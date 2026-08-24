<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="flutter-sheet-card">
        <!-- iOS/Android bottom sheet drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon primary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Add Money</h3>
            <p class="flutter-sheet-subtitle">Fund your KorpaBee wallet securely</p>
          </div>
          <button class="flutter-sheet-close" @click="$emit('update:modelValue', false)" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flutter-sheet-body">
          <!-- Presets -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Quick Select Amount</span>
            <div class="preset-grid">
              <button
                v-for="p in presets"
                :key="p"
                class="preset-chip"
                :class="{ active: amount === p }"
                @click="amount = p"
              >
                ₦{{ p.toLocaleString('en-NG') }}
              </button>
            </div>
          </div>

          <!-- TextFormField Custom Amount -->
          <div class="flutter-text-field" style="margin-top: var(--spacing-sm);">
            <span class="flutter-text-field-label">Or Enter Amount</span>
            <div class="flutter-text-field-input-wrap amount-wrap">
              <span class="amount-prefix-symbol">₦</span>
              <input
                v-model.number="amount"
                type="number"
                class="flutter-text-field-input amount-input"
                placeholder="0.00"
                min="100"
                @input="clearPreset"
              />
            </div>
            <span class="hint-text">Minimum deposit is ₦100</span>
          </div>

          <!-- Material 3 warning/fee note -->
          <div class="m3-note-card">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="note-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span class="note-text">Deposits are instant and secured. Powered by Paystack.</span>
          </div>
        </div>

        <!-- Sticky Footer with full-width primary CTA -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="$emit('update:modelValue', false)">
            Cancel
          </button>
          <button
            class="flutter-btn flutter-btn-primary"
            :disabled="loading || amount < 100"
            @click="handleTopup"
          >
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>Pay ₦{{ amount > 0 ? amount.toLocaleString('en-NG') : '0' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useFinanceStore } from '@/stores/finance.js'
import { useToast } from '@/composables/useToast.js'

defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const financeStore = useFinanceStore()
const { showToast } = useToast()

const presets = [1000, 2000, 5000, 10000, 20000, 50000]
const amount = ref(2000)
const loading = ref(false)
const clearPreset = () => {}

const handleTopup = async () => {
  if (typeof window.PaystackPop === 'undefined') {
    showToast({
      title: 'Payment Error',
      message: 'Paystack payment gateway is not loaded. Please check your internet connection.',
      duration: 5000
    })
    return
  }

  loading.value = true
  try {
    const result = await financeStore.initiateTopup(amount.value)
    
    const handler = window.PaystackPop.setup({
      key: result.public_key,
      email: result.email || financeStore.wallet?.user?.email,
      amount: amount.value * 100, // in kobo
      access_code: result.access_code,
      callback: function(response) {
        loading.value = true
        financeStore.verifyTopup(response.reference).then(() => {
          showToast({
            title: 'Top-up Success',
            message: 'Wallet topped up successfully!',
            duration: 5000
          })
          emit('update:modelValue', false)
        }).catch((err) => {
          console.error('[Verify Topup Error]', err)
          showToast({
            title: 'Verification Failed',
            message: 'Payment verification failed. Please contact support.',
            duration: 5000
          })
        }).finally(() => {
          loading.value = false
        })
      },
      onClose: () => {
        showToast({
          title: 'Top-up Closed',
          message: 'Payment window closed.',
          duration: 3000
        })
        loading.value = false
      }
    })
    
    handler.openIframe()
  } catch (e) {
    console.error('[Topup Initiate Error]', e)
    showToast({
      title: 'Top-up Error',
      message: e.response?.data?.message ?? 'Failed to initiate payment. Please try again.',
      duration: 5000
    })
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Presets Grid ── */
.preset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.preset-chip {
  padding: 12px 8px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-md);
  color: var(--m3-on-surface-variant);
  font: var(--type-label-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
  text-align: center;
}
.preset-chip:hover {
  background-color: var(--m3-surface-container-high);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--m3-on-surface);
}
.preset-chip.active {
  background-color: var(--m3-primary);
  border-color: var(--m3-primary);
  color: var(--m3-on-primary);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}
.preset-chip:active {
  transform: var(--interactive-scale);
}

/* ── Custom Amount Input Styles ── */
.amount-wrap {
  border-radius: var(--radius-md);
}
.amount-prefix-symbol {
  padding-left: var(--spacing-lg);
  font-size: 20px;
  font-weight: 800;
  color: var(--m3-on-surface-variant);
  user-select: none;
}
.amount-input {
  padding: 14px 16px 14px 4px;
  font-size: 22px;
  font-weight: 800;
  color: var(--m3-on-surface);
  letter-spacing: -0.5px;
}
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.hint-text {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  margin-top: 4px;
  font-weight: 500;
}

/* ── M3 Styled Notification Card ── */
.m3-note-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: 12px 14px;
  background-color: rgba(99, 102, 241, 0.06);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: var(--radius-md);
  margin-top: 4px;
}
.note-icon {
  color: var(--m3-primary);
  flex-shrink: 0;
  margin-top: 1px;
}
.note-text {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  line-height: 1.4;
}
</style>
