import { ref, computed, onBeforeUnmount } from 'vue'

/**
 * Voice note recording via the MediaRecorder API.
 * Detects feature support up front so callers can fall back to a plain
 * audio file picker when the browser can't record in-app.
 *
 * @param {(file: File) => void} onComplete - called with the finished
 *   File (named `voice-note-<timestamp>.<ext>`) once recording stops normally.
 * @returns {{
 *   isSupported: boolean,
 *   isRecording: import('vue').Ref<boolean>,
 *   durationSec: import('vue').Ref<number>,
 *   formattedDuration: import('vue').ComputedRef<string>,
 *   error: import('vue').Ref<null|'unsupported'|'denied'|'error'>,
 *   start: () => Promise<boolean>,
 *   stop: () => void,
 *   cancel: () => void
 * }}
 */
export function useVoiceRecorder(onComplete) {
  const isSupported =
    typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder !== 'undefined'

  const isRecording = ref(false)
  const isPaused = ref(false)
  const durationSec = ref(0)
  const error = ref(null)

  let mediaRecorder = null
  let mediaStream = null
  let chunks = []
  let timer = null

  const pickMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ]
    return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || ''
  }

  const stopStreamTracks = () => {
    mediaStream?.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }

  const startTimer = () => {
    durationSec.value = 0
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      durationSec.value += 1
    }, 1000)
  }

  const pauseTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  const resumeTimer = () => {
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      durationSec.value += 1
    }, 1000)
  }

  const stopTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  /** @returns {Promise<boolean>} whether recording actually started */
  const start = async () => {
    error.value = null
    if (!isSupported) {
      error.value = 'unsupported'
      return false
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = pickMimeType()
      mediaRecorder = mimeType
        ? new MediaRecorder(mediaStream, { mimeType })
        : new MediaRecorder(mediaStream)
      chunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        stopTimer()
        stopStreamTracks()
        isRecording.value = false
        isPaused.value = false

        if (mediaRecorder?.__cancelled) {
          chunks = []
          return
        }

        const type = mediaRecorder.mimeType || mimeType || 'audio/webm'
        const blob = new Blob(chunks, { type })
        chunks = []
        const ext = type.includes('ogg') ? 'ogg' : type.includes('mp4') ? 'm4a' : 'webm'
        const file = new File([blob], `voice-note-${Date.now()}.${ext}`, { type })
        onComplete?.(file)
      }

      mediaRecorder.start()
      isRecording.value = true
      isPaused.value = false
      startTimer()
      return true
    } catch (err) {
      error.value = err?.name === 'NotAllowedError' ? 'denied' : 'error'
      stopStreamTracks()
      return false
    }
  }

  const pause = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      isPaused.value = true
      pauseTimer()
    }
  }

  const resume = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      isPaused.value = false
      resumeTimer()
    }
  }

  const stop = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.__cancelled = false
      mediaRecorder.stop()
    }
  }

  const cancel = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.__cancelled = true
      mediaRecorder.stop()
    } else {
      stopTimer()
      stopStreamTracks()
      isRecording.value = false
      isPaused.value = false
    }
  }

  const formattedDuration = computed(() => {
    const m = Math.floor(durationSec.value / 60).toString().padStart(2, '0')
    const s = (durationSec.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  onBeforeUnmount(() => {
    stopTimer()
    stopStreamTracks()
  })

  return { isSupported, isRecording, isPaused, durationSec, formattedDuration, error, start, pause, resume, stop, cancel }
}
