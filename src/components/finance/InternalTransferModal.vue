<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="handleClose">
      <div class="flutter-sheet-card">
        <!-- iOS/Android drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon" :class="step === 4 ? 'success-bg' : 'primary'">
            <svg v-if="step === 4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">{{ step === 4 ? 'Transfer Successful ðŸŽ‰' : 'To KorpaPoint' }}</h3>
            <p class="flutter-sheet-subtitle">{{ step === 4 ? 'Instant transfer completed' : 'Instant transfer to any KorpaTag' }}</p>
          </div>
          <button class="flutter-sheet-close" @click="handleClose" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Material 3 style step indicator -->
        <div class="m3-steps-container">
          <div class="step-item" :class="{ active: step >= 1, completed: step > 1 }">
            <div class="step-circle">{{ step > 1 ? 'âœ“' : '1' }}</div>
            <span class="step-label">Recipient</span>
          </div>
          <div class="step-separator-line" :class="{ active: step >= 2 }"></div>
          <div class="step-item" :class="{ active: step >= 2, completed: step > 2 }">
            <div class="step-circle">{{ step > 2 ? 'âœ“' : '2' }}</div>
            <span class="step-label">Amount</span>
          </div>
          <div class="step-separator-line" :class="{ active: step >= 3 }"></div>
          <div class="step-item" :class="{ active: step >= 3, completed: step === 4 }">
            <div class="step-circle">{{ step === 4 ? 'âœ“' : '3' }}</div>
            <span class="step-label">Confirm</span>
          </div>
        </div>

        <!-- Scrollable Body -->
        <div class="flutter-sheet-body">
          <!-- STEP 1: RECIPIENT -->
          <div v-if="step === 1" class="step-content-box">
            <div class="flutter-text-field">
              <span class="flutter-text-field-label">Recipient KorpaTag</span>
              <div class="flutter-text-field-input-wrap tag-input-wrap" :class="{ resolving: resolvingTag, success: resolvedRecipient, error: tagError }">
                <span class="tag-decorator">@</span>
                <input
                  v-model="rawTag"
                  type="text"
                  class="flutter-text-field-input tag-input-field"
                  placeholder="korpa_tag"
                  @input="handleTagInput"
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck="false"
                />
                <div v-if="resolvingTag" class="tag-spinner-wrap">
                  <span class="flutter-spin"></span>
                </div>
                <div v-else-if="resolvedRecipient" class="tag-success-checkmark">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Lookup feedback card -->
            <div v-if="resolvingTag" class="lookup-status-card loading">
              <span class="pulse-dot"></span>
              <span>Looking up @{{ rawTag }}...</span>
            </div>
            <div v-else-if="resolvedRecipient" class="lookup-status-card success">
              <img
                :src="resolvedRecipient.avatar || `https://www.gravatar.com/avatar/${resolvedRecipient.uuid ?? resolvedRecipient.name}?d=identicon&s=40`"
                class="recipient-avatar-circle"
                alt="avatar"
              />
              <div class="recipient-details-text">
                <span class="recipient-name">{{ resolvedRecipient.name }}</span>
                <span class="verified-tag">â— Verified User ({{ resolvedRecipient.tag }})</span>
              </div>
            </div>
            <div v-else-if="tagError" class="lookup-status-card error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>{{ tagError }}</span>
            </div>

            <p class="form-helper-text">Tag verification happens instantly in real-time.</p>
          </div>

          <!-- STEP 2: AMOUNT -->
          <div v-else-if="step === 2" class="step-content-box">
            <!-- Recipient Capsule -->
            <div class="selected-recipient-capsule">
              <img :src="resolvedRecipient?.avatar || `https://www.gravatar.com/avatar/${resolvedRecipient?.uuid ?? resolvedRecipient?.name}?d=identicon&s=40`" class="capsule-avatar" />
              <div class="capsule-text">
                <span class="capsule-name">{{ resolvedRecipient?.name }}</span>
                <span class="capsule-tag">{{ resolvedRecipient?.tag || '@' + rawTag }}</span>
              </div>
              <button class="btn-edit-recipient" @click="step = 1; resolvedRecipient = null; rawTag = ''">Change</button>
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
                  min="100"
                />
              </div>
              <div class="balance-hint-row">
                <span>Available: <strong>â‚¦{{ balanceFmt }}</strong></span>
                <button class="btn-max-amount" @click="form.amount = balance">Use Max</button>
              </div>

              <div v-if="props.balance < 100" class="lookup-status-card error" style="margin-top: 8px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Insufficient wallet balance. Minimum required transfer is â‚¦100.00.</span>
              </div>
            </div>

            <!-- Amount Presets -->
            <div class="chip-preset-row">
              <button
                v-for="p in [500, 1000, 2000, 5000]"
                :key="p"
                class="preset-chip-item"
                :class="{ active: form.amount === p }"
                @click="form.amount = p"
              >
                â‚¦{{ p.toLocaleString() }}
              </button>
            </div>

            <div class="flutter-text-field" style="margin-top: var(--spacing-md);">
              <span class="flutter-text-field-label">Add Note (Optional)</span>
              <div class="flutter-text-field-input-wrap">
                <input
                  v-model="form.note"
                  type="text"
                  class="flutter-text-field-input"
                  placeholder="What is this transfer for?"
                  maxlength="100"
                />
              </div>
            </div>
          </div>

          <!-- STEP 3: CONFIRMATION -->
          <div v-else-if="step === 3" class="step-content-box">
            <div class="m3-summary-card">
              <div class="summary-card-row">
                <span class="row-title">To Recipient</span>
                <span class="row-value">{{ resolvedRecipient?.name }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">KorpaTag</span>
                <span class="row-value">{{ resolvedRecipient?.tag || '@' + rawTag }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Transfer Amount</span>
                <span class="row-value highlight-red">â‚¦{{ form.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
              <div v-if="form.note" class="summary-card-row">
                <span class="row-title">Note</span>
                <span class="row-value note-italic">"{{ form.note }}"</span>
              </div>
              <div class="summary-card-row total-row">
                <span class="row-title">Total Sent</span>
                <span class="row-value">â‚¦{{ form.amount?.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>

            <!-- Warning Badge -->
            <div class="m3-warning-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="warning-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span class="warning-text">Internal transfers are processed instantly and cannot be reversed. Please verify the tag before proceeding.</span>
            </div>
          </div>

          <!-- STEP 4: SUCCESS MODAL -->
          <div v-else-if="step === 4" class="step-content-box success-modal-box">
            <div class="success-icon-badge">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <div class="success-header-text">
              <h3 class="success-title">Transfer Successful! ðŸŽ‰</h3>
              <p class="success-subtitle">Funds delivered instantly to recipient</p>
            </div>

            <div class="success-amount-display">
              <span class="success-amount-val">â‚¦{{ lastSentAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 }) }}</span>
            </div>

            <!-- Recipient Capsule -->
            <div class="selected-recipient-capsule success-capsule">
              <img :src="resolvedRecipient?.avatar || `https://www.gravatar.com/avatar/${resolvedRecipient?.uuid ?? resolvedRecipient?.name}?d=identicon&s=40`" class="capsule-avatar" />
              <div class="capsule-text">
                <span class="capsule-name">{{ resolvedRecipient?.name }}</span>
                <span class="capsule-tag">{{ resolvedRecipient?.tag }}</span>
              </div>
            </div>

            <div class="m3-summary-card">
              <div class="summary-card-row">
                <span class="row-title">Transaction Ref</span>
                <span class="row-value font-mono">{{ lastTxnRef }}</span>
              </div>
              <div class="summary-card-row">
                <span class="row-title">Date & Time</span>
                <span class="row-value">{{ lastTxnTime }}</span>
              </div>
              <div v-if="form.note" class="summary-card-row">
                <span class="row-title">Note</span>
                <span class="row-value note-italic">"{{ form.note }}"</span>
              </div>
            </div>
          </div>
        </div>


        <!-- PIN confirmation overlay (shown over steps 1-3 when biometric was cancelled/unavailable) -->
        <div v-if="showPinStep" class="pin-overlay-box">
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
          <button class="cancel-pin-btn" :disabled="loading" @click="showPinStep = false">Cancel</button>
        </div>
        <!-- Sticky Footer -->
        <div v-if="step < 4 && !showPinStep" class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="step > 1 ? step-- : handleClose()">
            {{ step > 1 ? 'Back' : 'Cancel' }}
          </button>
          <button class="flutter-btn flutter-btn-primary" :disabled="!canProceed || loading" @click="nextStep">
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>{{ step < 3 ? 'Continue' : 'Confirm & Send' }}</span>
          </button>
        </div>
        <div v-else class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="resetToStepOne">
            New Transfer
          </button>
          <button class="flutter-btn flutter-btn-primary" @click="handleClose">
            Done
          </button>
        </div>
      </div>
    </div>
  <!-- SetupPinModal: opens when user has no PIN -->
  <SetupPinModal
    v-model="showPinSetup"
    mode="set"
    @success="onPinSetupSuccess"
  />
</Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance.js'
import { useToast } from '@/composables/useToast.js'
import { isNative } from '@/lib/nativeBridge.js'
import { useAuthStore } from '@/stores/auth.js'
import SetupPinModal from '@/components/SetupPinModal.vue'
import TransactionPinPad from '@/components/TransactionPinPad.vue'

const props = defineProps({ modelValue: Boolean, balance: { type: Number, default: 0 } })
const emit = defineEmits(['update:modelValue', 'success'])

const financeStore = useFinanceStore()
const authStore = useAuthStore()
const { showToast } = useToast()

const step = ref(1)
const rawTag = ref('')
const resolvingTag = ref(false)
const resolvedRecipient = ref(null)
const tagError = ref('')
const loading = ref(false)
const form = ref({ amount: 500, note: '' })
const showPinStep = ref(false)   // true: show inline PIN pad instead of normal steps
const showPinSetup = ref(false)  // true: open SetupPinModal (no PIN yet)
const pinError = ref(null)
const pinPadRef = ref(null)
let tagTimer = null

// Success modal state refs
const lastSentAmount = ref(0)
const lastTxnRef = ref('')
const lastTxnTime = ref('')

const balanceFmt = computed(() => Number(props.balance ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 }))

const canProceed = computed(() => {
  if (step.value === 1) return !!resolvedRecipient.value
  if (step.value === 2) return form.value.amount >= 100 && form.value.amount <= props.balance
  return true
})

const handleTagInput = () => {
  tagError.value = ''
  resolvedRecipient.value = null

  if (rawTag.value.startsWith('@')) {
    rawTag.value = rawTag.value.replace(/^@+/, '')
  }

  const cleanTag = rawTag.value.trim()
  if (cleanTag.length < 3) {
    resolvingTag.value = false
    return
  }

  resolvingTag.value = true
  if (tagTimer) clearTimeout(tagTimer)

  tagTimer = setTimeout(async () => {
    try {
      const recipient = await financeStore.resolveTag(cleanTag)
      resolvedRecipient.value = recipient
    } catch (e) {
      tagError.value = e.response?.data?.message || e.message || 'No user found with this tag'
    } finally {
      resolvingTag.value = false
    }
  }, 400)
}

const nextStep = async () => {
  if (step.value < 3) {
    step.value++
  } else {
    await handleTransfer()
  }
}

// Lightweight DOM-based confetti burst
const fireConfetti = () => {
  const colors = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6']
  const container = document.createElement('div')
  container.className = 'confetti-burst-container'
  document.body.appendChild(container)

  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('span')
    piece.className = 'confetti-piece'
    piece.style.setProperty('--x', `${(Math.random() - 0.5) * 720}px`)
    piece.style.setProperty('--y', `${Math.random() * 500 + 200}px`)
    piece.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`)
    piece.style.setProperty('--delay', `${Math.random() * 200}ms`)
    piece.style.background = colors[i % colors.length]
    container.appendChild(piece)
  }

  setTimeout(() => container.remove(), 2500)
}

const handleTransfer = async () => {
  if (!canProceed.value || loading.value) return

  // ── Server-side re-verification ────────────────────────────────────────
  // Try biometric on native; fall back to PIN on cancel/failure or always on web.
  let authPayload = {}

  if (isNative()) {
    try {
      const { nonce, deviceId } = await authStore.confirmTransactionBiometrics()
      authPayload = { biometric_nonce: nonce, device_id: deviceId }
    } catch {
      // Biometric cancelled — fall through to PIN
      const pinStatus = await financeStore.fetchPinStatus()
      if (pinStatus === false) {
        showPinSetup.value = true
        return
      }
      showPinStep.value = true
      return
    }
  } else {
    const pinStatus = await financeStore.fetchPinStatus()
    if (pinStatus === false) {
      showPinSetup.value = true
      return
    }
    showPinStep.value = true
    return
  }

  loading.value = true
  try {
    const payload = {
      recipient_tag: resolvedRecipient.value?.tag || rawTag.value,
      amount: form.value.amount,
      note: form.value.note,
      ...authPayload
    }

    const result = await financeStore.internalTransfer(payload)

    fireConfetti()
    lastSentAmount.value = form.value.amount
    lastTxnRef.value = result.transaction_id || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    lastTxnTime.value = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
    step.value = 4

    showToast({
      title: 'Transfer Successful âœ“',
      message: `â‚¦${Number(form.value.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })} sent to ${resolvedRecipient.value.name}.`,
      duration: 5000
    })
    emit('success')
  } catch (e) {
    const errorMsg = e.response?.data?.message || e.message || 'Could not complete transfer. Try again.'
    showToast({ title: 'Transfer Failed', message: errorMsg, duration: 5000 })
  } finally {
    loading.value = false
  }
}

const resetToStepOne = () => {
  step.value = 1
  rawTag.value = ''
  resolvedRecipient.value = null
  tagError.value = ''
  form.value = { amount: 500, note: '' }
}

const handleClose = () => {
  emit('update:modelValue', false)
  setTimeout(() => {
    resetToStepOne()
  }, 300)
}

watch(() => props.modelValue, (v) => { if (!v) handleClose() })

const submitWithPin = async (pin) => {
  loading.value = true
  pinError.value = null
  try {
    const payload = {
      recipient_tag: resolvedRecipient.value?.tag || rawTag.value,
      amount: form.value.amount,
      note: form.value.note,
      transaction_pin: pin,
    }
    const result = await financeStore.internalTransfer(payload)
    showPinStep.value = false
    fireConfetti()
    lastSentAmount.value = form.value.amount
    lastTxnRef.value = result.transaction_id || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
    lastTxnTime.value = new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
    step.value = 4
    showToast({ title: 'Transfer Successful 🎉', message: `₦${Number(form.value.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })} sent to ${resolvedRecipient.value.name}.`, duration: 5000 })
    emit('success')
  } catch (e) {
    const msg = e.response?.data?.message || 'Incorrect PIN or network error.'
    pinError.value = msg
    showToast({ title: 'Transfer Failed', message: msg, duration: 5000 })
  } finally {
    loading.value = false
  }
}

const onPinSetupSuccess = () => {
  showToast({ title: 'PIN Set', message: 'Now enter your PIN to confirm the transfer.', duration: 3000 })
  showPinStep.value = true
}
</script>

<style scoped>
/* â”€â”€ Step Indicator Bar â”€â”€ */
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
  background-color: var(--m3-primary);
  color: var(--m3-on-primary);
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
  background-color: var(--m3-primary);
}

/* â”€â”€ Step Content Box â”€â”€ */
.step-content-box {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
}

/* â”€â”€ Tag Input Specifics â”€â”€ */
.tag-input-wrap {
  position: relative;
  overflow: hidden;
}
.tag-decorator {
  padding-left: var(--spacing-lg);
  font-size: 18px;
  font-weight: 800;
  color: var(--m3-primary);
  user-select: none;
}
.tag-input-field {
  padding: 13px 16px 13px 4px;
  font-weight: 700;
}
.tag-spinner-wrap, .tag-success-checkmark {
  padding-right: var(--spacing-lg);
  display: flex;
  align-items: center;
}
.tag-success-checkmark {
  color: var(--m3-success);
}

/* Lookup status card layout */
.lookup-status-card {
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

.lookup-status-card.loading {
  background-color: rgba(99, 102, 241, 0.06);
  color: var(--m3-on-surface-variant);
  font: var(--type-body-md);
}
.pulse-dot {
  width: 8px; height: 8px;
  background-color: var(--m3-primary);
  border-radius: var(--radius-full);
  animation: pulse-effect 1s infinite alternate;
}
@keyframes pulse-effect {
  from { opacity: 0.3; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1.15); }
}

.lookup-status-card.success {
  background-color: rgba(16, 185, 129, 0.07);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: var(--m3-on-surface);
}
.recipient-avatar-circle {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 1.5px solid rgba(16, 185, 129, 0.4);
}
.recipient-details-text {
  display: flex;
  flex-direction: column;
}
.recipient-name {
  font: var(--type-body-lg);
  font-weight: 700;
}
.verified-tag {
  font: var(--type-label-sm);
  color: var(--m3-success);
  margin-top: 1px;
}

.lookup-status-card.error {
  background-color: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: var(--m3-error);
  font: var(--type-body-md);
  font-weight: 600;
}

.form-helper-text {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  margin: 0;
  font-weight: 500;
}

/* â”€â”€ Selected Recipient Capsule (Step 2) â”€â”€ */
.selected-recipient-capsule {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background-color: rgba(99, 102, 241, 0.07);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-md);
  padding: 12px 14px;
}
.capsule-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 1.5px solid rgba(99, 102, 241, 0.4);
}
.capsule-text {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.capsule-name {
  font: var(--type-body-lg);
  font-weight: 700;
  color: var(--m3-on-surface);
}
.capsule-tag {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}
.btn-edit-recipient {
  background: none;
  border: none;
  color: var(--m3-primary);
  font: var(--type-label-lg);
  cursor: pointer;
  padding: 4px var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--duration-short);
}
.btn-edit-recipient:hover {
  background-color: rgba(99, 102, 241, 0.1);
}

/* â”€â”€ Amount fields step 2 â”€â”€ */
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
  background-color: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: var(--radius-sm);
  color: var(--m3-primary);
  font: var(--type-label-sm);
  font-weight: 800;
  padding: 2px 8px;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.btn-max-amount:hover {
  background-color: rgba(99, 102, 241, 0.16);
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
  border-color: rgba(99, 102, 241, 0.4);
  color: var(--m3-primary);
}
.preset-chip-item.active {
  background-color: var(--m3-primary);
  border-color: var(--m3-primary);
  color: var(--m3-on-primary);
}

/* â”€â”€ M3 Summary Card (Step 3 & 4) â”€â”€ */
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
.row-value.highlight-red {
  color: var(--m3-error);
  font-size: 15px;
  font-weight: 800;
}
.row-value.note-italic {
  font-style: italic;
  color: var(--m3-on-surface-variant);
}
.total-row {
  background-color: rgba(99, 102, 241, 0.06);
  border-top: 1px solid rgba(99, 102, 241, 0.15);
}
.total-row .row-value {
  color: var(--m3-primary);
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

/* â”€â”€ Step 4 Success Modal Layout â”€â”€ */
.flutter-sheet-header-icon.success-bg {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--m3-success);
}

.success-modal-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px 0;
  animation: card-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.success-icon-badge {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%);
  border: 2px solid rgba(16, 185, 129, 0.4);
  color: var(--m3-success);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
  margin-bottom: 12px;
}

.success-header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.success-title {
  font: var(--type-headline-md);
  font-weight: 800;
  color: var(--m3-on-surface);
  margin: 0;
}
.success-subtitle {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  margin: 0;
}

.success-amount-display {
  margin: 16px 0 8px;
  padding: 10px 24px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: var(--radius-full);
}
.success-amount-val {
  font-size: 26px;
  font-weight: 800;
  color: var(--m3-success);
  letter-spacing: -0.5px;
}

.success-capsule {
  width: 100%;
  margin-bottom: 16px;
}

/* â”€â”€ Confetti Animation â”€â”€ */
:global(.confetti-burst-container) {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 1px;
  pointer-events: none;
  z-index: 99999;
}
:global(.confetti-piece) {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 2px;
  opacity: 0;
  animation: confetti-fall 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x), var(--y)) rotate(var(--rot)) scale(0.4);
  }
}

.pin-overlay-box {
  position: absolute;
  inset: 0;
  background: #1a1a2e;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;
  z-index: 10;
}

.pin-step-header {
  text-align: center;
}

.pin-step-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.pin-step-label {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.7);
  margin: 0;
}

.cancel-pin-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
}

.cancel-pin-btn:hover { color: rgba(255,255,255,0.7); }
</style>
