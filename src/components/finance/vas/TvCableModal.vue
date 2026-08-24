<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="handleClose">
      <div class="flutter-sheet-card">
        <!-- iOS/Android drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Pay TV Bill</h3>
            <p class="flutter-sheet-subtitle">Renew DStv, GOtv, StarTimes & streaming</p>
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
          <!-- Provider Grid -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Provider</span>
            <div class="provider-selection-grid">
              <button
                v-for="p in providers" :key="p.id"
                class="provider-select-btn"
                :class="{ active: form.provider === p.id }"
                @click="form.provider = p.id; form.plan = null; form.smartcard = ''; cardName = ''"
              >
                <span class="provider-logo-avatar" :style="{ background: p.color + '20', color: p.color }">
                  {{ p.icon }}
                </span>
                <span class="provider-name-label">{{ p.name }}</span>
              </button>
            </div>
          </div>

          <!-- Smart Card Number input -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">{{ smartcardLabel }}</span>
            <div class="flutter-text-field-input-wrap smartcard-wrap">
              <span class="card-icon-prefix">💳</span>
              <input
                v-model="form.smartcard"
                type="tel"
                class="flutter-text-field-input smartcard-input-field"
                :placeholder="smartcardPlaceholder"
                maxlength="12"
                inputmode="numeric"
                @input="triggerCardResolve"
              />
              <!-- Loader inside input -->
              <span v-if="cardResolving" class="spinner-suffix">
                <span class="flutter-spin"></span>
              </span>
              <span v-else-if="cardName" class="checkmark-suffix">✓</span>
            </div>

            <!-- Resolution Badge -->
            <div v-if="cardName" class="resolved-owner-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Verified: <strong>{{ cardName }}</strong></span>
            </div>
          </div>

          <!-- Plan Selection List -->
          <div v-if="currentPlans.length" class="flutter-text-field">
            <span class="flutter-text-field-label">Select Subscription Plan</span>
            <div class="plan-selection-list">
              <button
                v-for="plan in currentPlans"
                :key="plan.id"
                class="plan-card-item"
                :class="{ active: form.plan?.id === plan.id }"
                @click="form.plan = plan"
              >
                <div class="plan-left-details">
                  <span class="plan-name-text">{{ plan.name }}</span>
                  <span class="plan-desc-text">{{ plan.desc }}</span>
                </div>
                <span class="plan-price-text">₦{{ plan.price.toLocaleString() }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="handleClose">
            Cancel
          </button>
          <button class="flutter-btn flutter-btn-primary" :disabled="!canPay || loading" @click="handlePay">
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>Pay ₦{{ form.plan?.price?.toLocaleString() ?? '0' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast.js'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const { showToast } = useToast()

const providers = [
  { id: 'dstv',   name: 'DStv',       icon: '📡', color: '#3B82F6' },
  { id: 'gotv',   name: 'GOtv',       icon: '📺', color: '#10B981' },
  { id: 'startimes', name: 'StarTimes', icon: '⭐', color: '#EF4444' },
  { id: 'showmax', name: 'Showmax',   icon: '🎬', color: '#EC4899' },
]

const plansMap = {
  dstv: [
    { id: 1, name: 'Access', desc: '40+ channels, 1 month', price: 2500 },
    { id: 2, name: 'Confam', desc: '65+ channels, 1 month', price: 6200 },
    { id: 3, name: 'Compact', desc: '115+ channels, 1 month', price: 15700 },
    { id: 4, name: 'Compact+', desc: '130+ channels, 1 month', price: 22000 },
    { id: 5, name: 'Premium', desc: '180+ channels, 1 month', price: 29500 },
  ],
  gotv: [
    { id: 1, name: 'Smallie', desc: '15 channels, 1 month', price: 1575 },
    { id: 2, name: 'Jinja', desc: '50 channels, 1 month', price: 3300 },
    { id: 3, name: 'Jolli', desc: '65 channels, 1 month', price: 4150 },
    { id: 4, name: 'Max', desc: '75+ channels, 1 month', price: 7200 },
  ],
  startimes: [
    { id: 1, name: 'Nova', desc: '40 channels, 1 month', price: 1300 },
    { id: 2, name: 'Basic', desc: '70 channels, 1 month', price: 2000 },
    { id: 3, name: 'Smart', desc: '110 channels, 1 month', price: 3100 },
    { id: 4, name: 'Classic', desc: '160 channels, 1 month', price: 4900 },
  ],
  showmax: [
    { id: 1, name: 'Mobile', desc: 'Mobile only, 1 month', price: 2900 },
    { id: 2, name: 'Standard', desc: '2 screens, 1 month', price: 5900 },
    { id: 3, name: 'Premier League', desc: 'With live football', price: 8900 },
  ],
}

const form = ref({ provider: 'dstv', smartcard: '', plan: null })
const loading = ref(false)
const cardName = ref('')
const cardResolving = ref(false)
let resolveTimer = null

const currentPlans = computed(() => plansMap[form.value.provider] ?? [])
const smartcardPlaceholder = computed(() => form.value.provider === 'showmax' ? 'Showmax registered email' : 'Enter 10 to 12 digit IUC number')
const smartcardLabel = computed(() => form.value.provider === 'showmax' ? 'Account Email' : 'Smart Card / IUC Number')
const canPay = computed(() => form.value.smartcard.length >= 8 && !!form.value.plan && !!cardName.value)

const triggerCardResolve = () => {
  cardName.value = ''
  if (form.value.smartcard.length >= 8) {
    cardResolving.value = true
    if (resolveTimer) clearTimeout(resolveTimer)
    resolveTimer = setTimeout(() => {
      cardResolving.value = false
      cardName.value = 'Royal Njoku'
    }, 1000)
  }
}

const handlePay = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  showToast({ title: 'Subscription Renewed! ✓', message: `${providers.find(p => p.id === form.value.provider)?.name} ${form.value.plan?.name} activated for ${cardName.value}.`, duration: 5000 })
  emit('update:modelValue', false)
}

const handleClose = () => emit('update:modelValue', false)
</script>

<style scoped>
/* ── Provider Selection Grid ── */
.provider-selection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.provider-select-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 12px var(--spacing-xs);
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.provider-select-btn:hover {
  background-color: rgba(59, 130, 246, 0.06);
  border-color: rgba(59, 130, 246, 0.25);
}
.provider-select-btn.active {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: var(--m3-blue);
}
.provider-select-btn:active {
  transform: var(--interactive-scale);
}

.provider-logo-avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: var(--elevation-1);
}

.provider-name-label {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  text-align: center;
}
.provider-select-btn.active .provider-name-label {
  color: #93C5FD;
  font-weight: 800;
}

/* ── Smartcard inputs ── */
.smartcard-wrap {
  border-radius: var(--radius-md);
}
.smartcard-wrap:focus-within {
  border-color: var(--m3-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}
.card-icon-prefix {
  padding-left: var(--spacing-lg);
  font-size: 16px;
  user-select: none;
}
.smartcard-input-field {
  padding: 13px 16px 13px 4px;
  font-weight: 700;
  letter-spacing: 1px;
}
.spinner-suffix, .checkmark-suffix {
  padding-right: var(--spacing-lg);
  display: flex;
  align-items: center;
}
.checkmark-suffix {
  color: var(--m3-success);
  font-weight: 800;
  font-size: 16px;
}

.resolved-owner-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  background-color: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-full);
  font: var(--type-label-sm);
  color: var(--m3-success);
  margin-top: 4px;
  width: fit-content;
}

/* ── Plan Selection List ── */
.plan-selection-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 220px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
}

.plan-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.plan-card-item:hover {
  border-color: rgba(59, 130, 246, 0.4);
  background-color: var(--m3-surface-container);
}
.plan-card-item.active {
  background-color: rgba(59, 130, 246, 0.08);
  border-color: var(--m3-blue);
}
.plan-card-item:active {
  transform: var(--interactive-scale);
}

.plan-left-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}
.plan-name-text {
  font: var(--type-title-md);
  color: var(--m3-on-surface);
}
.plan-desc-text {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}

.plan-price-text {
  font: var(--type-title-md);
  color: var(--m3-blue);
  font-weight: 800;
}
</style>
