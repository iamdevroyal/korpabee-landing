<template>
  <div class="pin-pad">
    <!-- PIN dots display -->
    <div class="pin-dots" role="status" :aria-label="`${enteredDigits.length} of ${maxLength} digits entered`">
      <span
        v-for="i in maxLength"
        :key="i"
        class="pin-dot"
        :class="{ filled: i <= enteredDigits.length }"
      />
    </div>

    <!-- Error -->
    <p v-if="error" class="pin-error" role="alert">{{ error }}</p>

    <!-- Numpad -->
    <div class="numpad" role="group" aria-label="PIN number pad">
      <button
        v-for="key in numpadKeys"
        :key="key"
        class="numpad-key"
        :class="{ 'numpad-key--action': key === 'del' || key === '' }"
        :disabled="key === '' || loading"
        :aria-label="key === 'del' ? 'Delete' : key === '' ? '' : key"
        @click="handleKey(key)"
      >
        <span v-if="key === 'del'">
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1L1 8L8 15M21 8H1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 1H19C20.1 1 21 1.9 21 3V13C21 14.1 20.1 15 19 15H9L1 8L9 1Z" stroke="currentColor" stroke-width="2"/>
            <path d="M13 5L17 11M17 5L13 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span v-else>{{ key }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  maxLength:   { type: Number, default: 4 },
  loading:     { type: Boolean, default: false },
  error:       { type: String, default: null },
  autoSubmit:  { type: Boolean, default: true },
})

const emit = defineEmits(['complete', 'change'])

const enteredDigits = ref([])

// 1-9, blank placeholder, 0, del
const numpadKeys = ['1','2','3','4','5','6','7','8','9','','0','del']

const currentPin = computed(() => enteredDigits.value.join(''))

watch(currentPin, (val) => {
  emit('change', val)
  if (props.autoSubmit && val.length === props.maxLength) {
    emit('complete', val)
  }
})

function handleKey(key) {
  if (key === 'del') {
    enteredDigits.value.pop()
  } else if (key !== '' && enteredDigits.value.length < props.maxLength) {
    enteredDigits.value.push(key)
    if (!props.autoSubmit && enteredDigits.value.length === props.maxLength) {
      emit('complete', currentPin.value)
    }
  }
}

function reset() {
  enteredDigits.value = []
}

defineExpose({ reset, currentPin })
</script>

<style scoped>
.pin-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pin-dots {
  display: flex;
  gap: 1rem;
}

.pin-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--color-primary, #6c63ff);
  background: transparent;
  transition: background 0.2s, transform 0.15s;
}

.pin-dot.filled {
  background: var(--color-primary, #6c63ff);
  transform: scale(1.15);
}

.pin-error {
  color: #ef4444;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
  animation: shake 0.35s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 70px);
  gap: 0.75rem;
}

.numpad-key {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.07);
  color: inherit;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.numpad-key:active:not(:disabled) {
  background: rgba(108, 99, 255, 0.25);
  transform: scale(0.93);
}

.numpad-key:disabled {
  opacity: 0;
  pointer-events: none;
}

.numpad-key--action {
  background: transparent;
  font-size: 1rem;
}
</style>
