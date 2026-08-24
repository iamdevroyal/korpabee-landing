<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="handleClose">
      <div class="flutter-sheet-card">
        <!-- iOS/Android drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon secondary">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
              <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
              <line x1="12" y1="20" x2="12.01" y2="20"></line>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Buy Data Bundle</h3>
            <p class="flutter-sheet-subtitle">Select a plan for any mobile network</p>
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
          <!-- Network Selection -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Network</span>
            <div class="network-selection-grid">
              <button
                v-for="net in networks" :key="net.id"
                class="network-select-btn"
                :class="{ active: form.network === net.id }"
                @click="form.network = net.id; form.bundle = null"
              >
                <span class="network-logo-circle" :style="{ background: net.color }">{{ net.logo }}</span>
                <span class="network-name-label">{{ net.name }}</span>
              </button>
            </div>
          </div>

          <!-- Phone Number -->
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

          <!-- Bundle Selection List -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Bundle Plan</span>
            <div class="bundle-selection-list">
              <button
                v-for="bundle in currentBundles"
                :key="bundle.id"
                class="bundle-card-item"
                :class="{ active: form.bundle?.id === bundle.id }"
                @click="form.bundle = bundle"
              >
                <div class="bundle-left-details">
                  <span class="bundle-size-text">{{ bundle.size }}</span>
                  <span class="bundle-validity-text">{{ bundle.validity }}</span>
                </div>
                <span class="bundle-price-text">₦{{ bundle.price.toLocaleString() }}</span>
              </button>
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
            <span v-else>Buy {{ form.bundle?.size ?? 'Bundle' }}</span>
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
  { id: 'mtn', name: 'MTN', logo: 'M', color: '#FFCC00' },
  { id: 'airtel', name: 'Airtel', logo: 'A', color: '#DC143C' },
  { id: 'glo', name: 'Glo', logo: 'G', color: '#006600' },
  { id: '9mobile', name: '9Mobile', logo: '9', color: '#006699' },
]

const bundlesMap = {
  mtn: [
    { id: 1, size: '500MB', validity: '1 Day', price: 200 },
    { id: 2, size: '1.5GB', validity: '3 Days', price: 500 },
    { id: 3, size: '3GB', validity: '7 Days', price: 1000 },
    { id: 4, size: '7GB', validity: '14 Days', price: 2000 },
    { id: 5, size: '15GB', validity: '30 Days', price: 3500 },
    { id: 6, size: '30GB', validity: '30 Days', price: 6000 },
  ],
  airtel: [
    { id: 1, size: '750MB', validity: '2 Days', price: 300 },
    { id: 2, size: '2GB', validity: '7 Days', price: 700 },
    { id: 3, size: '5GB', validity: '30 Days', price: 1500 },
    { id: 4, size: '12GB', validity: '30 Days', price: 3000 },
  ],
  glo: [
    { id: 1, size: '1GB', validity: '7 Days', price: 300 },
    { id: 2, size: '2.9GB', validity: '30 Days', price: 500 },
    { id: 3, size: '7.7GB', validity: '30 Days', price: 1500 },
  ],
  '9mobile': [
    { id: 1, size: '500MB', validity: '7 Days', price: 200 },
    { id: 2, size: '2GB', validity: '30 Days', price: 500 },
    { id: 3, size: '5GB', validity: '30 Days', price: 1200 },
  ],
}

const form = ref({ network: 'mtn', phone: '', bundle: null })
const loading = ref(false)

const currentBundles = computed(() => bundlesMap[form.value.network] ?? [])
const canBuy = computed(() => form.value.phone.length >= 10 && !!form.value.bundle)

const handleBuy = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 1500))
  loading.value = false
  showToast({ title: 'Data Bundle Activated! ✓', message: `${form.value.bundle.size} data sent to ${form.value.phone} successfully.`, duration: 5000 })
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
  background-color: rgba(20, 184, 166, 0.06);
  border-color: rgba(20, 184, 166, 0.25);
}
.network-select-btn.active {
  background-color: rgba(20, 184, 166, 0.1);
  border-color: var(--m3-secondary);
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
  box-shadow: var(--elevation-1);
}

.network-name-label {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  text-align: center;
}
.network-select-btn.active .network-name-label {
  color: var(--m3-secondary);
  font-weight: 800;
}

/* ── Phone input ── */
.phone-wrap {
  border-radius: var(--radius-md);
}
.phone-wrap:focus-within {
  border-color: var(--m3-secondary);
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.12);
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

/* ── Bundle Cards List ── */
.bundle-selection-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-height: 260px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
}

.bundle-card-item {
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
.bundle-card-item:hover {
  border-color: rgba(20, 184, 166, 0.4);
  background-color: var(--m3-surface-container);
}
.bundle-card-item.active {
  background-color: rgba(20, 184, 166, 0.08);
  border-color: var(--m3-secondary);
}
.bundle-card-item:active {
  transform: var(--interactive-scale);
}

.bundle-left-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: left;
}
.bundle-size-text {
  font: var(--type-title-md);
  color: var(--m3-on-surface);
}
.bundle-validity-text {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}
.bundle-card-item.active .bundle-validity-text {
  color: #5EEAD4;
}

.bundle-price-text {
  font: var(--type-title-md);
  color: var(--m3-secondary);
  font-weight: 800;
}
</style>
