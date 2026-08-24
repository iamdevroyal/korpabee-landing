<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="handleClose">
      <div class="flutter-sheet-card">
        <!-- iOS/Android drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5 2 0 3 1 3 2.5s-1 2-2 2.5c-1 .5-1.5 1-1.5 2v.5"></path>
              <line x1="12" y1="19" x2="12.01" y2="19"></line>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Crypto Exchange</h3>
            <p class="flutter-sheet-subtitle">Secure peer-to-peer crypto swaps</p>
          </div>
          <button class="flutter-sheet-close" @click="handleClose" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flutter-sheet-body">
          <!-- Coming Soon Hero - Pulsing orbs -->
          <div class="cs-hero-container">
            <div class="vector-orb-wrapper">
              <div class="pulse-ring ring-first"></div>
              <div class="pulse-ring ring-second"></div>
              <div class="pulse-ring ring-third"></div>
              <span class="bitcoin-symbol">₿</span>
            </div>
            <h2 class="coming-soon-title">Coming Soon</h2>
            <p class="coming-soon-desc">We're building a highly secure, instant crypto on/off-ramp and P2P swap engine tailored for verified corps members.</p>
          </div>

          <!-- Feature List -->
          <div class="feature-list-deck">
            <div class="feature-item-card" v-for="feat in features" :key="feat.icon">
              <span class="feat-icon-symbol">{{ feat.icon }}</span>
              <div class="feat-details">
                <div class="feat-title-text">{{ feat.name }}</div>
                <div class="feat-description-text">{{ feat.desc }}</div>
              </div>
              <span class="feat-soon-pill">Soon</span>
            </div>
          </div>

          <!-- Notification form with Material 3 TextFormField style -->
          <div class="notify-form-section">
            <span class="flutter-text-field-label">Get Notified On Release</span>
            <div class="flutter-text-field-input-wrap notify-input-row" :class="{ success: notified }">
              <input
                v-model="email"
                type="email"
                class="flutter-text-field-input notify-input-field"
                placeholder="Enter your email address"
                :disabled="notified"
              />
              <button class="notify-action-btn" :disabled="notified || !email" @click="handleNotify">
                <span v-if="notified">✓ Added</span>
                <span v-else>Notify Me</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky Footer with full-width close button -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-primary full-width-close" @click="handleClose">
            Close Panel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast.js'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const { showToast } = useToast()

const email = ref('')
const notified = ref(false)

const features = [
  { icon: '₿', name: 'BTC & USDT Ramp', desc: 'Buy crypto with your wallet balance' },
  { icon: '⚡', name: 'Instant P2P Swap', desc: 'Trade directly with verified peers' },
  { icon: '🔒', name: 'Escrow Protection', desc: 'All trades secured by KorpaBee escrow' },
  { icon: '📈', name: 'Live Market Rates', desc: 'Real-time NGN/USD/BTC pricing' },
]

const handleNotify = () => {
  notified.value = true
  showToast({ title: 'You\'re on the list! 🚀', message: 'We\'ll notify you as soon as Crypto Exchange goes live.', duration: 5000 })
}

const handleClose = () => emit('update:modelValue', false)
</script>

<style scoped>
/* ── Coming Soon Hero with Pulsing Rings ── */
.cs-hero-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) 0 var(--spacing-sm);
}

.vector-orb-wrapper {
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.pulse-ring {
  position: absolute;
  border-radius: var(--radius-full);
  border: 2px solid rgba(245, 158, 11, 0.25);
  animation: ripple-pulse 2.5s ease-out infinite;
}
.ring-first { width: 84px; height: 84px; animation-delay: 0s; }
.ring-second { width: 104px; height: 104px; animation-delay: 0.5s; }
.ring-third { width: 124px; height: 124px; animation-delay: 1s; }

@keyframes ripple-pulse {
  0% { opacity: 0.6; transform: scale(0.85); }
  80% { opacity: 0; }
  100% { opacity: 0; transform: scale(1.2); }
}

.bitcoin-symbol {
  width: 58px;
  height: 58px;
  background: linear-gradient(135deg, var(--m3-orange), #D97706);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 900;
  color: #ffffff;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
}

.coming-soon-title {
  font: var(--type-headline);
  color: var(--m3-on-surface);
  margin: 0;
  letter-spacing: -0.5px;
}

.coming-soon-desc {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  text-align: center;
  line-height: 1.55;
  max-width: 300px;
  margin: 0;
}

/* ── Feature List ── */
.feature-list-deck {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  width: 100%;
}

.feature-item-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 12px 14px;
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-md);
}

.feat-icon-symbol {
  width: 36px;
  height: 36px;
  background-color: var(--m3-orange-container);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--m3-orange);
  font-weight: 900;
  flex-shrink: 0;
}

.feat-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.feat-title-text {
  font: var(--type-body-lg);
  font-weight: 700;
  color: var(--m3-on-surface);
}
.feat-description-text {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
  margin-top: 1px;
}

.feat-soon-pill {
  padding: 2px 8px;
  background-color: var(--m3-orange-container);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: var(--radius-full);
  font: var(--type-label-sm);
  color: var(--m3-orange);
  font-weight: 800;
  text-transform: uppercase;
  flex-shrink: 0;
}

/* ── Notification Form release ── */
.notify-form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
  margin-top: 4px;
}

.notify-input-row {
  border-radius: var(--radius-md);
  overflow: hidden;
  background-color: var(--m3-surface-container-low);
  display: flex;
  align-items: center;
  width: 100%;
}
.notify-input-row:focus-within {
  border-color: var(--m3-orange);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}
.notify-input-row.success {
  border-color: var(--m3-success);
}

.notify-input-field {
  padding: 12px 14px;
  font: var(--type-body-md);
}

.notify-action-btn {
  height: 40px;
  padding: 0 var(--spacing-lg);
  background: linear-gradient(135deg, var(--m3-orange), #D97706);
  border: none;
  border-radius: var(--radius-md);
  color: #ffffff;
  font: var(--type-label-lg);
  font-weight: 800;
  cursor: pointer;
  margin-right: 4px;
  transition: all var(--duration-short) var(--ease-out);
  white-space: nowrap;
}
.notify-action-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}
.notify-action-btn:active:not(:disabled) {
  transform: var(--interactive-scale);
}
.notify-action-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.full-width-close {
  width: 100%;
}
</style>
