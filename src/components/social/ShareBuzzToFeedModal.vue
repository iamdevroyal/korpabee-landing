<template>
  <Teleport to="body">
    <Transition name="sbf-fade">
      <div v-if="modelValue" class="sbf-overlay" @click.self="close">
        <div class="sbf-card" role="dialog" aria-modal="true" aria-label="Share Buzz to Feed">

          <!-- Header -->
          <div class="sbf-header">
            <div class="sbf-header-left">
              <svg xmlns="http://www.w3.org/2000/svg" class="sbf-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
              </svg>
              <span class="sbf-title">Share Buzz to Feed</span>
            </div>
            <button class="sbf-close" @click="close" :disabled="loading" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="sbf-body">
            <!-- Resharer composer -->
            <div class="sbf-composer">
              <div class="sbf-avatar">
                <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="You" />
                <span v-else>{{ currentUserInitials }}</span>
              </div>
              <div class="sbf-composer-right">
                <p class="sbf-username">{{ currentUser?.name }}</p>
                <textarea
                  v-model="caption"
                  class="sbf-textarea"
                  rows="2"
                  placeholder="Add your thoughts... (optional)"
                  maxlength="500"
                  id="share-buzz-to-feed-caption"
                />
                <p class="sbf-char-count">{{ caption.length }}/500</p>
              </div>
            </div>

            <!-- Buzz preview -->
            <div class="sbf-buzz-preview" v-if="targetBuzz">
              <div class="sbf-preview-header">
                <div class="sbf-preview-avatar">
                  <img v-if="targetBuzz.creator?.avatar" :src="targetBuzz.creator.avatar" alt="" />
                  <span v-else>{{ buzzCreatorInitials }}</span>
                </div>
                <span class="sbf-preview-name">{{ targetBuzz.creator?.name || 'Corper' }}</span>
              </div>

              <!-- Text buzz with gradient bg & font styling -->
              <div
                v-if="!targetBuzz.media?.length"
                class="sbf-preview-text-card"
                :style="previewBgStyle"
              >
                <p :style="previewTextStyle">{{ targetBuzz.content }}</p>
              </div>

              <!-- Image buzz -->
              <div v-else-if="targetBuzz.media[0]?.type === 'image'" class="sbf-preview-media">
                <img :src="targetBuzz.media[0].url" class="sbf-preview-img" alt="" />
                <p v-if="targetBuzz.content" class="sbf-preview-caption">{{ targetBuzz.content }}</p>
              </div>

              <!-- Video buzz -->
              <div v-else class="sbf-preview-video-thumb">
                <svg xmlns="http://www.w3.org/2000/svg" class="sbf-play" fill="white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
                  <polygon points="10,8 18,12 10,16" fill="white" />
                </svg>
                <p v-if="targetBuzz.content" class="sbf-preview-caption">{{ targetBuzz.content }}</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sbf-footer">
            <button class="sbf-cancel-btn" @click="close" :disabled="loading">Cancel</button>
            <button
              id="share-buzz-to-feed-submit"
              class="sbf-submit-btn"
              @click="submit"
              :disabled="loading"
            >
              <svg v-if="loading" class="sbf-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              {{ loading ? 'Posting...' : '📰 Post to Feed' }}
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

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  buzz:       { type: Object, required: true },
})
const emit = defineEmits(['update:modelValue', 'posted'])

const { user: currentUser } = useAuth()
const feedStore = useFeedStore()
const caption = ref('')
const loading = ref(false)

const targetBuzz = computed(() => {
  if (props.buzz?.type === 'reshare' && props.buzz?.original_buzz && !props.buzz.original_buzz.deleted) {
    return props.buzz.original_buzz
  }
  return props.buzz
})

const currentUserInitials = computed(() => {
  const n = currentUser.value?.name || '?'
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

const buzzCreatorInitials = computed(() => {
  const n = targetBuzz.value?.creator?.name || '?'
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

const previewBgStyle = computed(() => {
  const bg = targetBuzz.value?.bg
  if (bg && bg !== 'none' && BUZZ_BG_MAP[bg]) return { background: BUZZ_BG_MAP[bg] }
  if (bg && (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('linear-gradient'))) return { background: bg }
  const fallbacks = [
    'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
    'linear-gradient(135deg,#EC4899,#F472B6)',
    'linear-gradient(135deg,#10B981,#34D399)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
  ]
  let h = 0
  for (const c of (targetBuzz.value?.uuid || '')) h = ((h << 5) - h) + c.charCodeAt(0)
  return { background: fallbacks[Math.abs(h) % fallbacks.length] }
})

const previewTextStyle = computed(() => {
  const buzz = targetBuzz.value
  const len = buzz?.content?.length || 0
  const fontSize = len <= 80 ? '1.05rem' : len <= 200 ? '0.92rem' : '0.82rem'
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
    const post = await feedStore.shareBuzzToFeed(props.buzz.uuid, {
      content: caption.value.trim() || null,
    })
    success = true
    emit('posted', post)

    // Smooth scroll window to top if on feed view
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (document.documentElement) document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Share buzz to feed error:', err)
  } finally {
    loading.value = false
    if (success) forceClose()
  }
}
</script>

<style scoped>
.sbf-overlay {
  position: fixed; inset: 0; z-index: 1100;
  background: rgba(10, 12, 30, 0.65); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.sbf-card {
  background: #ffffff; border-radius: 20px;
  width: 100%; max-width: 440px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.25);
  display: flex; flex-direction: column; overflow: hidden;
}
.sbf-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; border-bottom: 1px solid #f0f0f5;
}
.sbf-header-left { display: flex; align-items: center; gap: 8px; }
.sbf-header-icon { width: 18px; height: 18px; color: #3b82f6; }
.sbf-title { font-size: 15px; font-weight: 700; color: #1a1f36; }
.sbf-close {
  width: 30px; height: 30px; border-radius: 50%;
  background: #f4f4f8; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #6b7280;
}
.sbf-body { padding: 14px 18px; overflow-y: auto; max-height: 65vh; }
.sbf-composer { display: flex; gap: 10px; margin-bottom: 12px; }
.sbf-avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; overflow: hidden;
}
.sbf-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sbf-composer-right { flex: 1; }
.sbf-username { font-size: 12px; font-weight: 700; color: #1a1f36; margin-bottom: 6px; }
.sbf-textarea {
  width: 100%; border: 1px solid #e8eaf0; border-radius: 8px;
  padding: 8px 10px; font-size: 13px; color: #374151; resize: none; outline: none;
  font-family: inherit; transition: border-color 0.2s;
}
.sbf-textarea:focus { border-color: #3b82f6; }
.sbf-char-count { font-size: 11px; color: #9ca3af; text-align: right; margin-top: 3px; }

.sbf-buzz-preview {
  border: 1px solid #e5e7eb; border-radius: 12px;
  padding: 12px; background: #f8fafc;
}
.sbf-preview-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.sbf-preview-avatar {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 700; color: #fff; overflow: hidden; flex-shrink: 0;
}
.sbf-preview-avatar img { width: 100%; height: 100%; object-fit: cover; }
.sbf-preview-name { font-size: 12px; font-weight: 700; color: #1a1f36; }

.sbf-preview-text-card {
  border-radius: 10px; overflow: hidden;
  min-height: 90px; max-height: 160px;
  display: flex; align-items: center; justify-content: center;
  padding: 14px 16px; text-align: center;
}
.sbf-preview-caption {
  font-size: 11px; color: #6b7280; margin-top: 5px; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.sbf-preview-media { margin-top: 8px; border-radius: 8px; overflow: hidden; }
.sbf-preview-img { width: 100%; max-height: 120px; object-fit: cover; display: block; }
.sbf-preview-video-thumb {
  height: 80px; background: #111;
  display: flex; align-items: center; justify-content: center;
}
.sbf-play { width: 32px; height: 32px; }

.sbf-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 12px 18px; border-top: 1px solid #f0f0f5;
}
.sbf-cancel-btn {
  padding: 8px 16px; border: 1px solid #e5e7eb; border-radius: 8px;
  background: transparent; color: #6b7280; font-size: 13px; font-weight: 600; cursor: pointer;
}
.sbf-submit-btn {
  padding: 8px 18px; border: none; border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: opacity 0.2s;
}
.sbf-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.sbf-spin { width: 14px; height: 14px; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.sbf-fade-enter-active, .sbf-fade-leave-active { transition: opacity 0.2s; }
.sbf-fade-enter-from, .sbf-fade-leave-to { opacity: 0; }
</style>
