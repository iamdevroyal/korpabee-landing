<template>
  <div class="chat-input-root">

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
              <!-- Gallery (Images) -->
              <button type="button" class="attach-item" @click="selectCategory('gallery')">
                <div class="attach-icon-wrapper attach-gallery">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span class="attach-label">Gallery</span>
              </button>

              <!-- Video / Camera -->
              <button type="button" class="attach-item" @click="selectCategory('video')">
                <div class="attach-icon-wrapper attach-camera">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </div>
                <span class="attach-label">Camera</span>
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

              <!-- Audio -->
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

      <!-- Hidden multi-file input -->
      <input
        type="file"
        ref="fileInput"
        @change="onFilesSelected"
        class="hidden-input"
        multiple
        :accept="activeAccept"
      />

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
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useUiStore } from '@/stores/ui'

const emit = defineEmits(['send', 'typing'])
const ui = useUiStore()

const text          = ref('')
const selectedFiles = ref([])   // [{ file: File, objectUrl: string|null }]
const fileInput     = ref(null)
const isTyping      = ref(false)
let typingTimeout   = null

const showAttachPopup = ref(false)
const activeAccept = ref('image/*,video/*,audio/*,application/pdf,.doc,.docx,.xls,.xlsx')

const canSend = computed(() => text.value.trim().length > 0 || selectedFiles.value.length > 0)

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

// ─── File selection ──────────────────────────────────────────────────────────
const toggleAttachPopup = () => {
  showAttachPopup.value = !showAttachPopup.value
}

const triggerFileInput = () => fileInput.value?.click()

const selectCategory = (type) => {
  showAttachPopup.value = false
  if (type === 'gallery') {
    activeAccept.value = 'image/*'
    triggerFileInput()
  } else if (type === 'video') {
    activeAccept.value = 'video/*'
    triggerFileInput()
  } else if (type === 'audio') {
    activeAccept.value = 'audio/*'
    triggerFileInput()
  } else if (type === 'document') {
    activeAccept.value = 'application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
    triggerFileInput()
  } else {
    ui.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} sharing is coming soon!`, 'info')
  }
}

const onFilesSelected = (event) => {
  const files = Array.from(event.target.files || [])
  files.forEach(file => {
    selectedFiles.value.push({
      file,
      objectUrl: isPreviewable(file) ? URL.createObjectURL(file) : null
    })
  })
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

// Revoke object URLs when component unmounts
onBeforeUnmount(clearAllFiles)

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

  if (typingTimeout) clearTimeout(typingTimeout)
  if (isTyping.value) {
    isTyping.value = false
    emit('typing', false)
  }

  // Emit text + array of File objects (not wrapped items)
  emit('send', {
    text: text.value,
    files: selectedFiles.value.map(item => item.file)
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
  border-top: 1px solid #E8E4FF;
  background: #fff;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #E8E4FF;
  background: #F8F7FF;
  flex-shrink: 0;
  cursor: default;
}

/* Image/video chips show thumb */
.chip--image,
.chip--video { border-color: #C4B5FD; background: #000; }

.chip-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Icon chips */
.chip--audio  { border-color: #FCD34D; background: #FFFBEB; }
.chip--pdf    { border-color: #FCA5A5; background: #FEF2F2; }
.chip--file   { border-color: #A5B4FC; background: #EEF2FF; }

.chip--audio  .chip-icon { color: #D97706; }
.chip--pdf    .chip-icon { color: #EF4444; }
.chip--file   .chip-icon { color: #6366F1; }

.chip-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.chip-name {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,0.45);
  color: #fff;
  font-size: 8.5px;
  font-weight: 600;
  text-align: center;
  padding: 2px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chip--image .chip-name,
.chip--video .chip-name { background: rgba(0,0,0,0.5); }

.chip-remove {
  position: absolute;
  top: 3px; right: 3px;
  background: rgba(0,0,0,0.55);
  border: none;
  border-radius: 50%;
  width: 18px; height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  padding: 0;
  transition: background 0.15s;
}
.chip-remove:hover { background: #EF4444; }

.clear-all-btn {
  font-size: 11px;
  color: #6C5CE7;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
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