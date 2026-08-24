<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="modal-backdrop"
        @click.self="handleClose"
        @keydown.esc="handleClose"
        tabindex="-1"
      >
        <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Edit message">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Edit Message</h2>
              <p class="modal-subtitle">Changes are visible to everyone in real-time</p>
            </div>
            <button class="modal-close" @click="handleClose" title="Cancel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Textarea -->
          <div class="modal-body">
            <textarea
              ref="textareaRef"
              v-model="editedText"
              class="edit-textarea"
              :class="{ 'has-error': error }"
              placeholder="Type your message…"
              rows="4"
              maxlength="5000"
              @keydown.ctrl.enter="handleSave"
              @keydown.meta.enter="handleSave"
            />
            <div class="textarea-meta">
              <span v-if="error" class="error-text">{{ error }}</span>
              <span class="char-count" :class="{ 'near-limit': editedText.length > 4800 }">
                {{ editedText.length }}/5000
              </span>
            </div>
          </div>

          <!-- Footer actions -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="handleClose" :disabled="saving">
              Cancel
            </button>
            <button
              class="btn-save"
              @click="handleSave"
              :disabled="saving || !editedText.trim() || editedText.trim() === originalText.trim()"
            >
              <svg v-if="saving" class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" style="opacity:.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity:.8"/>
              </svg>
              <span>{{ saving ? 'Saving…' : 'Save changes' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const props = defineProps({
  open:        { type: Boolean, default: false },
  messageUuid: { type: String,  default: '' },
  currentText: { type: String,  default: '' },
})

const emit = defineEmits(['close', 'saved'])

const chatStore    = useChatStore()
const textareaRef  = ref(null)
const editedText   = ref('')
const originalText = ref('')
const saving       = ref(false)
const error        = ref('')

// Populate textarea when modal opens
watch(() => props.open, async (val) => {
  if (val) {
    editedText.value   = props.currentText || ''
    originalText.value = props.currentText || ''
    error.value        = ''
    await nextTick()
    textareaRef.value?.focus()
    // Place cursor at end
    const len = textareaRef.value?.value.length || 0
    textareaRef.value?.setSelectionRange(len, len)
  }
})

const handleClose = () => {
  if (saving.value) return
  emit('close')
}

const handleSave = async () => {
  const trimmed = editedText.value.trim()
  if (!trimmed) {
    error.value = 'Message cannot be empty.'
    return
  }
  if (trimmed === originalText.value.trim()) {
    handleClose()
    return
  }

  saving.value = true
  error.value  = ''

  try {
    await chatStore.editMessage(props.messageUuid, trimmed)
    emit('saved', trimmed)
    emit('close')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  z-index: 9900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-panel {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px;
}

.modal-subtitle {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.modal-close {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}

.modal-body {
  padding: 16px 20px 12px;
}

.edit-textarea {
  width: 100%;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.55;
  color: #111827;
  resize: vertical;
  min-height: 96px;
  max-height: 240px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  box-sizing: border-box;
}
.edit-textarea:focus {
  border-color: #0d9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.12);
}
.edit-textarea.has-error {
  border-color: #ef4444;
}

.textarea-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
  min-height: 18px;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

.char-count {
  font-size: 11px;
  color: #d1d5db;
  margin-left: auto;
}
.char-count.near-limit {
  color: #f59e0b;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  gap: 10px;
  padding: 12px 20px 20px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 9px 18px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-cancel:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-save {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #0d9488, #14b8a6);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
}
.btn-save:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-save:active:not(:disabled) { transform: translateY(0); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

.spin {
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal transitions */
.modal-fade-enter-active { animation: modal-in 0.2s ease; }
.modal-fade-leave-active { animation: modal-in 0.15s ease reverse; }
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
}
</style>
