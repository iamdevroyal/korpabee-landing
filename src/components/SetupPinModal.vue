<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)" role="dialog" aria-modal="true" aria-labelledby="setup-pin-title">
        <div class="modal-card">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-icon">??</div>
            <h2 id="setup-pin-title" class="modal-title">
              {{ mode === 'set' ? 'Set Transaction PIN' : 'Change Transaction PIN' }}
            </h2>
            <p class="modal-subtitle">
              {{ stepLabel }}
            </p>
          </div>

          <!-- PIN Pad -->
          <TransactionPinPad
            ref="pinPad"
            :error="error"
            :loading="loading"
            @complete="onPinComplete"
          />

          <!-- Step indicator -->
          <div class="step-indicator">
            <span
              v-for="i in totalSteps"
              :key="i"
              class="step-dot"
              :class="{ active: i === currentStep, done: i < currentStep }"
            />
          </div>

          <!-- Cancel -->
          <button class="cancel-btn" :disabled="loading" @click="$emit('update:modelValue', false)">
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import TransactionPinPad from '@/components/TransactionPinPad.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  mode:       { type: String, default: 'set' }, // 'set' | 'change'
})
const emit = defineEmits(['update:modelValue', 'success'])

const financeStore = useFinanceStore()
const pinPad       = ref(null)
const loading      = ref(false)
const error        = ref(null)

// Steps: 'set' mode: [1] enter new PIN, [2] confirm
// 'change' mode: [1] enter current PIN, [2] enter new, [3] confirm new
const currentStep   = ref(1)
const collectedPins = ref({}) // { current, newPin, confirm }

const totalSteps = computed(() => props.mode === 'change' ? 3 : 2)

const stepLabel = computed(() => {
  if (props.mode === 'change') {
    if (currentStep.value === 1) return 'Enter your current PIN'
    if (currentStep.value === 2) return 'Enter your new 4-digit PIN'
    return 'Confirm your new PIN'
  }
  return currentStep.value === 1 ? 'Enter a 4-digit PIN' : 'Confirm your PIN'
})

// Reset on open/close
watch(() => props.modelValue, (open) => {
  if (open) {
    currentStep.value = 1
    collectedPins.value = {}
    error.value = null
    loading.value = false
  }
})

async function onPinComplete(pin) {
  error.value = null
  pinPad.value?.reset()

  if (props.mode === 'set') {
    if (currentStep.value === 1) {
      collectedPins.value.newPin = pin
      currentStep.value = 2
    } else {
      if (pin !== collectedPins.value.newPin) {
        error.value = 'PINs do not match. Try again.'
        currentStep.value = 1
        collectedPins.value = {}
        return
      }
      await submitSet(collectedPins.value.newPin)
    }
  } else {
    // change mode
    if (currentStep.value === 1) {
      collectedPins.value.current = pin
      currentStep.value = 2
    } else if (currentStep.value === 2) {
      collectedPins.value.newPin = pin
      currentStep.value = 3
    } else {
      if (pin !== collectedPins.value.newPin) {
        error.value = 'PINs do not match. Try again.'
        currentStep.value = 2
        collectedPins.value.newPin = null
        return
      }
      await submitChange(collectedPins.value.current, collectedPins.value.newPin)
    }
  }
}

async function submitSet(pin) {
  loading.value = true
  try {
    await financeStore.setPin(pin, pin) // confirmation handled client-side above
    emit('success', 'Transaction PIN set successfully.')
    emit('update:modelValue', false)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to set PIN. Please try again.'
    currentStep.value = 1
    collectedPins.value = {}
  } finally {
    loading.value = false
  }
}

async function submitChange(currentPin, newPin) {
  loading.value = true
  try {
    await financeStore.changePin(currentPin, newPin, newPin)
    emit('success', 'Transaction PIN changed successfully.')
    emit('update:modelValue', false)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to change PIN. Please try again.'
    currentStep.value = 1
    collectedPins.value = {}
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9000;
  padding: 1rem;
}

.modal-card {
  background: #1a1a2e;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 2rem 1.5rem 3rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  animation: slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header { text-align: center; }

.modal-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.4rem;
}

.modal-subtitle {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  margin: 0;
}

.step-indicator {
  display: flex;
  gap: 0.5rem;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  transition: background 0.2s, transform 0.2s;
}

.step-dot.active {
  background: #6c63ff;
  transform: scale(1.3);
}

.step-dot.done {
  background: #22c55e;
}

.cancel-btn {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  transition: color 0.2s;
}

.cancel-btn:hover { color: rgba(255,255,255,0.85); }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.25s; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
</style>
