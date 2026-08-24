<template>
  <Teleport to="body">
    <Transition name="sbm-fade">
      <div v-if="modelValue" class="sbm-overlay" @click.self="close">
        <div class="sbm-card" role="dialog" aria-modal="true" aria-label="Reshare buzz">

          <!-- Header -->
          <div class="sbm-header">
            <div class="sbm-header-left">
              <!-- Reshare icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="sbm-reshare-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span class="sbm-title">Reshare Buzz</span>
            </div>
            <button class="sbm-close" @click="close" :disabled="loading" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="sbm-body">

            <!-- Resharer composer -->
            <div class="sbm-composer">
              <div class="sbm-avatar">
                <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="You" />
                <span v-else>{{ currentUserInitials }}</span>
              </div>
              <div class="sbm-composer-right">
                <p class="sbm-username">{{ currentUser?.name }}</p>
                <textarea
                  v-model="caption"
                  class="sbm-textarea"
                  rows="2"
                  placeholder="Add a comment... (optional)"
                  maxlength="500"
                  id="reshare-buzz-caption"
                />
                <p class="sbm-char-count">{{ caption.length }}/500</p>
              </div>
            </div>

            <!-- Buzz preview (read-only compact card) -->
            <div class="sbm-buzz-preview" v-if="buzz">
              <!-- Reshared badge if this itself is already a reshare -->
              <div v-if="buzz.is_reshared" class="sbm-reshared-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Reshared
              </div>

              <div class="sbm-preview-header">
                <div class="sbm-preview-avatar">
                  <img v-if="buzz.creator?.avatar" :src="buzz.creator.avatar" alt="" />
                  <span v-else>{{ buzzCreatorInitials }}</span>
                </div>
                <span class="sbm-preview-name">{{ buzz.creator?.name || 'Corper' }}</span>
              </div>

              <!-- Text buzz with proper background gradient + font styling -->
              <div
                v-if="!buzz.media?.length"
                class="sbm-preview-text-card"
                :style="previewBgStyle"
              >
                <p :style="previewTextStyle">{{ buzz.content }}</p>
              </div>

              <!-- Image buzz -->
              <div v-else-if="buzz.media[0]?.type === 'image'" class="sbm-preview-media">
                <img :src="buzz.media[0].url" class="sbm-preview-img" alt="" />
                <p v-if="buzz.content" class="sbm-preview-caption">{{ buzz.content }}</p>
              </div>

              <!-- Video buzz -->
              <div v-else class="sbm-preview-video-thumb">
                <svg xmlns="http://www.w3.org/2000/svg" class="sbm-play" fill="white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
                  <polygon points="10,8 18,12 10,16" fill="white" />
                </svg>
                <p v-if="buzz.content" class="sbm-preview-caption">{{ buzz.content }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sbm-footer">
            <button class="sbm-cancel-btn" @click="close" :disabled="loading">Cancel</button>
            <button
              id="reshare-buzz-submit"
              class="sbm-submit-btn"
              @click="submit"
              :disabled="loading"
            >
              <svg v-if="loading" class="sbm-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              {{ loading ? 'Resharing...' : '↩ Reshare' }}
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
import { useUiStore } from '@/stores/ui'
import { useBuzzStore } from '@/stores/buzz'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  buzz:       { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue', 'reshared'])

const { user: currentUser } = useAuth()
const ui = useUiStore()
const buzzStore = useBuzzStore()
const caption = ref('')
const loading = ref(false)

const currentUserInitials = computed(() => {
  const n = currentUser.value?.name || '?'
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

const buzzCreatorInitials = computed(() => {
  const n = props.buzz?.creator?.name || '?'
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

const BUZZ_BG_MAP = {
  violet:   'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
  sunset:   'linear-gradient(135deg,#F59E0B,#EF4444)',
  forest:   'linear-gradient(135deg,#10B981,#059669)',
  ocean:    'linear-gradient(135deg,#3B82F6,#8B5CF6)',
  rose:     'linear-gradient(135deg,#EC4899,#F43F5E)',
  night:    'linear-gradient(135deg,#1A1535,#2D2B55)',
  nysc:     'linear-gradient(135deg,#16A34A,#15803D)',
  midnight: 'linear-gradient(135deg,#0F172A,#1E293B)',
  gold:     'linear-gradient(135deg,#F59E0B,#D97706)',
  neon:     'linear-gradient(135deg,#06B6D4,#3B82F6)',
  cherry:   'linear-gradient(135deg,#DC2626,#991B1B)',
  lavender: 'linear-gradient(135deg,#A855F7,#EC4899)',
  fire:     'linear-gradient(135deg,#EA580C,#CA8A04)',
}

const FONT_FAMILY_MAP = {
  sans:    "Inter, system-ui, -apple-system, sans-serif",
  serif:   "Georgia, 'Times New Roman', serif",
  mono:    "'Courier New', Courier, monospace",
  cursive: "'Caveat', 'Comic Sans MS', cursive",
  impact:  "Impact, 'Arial Black', sans-serif",
}

const FONT_WEIGHT_MAP = { normal: '400', medium: '500', bold: '700', black: '900' }

// Resolves the buzz bg key → actual CSS gradient
const previewBgStyle = computed(() => {
  const bg = props.buzz?.bg
  if (bg && bg !== 'none' && BUZZ_BG_MAP[bg]) return { background: BUZZ_BG_MAP[bg] }
  if (bg && (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('linear-gradient'))) return { background: bg }
  // Fallback deterministic gradient based on uuid
  const fallbacks = [
    'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
    'linear-gradient(135deg,#EC4899,#F472B6)',
    'linear-gradient(135deg,#10B981,#34D399)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
  ]
  let h = 0
  for (const c of (props.buzz?.uuid || '')) h = ((h << 5) - h) + c.charCodeAt(0)
  return { background: fallbacks[Math.abs(h) % fallbacks.length] }
})

// Font style + weight for the preview text
const previewTextStyle = computed(() => {
  const buzz = props.buzz
  const len = buzz?.content?.length || 0
  const fontSize = len <= 80 ? '1.1rem' : len <= 200 ? '0.95rem' : '0.82rem'
  return {
    color: '#fff',
    fontSize,
    lineHeight: '1.5',
    fontFamily: FONT_FAMILY_MAP[buzz?.font_style] || FONT_FAMILY_MAP.sans,
    fontWeight: FONT_WEIGHT_MAP[buzz?.font_weight] || FONT_WEIGHT_MAP.bold,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  }
})

function close() {
  if (loading.value) return
  caption.value = ''
  emit('update:modelValue', false)
}

function forceClose() {
  caption.value = ''
  emit('update:modelValue', false)
}

async function submit() {
  loading.value = true
  let success = false
  try {
    // Use the store action — it prepends the new buzz to buzzStore.items[]
    // so it appears immediately in the feed carousel without a page refresh.
    const reshare = await buzzStore.reshare(props.buzz.uuid, {
      content: caption.value.trim() || null,
    })
    success = true
    emit('reshared', reshare)
  } catch (err) {
    ui.showToast('Failed to reshare. Please try again.', 'error')
    console.error('Reshare buzz error:', err)
  } finally {
    loading.value = false
    if (success) forceClose()
  }
}
</script>

<style scoped>
.sbm-overlay {
  position: fixed; inset: 0; z-index: 1100;
  background: rgba(10,12,30,0.65); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.sbm-card {
  background: #fff; border-radius: 20px;
  width: 100%; max-width: 420px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  display: flex; flex-direction: column; overflow: hidden;
}
.sbm-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #f0f0f5;
}
.sbm-header-left { display: flex; align-items: center; gap: 8px; }
.sbm-reshare-icon { width: 18px; height: 18px; color: #6366f1; }
.sbm-title { font-size: 15px; font-weight: 700; color: #1a1f36; }
.sbm-close {
  width: 30px; height: 30px; border-radius: 50%;
  background: #f4f4f8; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #6b7280;
}
.sbm-body { padding: 14px 18px; overflow-y: auto; max-height: 65vh; }
.sbm-composer { display: flex; gap: 10px; margin-bottom: 12px; }
.sbm-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; overflow: hidden;
}
.sbm-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sbm-composer-right { flex: 1; }
.sbm-username { font-size: 12px; font-weight: 700; color: #1a1f36; margin-bottom: 6px; }
.sbm-textarea {
  width: 100%; border: 1px solid #e8eaf0; border-radius: 8px;
  padding: 8px 10px; font-size: 13px; color: #374151; resize: none; outline: none;
  font-family: inherit; transition: border-color 0.2s;
}
.sbm-textarea:focus { border-color: #6366f1; }
.sbm-char-count { font-size: 11px; color: #9ca3af; text-align: right; margin-top: 3px; }

.sbm-buzz-preview {
  border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 12px; background: #f9fafb;
}
.sbm-reshared-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #6366f1;
  background: #eef2ff; border-radius: 20px; padding: 2px 8px;
  margin-bottom: 8px;
}
.sbm-preview-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.sbm-preview-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #fff; overflow: hidden; flex-shrink: 0;
}
.sbm-preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sbm-preview-name { font-size: 12px; font-weight: 700; color: #1a1f36; }
.sbm-preview-text {
  font-size: 13px; color: #374151; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  word-break: break-word; white-space: pre-wrap;
}
.sbm-preview-text-card {
  border-radius: 10px; overflow: hidden;
  min-height: 90px; max-height: 160px;
  display: flex; align-items: center; justify-content: center;
  padding: 14px 16px; text-align: center;
}
.sbm-preview-caption {
  font-size: 11px; color: #6b7280; margin-top: 5px; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.sbm-preview-media { margin-top: 8px; border-radius: 8px; overflow: hidden; }
.sbm-preview-img { width: 100%; max-height: 120px; object-fit: cover; display: block; }
.sbm-preview-video-thumb {
  height: 80px; background: #111;
  display: flex; align-items: center; justify-content: center;
}
.sbm-play { width: 32px; height: 32px; }

.sbm-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 12px 18px; border-top: 1px solid #f0f0f5;
}
.sbm-cancel-btn {
  padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px;
  background: transparent; color: #6b7280; font-size: 13px; font-weight: 600; cursor: pointer;
}
.sbm-submit-btn {
  padding: 8px 18px; border: none; border-radius: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  transition: opacity 0.2s;
}
.sbm-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.sbm-spin { width: 14px; height: 14px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.sbm-fade-enter-active, .sbm-fade-leave-active { transition: opacity 0.2s; }
.sbm-fade-enter-from, .sbm-fade-leave-to { opacity: 0; }
</style>
