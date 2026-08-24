<template>
  <div class="camera-modal-backdrop" @click.self="handleClose">
    <div class="camera-modal">

      <!-- ── Live preview ─────────────────────────────────────────────── -->
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="camera-preview"
        :class="{ 'camera-preview--mirrored': recorder.facingMode.value === 'user' }"
      ></video>

      <!-- No camera slot (e.g. switched to rear on a laptop) -->
      <div v-if="recorder.error.value === 'no_camera'" class="camera-no-preview">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
          <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p>Camera not available</p>
      </div>

      <!-- ── Recording duration badge ─────────────────────────────────── -->
      <div v-if="recorder.isRecording.value" class="camera-duration">
        <span class="camera-duration-dot" :class="{ 'camera-duration-dot--paused': recorder.isPaused.value }"></span>
        {{ recorder.formattedDuration.value }}
        <span v-if="recorder.isPaused.value" class="camera-duration-paused-label">PAUSED</span>
      </div>

      <!-- ── Mode toggle (hidden while recording) ─────────────────────── -->
      <div class="camera-mode-toggle" v-if="!recorder.isRecording.value">
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-btn--active': mode === 'photo' }"
          @click="mode = 'photo'"
        >📷 Photo</button>
        <button
          type="button"
          class="mode-btn"
          :class="{ 'mode-btn--active': mode === 'video' }"
          @click="mode = 'video'"
        >🎥 Video</button>
      </div>

      <!-- ── Pause / Resume row (visible while recording) ────────────── -->
      <div v-if="recorder.isRecording.value" class="camera-pause-row">
        <button
          type="button"
          class="camera-btn camera-btn--pause"
          @click="togglePause"
          :title="recorder.isPaused.value ? 'Resume recording' : 'Pause recording'"
        >
          <!-- Pause icon -->
          <svg v-if="!recorder.isPaused.value" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
          <!-- Resume / play icon -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z"/>
          </svg>
        </button>
        <span class="camera-pause-hint">{{ recorder.isPaused.value ? 'Tap ▶ to resume' : 'Tap ⏸ to pause' }}</span>
      </div>

      <!-- ── Bottom controls row ──────────────────────────────────────── -->
      <div class="camera-controls">

        <!-- Cancel -->
        <button type="button" class="camera-btn camera-btn--cancel" @click="handleClose" title="Cancel">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Shutter / Stop -->
        <button
          type="button"
          class="camera-btn camera-btn--shutter"
          :class="{ 'camera-btn--recording': recorder.isRecording.value }"
          @click="handleShutter"
          :title="shutterTitle"
          :disabled="recorder.error.value === 'no_camera' && !recorder.isRecording.value"
        >
          <!-- Inner stop square while recording -->
          <span v-if="recorder.isRecording.value" class="shutter-stop-sq"></span>
        </button>

        <!-- Camera switch — always shown; greyed out if only one camera -->
        <button
          type="button"
          class="camera-btn camera-btn--switch"
          :class="{ 'camera-btn--switch-disabled': !recorder.canSwitchCamera.value }"
          @click="handleSwitchCamera"
          :title="recorder.canSwitchCamera.value ? 'Switch camera' : 'Only one camera available'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

/**
 * CameraCaptureModal
 *
 * Wraps a recorder instance (useVideoRecorder) to show a live camera preview
 * with photo capture, video recording (with pause/resume), and camera switching.
 *
 * KEY FIX: onMounted() calls recorder.attachStream() so the <video> element
 * is guaranteed to exist in the DOM before the MediaStream is assigned to it.
 * Previously the stream was attached during openPreview() before the modal
 * mounted, causing a permanently blank preview.
 */

const props = defineProps({
  /** The recorder instance from useVideoRecorder */
  recorder:    { type: Object, required: true },
  /** Which mode the modal opens in */
  initialMode: { type: String, default: 'photo' },
})

const emit = defineEmits(['close', 'captured'])

const mode     = ref(props.initialMode)
const videoRef = ref(null)

// ── Wire up the video element ref to the composable ──────────────────────────
// The composable exposes videoEl as a ref so it can call attachStream().
// We point it at our local template ref on mount then attach the stream.
onMounted(async () => {
  // Give Vue one tick to finish rendering the <video> element
  await nextTick()
  // Sync the composable's videoEl ref so capturePhoto() and attachStream() work
  props.recorder.videoEl.value = videoRef.value
  // Now attach the already-acquired MediaStream to the element
  props.recorder.attachStream()
})

// ── Shutter logic ─────────────────────────────────────────────────────────────
const shutterTitle = computed(() => {
  if (props.recorder.isRecording.value) return 'Stop recording'
  return mode.value === 'photo' ? 'Take photo' : 'Start recording'
})

const handleShutter = async () => {
  // Stop recording
  if (props.recorder.isRecording.value) {
    props.recorder.stop()
    return
  }

  if (mode.value === 'photo') {
    const file = await props.recorder.capturePhoto()
    if (file) {
      emit('captured', file)
      emit('close')
    }
  } else {
    props.recorder.startRecording()
  }
}

// ── Pause / Resume toggle ─────────────────────────────────────────────────────
const togglePause = () => {
  if (props.recorder.isPaused.value) {
    props.recorder.resumeRecording()
  } else {
    props.recorder.pauseRecording()
  }
}

// ── Camera switch ─────────────────────────────────────────────────────────────
const handleSwitchCamera = async () => {
  if (!props.recorder.canSwitchCamera.value) return // single camera — silently ignore
  await props.recorder.switchCamera()
  // Re-sync videoEl ref after switch (stream may have been re-acquired)
  await nextTick()
  props.recorder.videoEl.value = videoRef.value
}

// ── Close ─────────────────────────────────────────────────────────────────────
const handleClose = () => {
  if (props.recorder.isRecording.value) {
    props.recorder.stop()
  }
  emit('close')
}
</script>

<style scoped>
/* ── Backdrop ── */
.camera-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(10, 8, 20, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── Modal frame ── */
.camera-modal {
  position: relative;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  overflow: hidden;
  background: #0a0814;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

/* ── Preview video ── */
.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #000;
}

/* Mirror the front camera so it looks natural (selfie-style) */
.camera-preview--mirrored {
  transform: scaleX(-1);
}

/* ── No-camera blank slot ── */
.camera-no-preview {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #1a1535;
  color: rgba(255,255,255,0.4);
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
}
.camera-no-preview p { margin: 0; }

/* ── Recording badge ── */
.camera-duration {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 99px;
  font-variant-numeric: tabular-nums;
  backdrop-filter: blur(4px);
}

.camera-duration-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f43f5e;
  flex-shrink: 0;
  animation: camera-pulse 1.1s ease-in-out infinite;
}

.camera-duration-dot--paused {
  background: #fbbf24;
  animation: none;
}

.camera-duration-paused-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #fbbf24;
  margin-left: 2px;
}

@keyframes camera-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* ── Mode toggle ── */
.camera-mode-toggle {
  position: absolute;
  bottom: 104px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 99px;
  padding: 4px;
  backdrop-filter: blur(6px);
}

.mode-btn {
  border: none;
  background: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 99px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.mode-btn--active {
  background: #fff;
  color: #1A1535;
}

/* ── Pause/Resume row ── */
.camera-pause-row {
  position: absolute;
  bottom: 104px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 99px;
  padding: 6px 16px 6px 6px;
  backdrop-filter: blur(6px);
}

.camera-pause-hint {
  color: rgba(255,255,255,0.8);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

/* ── Controls row ── */
.camera-controls {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
}

/* ── Base button ── */
.camera-btn {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, background 0.2s, opacity 0.2s;
}

/* Cancel */
.camera-btn--cancel {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(4px);
}
.camera-btn--cancel:hover { background: rgba(255, 255, 255, 0.28); }

/* Shutter */
.camera-btn--shutter {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 0 0 2px rgba(255,255,255,0.15);
  flex-shrink: 0;
}
.camera-btn--shutter:hover:not(:disabled) { transform: scale(1.06); }
.camera-btn--shutter:disabled { opacity: 0.35; cursor: not-allowed; }

/* Recording state — red rounded-rect stop button */
.camera-btn--recording {
  background: #f43f5e;
  border-color: rgba(244, 63, 94, 0.35);
}

.shutter-stop-sq {
  width: 22px;
  height: 22px;
  background: #fff;
  border-radius: 4px;
  display: block;
}

/* Switch camera */
.camera-btn--switch {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  backdrop-filter: blur(4px);
}
.camera-btn--switch:hover:not(.camera-btn--switch-disabled) { background: rgba(255, 255, 255, 0.28); }
.camera-btn--switch-disabled {
  opacity: 0.35;
  cursor: default;
}

/* Pause */
.camera-btn--pause {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  backdrop-filter: blur(4px);
}
.camera-btn--pause:hover { background: rgba(255, 255, 255, 0.3); }

/* ── Responsive ── */
@media (max-width: 480px) {
  .camera-modal {
    max-width: 100%;
    border-radius: 16px;
  }
}
</style>
