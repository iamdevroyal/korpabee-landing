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
        <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Delete message">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 class="modal-title">Delete Message?</h2>
              <p class="modal-subtitle">This message will be removed for everyone in the chat.</p>
            </div>
            <button class="modal-close" @click="handleClose" title="Cancel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <!-- Body Message Preview -->
          <div v-if="messageText" class="modal-body">
            <div class="message-preview-box">
              <p class="preview-text">{{ messageText }}</p>
            </div>
          </div>

          <div v-if="error" class="error-banner">
            {{ error }}
          </div>

          <!-- Footer actions -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="handleClose" :disabled="deleting">
              Cancel
            </button>
            <button
              class="btn-delete"
              @click="handleDelete"
              :disabled="deleting"
            >
              <svg v-if="deleting" class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" style="opacity:.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" style="opacity:.8"/>
              </svg>
              <span>{{ deleting ? 'Deleting…' : 'Delete for everyone' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const props = defineProps({
  open:        { type: Boolean, default: false },
  messageUuid: { type: String,  default: '' },
  messageText: { type: String,  default: '' },
})

const emit = defineEmits(['close', 'deleted'])

const chatStore = useChatStore()
const deleting  = ref(false)
const error     = ref('')

const handleClose = () => {
  if (deleting.value) return
  error.value = ''
  emit('close')
}

const handleDelete = async () => {
  if (!props.messageUuid) return
  deleting.value = true
  error.value    = ''

  try {
    await chatStore.deleteMessage(props.messageUuid)
    emit('deleted')
    emit('close')
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to delete message. Please try again.'
  } finally {
    deleting.value = false
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
  max-width: 440px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 14px;
}

.modal-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  flex-shrink: 0;
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px;
}

.modal-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
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
  padding: 0 20px 12px;
}

.message-preview-box {
  background: #f9fafb;
  border: 1.5px dashed #e5e7eb;
  border-radius: 10px;
  padding: 10px 14px;
}

.preview-text {
  font-size: 13px;
  color: #4b5563;
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.error-banner {
  margin: 0 20px 10px;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 8px;
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
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

.btn-delete {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  background: #ef4444;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn-delete:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
.btn-delete:active:not(:disabled) { transform: translateY(0); }
.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

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
