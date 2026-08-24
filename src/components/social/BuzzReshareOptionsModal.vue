<template>
  <Teleport to="body">
    <Transition name="bro-fade">
      <div v-if="modelValue" class="bro-overlay" @click.self="close">
        <div class="bro-card" role="dialog" aria-modal="true" aria-label="Share buzz options">
          <!-- Header -->
          <div class="bro-header">
            <div class="bro-header-left">
              <svg xmlns="http://www.w3.org/2000/svg" class="bro-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <div>
                <h3 class="bro-title">Share Buzz</h3>
                <p class="bro-subtitle">Choose how you want to share this buzz</p>
              </div>
            </div>
            <button class="bro-close" @click="close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Options Grid -->
          <div class="bro-body">
            <!-- Option 1: Share as Buzz -->
            <button class="bro-option-card bro-option-buzz" @click="selectBuzz">
              <div class="bro-option-icon-wrap bro-icon-buzz">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
              <div class="bro-option-info">
                <span class="bro-option-title">Reshare as Buzz 🔁</span>
                <span class="bro-option-desc">Share to your buzz carousel for 24 hours</span>
              </div>
              <svg class="bro-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <!-- Option 2: Share to Feed -->
            <button class="bro-option-card bro-option-feed" @click="selectFeed">
              <div class="bro-option-icon-wrap bro-icon-feed">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
              </div>
              <div class="bro-option-info">
                <span class="bro-option-title">Share to Feed as Post 📰</span>
                <span class="bro-option-desc">Post to main feed with text & media preserved</span>
              </div>
              <svg class="bro-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, required: true },
})
const emit = defineEmits(['update:modelValue', 'select-buzz', 'select-feed'])

function close() {
  emit('update:modelValue', false)
}

function selectBuzz() {
  emit('update:modelValue', false)
  emit('select-buzz')
}

function selectFeed() {
  emit('update:modelValue', false)
  emit('select-feed')
}
</script>

<style scoped>
.bro-overlay {
  position: fixed; inset: 0; z-index: 1100;
  background: rgba(10, 12, 30, 0.65); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.bro-card {
  background: #ffffff; border-radius: 24px;
  width: 100%; max-width: 400px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  display: flex; flex-direction: column; overflow: hidden;
  animation: bro-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes bro-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.bro-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #f0f0f5;
}
.bro-header-left { display: flex; align-items: center; gap: 10px; }
.bro-header-icon { width: 22px; height: 22px; color: #6366f1; }
.bro-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
.bro-subtitle { font-size: 11px; color: #64748b; margin: 0; }
.bro-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: #f1f5f9; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #64748b;
  transition: background 0.2s;
}
.bro-close:hover { background: #e2e8f0; color: #1e293b; }

.bro-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

.bro-option-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 16px;
  border: 1px solid #e2e8f0; background: #fafafa;
  text-align: left; cursor: pointer; transition: all 0.2s ease;
  width: 100%;
}
.bro-option-card:hover {
  border-color: #6366f1; background: #f8fafc;
  transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
}

.bro-option-icon-wrap {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; flex-shrink: 0;
}
.bro-icon-buzz { background: linear-gradient(135deg, #8b5cf6, #ec4899); }
.bro-icon-feed { background: linear-gradient(135deg, #3b82f6, #6366f1); }

.bro-option-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.bro-option-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.bro-option-desc { font-size: 11px; color: #64748b; line-height: 1.3; }

.bro-arrow { color: #94a3b8; transition: transform 0.2s; }
.bro-option-card:hover .bro-arrow { transform: translateX(2px); color: #6366f1; }

.bro-fade-enter-active, .bro-fade-leave-active { transition: opacity 0.2s; }
.bro-fade-enter-from, .bro-fade-leave-to { opacity: 0; }
</style>
