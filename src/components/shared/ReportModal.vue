<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="report-modal-overlay" @click.self="close">
        <div class="report-modal">
          <!-- Header -->
          <div class="report-modal__header">
            <div class="report-modal__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
            </div>
            <div>
              <h3 class="report-modal__title">Report {{ contentLabel }}</h3>
              <p class="report-modal__sub">Help keep KorpaBee safe for all corpers</p>
            </div>
            <button class="report-modal__close" @click="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="report-modal__body">
            <div v-if="submitted" class="report-modal__success">
              <div class="report-modal__success-icon">✓</div>
              <p class="report-modal__success-title">Report submitted!</p>
              <p class="report-modal__success-sub">Our moderation team will review this. Thank you for helping keep the community safe.</p>
              <button class="report-modal__btn report-modal__btn--primary" @click="close">Done</button>
            </div>

            <template v-else>
              <div class="report-modal__field">
                <label class="report-modal__label">Why are you reporting this? <span class="report-modal__required">*</span></label>
                <div class="report-modal__reasons">
                  <button
                    v-for="reason in reasons"
                    :key="reason.value"
                    type="button"
                    :class="['report-modal__reason', { 'report-modal__reason--active': form.reason === reason.value }]"
                    @click="form.reason = reason.value"
                  >
                    <span class="report-modal__reason-icon">{{ reason.icon }}</span>
                    <span class="report-modal__reason-text">{{ reason.label }}</span>
                  </button>
                </div>
              </div>

              <div class="report-modal__field">
                <label class="report-modal__label">Additional details (optional)</label>
                <textarea
                  v-model="form.description"
                  rows="2.5"
                  class="report-modal__textarea"
                  placeholder="Add context or specifics to help our team investigate…"
                  maxlength="500"
                ></textarea>
                <p class="report-modal__char-count">{{ form.description.length }}/500</p>
              </div>

              <p v-if="error" class="report-modal__error">{{ error }}</p>
            </template>
          </div>

          <!-- Footer Actions -->
          <div v-if="!submitted" class="report-modal__footer">
            <button type="button" class="report-modal__btn report-modal__btn--ghost" @click="close">Cancel</button>
            <button type="button" class="report-modal__btn report-modal__btn--primary" :disabled="!form.reason || submitting" @click="submit">
              <svg v-if="submitting" class="report-modal__spinner" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ submitting ? 'Submitting…' : 'Submit Report' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { moderationApi } from '@/api/moderation.js'

const props = defineProps({
  open:         { type: Boolean, default: false },
  targetType:   { type: String,  required: true }, // 'post' | 'buzz' | 'comment' | 'buzz_comment' | 'gig' | 'ppa_review' | 'message' | 'user'
  targetId:     { type: [Number, String], required: true },
})

const emit = defineEmits(['close'])

const submitting = ref(false)
const submitted  = ref(false)
const error      = ref('')

const form = reactive({ reason: '', description: '' })

const contentLabels = {
  post:         'Post',
  comment:      'Comment',
  buzz:         'Buzz Video',
  buzz_comment: 'Buzz Comment',
  gig:          'Gig',
  ppa_review:   'PPA Review',
  message:      'Message',
  user:         'User Profile',
}

const contentLabel = computed(() => contentLabels[props.targetType] ?? 'Content')

const reasons = [
  { value: 'spam',           icon: '📢', label: 'Spam or unsolicited promotion' },
  { value: 'harassment',     icon: '😡', label: 'Harassment or bullying' },
  { value: 'hate_speech',    icon: '🚫', label: 'Hate speech or discrimination' },
  { value: 'misinformation', icon: '❌', label: 'False or misleading information' },
  { value: 'fake',           icon: '🎭', label: 'Fake identity or impersonation' },
  { value: 'inappropriate',  icon: '⚠️', label: 'Nudity or inappropriate content' },
  { value: 'fraud',          icon: '💰', label: 'Scam, fraud, or financial deception' },
  { value: 'other',          icon: '📋', label: 'Other violation' },
]

// Reset state each time the modal opens
watch(() => props.open, (val) => {
  if (val) {
    form.reason      = ''
    form.description = ''
    error.value      = ''
    submitted.value  = false
    submitting.value = false
  }
})

function close() {
  emit('close')
}

async function submit() {
  if (!form.reason || submitting.value) return
  submitting.value = true
  error.value = ''
  try {
    await moderationApi.reportContent({
      reportable_type: props.targetType,
      reportable_id:   props.targetId,
      reason:          form.reason,
      description:     form.description || null,
    })
    submitted.value = true
  } catch (err) {
    error.value = err?.response?.data?.message || 'Failed to submit report. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.report-modal-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}

.report-modal {
  background: #fff; border-radius: 20px; width: 100%; max-width: 520px;
  max-height: 85vh; display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden;
}

.report-modal__header {
  display: flex; align-items: center; gap: 12px;
  padding: 16px 20px; border-bottom: 1px solid #f0f0f4;
  flex-shrink: 0; background: #fff;
}
.report-modal__icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: #fef3f2; color: #d92d20;
  display: flex; align-items: center; justify-content: center;
}
.report-modal__title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0; }
.report-modal__sub   { font-size: 11px; color: #888; margin: 2px 0 0; }
.report-modal__close {
  margin-left: auto; background: none; border: none; cursor: pointer;
  color: #aaa; padding: 4px; border-radius: 8px; display: flex; align-items: center;
}
.report-modal__close:hover { background: #f5f5f7; color: #555; }

.report-modal__body {
  padding: 18px 20px; flex: 1; overflow-y: auto; min-height: 0;
}

.report-modal__field { margin-bottom: 16px; }
.report-modal__label { display: block; font-size: 12px; font-weight: 600; color: #444; margin-bottom: 10px; }
.report-modal__required { color: #d92d20; }

.report-modal__reasons {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
}
@media (max-width: 520px) {
  .report-modal__reasons { grid-template-columns: 1fr; }
}

.report-modal__reason {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 12px; border-radius: 12px; border: 1.5px solid #e8e8f0;
  background: #fff; cursor: pointer; text-align: left; font-size: 12px;
  color: #333; transition: all 0.15s ease; font-weight: 500; min-height: 44px;
}
.report-modal__reason:hover { border-color: #6c5ce7; background: #f5f3ff; }
.report-modal__reason--active { border-color: #6c5ce7; background: #f0eeff; color: #5a4fd0; font-weight: 600; }
.report-modal__reason-icon { font-size: 15px; flex-shrink: 0; }
.report-modal__reason-text { line-height: 1.3; }

.report-modal__textarea {
  width: 100%; border: 1.5px solid #e8e8f0; border-radius: 10px;
  padding: 10px 12px; font-size: 13px; color: #333; resize: none;
  outline: none; font-family: inherit; transition: border-color 0.15s;
}
.report-modal__textarea:focus { border-color: #6c5ce7; }
.report-modal__char-count { font-size: 11px; color: #bbb; text-align: right; margin-top: 4px; }

.report-modal__error { color: #d92d20; font-size: 12px; margin-bottom: 12px; }

.report-modal__footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 20px; border-top: 1px solid #f0f0f4; flex-shrink: 0; background: #fff;
}
.report-modal__btn {
  padding: 9px 20px; border-radius: 10px; font-size: 13px; font-weight: 600;
  cursor: pointer; border: none; transition: all 0.15s ease;
  display: flex; align-items: center; gap: 6px;
}
.report-modal__btn--ghost { background: #f5f5f7; color: #666; }
.report-modal__btn--ghost:hover { background: #eaeaef; }
.report-modal__btn--primary { background: #d92d20; color: #fff; }
.report-modal__btn--primary:hover:not(:disabled) { background: #b91c1c; }
.report-modal__btn--primary:disabled { opacity: 0.55; cursor: not-allowed; }
.report-modal__spinner { animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.report-modal__success { text-align: center; padding: 24px 10px 10px; }
.report-modal__success-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: #ecfdf5; color: #059669; font-size: 24px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
}
.report-modal__success-title { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0 0 8px; }
.report-modal__success-sub { font-size: 13px; color: #666; margin: 0 0 20px; line-height: 1.5; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

