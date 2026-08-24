import { ref, computed, onBeforeUnmount } from 'vue'

/**
 * Live camera preview with photo capture and short video recording,
 * built on getUserMedia + MediaRecorder. Supports switching between
 * front/back cameras where the device exposes more than one.
 *
 * KEY FIX: Stream attachment is deferred via `attachStream()` which
 * callers invoke *after* the <video> element is mounted in the DOM.
 * Previously `openPreview()` tried to set srcObject before the modal
 * rendered, leaving the preview permanently blank.
 *
 * @param {(file: File) => void} onComplete - called with the finished
 *   video File once recording stops normally.
 * @param {{ maxDurationSec?: number }} [options]
 */
export function useVideoRecorder(onComplete, options = {}) {
  const maxDurationSec = options.maxDurationSec ?? 60

  const isSupported =
    typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== 'undefined'

  const isActive      = ref(false) // camera preview open
  const isRecording   = ref(false)
  const isPaused      = ref(false)
  const durationSec   = ref(0)
  const facingMode    = ref('user')       // start with front cam — safe default for laptops
  const canSwitchCamera = ref(false)
  const hasBackCamera   = ref(false)      // true only if a rear camera was found
  const hasFrontCamera  = ref(true)       // assume front always present
  const error         = ref(null)

  /** Bind this ref to the preview <video> element via :ref="el => (videoEl.value = el)" */
  const videoEl = ref(null)

  let mediaStream   = null
  let mediaRecorder = null
  let chunks        = []
  let timer         = null

  // ── Stream helpers ─────────────────────────────────────────────────────────

  const stopStreamTracks = () => {
    mediaStream?.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }

  /**
   * Attaches the active stream to the video element.
   * Must be called AFTER the <video> element is mounted (i.e. after the
   * containing component renders), not before. Call from onMounted() or
   * a nextTick() callback after setting isActive = true.
   */
  const attachStream = () => {
    if (videoEl.value && mediaStream) {
      videoEl.value.srcObject = mediaStream
      // Force play in case autoplay was blocked
      videoEl.value.play().catch(() => {})
    }
  }

  // ── Camera enumeration ────────────────────────────────────────────────────

  const detectCameras = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      canSwitchCamera.value = false
      return
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === 'videoinput')

      // Try to detect front vs back by label (browsers expose labels after getUserMedia)
      const labels = videoDevices.map((d) => d.label.toLowerCase())
      hasFrontCamera.value = labels.some((l) => l.includes('front') || l.includes('user')) || videoDevices.length >= 1
      hasBackCamera.value  = labels.some((l) => l.includes('back') || l.includes('rear') || l.includes('environment'))

      // Allow switching if at least 2 video inputs OR if labels clearly show both
      canSwitchCamera.value = videoDevices.length > 1 || (hasFrontCamera.value && hasBackCamera.value)
    } catch {
      canSwitchCamera.value = false
    }
  }

  // Re-evaluate when devices change (e.g. external webcam plugged in)
  if (typeof navigator !== 'undefined' && navigator.mediaDevices?.addEventListener) {
    navigator.mediaDevices.addEventListener('devicechange', detectCameras)
  }

  // ── getUserMedia with graceful facingMode fallback ────────────────────────

  /**
   * Attempts getUserMedia with facingMode constraint.
   * Falls back to plain `video: true` if facingMode is not supported/available.
   */
  const getStream = async (facing) => {
    // Try with facingMode constraint first
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
        audio: true,
      })
    } catch {
      // facingMode unsupported or camera not available — fallback to any camera
      return await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    }
  }

  // ── openPreview ────────────────────────────────────────────────────────────

  /**
   * Acquires the camera stream. Returns true on success.
   * The caller must invoke `attachStream()` AFTER the <video> element is mounted.
   */
  const openPreview = async () => {
    error.value = null
    if (!isSupported) {
      error.value = 'unsupported'
      return false
    }
    try {
      mediaStream = await getStream(facingMode.value)
      isActive.value = true
      // Attachment happens in the modal's onMounted — do NOT call attachStream() here
      await detectCameras()
      return true
    } catch (err) {
      error.value = err?.name === 'NotAllowedError' ? 'denied' : 'error'
      return false
    }
  }

  // ── switchCamera ───────────────────────────────────────────────────────────

  const switchCamera = async () => {
    const next = facingMode.value === 'environment' ? 'user' : 'environment'

    // If we know the target camera doesn't exist, update UI but show blank
    const targetExists = next === 'user' ? hasFrontCamera.value : hasBackCamera.value
    if (!targetExists && canSwitchCamera.value === false) {
      // Only one camera — no-op
      return
    }

    facingMode.value = next
    stopStreamTracks()

    try {
      mediaStream = await getStream(next)
      attachStream()
    } catch {
      // Target camera not available (e.g. no rear cam on laptop)
      // Clear stream so the preview goes blank — user sees "no camera" state
      mediaStream = null
      if (videoEl.value) videoEl.value.srcObject = null
      error.value = 'no_camera'
    }
  }

  // ── Photo capture ──────────────────────────────────────────────────────────

  /** Snap the current preview frame as a JPEG File. */
  const capturePhoto = () => {
    const video = videoEl.value
    if (!video) return Promise.resolve(null)

    // Ensure video is actually playing and has dimensions
    if (!video.videoWidth || !video.videoHeight) {
      return Promise.resolve(null)
    }

    const canvas = document.createElement('canvas')
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')

    // Mirror the image if using front camera (matches what user sees in preview)
    if (facingMode.value === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(null); return }
          resolve(new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        0.92
      )
    })
  }

  // ── Video recording ────────────────────────────────────────────────────────

  const pickMimeType = () => {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ]
    return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || ''
  }

  const startTimer = () => {
    durationSec.value = 0
    timer = setInterval(() => {
      if (!isPaused.value) {
        durationSec.value += 1
        if (durationSec.value >= maxDurationSec) stop()
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  const startRecording = () => {
    if (!mediaStream) return
    const mimeType = pickMimeType()
    mediaRecorder = mimeType
      ? new MediaRecorder(mediaStream, { mimeType })
      : new MediaRecorder(mediaStream)
    chunks = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data?.size > 0) chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      stopTimer()
      isRecording.value = false
      isPaused.value    = false

      if (mediaRecorder.__cancelled) {
        chunks = []
        return
      }

      const type = mediaRecorder.mimeType || mimeType || 'video/webm'
      const blob = new Blob(chunks, { type })
      chunks = []
      const ext = type.includes('mp4') ? 'mp4' : 'webm'
      const file = new File([blob], `video-note-${Date.now()}.${ext}`, { type })
      onComplete?.(file)
    }

    mediaRecorder.start(250) // timeslice = 250ms keeps chunks granular
    isRecording.value = true
    isPaused.value    = false
    startTimer()
  }

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      isPaused.value = true
    }
  }

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      isPaused.value = false
    }
  }

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.__cancelled = false
      mediaRecorder.stop()
    }
  }

  /** Stop recording without emitting the resulting file. */
  const cancelRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.__cancelled = true
      mediaRecorder.stop()
    }
    stopTimer()
    isRecording.value = false
    isPaused.value    = false
  }

  /** Close the camera preview entirely, cancelling any in-progress recording. */
  const closePreview = () => {
    cancelRecording()
    stopStreamTracks()
    isActive.value = false
    error.value = null
  }

  // ── Computed ───────────────────────────────────────────────────────────────

  const formattedDuration = computed(() => {
    const m = Math.floor(durationSec.value / 60).toString().padStart(2, '0')
    const s = (durationSec.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  onBeforeUnmount(() => {
    stopTimer()
    stopStreamTracks()
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.removeEventListener) {
      navigator.mediaDevices.removeEventListener('devicechange', detectCameras)
    }
  })

  return {
    isSupported,
    isActive,
    isRecording,
    isPaused,
    durationSec,
    formattedDuration,
    facingMode,
    canSwitchCamera,
    hasFrontCamera,
    hasBackCamera,
    error,
    videoEl,
    openPreview,
    attachStream,
    switchCamera,
    capturePhoto,
    startRecording,
    pauseRecording,
    resumeRecording,
    stop,
    closePreview,
  }
}
