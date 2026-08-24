<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="spm-overlay" @click.self="close">
        <div class="spm-card" role="dialog" aria-modal="true" aria-label="Share post">

          <!-- Header -->
          <div class="spm-header">
            <h3 class="spm-title">
              <svg xmlns="http://www.w3.org/2000/svg" class="spm-title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Post
            </h3>
            <button class="spm-close" @click="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Resharer's own caption -->
          <div class="spm-body">
            <div class="spm-composer">
              <div class="spm-user-avatar">
                <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="You" />
                <span v-else>{{ currentUserInitials }}</span>
              </div>
              <div class="spm-composer-right">
                <div class="spm-visibility-row">
                  <span class="spm-username">{{ currentUser?.name }}</span>
                  <select v-model="visibility" class="spm-vis-select" id="share-visibility">
                    <option value="public">🌍 Global</option>
                    <option value="state">📍 State</option>
                    <option value="platoon">🪖 Platoon</option>
                    <option value="batch">🎓 Batch</option>
                  </select>
                </div>
                <textarea
                  v-model="caption"
                  class="spm-textarea"
                  rows="3"
                  placeholder="Say something about this post... (optional)"
                  maxlength="1000"
                  id="share-caption"
                />
                <p class="spm-char-count">{{ caption.length }}/1000</p>
              </div>
            </div>

            <!-- Original post preview (read-only) -->
            <OriginalPostPreview :post="post" />
          </div>

          <!-- Footer -->
          <div class="spm-footer">
            <button class="spm-cancel-btn" @click="close" :disabled="loading">Cancel</button>
            <button
              id="share-post-submit"
              class="spm-share-btn"
              @click="submit"
              :disabled="loading"
            >
              <svg v-if="loading" class="spm-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="spm-share-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {{ loading ? 'Sharing...' : 'Share Now' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFeedStore } from '@/stores/feed'
import { useUiStore } from '@/stores/ui'
import OriginalPostPreview from './OriginalPostPreview.vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  post: { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue', 'shared'])

const { user: currentUser } = useAuth()
const feedStore = useFeedStore()
const ui = useUiStore()

const caption    = ref('')
const visibility = ref('public')
const loading    = ref(false)

const currentUserInitials = computed(() => {
  const n = currentUser.value?.name || '?'
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

function close() {
  if (loading.value) return
  caption.value = ''
  visibility.value = 'public'
  emit('update:modelValue', false)
}

// Internal close that bypasses the loading guard — used after a successful submit
// (loading is reset in finally before this is called)
function forceClose() {
  caption.value = ''
  visibility.value = 'public'
  emit('update:modelValue', false)
}

async function submit() {
  loading.value = true
  let success = false
  try {
    await feedStore.sharePost(props.post.uuid, {
      content: caption.value.trim() || null,
      visibility: visibility.value,
    })
    success = true
    ui.showToast('Post reshared! 🔁', 'success')
    emit('shared')
  } catch (err) {
    ui.showToast('Failed to share post. Please try again.', 'error')
    console.error('Share post error:', err)
  } finally {
    loading.value = false
    if (success) forceClose()
  }
}
</script>

<style scoped>
.spm-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10, 12, 30, 0.6);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}

.spm-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.spm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f5;
}
.spm-title {
  display: flex; align-items: center; gap: 8px;
  font-size: 16px; font-weight: 700; color: #1a1f36;
}
.spm-title-icon { width: 20px; height: 20px; color: #6366f1; }
.spm-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: #f4f4f8; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #6b7280; transition: background 0.2s;
}
.spm-close:hover { background: #ebebf5; }

.spm-body { padding: 16px 20px; overflow-y: auto; max-height: 60vh; }

.spm-composer {
  display: flex; gap: 12px; margin-bottom: 12px;
}
.spm-user-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700; color: white;
  flex-shrink: 0; overflow: hidden;
}
.spm-user-avatar img { width: 100%; height: 100%; object-fit: cover; }
.spm-composer-right { flex: 1; min-width: 0; }

.spm-visibility-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}
.spm-username { font-size: 13px; font-weight: 700; color: #1a1f36; }
.spm-vis-select {
  font-size: 11px; font-weight: 600; color: #6366f1;
  background: #eef2ff; border: 1px solid #c7d2fe;
  border-radius: 20px; padding: 2px 8px;
  cursor: pointer; outline: none;
}

.spm-textarea {
  width: 100%; min-height: 80px;
  border: 1px solid #e8eaf0; border-radius: 10px;
  padding: 10px 12px; font-size: 14px; color: #374151;
  resize: none; outline: none; transition: border-color 0.2s;
  font-family: inherit;
}
.spm-textarea:focus { border-color: #6366f1; }
.spm-char-count { font-size: 11px; color: #9ca3af; text-align: right; margin-top: 4px; }

.spm-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 20px; border-top: 1px solid #f0f0f5;
}
.spm-cancel-btn {
  padding: 9px 18px; border-radius: 10px; border: 1px solid #e5e7eb;
  background: transparent; color: #6b7280; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.spm-cancel-btn:hover { background: #f9fafb; }

.spm-share-btn {
  padding: 9px 20px; border-radius: 10px; border: none;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; font-size: 13px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
}
.spm-share-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.spm-share-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.spm-share-icon, .spm-spinner { width: 16px; height: 16px; }
.spm-spinner { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
