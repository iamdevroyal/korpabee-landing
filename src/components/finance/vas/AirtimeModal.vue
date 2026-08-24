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
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Buy Airtime</h3>
            <p class="flutter-sheet-subtitle">Top up mobile lines instantly</p>
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
          <!-- Network Selection Grid -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Network</span>
            <div class="network-selection-grid">
              <button
                v-for="net in networks" :key="net.id"
                class="network-select-btn"
                :class="{ active: form.network === net.id }"
                @click="form.network = net.id"
              >
                <span class="network-logo-circle" :style="{ background: net.color }">{{ net.logo }}</span>
                <span class="network-name-label">{{ net.name }}</span>
              </button>
            </div>
          </div>

          <!-- Phone Number input -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Phone Number</span>
            <div class="flutter-text-field-input-wrap phone-wrap">
              <span class="phone-country-prefix">🇳🇬 +234</span>
              <input
                v-model="form.phone"
                type="tel"
                class="flutter-text-field-input phone-input-field"
                placeholder="8012345678"
                maxlength="11"
                inputmode="numeric"
              />
            </div>
          </div>

          <!-- Amount Presets Grid -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Amount</span>
            <div class="amount-select-grid">
              <button
                v-for="amt in [50, 100, 200, 500, 1000, 2000]" :key="amt"
                class="amount-select-chip"
                :class="{ active: form.amount === amt }"
                @click="form.amount = amt"
              >
                ₦{{ amt }}
              </button>
            </div>
          </div>

          <!-- Custom Amount input -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Or Custom Amount (₦)</span>
            <div class="flutter-text-field-input-wrap amount-wrap">
              <span class="amount-prefix-symbol">₦</span>
              <input
                v-model.number="form.amount"
                type="number"
                class="flutter-text-field-input custom-amount-input"
                placeholder="Enter custom amount"
                min="50"
              />
            </div>
          </div>

          <!-- Purchase Summary card -->
          <div v-if="form.network && form.phone.length >= 10 && form.amount >= 50" class="vas-summary-card">
            <div class="summary-row">
              <span class="summary-key">Telecom Network</span>
              <span class="summary-val">{{ selectedNetwork?.name }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-key">Mobile Number</span>
              <span class="summary-val font-mono">+234 {{ form.phone }}</span>
            </div>
            <div class="summary-row total-row">
              <span class="summary-key">Total Cost</span>
              <span class="summary-val font-bold">₦{{ form.amount?.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="handleClose">
            Cancel
          </button>
          <button class="flutter-btn flutter-btn-primary" :disabled="!canBuy || loading" @click="handleBuy">
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>Buy Airtime</span>
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

const networks = [
  { id: 'mtn',    name: 'MTN',      logo: 'M',  color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel',   logo: 'A',  color: '#DC143C' },
  { id: 'glo',    name: 'Glo',      logo: 'G',  color: '#006600' },
  { id: '9mobile',name: '9Mobile',  logo: '9',  color: '#006699' },
]

const form = ref({ network: 'mtn', phone: '', amount: 200 })
const loading = ref(false)

const selectedNetwork = computed(() => networks.find(n => n.id === form.value.network))
const canBuy = computed(() => form.value.network && form.value.phone.length >= 10 && form.value.amount >= 50)

const handleBuy = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  showToast({ title: 'Airtime Purchased! ✓', message: `₦${form.value.amount} ${selectedNetwork.value?.name} airtime sent to ${form.value.phone}.`, duration: 5000 })
  emit('update:modelValue', false)
}

const handleClose = () => emit('update:modelValue', false)
</script>

<style scoped>
/* ── Network Selection Grid ── */
.network-selection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.network-select-btn {
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
.network-select-btn:hover {
  background-color: rgba(249, 115, 22, 0.06);
  border-color: rgba(249, 115, 22, 0.25);
}
.network-select-btn.active {
  background-color: rgba(249, 115, 22, 0.1);
  border-color: var(--m3-orange);
}
.network-select-btn:active {
  transform: var(--interactive-scale);
}

.network-logo-circle {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 13px;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: var(--elevation-1);
}

.network-name-label {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  text-align: center;
}
.network-select-btn.active .network-name-label {
  color: var(--m3-orange);
  font-weight: 800;
}

/* ── Phone input prefix ── */
.phone-wrap {
  border-radius: var(--radius-md);
}
.phone-wrap:focus-within {
  border-color: var(--m3-orange);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
}
.phone-country-prefix {
  padding: 0 var(--spacing-md);
  font: var(--type-body-lg);
  font-weight: 700;
  color: var(--m3-on-surface-variant);
  white-space: nowrap;
  flex-shrink: 0;
  user-select: none;
}
.phone-input-field {
  padding: 13px 16px 13px 0;
  font-weight: 700;
  letter-spacing: 1px;
}

/* ── Amount grid and inputs ── */
.amount-select-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.amount-select-chip {
  padding: 12px 6px;
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
.amount-select-chip:hover {
  border-color: rgba(249, 115, 22, 0.35);
  color: #FB923C;
}
.amount-select-chip.active {
  background-color: var(--m3-orange);
  border-color: var(--m3-orange);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}
.amount-select-chip:active {
  transform: var(--interactive-scale);
}

.amount-wrap {
  border-radius: var(--radius-md);
}
.amount-wrap:focus-within {
  border-color: var(--m3-orange);
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
}
.amount-prefix-symbol {
  padding-left: var(--spacing-lg);
  font-size: 18px;
  font-weight: 800;
  color: var(--m3-on-surface-variant);
  user-select: none;
}
.custom-amount-input {
  padding: 13px 16px 13px 4px;
  font-weight: 800;
  font-size: 18px;
}
.custom-amount-input::-webkit-outer-spin-button,
.custom-amount-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* ── Summary Card ── */
.vas-summary-card {
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 4px;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--m3-outline-variant);
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  font-weight: 600;
}
.summary-row:last-child {
  border-bottom: none;
}
.summary-key {
  color: var(--m3-on-surface-variant);
}
.summary-val {
  color: var(--m3-on-surface);
  font-weight: 700;
}
.total-row {
  background-color: rgba(249, 115, 22, 0.06);
  border-top: 1px solid rgba(249, 115, 22, 0.15);
}
.total-row .summary-val {
  color: #FB923C;
  font-size: 15px;
  font-weight: 800;
}
</style>
