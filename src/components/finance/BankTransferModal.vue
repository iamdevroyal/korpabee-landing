<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="handleClose">
      <div class="flutter-sheet-card">
        <!-- iOS/Android drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <line x1="9" y1="21" x2="9" y2="9"></line>
              <line x1="15" y1="21" x2="15" y2="9"></line>
              <line x1="3" y1="9" x2="21" y2="9"></line>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">To Bank Account</h3>
            <p class="flutter-sheet-subtitle">Withdraw wallet balance to any bank</p>
          </div>
          <button class="flutter-sheet-close" @click="handleClose" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Steps Indicator -->
        <div class="m3-steps-container">
          <div class="step-item" :class="{ active: step >= 1, completed: step > 1 }">
            <div class="step-circle">{{ step > 1 ? 'âœ“' : '1' }}</div>
            <span class="step-label">Bank Details</span>
          </div>
          <div class="step-separator-line" :class="{ active: step >= 2 }"></div>
          <div class="step-item" :class="{ active: step >= 2, completed: step > 2 }">
            <div class="step-circle">{{ step > 2 ? 'âœ“' : '2' }}</div>
            <span class="step-label">Amount</span>
          </div>
          <div class="step-separator-line" :class="{ active: step >= 3 }"></div>
          <div class="step-item" :class="{ active: step >= 3 }">
            <div class="step-circle">3</div>
            <span class="step-label">Confirm</span>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flutter-sheet-body">
          <!-- STEP 1: BANK DETAILS -->
          <div v-if="step === 1" class="step-content-box">
            <!-- Select Bank â€” searchable combobox styled like Material 3 TextFormField -->
            <div class="flutter-text-field">
              <span class="flutter-text-field-label">Select Bank</span>

              <div class="bank-combobox" ref="bankComboboxRef">
                <!-- Trigger: always the same box, arrow always works, never swapped out -->
                <div class="flutter-text-field-input-wrap bank-select-wrap" @click="toggleBankDropdown">
                  <span class="select-icon-prefix">ðŸ¦</span>
                  <span class="flutter-text-field-input select-input bank-combobox-trigger" :class="{ 'is-placeholder': !selectedBankName }">
                    {{ selectedBankName || 'Choose your destination bank' }}
                  </span>
                  <span class="select-chevron" :class="{ 'is-open': bankDropdownOpen }">â–¼</span>
                </div>

                <!-- Panel: sits below the select, not inside it, so it's never clipped -->
                <div v-if="bankDropdownOpen" class="bank-dropdown-panel">
                  <div class="bank-dropdown-search-wrap">
                    <span class="bank-dropdown-search-icon">ðŸ”</span>
                    <input
                      ref="bankSearchInputRef"
                      v-model="bankSearchQuery"
                      type="text"
                      class="bank-dropdown-search-input"
                      placeholder="Search bank name..."
                      @click.stop
                      @keydown.esc="bankDropdownOpen = false"
                    />
                  </div>
                  <div class="bank-dropdown-list">
                    <button
                      v-for="bank in filteredBanks"
                      :key="bank.code"
                      type="button"
                      class="bank-dropdown-option"
                      :class="{ active: bank.code === form.bank_code }"
                      @click="selectBank(bank)"
                    >
                      {{ bank.name }}
                    </button>
                    <div v-if="!filteredBanks.length" class="bank-dropdown-empty">No banks match "{{ bankSearchQuery }}"</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Account Number -->
            <div class="flutter-text-field" style="margin-top: var(--spacing-sm);">
              <span class="flutter-text-field-label">Account Number</span>
              <div class="flutter-text-field-input-wrap">
                <input
                  v-model="form.account_number"
                  type="tel"
                  class="flutter-text-field-input account-number-input"
                  placeholder="0123456789"
                  maxlength="10"
                  inputmode="numeric"
                  @input="triggerResolve"
                />
              </div>
            </div>

            <!-- Real-time Verification Feedback -->
            <div v-if="resolving" class="resolve-card loading">
              <span class="pulse-dot"></span>
              <span>Verifying account details with bank...</span>
            </div>
            <div v-else-if="form.account_name" class="resolve-card success">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div class="resolve-text">
                <span class="resolve-label">Account Verified</span>
                <span class="verified-name">{{ form.account_name }}</span>
              </div>
            </div>
            <div v-else-if="resolveError" class="resolve-card error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="error-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div class="resolve-text">
                <span class="resolve-label error-label">Verification Failed</span>
                <span class="verified-name error-name">{{ resolveError }}</span>
              </div>
            </div>
          </div>

          <!-- STEP 2: AMOUNT -->
          <div v-else-if="step === 2" class="step-content-box">
            <!-- Verified Account Info Pill -->
            <div class="account-pill-card">
              <div class="bank-avatar-wrap">ðŸ¦</div>
              <div class="pill-details">
                <span class="pill-name">{{ form.account_name }}</span>
                <span class="pill-meta">{{ form.account_number }} Â· {{ selectedBankName }}</span>
              </div>
              <button class="btn-edit-account" @click="step = 1">Edit</button>
            </div>

            <div class="flutter-text-field" style="margin-top: var(--spacing-md);">
              <span class="flutter-text-field-label">Amount (â‚¦)</span>
              <div class="flutter-text-field-input-wrap amount-wrap">
                <span class="amount-symbol">â‚¦</span>
                <input
                  v-model.number="form.amount"
                  type="number"
                  class="flutter-text-field-input amount-input"
                  placeholder="0.00"
                  min="500"
                />
              </div>
              <div class="balance-hint-row">
                <span>Available: <strong>â‚¦{{ balanceFmt }}</strong></span>
                <button class="btn-max-amount" @click="form.amount = Math.min(balance, 200000)">Max Limit</button>
              </div>
            </div>

            <!-- Presets -->
            <div class="chip-preset-row">
              <button
                v-for="p in [1000, 2000, 5000, 10000]"
                :key="p"
                class="preset-chip-item"
                :class="{ active: form.amount === p }"
                @click="form.amount = p"
              >
                â‚¦{{ p.toLocaleString() }}
              </button>
            </div>

            <!-- Detailed Fee Breakdown Card -->
            <div class="m3-fee-card">
              <div class="fee-row">
                <span>Withdrawal Amount</span>
                <span>â‚¦{{ (form.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="fee-row">
                <span>Processing Fee (0.5%)</span>
                <span class="fee-accent">â‚¦{{ fee.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="fee-row total-deducted-row">
                <span>Total Wallet Deduction</span>
                <span>â‚¦{{ (Number(form.amount || 0) + fee).toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>
          </div>

          <!-- STEP 3: CONFIRMATION -->
          <div v-else-if="step === 3" class="step-content-box">
            <div class="m3-summary-card">
              <div class="summary-card-row">
                <span class="row-title">Recipient Name</span>
                <span class="row-value">{{ form.account_name }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Bank</span>
                <span class="row-value">{{ selectedBankName }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Account Number</span>
                <span class="row-value font-mono">{{ form.account_number }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Transfer Amount</span>
                <span class="row-value amount-red">â‚¦{{ form.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Processing Fee</span>
                <span class="row-value fee-orange">â‚¦{{ fee.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div class="summary-card-row total-row">
                <span class="row-title">Total Deducted</span>
                <span class="row-value">â‚¦{{ (Number(form.amount || 0) + fee).toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>

            <!-- Cupertino Warning Badge -->
            <div class="m3-warning-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="warning-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="warning-text">Bank transfers typically take 1â€“2 business hours. Fees are charged by local switches and are non-refundable.</span>
            </div>
          </div>

          <!-- Step 4: PIN entry (fallback from biometric cancel / web) -->
          <div v-else-if="step === 4" class="step-content-box">
            <div class="pin-step-header">
              <span class="pin-step-icon">🔐</span>
              <p class="pin-step-label">Enter your transaction PIN to confirm this transfer</p>
            </div>
            <TransactionPinPad
              ref="pinPadRef"
              :error="pinError"
              :loading="loading"
              @complete="submitWithPin"
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="step === 4 ? (step = 3) : (step > 1 ? step-- : handleClose())">
            {{ step > 1 ? 'Back' : 'Cancel' }}
          </button>
          <button v-if="step < 4" class="flutter-btn flutter-btn-primary" :disabled="!canProceed || loading" @click="nextStep">
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>{{ step < 3 ? 'Continue' : 'Confirm & Send' }}</span>
          </button>
        </div>
      </div>
    </div>
  <!-- SetupPinModal: shown when user has no PIN yet -->
  <SetupPinModal
    v-model="showPinSetup"
    mode="set"
    @success="onPinSetupSuccess"
  />
</Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance.js'
import { useUiStore } from '@/stores/ui'
import { isNative, vibrate } from '@/lib/nativeBridge.js'
import { useAuthStore } from '@/stores/auth.js'
import SetupPinModal from '@/components/SetupPinModal.vue'
import TransactionPinPad from '@/components/TransactionPinPad.vue'

const props = defineProps({ modelValue: Boolean, balance: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'success'])

const financeStore = useFinanceStore()
const authStore = useAuthStore()
const ui = useUiStore()

const step = ref(1)
const loading = ref(false)
const showPinSetup = ref(false)
const pinError = ref(null)
const pinPadRef = ref(null)
const resolving = ref(false)
const resolveError = ref('')
let resolveTimer = null
let resolveToken = 0 // guards against a stale response overwriting a newer request

const form = ref({ bank_code: '', account_number: '', account_name: '', amount: 1000 })

onMounted(() => {
  financeStore.fetchBanks().catch(() => {
    // Non-fatal â€” the hardcoded fallback list still lets the user proceed,
    // though codes should be verified against Paystack's live list.
  })
})

// Reset resolution state whenever the sheet is reopened
watch(() => props.modelValue, (open) => {
  if (open) resolveError.value = ''
})

const banks = computed(() => financeStore.banks ?? [
  { code: '044', name: 'Access Bank' }, { code: '050', name: 'EcoBank Nigeria' },
  { code: '011', name: 'First Bank Nigeria' }, { code: '058', name: 'Guaranty Trust Bank' },
  { code: '070', name: 'Heritage Bank' }, { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' }, { code: '082', name: 'Keystone Bank' },
  { code: '033', name: 'UBA' }, { code: '035', name: 'Wema Bank' }, { code: '057', name: 'Zenith Bank' },
])
const selectedBankName = computed(() => banks.value.find(b => b.code === form.value.bank_code)?.name ?? '')

// â”€â”€ Searchable bank combobox â”€â”€
const bankDropdownOpen = ref(false)
const bankSearchQuery = ref('')
const bankSearchInputRef = ref(null)
const bankComboboxRef = ref(null)

const filteredBanks = computed(() => {
  const q = bankSearchQuery.value.trim().toLowerCase()
  if (!q) return banks.value
  return banks.value.filter((b) => b.name.toLowerCase().includes(q))
})

const toggleBankDropdown = () => {
  bankDropdownOpen.value = !bankDropdownOpen.value
  if (bankDropdownOpen.value) {
    bankSearchQuery.value = ''
    nextTick(() => bankSearchInputRef.value?.focus())
  }
}

const selectBank = (bank) => {
  form.value.bank_code = bank.code
  bankDropdownOpen.value = false
  bankSearchQuery.value = ''
  triggerResolve()
}

const handleClickOutsideBankDropdown = (e) => {
  if (bankComboboxRef.value && !bankComboboxRef.value.contains(e.target)) {
    bankDropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutsideBankDropdown))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutsideBankDropdown))

const balanceFmt = computed(() => Number(props.balance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }))
const fee = computed(() => Math.max(50, Math.round((form.value.amount || 0) * 0.005)))

const canProceed = computed(() => {
  if (step.value === 1) return !!form.value.account_name && !!form.value.bank_code
  if (step.value === 2) return form.value.amount >= 500 && (Number(form.value.amount || 0) + fee.value) <= props.balance
  return true
})

const triggerResolve = () => {
  form.value.account_name = ''
  resolveError.value = ''
  resolving.value = false

  const num = form.value.account_number.trim()
  const bank = form.value.bank_code

  if (resolveTimer) clearTimeout(resolveTimer)

  // Nigerian NUBAN account numbers are exactly 10 digits; only fire once both fields are ready
  if (num.length !== 10 || !bank) return

  const token = ++resolveToken
  resolving.value = true

  // Debounce so we don't hit Paystack on every keystroke while typing the last digits
  resolveTimer = setTimeout(async () => {
    try {
      const data = await financeStore.resolveBankAccount({ account_number: num, bank_code: bank })
      if (token !== resolveToken) return // input changed again while this call was in flight
      form.value.account_name = data.account_name
    } catch (e) {
      if (token !== resolveToken) return
      resolveError.value = e.response?.data?.message ?? 'Could not verify this account. Check the details and try again.'
    } finally {
      if (token === resolveToken) resolving.value = false
    }
  }, 400)
}

// Lightweight DOM-based confetti burst â€” no external dependency needed.
const fireConfetti = () => {
  const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899']
  const container = document.createElement('div')
  container.className = 'confetti-burst-container'
  document.body.appendChild(container)

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('span')
    piece.className = 'confetti-piece'
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 640}px`)
    piece.style.setProperty('--y', `${Math.random() * 420 + 260}px`)
    piece.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`)
    piece.style.setProperty('--delay', `${Math.random() * 150}ms`)
    piece.style.background = colors[i % colors.length]
    container.appendChild(piece)
  }

  setTimeout(() => container.remove(), 2000)
}

const nextStep = async () => {
  if (step.value < 3) { step.value++; return }

  // On the native app, require Face ID / fingerprint before moving money.
  // No-op on web (returns true immediately) â€” see src/lib/nativeBridge.js.
  if (isNative()) {
    const confirmed = await confirmWithBiometrics({
      reason: `Confirm transfer of â‚¦${(form.value.amount || 0).toLocaleString()}`,
    })
    if (!confirmed) {
      vibrate()
      ui.showToast('Transfer cancelled â€” biometric confirmation failed.', 'error', 4000)
      return
    }
  }

  loading.value = true
  try {
    await financeStore.withdraw(form.value)
    fireConfetti()
    ui.showToast(`Transfer initiated â€” â‚¦${form.value.amount.toLocaleString()} to ${form.value.account_name} is being processed.`, 'success', 5000)
    emit('success')
    handleClose()
  } catch (e) {
    // Backend always returns { message } in the JSON body on failure; fall back to a
    // generic message only for genuine network-level failures (e.response missing entirely).
    const message = e.response?.data?.message ?? 'Network error. Please check your connection and try again.'
    ui.showToast(message, 'error', 6000)
  } finally {
    loading.value = false
  }
}


/** Called from the inline PIN pad (step 4) once the user enters their PIN. */

function onPinSetupSuccess() {
  ui.showToast('PIN set! Now enter your PIN to confirm the transfer.', 'info', 3000)
  step.value = 4
}
async function submitWithPin(pin) {
  loading.value = true
  pinError.value = null
  try {
    await financeStore.withdraw({ ...form.value, transaction_pin: pin })
    fireConfetti()
    ui.showToast(`Transfer initiated — ₦${form.value.amount.toLocaleString()} to ${form.value.account_name} is being processed.`, 'success', 5000)
    emit('success')
    handleClose()
  } catch (e) {
    const message = e.response?.data?.message ?? 'Incorrect PIN or network error.'
    pinError.value = message
    ui.showToast(message, 'error', 5000)
  } finally {
    loading.value = false
  }
}
const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    step.value = 1; resolving.value = false; resolveError.value = ''
    bankDropdownOpen.value = false; bankSearchQuery.value = ''
    form.value = { bank_code: '', account_number: '', account_name: '', amount: 1000 }
  }, 300)
}
</script>

<style scoped>
/* â”€â”€ Steps Indicator â”€â”€ */
.m3-steps-container {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background-color: var(--m3-surface-container-low);
  border-bottom: 1px solid var(--m3-outline);
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.step-circle {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--m3-on-surface-variant);
  font: var(--type-label-sm);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-short) var(--ease-out);
}
.step-item.active .step-circle {
  background-color: var(--m3-purple);
  color: #ffffff;
}
.step-item.completed .step-circle {
  background-color: var(--m3-success);
  color: #ffffff;
}

.step-label {
  font: var(--type-label-sm);
  font-weight: 700;
  color: var(--m3-on-surface-variant);
  transition: color var(--duration-short);
}
.step-item.active .step-label {
  color: var(--m3-on-surface);
}

.step-separator-line {
  flex: 1;
  height: 2.5px;
  background-color: rgba(255, 255, 255, 0.08);
  margin: 0 10px;
  border-radius: var(--radius-full);
  transition: background-color var(--duration-short);
}
.step-separator-line.active {
  background-color: var(--m3-purple);
}

/* â”€â”€ Step Content Box â”€â”€ */
.step-content-box {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
}

/* â”€â”€ Bank Select Wrap â”€â”€ */
.bank-combobox {
  position: relative; /* dropdown panel anchors here, NOT inside the input box below */
}
.bank-select-wrap {
  cursor: pointer;
}
.select-icon-prefix {
  padding-left: var(--spacing-lg);
  font-size: 16px;
  pointer-events: none;
}
.select-chevron {
  position: absolute;
  right: 16px;
  font-size: 9px;
  color: var(--m3-on-surface-variant);
  pointer-events: none;
  transition: transform 0.15s ease;
}
.select-chevron.is-open {
  transform: rotate(180deg);
}
.select-input {
  appearance: none;
  padding: 13px 40px 13px 8px;
  font-weight: 600;
  cursor: pointer;
}
.select-input option {
  background-color: var(--m3-surface);
  color: var(--m3-on-surface);
}

/* â”€â”€ Bank Combobox (searchable dropdown) â”€â”€ */
.bank-combobox-trigger {
  display: block;
  width: 100%;
  text-align: left;
}
.bank-combobox-trigger.is-placeholder {
  color: var(--m3-on-surface-variant);
}

/* Panel sits fully OUTSIDE the input box (anchored to .bank-combobox), so it's
   never clipped by the input-wrap's rounded-corner overflow:hidden. */
.bank-dropdown-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background-color: var(--m3-surface-container-low, var(--m3-surface));
  border: 1px solid var(--m3-outline-variant, var(--m3-outline));
  border-radius: var(--radius-md, 12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  z-index: 30;
  overflow: hidden;
}
.bank-dropdown-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--m3-outline-variant, var(--m3-outline));
}
.bank-dropdown-search-icon {
  font-size: 13px;
  opacity: 0.6;
}
.bank-dropdown-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font: var(--type-body-md, inherit);
  color: var(--m3-on-surface);
}
.bank-dropdown-list {
  max-height: 220px;
  overflow-y: auto;
  padding: 4px;
}
.bank-dropdown-option {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: none;
  background: none;
  border-radius: 8px;
  font: var(--type-body-md, inherit);
  font-weight: 500;
  color: var(--m3-on-surface);
  cursor: pointer;
}
.bank-dropdown-option:hover {
  background-color: var(--m3-surface-container-highest, rgba(0, 0, 0, 0.05));
}
.bank-dropdown-option.active {
  background-color: var(--m3-primary-container, rgba(139, 92, 246, 0.12));
  font-weight: 700;
}
.bank-dropdown-empty {
  padding: 14px 12px;
  font-size: 13px;
  color: var(--m3-on-surface-variant);
  text-align: center;
}

/* â”€â”€ Confetti burst â”€â”€ */
.confetti-burst-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99999; /* above this modal, below the global toast layer (999999) */
  overflow: hidden;
}
.confetti-piece {
  position: absolute;
  left: 50%;
  top: 35%;
  width: 8px;
  height: 14px;
  border-radius: 2px;
  opacity: 0;
  animation: confetti-fall 1.7s ease-out forwards;
  animation-delay: var(--delay);
}
@keyframes confetti-fall {
  0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
  100% { opacity: 0; transform: translate(var(--x), var(--y)) rotate(var(--rot)); }
}

.account-number-input {
  letter-spacing: 2.5px;
  font-weight: 800;
}

/* â”€â”€ Resolve Card â”€â”€ */
.resolve-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  animation: card-fade-in var(--duration-medium) var(--ease-out);
}
@keyframes card-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.resolve-card.loading {
  background-color: rgba(139, 92, 246, 0.06);
  color: var(--m3-on-surface-variant);
  font: var(--type-body-md);
}
.pulse-dot {
  width: 8px; height: 8px;
  background-color: var(--m3-purple);
  border-radius: var(--radius-full);
  animation: pulse-effect 1s infinite alternate;
}
@keyframes pulse-effect {
  from { opacity: 0.3; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1.15); }
}

.resolve-card.success {
  background-color: rgba(16, 185, 129, 0.07);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--m3-on-surface);
}
.check-icon {
  color: var(--m3-success);
  flex-shrink: 0;
}
.resolve-text {
  display: flex;
  flex-direction: column;
}
.resolve-label {
  font: var(--type-label-sm);
  color: var(--m3-success);
  font-weight: 800;
}
.verified-name {
  font: var(--type-body-lg);
  font-weight: 700;
}

.resolve-card.error {
  background-color: rgba(239, 68, 68, 0.07);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--m3-on-surface);
}
.error-icon {
  color: var(--m3-error);
  flex-shrink: 0;
}
.error-label {
  color: var(--m3-error) !important;
}
.error-name {
  font: var(--type-body-md);
  font-weight: 600;
}

/* â”€â”€ Account Pill Card (Step 2) â”€â”€ */
.account-pill-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background-color: rgba(139, 92, 246, 0.07);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}
.bank-avatar-wrap {
  font-size: 20px;
  user-select: none;
}
.pill-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.pill-name {
  font: var(--type-body-lg);
  font-weight: 700;
  color: var(--m3-on-surface);
}
.pill-meta {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}
.btn-edit-account {
  background: none;
  border: none;
  color: var(--m3-purple);
  font: var(--type-label-lg);
  cursor: pointer;
  padding: 4px var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-short);
}
.btn-edit-account:hover {
  background-color: rgba(139, 92, 246, 0.1);
}

/* â”€â”€ Amount Input Step 2 â”€â”€ */
.amount-wrap {
  border-radius: var(--radius-md);
}
.amount-symbol {
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
}
.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.balance-hint-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}
.btn-max-amount {
  background-color: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: var(--radius-sm);
  color: var(--m3-purple);
  font: var(--type-label-sm);
  font-weight: 800;
  padding: 2px 8px;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.btn-max-amount:hover {
  background-color: rgba(139, 92, 246, 0.16);
}

/* Presets */
.chip-preset-row {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.preset-chip-item {
  padding: 8px 16px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-full);
  color: var(--m3-on-surface-variant);
  font: var(--type-label-md);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.preset-chip-item:hover {
  border-color: rgba(139, 92, 246, 0.4);
  color: var(--m3-purple);
}
.preset-chip-item.active {
  background-color: var(--m3-purple);
  border-color: var(--m3-purple);
  color: #ffffff;
}

/* â”€â”€ Fee Breakdown Card â”€â”€ */
.m3-fee-card {
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 4px;
}
.fee-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid var(--m3-outline-variant);
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  font-weight: 600;
}
.fee-row:last-child {
  border-bottom: none;
}
.fee-accent {
  color: var(--m3-warning);
}
.total-deducted-row {
  background-color: rgba(139, 92, 246, 0.05);
  color: var(--m3-on-surface);
  font-weight: 700;
  border-top: 1px solid rgba(139, 92, 246, 0.15);
}

/* â”€â”€ Summary Card â”€â”€ */
.m3-summary-card {
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.summary-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--m3-outline-variant);
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  font-weight: 600;
}
.summary-card-row:last-child {
  border-bottom: none;
}
.row-value {
  font: var(--type-body-lg);
  font-weight: 700;
  color: var(--m3-on-surface);
  text-align: right;
  max-width: 60%;
}
.row-value.amount-red {
  color: var(--m3-error);
  font-size: 15px;
  font-weight: 800;
}
.row-value.fee-orange {
  color: var(--m3-warning);
}
.total-row {
  background-color: rgba(139, 92, 246, 0.06);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
}
.total-row .row-value {
  color: #C4B5FD;
  font-size: 15px;
  font-weight: 800;
}

/* â”€â”€ Warning Badge â”€â”€ */
.m3-warning-badge {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: 12px 14px;
  background-color: rgba(245, 158, 11, 0.05);
  border: 1px solid rgba(245, 158, 11, 0.15);
  border-radius: var(--radius-md);
}
.warning-icon {
  color: var(--m3-warning);
  flex-shrink: 0;
  margin-top: 1px;
}
.warning-text {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  line-height: 1.4;
}
</style>

