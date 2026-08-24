<template>
  <div
    class="chat-input-root"
    @dragenter="dragDrop.onDragEnter"
    @dragover="dragDrop.onDragOver"
    @dragleave="dragDrop.onDragLeave"
    @drop="dragDrop.onDrop"
  >

    <!-- ── Drag & drop overlay (desktop only) ────────────────────────────── -->
    <div v-if="dragDrop.isDragging.value" class="drag-overlay">
      <span class="drag-overlay-text">Drop files to attach</span>
    </div>

    <!-- ── Reply Banner ──────────────────────────────────────────────────── -->
    <div v-if="replyTo" class="reply-preview-banner">
      <div class="reply-preview-left border-l-4 border-teal-500 pl-3 py-1 text-xs">
        <p class="font-bold text-teal-600">Replying to {{ replyTo.sender?.name || 'Message' }}</p>
        <p class="text-gray-500 truncate max-w-md">
          {{ replyTo.message || (replyTo.media_url ? 'Attachment' : 'Message') }}
        </p>
      </div>
      <button type="button" @click="$emit('cancel-reply')" class="text-gray-400 hover:text-gray-600 p-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- ── File Previews ─────────────────────────────────────────────────── -->
    <div v-if="selectedFiles.length > 0" class="file-preview-row">
      <div
        v-for="(item, idx) in selectedFiles"
        :key="idx"
        class="file-chip"
        :class="chipClass(item)"
      >
        <!-- Image preview -->
        <img
          v-if="item.objectUrl && item.file.type.startsWith('image/')"
          :src="item.objectUrl"
          class="chip-thumb"
          alt=""
        />
        <!-- Video preview -->
        <video
          v-else-if="item.objectUrl && item.file.type.startsWith('video/')"
          :src="item.objectUrl"
          class="chip-thumb"
          muted
          preload="metadata"
        />
        <!-- Icon for other types -->
        <div v-else class="chip-icon">
          <svg v-if="item.file.type.startsWith('audio/')" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
          <svg v-else-if="isPdf(item.file)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
        </div>

        <!-- File name badge -->
        <span class="chip-name">{{ shortName(item.file.name) }}</span>

        <!-- Remove button -->
        <button class="chip-remove" @click.stop="removeFile(idx)" title="Remove">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
      </div>

      <!-- Clear all -->
      <button v-if="selectedFiles.length > 1" class="clear-all-btn" @click="clearAllFiles" title="Clear all files">
        Clear all
      </button>
    </div>

    <!-- ── Input Row ──────────────────────────────────────────────────────── -->
    <!-- Click-away backdrop -->
    <div v-if="showAttachPopup" class="popup-backdrop" @click="showAttachPopup = false"></div>

    <form @submit.prevent="submit" class="input-row">

      <!-- Voice note recording bar replaces the normal row while recording -->
      <VoiceRecorderBar
        v-if="voiceRecorder.isRecording.value"
        :duration="voiceRecorder.formattedDuration.value"
        :is-paused="voiceRecorder.isPaused.value"
        @cancel="cancelVoiceNote"
        @pause="pauseVoiceNote"
        @resume="resumeVoiceNote"
        @stop="stopVoiceNote"
      />

      <template v-else>
        <!-- Attach button wrapper to position popup relative to it on mobile if needed, or relative to root -->
        <div class="attach-btn-wrap">
          <button
            type="button"
            @click="toggleAttachPopup"
            class="action-btn"
            :class="{ 'action-btn--active': showAttachPopup }"
            title="Attach files"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            <span v-if="selectedFiles.length > 0" class="attach-badge">{{ selectedFiles.length }}</span>
          </button>

          <!-- Attach Popover Menu -->
          <Transition name="popup-scale">
            <div v-if="showAttachPopup" class="attach-popup">
              <div class="attach-grid">
                <!-- Camera (photo/video capture) -->
                <button type="button" class="attach-item" @click="selectCategory('camera')">
                  <div class="attach-icon-wrapper attach-camera">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17a4 4 0 100-8 4 4 0 000 8z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Camera</span>
                </button>

                <!-- Gallery (Images & Videos) -->
                <button type="button" class="attach-item" @click="selectCategory('gallery')">
                  <div class="attach-icon-wrapper attach-gallery">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Gallery</span>
                </button>

                <!-- Video -->
                <button type="button" class="attach-item" @click="selectCategory('video')">
                  <div class="attach-icon-wrapper attach-video">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Video</span>
                </button>

                <!-- Location -->
                <button type="button" class="attach-item" @click="selectCategory('location')">
                  <div class="attach-icon-wrapper attach-location">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Location</span>
                </button>

                <!-- Contact -->
                <button type="button" class="attach-item" @click="selectCategory('contact')">
                  <div class="attach-icon-wrapper attach-contact">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Contact</span>
                </button>

                <!-- Document -->
                <button type="button" class="attach-item" @click="selectCategory('document')">
                  <div class="attach-icon-wrapper attach-document">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Document</span>
                </button>

                <!-- Audio (voice note recording) -->
                <button type="button" class="attach-item" @click="selectCategory('audio')">
                  <div class="attach-icon-wrapper attach-audio">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                  </div>
                  <span class="attach-label">Audio</span>
                </button>

                <!-- Poll -->
                <button type="button" class="attach-item" @click="selectCategory('poll')">
                  <div class="attach-icon-wrapper attach-poll">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Poll</span>
                </button>

                <!-- Event -->
                <button type="button" class="attach-item" @click="selectCategory('event')">
                  <div class="attach-icon-wrapper attach-event">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span class="attach-label">Event</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Text field -->
        <input
          type="text"
          v-model="text"
          @input="onInput"
          placeholder="Type a message…"
          class="text-field"
          autocomplete="off"
        />

        <!-- Send button -->
        <button
          type="submit"
          :disabled="!canSend"
          class="send-btn"
          title="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </template>

      <!-- Hidden dedicated file inputs (Part 1) -->
      <input
        type="file"
        ref="cameraInput"
        @change="onFilesSelected"
        class="hidden-input"
        accept="image/*"
        capture="environment"
      />
      <input
        type="file"
        ref="galleryInput"
        @change="onFilesSelected"
        class="hidden-input"
        accept="image/*,video/*"
        multiple
      />
      <input
        type="file"
        ref="videoInput"
        @change="onFilesSelected"
        class="hidden-input"
        accept="video/*"
        capture="environment"
        multiple
      />
      <input
        type="file"
        ref="documentInput"
        @change="onFilesSelected"
        class="hidden-input"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
        multiple
      />
      <input
        type="file"
        ref="audioInput"
        @change="onFilesSelected"
        class="hidden-input"
        accept="audio/*"
        multiple
      />
    </form>

    <!-- ── Live camera preview modal (photo capture / video recording) ────── -->
    <CameraCaptureModal
      v-if="showCameraModal"
      :recorder="videoRecorder"
      :initial-mode="cameraInitialMode"
      @close="closeCameraModal"
      @captured="onPhotoCaptured"
    />

    <!-- ── Permission Request Modal ──────────────────────────────────────── -->
    <PermissionRequestModal
      v-model="permModal.visible.value"
      :permission="permModal.type.value"
      :is-blocked="permModal.isBlocked.value"
      @allow="permModal.onAllow()"
      @deny="permModal.onDeny()"
    />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useVoiceRecorder } from '@/composables/useVoiceRecorder'
import { useVideoRecorder } from '@/composables/useVideoRecorder'
import { useGeolocation } from '@/composables/useChatGeolocation'
import { useContactPicker } from '@/composables/useContactPicker'
import { useClipboardPaste } from '@/composables/useClipboardPaste'
import { useDragDrop } from '@/composables/useDragDrop'
import { useNetwork } from '@/composables/useNetwork'
import VoiceRecorderBar from '@/components/chat/VoiceRecorderBar.vue'
import CameraCaptureModal from '@/components/chat/CameraCaptureModal.vue'
import PermissionRequestModal from '@/components/chat/PermissionRequestModal.vue'

const props = defineProps({
  replyTo: { type: Object, default: null }
})
const emit = defineEmits(['send', 'typing', 'cancel-reply'])
const ui = useUiStore()
const { isOnline, guardOnline } = useNetwork()

const text          = ref('')
const selectedFiles = ref([])   // [{ file: File, objectUrl: string|null }]
const isTyping      = ref(false)
let typingTimeout   = null

const showAttachPopup = ref(false)

// ─── Permission Modal state ──────────────────────────────────────────────────
/**
 * Local store of permissions accepted via custom modal in this session.
 */
const acceptedPermissions = ref(new Set())

/**
 * Wraps the permission flow behind a custom modal.
 * Returns a Promise<boolean> — true = user confirmed, false = denied.
 */
const usePermissionModal = () => {
  const visible   = ref(false)
  const type      = ref('camera')  // 'camera' | 'microphone' | 'location'
  const isBlocked = ref(false)
  let _resolve = null

  const request = (permType, blocked = false) => {
    type.value      = permType
    isBlocked.value = blocked
    visible.value   = true
    return new Promise((resolve) => { _resolve = resolve })
  }

  const onAllow = () => {
    visible.value = false
    _resolve?.(true)
    _resolve = null
  }

  const onDeny = () => {
    visible.value = false
    _resolve?.(false)
    _resolve = null
  }

  return { visible, type, isBlocked, request, onAllow, onDeny }
}

const permModal = usePermissionModal()

/**
 * Gets the native bridge (MobileJumpNative or KorpaBeeNative), or null on web.
 */
const getNativeBridge = () =>
  (typeof window !== 'undefined' && (window.MobileJumpNative || window.KorpaBeeNative)) || null

/**
 * Checks web browser permission state for 'camera', 'microphone', or 'location'.
 * Returns 'granted' | 'prompt' | 'denied'.
 */
const checkWebPermissionStatus = async (permType) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
      const name = permType === 'location' ? 'geolocation' : (permType === 'microphone' ? 'microphone' : 'camera')
      const result = await navigator.permissions.query({ name })
      return result.state // 'granted' | 'prompt' | 'denied'
    }
  } catch (e) {
    // Safari / Firefox
  }
  return 'prompt'
}

/**
 * Ensures permission is granted. Shows the custom PermissionRequestModal
 * unless the permission is already verified as granted natively or in browser.
 */
const ensurePermission = async (permType, bridgeCheck) => {
  const bridge = getNativeBridge()

  // 1. Check Native Runner permission if running inside Android APK
  if (bridge && bridgeCheck) {
    if (bridgeCheck()) {
      return true // Already granted on Android Native Bridge
    }
  } else {
    // 2. Check Web Browser permission state
    const webStatus = await checkWebPermissionStatus(permType)
    if (webStatus === 'granted') {
      return true // Already granted in browser — zero modals needed, proceed immediately!
    }
    if (webStatus === 'denied') {
      // Browser settings have blocked this site — show Blocked Guide Modal!
      const retry = await permModal.request(permType, true)
      if (!retry) return false
      // User tapped "Try Again" after unblocking in settings — check again
      const newStatus = await checkWebPermissionStatus(permType)
      if (newStatus === 'denied') {
        ui.showToast(`Please set ${permType} to "Allow" in your browser site settings.`, 'warning')
        return false
      }
      return true
    }
  }

  // 3. Status is 'prompt' — show our custom PermissionRequestModal!
  const confirmed = await permModal.request(permType, false)
  if (!confirmed) {
    return false // User tapped "Not now" — cancel cleanly, no file fallback loop!
  }

  // 4. User tapped "Allow" — trigger native request if on Runner
  if (bridge?.requestPermissions) {
    bridge.requestPermissions()
  }

  return true
}

// Dedicated hidden file inputs (Part 1 / Part 2)
const cameraInput   = ref(null)
const galleryInput  = ref(null)
const videoInput    = ref(null)
const documentInput = ref(null)
const audioInput    = ref(null)

// Must be online AND have content to enable the send button
const canSend = computed(() => isOnline.value && (text.value.trim().length > 0 || selectedFiles.value.length > 0))

// ─── Helpers ────────────────────────────────────────────────────────────────
const isPdf  = (file) => file.type === 'application/pdf' || file.name.endsWith('.pdf')
const isPreviewable = (file) => file.type.startsWith('image/') || file.type.startsWith('video/')

const shortName = (name) => name.length > 18 ? name.slice(0, 15) + '…' : name

const chipClass = (item) => {
  if (item.file.type.startsWith('image/')) return 'chip--image'
  if (item.file.type.startsWith('video/')) return 'chip--video'
  if (item.file.type.startsWith('audio/')) return 'chip--audio'
  if (isPdf(item.file))                    return 'chip--pdf'
  return 'chip--file'
}

// ─── File selection (unchanged preview generation / optimistic-update path) ─
const toggleAttachPopup = () => {
  showAttachPopup.value = !showAttachPopup.value
}

/**
 * Shared entry point for every source of new files: pickers, voice/video
 * recording, clipboard paste, and drag & drop all funnel through here so
 * preview generation and the optimistic-update path stay identical.
 * @param {File[]} files
 */
const addFiles = (files) => {
  files.forEach(file => {
    selectedFiles.value.push({
      file,
      objectUrl: isPreviewable(file) ? URL.createObjectURL(file) : null
    })
  })
}

const onFilesSelected = (event) => {
  addFiles(Array.from(event.target.files || []))
  // Reset input so same file can be re-added
  event.target.value = ''
}

const removeFile = (idx) => {
  const item = selectedFiles.value[idx]
  if (item.objectUrl) URL.revokeObjectURL(item.objectUrl)
  selectedFiles.value.splice(idx, 1)
}

const clearAllFiles = () => {
  selectedFiles.value.forEach(item => {
    if (item.objectUrl) URL.revokeObjectURL(item.objectUrl)
  })
  selectedFiles.value = []
}

// ─── Voice notes (Part 3) ─────────────────────────────────────────────────
const onVoiceNoteReady = (file) => addFiles([file])
const voiceRecorder = useVoiceRecorder(onVoiceNoteReady)

const startVoiceNote = async () => {
  const bridge = getNativeBridge()
  const confirmed = await ensurePermission('microphone', bridge?.hasAudioPermission?.bind(bridge))
  if (!confirmed) return

  if (!voiceRecorder.isSupported) {
    audioInput.value?.click()
    return
  }
  const started = await voiceRecorder.start()
  if (!started) {
    if (voiceRecorder.error.value === 'denied') {
      permModal.request('microphone', true)
    } else {
      ui.showToast('Could not access microphone.', 'error')
    }
  }
}

const pauseVoiceNote = () => voiceRecorder.pause()
const resumeVoiceNote = () => voiceRecorder.resume()
const stopVoiceNote = () => voiceRecorder.stop()
const cancelVoiceNote = () => voiceRecorder.cancel()

// ─── Camera: photo capture + short video recording (Part 4) ───────────────
const showCameraModal = ref(false)
const cameraInitialMode = ref('photo') // 'photo' | 'video' - which mode the modal opens into
const onVideoReady = (file) => {
  addFiles([file])
  showCameraModal.value = false
}
const videoRecorder = useVideoRecorder(onVideoReady, { maxDurationSec: 60 })

/**
 * Opens the live camera preview modal (photo capture + video recording,
 * with a front/back switcher when the device has more than one camera).
 * @param {'photo'|'video'} initialMode - which mode the modal starts in
 */
const openCamera = async (initialMode = 'photo') => {
  const bridge = getNativeBridge()
  const confirmed = await ensurePermission('camera', bridge?.hasCameraPermission?.bind(bridge))
  if (!confirmed) return

  cameraInitialMode.value = initialMode
  const opened = await videoRecorder.openPreview()
  if (!opened) {
    if (videoRecorder.error?.value === 'denied') {
      permModal.request('camera', true)
    } else {
      ui.showToast('Could not access camera.', 'error')
    }
  } else {
    showCameraModal.value = true
  }
}

const onPhotoCaptured = (file) => addFiles([file])

const closeCameraModal = () => {
  videoRecorder.closePreview()
  showCameraModal.value = false
}

// ─── Location sharing (Part 5) ─────────────────────────────────────────────
const geolocation = useGeolocation()

const handleLocationShare = async () => {
  const bridge = getNativeBridge()
  const confirmed = await ensurePermission('location', bridge?.hasLocationPermission?.bind(bridge))
  if (!confirmed) return

  const location = await geolocation.getLocation()
  if (!location) {
    if (geolocation.error.value === 'denied') {
      permModal.request('location', true)
    } else {
      ui.showToast('Could not get your location. Please try again.', 'error')
    }
    return
  }
  emit('send', {
    text: `📍 Location: ${location.mapsUrl}`,
    files: []
  })
}

// ─── Contact sharing (Part 6) ───────────────────────────────────────────────
// Same approach as location - formatted as plain text through the existing
// `send` event rather than a new payload shape.
const contactPicker = useContactPicker()

const handleContactShare = async () => {
  if (!contactPicker.isSupported) {
    ui.showToast("Contact sharing isn't supported on this browser.", 'info')
    return
  }
  const contact = await contactPicker.pickContact()
  if (!contact) {
    if (contactPicker.error.value === 'error') {
      ui.showToast('Could not access contacts.', 'error')
    }
    return
  }
  const name = contact.name?.[0] || 'Contact'
  const tel = contact.tel?.[0]
  const email = contact.email?.[0]
  const details = [tel, email].filter(Boolean).join(' · ')
  emit('send', {
    text: `👤 Contact: ${name}${details ? ' — ' + details : ''}`,
    files: []
  })
}

// ─── Clipboard paste (Part 7) ───────────────────────────────────────────────
useClipboardPaste((file) => addFiles([file]))

// ─── Desktop drag & drop (Part 8) ──────────────────────────────────────────
const dragDrop = useDragDrop((files) => addFiles(files))

// Revoke object URLs when component unmounts
onBeforeUnmount(clearAllFiles)

/**
 * @param {'camera'|'gallery'|'video'|'document'|'audio'|'location'|'contact'|'poll'|'event'} type
 */
const selectCategory = (type) => {
  showAttachPopup.value = false

  if (type === 'camera') {
    openCamera('photo')
  } else if (type === 'gallery') {
    galleryInput.value?.click()
  } else if (type === 'video') {
    openCamera('video')
  } else if (type === 'document') {
    documentInput.value?.click()
  } else if (type === 'audio') {
    startVoiceNote()
  } else if (type === 'location') {
    handleLocationShare()
  } else if (type === 'contact') {
    handleContactShare()
  } else {
    ui.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} sharing is coming soon!`, 'info')
  }
}

// ─── Typing indicator ────────────────────────────────────────────────────────
const onInput = () => {
  if (!isTyping.value) {
    isTyping.value = true
    emit('typing', true)
  }
  if (typingTimeout) clearTimeout(typingTimeout)
  typingTimeout = setTimeout(() => {
    isTyping.value = false
    emit('typing', false)
  }, 2500)
}

// ─── Submit ──────────────────────────────────────────────────────────────────
const submit = () => {
  if (!canSend.value) return
  // Guard: block send when offline and show a friendly toast
  if (!isOnline.value) {
    ui.showToast("You're offline. Connect to send messages.", 'warning')
    return
  }

  if (typingTimeout) clearTimeout(typingTimeout)
  if (isTyping.value) {
    isTyping.value = false
    emit('typing', false)
  }

  // Emit text + array of File objects (not wrapped items) - unchanged shape
  emit('send', {
    text: text.value,
    files: selectedFiles.value.map(item => item.file),
    replyToUuid: props.replyTo?.uuid || null
  })

  // Clear
  text.value = ''
  clearAllFiles()
}
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────────────────────────────── */
.chat-input-root {
  position: relative;
}

.reply-preview-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f0fdf4;
  border-bottom: 1px solid #e5e7eb;
  padding: 6px 12px;
}

.chat-input-root {
  border-top: 1px solid #E8E4FF;
  background: #fff;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

/* ── Drag & drop overlay ─────────────────────────────────────────────────── */
.drag-overlay {
  position: absolute;
  inset: 4px;
  z-index: 1200;
  background: rgba(108, 92, 231, 0.08);
  border: 2px dashed #6C5CE7;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.drag-overlay-text {
  background: #fff;
  color: #6C5CE7;
  font-weight: 600;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.25);
}

/* ── File previews ───────────────────────────────────────────────────────── */
.file-preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 4px 0 2px;
  max-height: 128px;
  overflow-y: auto;
}

.file-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F8F7FF;
  border: 1px solid #E8E4FF;
  border-radius: 12px;
  padding: 4px 8px 4px 4px;
  max-width: 180px;
}

.chip-thumb {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #000;
}

.chip-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #EFEBFF;
  color: #6C5CE7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chip-name {
  font-size: 11px;
  color: #4B4468;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100px;
}

.chip-remove {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  color: #4B4468;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.chip-remove:hover { background: rgba(244, 63, 94, 0.15); color: #f43f5e; }

.clear-all-btn {
  background: none;
  border: none;
  color: #6C5CE7;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  align-self: center;
  transition: background 0.15s;
}
.clear-all-btn:hover { background: #F0EEFF; }

/* ── Input row ───────────────────────────────────────────────────────────── */
.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hidden-input { display: none; }

.attach-btn-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  position: relative;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #A8A4C4;
  padding: 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s, transform 0.2s ease;
}
.action-btn:hover { color: #6C5CE7; background: #F0EEFF; }
.action-btn--active {
  color: #6C5CE7 !important;
  background: #F0EEFF !important;
  transform: rotate(45deg);
}

.attach-badge {
  position: absolute;
  top: 1px; right: 1px;
  background: #6C5CE7;
  color: #fff;
  font-size: 8px;
  font-weight: 700;
  border-radius: 99px;
  width: 14px; height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* ── Attach Popup ────────────────────────────────────────────────────────── */
.popup-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: transparent;
}

.attach-popup {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 0;
  z-index: 1000;
  width: 320px;
  max-width: calc(100vw - 20px);
  background: rgba(22, 22, 26, 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
}

.attach-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px 8px;
  justify-items: center;
}

.attach-item {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  outline: none;
  padding: 0;
  transition: transform 0.2s ease;
  width: 100%;
}
.attach-item:hover {
  transform: translateY(-2px);
}

.attach-icon-wrapper {
  width: 60px;
  height: 38px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s ease;
}

.attach-item:hover .attach-icon-wrapper {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 12px var(--icon-glow);
}

/* Vibrant Icon Styling & Glowing */
.attach-gallery {
  --icon-glow: rgba(59, 130, 246, 0.45);
  color: #3b82f6;
}
.attach-camera {
  --icon-glow: rgba(244, 63, 94, 0.45);
  color: #f43f5e;
}
.attach-video {
  --icon-glow: rgba(20, 184, 166, 0.45);
  color: #14b8a6;
}
.attach-location {
  --icon-glow: rgba(16, 185, 129, 0.45);
  color: #10b981;
}
.attach-contact {
  --icon-glow: rgba(14, 165, 233, 0.45);
  color: #0ea5e9;
}
.attach-document {
  --icon-glow: rgba(139, 92, 246, 0.45);
  color: #8b5cf6;
}
.attach-audio {
  --icon-glow: rgba(16, 185, 129, 0.45);
  color: #10b981;
}
.attach-poll {
  --icon-glow: rgba(245, 158, 11, 0.45);
  color: #f59e0b;
}
.attach-event {
  --icon-glow: rgba(236, 72, 153, 0.45);
  color: #ec4899;
}

.attach-label {
  font-size: 11px;
  font-weight: 500;
  color: #A8A4C4;
  margin-top: 6px;
  text-align: center;
  transition: color 0.2s;
  white-space: nowrap;
}
.attach-item:hover .attach-label {
  color: #fff;
}

/* Transition Animations */
.popup-scale-enter-active,
.popup-scale-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.popup-scale-enter-from,
.popup-scale-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(12px);
}

.text-field {
  flex: 1;
  background: #F8F7FF;
  border: 1.5px solid #E8E4FF;
  border-radius: 20px;
  padding: 9px 16px;
  font-size: 14px;
  color: #1A1535;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  min-width: 0;
}
.text-field:focus {
  background: #fff;
  border-color: #6C5CE7;
  box-shadow: 0 0 0 3px rgba(108,92,231,0.1);
}

.send-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #8B7CF8, #6C5CE7);
  border: none;
  border-radius: 50%;
  width: 38px; height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 3px 12px rgba(108,92,231,0.3);
}
.send-btn:hover:not(:disabled) { transform: scale(1.08); opacity: 0.92; }
.send-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
</style>
