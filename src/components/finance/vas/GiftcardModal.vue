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
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title">Buy Gift Cards</h3>
            <p class="flutter-sheet-subtitle">Get global vouchers instantly</p>
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
          <!-- Category Tabs -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Category</span>
            <div class="category-tabs-container">
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="category-tab-item"
                :class="{ active: form.category === cat.id }"
                @click="form.category = cat.id; form.brand = null; form.denomination = null"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <!-- Brand selection grid -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label">Select Brand</span>
            <div class="brands-selection-grid">
              <button
                v-for="brand in currentBrands"
                :key="brand.id"
                class="brand-select-btn"
                :class="{ active: form.brand?.id === brand.id }"
                @click="form.brand = brand; form.denomination = null"
              >
                <span class="brand-logo-symbol">{{ brand.logo }}</span>
                <span class="brand-name-text">{{ brand.name }}</span>
                <span class="brand-region-tag">{{ brand.region }}</span>
              </button>
            </div>
          </div>

          <!-- Denominations Grid -->
          <div v-if="form.brand" class="flutter-text-field">
            <span class="flutter-text-field-label">Choose Denomination</span>
            <div class="denom-selection-grid">
              <button
                v-for="d in form.brand.denominations"
                :key="d"
                class="denom-chip-btn"
                :class="{ active: form.denomination === d }"
                @click="form.denomination = d"
              >
                ${{ d }}
              </button>
            </div>
          </div>

          <!-- Exchange Rate Equiv Card -->
          <div v-if="form.denomination" class="rate-preview-card">
            <span class="naira-equivalent-label">Approximate Cost</span>
            <span class="naira-amount-value">₦{{ Math.round(form.denomination * ngnRate).toLocaleString() }}</span>
            <span class="rate-conversion-text">Exchange Rate: ₦{{ ngnRate }}/USD</span>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-secondary" @click="handleClose">
            Cancel
          </button>
          <button class="flutter-btn flutter-btn-primary" :disabled="!canBuy || loading" @click="handleBuy">
            <span v-if="loading" class="flutter-spin"></span>
            <span v-else>Buy ${{ form.denomination ?? '—' }} Card</span>
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

const ngnRate = 1600

const categories = [
  { id: 'shopping', name: 'Shopping', icon: '🛍' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'streaming', name: 'Streaming', icon: '🎬' },
  { id: 'food', name: 'Food', icon: '🍔' },
]

const brandsMap = {
  shopping: [
    { id: 1, name: 'Amazon US', logo: '📦', region: 'US', denominations: [10, 25, 50, 100] },
    { id: 2, name: 'Jumia', logo: '🛒', region: 'NG', denominations: [1000, 2500, 5000, 10000] },
    { id: 3, name: 'Noon', logo: '🌞', region: 'UAE', denominations: [25, 50, 100, 200] },
  ],
  gaming: [
    { id: 1, name: 'Steam', logo: '🎮', region: 'Global', denominations: [10, 25, 50, 100] },
    { id: 2, name: 'PlayStation', logo: '🎯', region: 'US', denominations: [10, 20, 50] },
    { id: 3, name: 'Xbox', logo: '🟩', region: 'US', denominations: [15, 25, 50, 100] },
    { id: 4, name: 'iTunes', logo: '🍎', region: 'US', denominations: [10, 25, 50, 100] },
    { id: 5, name: 'Roblox', logo: '🧱', region: 'US', denominations: [10, 25, 50] },
  ],
  streaming: [
    { id: 1, name: 'Netflix', logo: '🎬', region: 'US', denominations: [15, 25, 50, 100] },
    { id: 2, name: 'Spotify', logo: '🎵', region: 'US', denominations: [10, 30, 60] },
    { id: 3, name: 'YouTube', logo: '▶️', region: 'US', denominations: [10, 25, 50] },
  ],
  food: [
    { id: 1, name: "McDonald's", logo: '🍟', region: 'US', denominations: [10, 25, 50] },
    { id: 2, name: 'Starbucks', logo: '☕', region: 'US', denominations: [10, 25, 50, 100] },
    { id: 3, name: 'Dominos', logo: '🍕', region: 'US', denominations: [10, 25, 50] },
  ],
}

const form = ref({ category: 'shopping', brand: null, denomination: null })
const loading = ref(false)

const currentBrands = computed(() => brandsMap[form.value.category] ?? [])
const canBuy = computed(() => !!form.value.brand && !!form.value.denomination)

const handleBuy = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 2000))
  loading.value = false
  const code = Array.from({ length: 4 }, () => Math.random().toString(36).slice(2, 6).toUpperCase()).join('-')
  showToast({
    title: 'Gift Card Ready! 🎁',
    message: `$${form.value.denomination} ${form.value.brand?.name} card purchased. Code: ${code}`,
    duration: 8000
  })
  emit('update:modelValue', false)
}

const handleClose = () => emit('update:modelValue', false)
</script>

<style scoped>
/* ── Category tabs ── */
.category-tabs-container {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.category-tabs-container::-webkit-scrollbar { display: none; }

.category-tab-item {
  padding: 10px 16px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-full);
  color: var(--m3-on-surface-variant);
  font: var(--type-label-lg);
  font-weight: 700;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.category-tab-item.active {
  background-color: var(--m3-purple-container);
  border-color: var(--m3-purple);
  color: #C4B5FD;
}
.category-tab-item:active {
  transform: var(--interactive-scale);
}

/* ── Brands selection grid ── */
.brands-selection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.brand-select-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
}
.brand-select-btn:hover {
  background-color: rgba(139, 92, 246, 0.06);
  border-color: rgba(139, 92, 246, 0.25);
}
.brand-select-btn.active {
  background-color: rgba(139, 92, 246, 0.1);
  border-color: var(--m3-purple);
}
.brand-select-btn:active {
  transform: var(--interactive-scale);
}

.brand-logo-symbol {
  font-size: 24px;
}

.brand-name-text {
  font: var(--type-label-sm);
  color: var(--m3-on-surface);
  text-align: center;
  line-height: 1.25;
}
.brand-region-tag {
  font-size: 8px;
  font-weight: 800;
  color: var(--m3-on-surface-variant);
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1px 6px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

/* ── Denominations grid ── */
.denom-selection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-sm);
  width: 100%;
}

.denom-chip-btn {
  padding: 12px 6px;
  background-color: var(--m3-surface-container-low);
  border: 1.5px solid var(--m3-outline);
  border-radius: var(--radius-md);
  color: var(--m3-on-surface-variant);
  font: var(--type-title-md);
  font-weight: 800;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
  text-align: center;
}
.denom-chip-btn:hover {
  border-color: rgba(139, 92, 246, 0.35);
  color: #C4B5FD;
}
.denom-chip-btn.active {
  background-color: var(--m3-purple);
  border-color: var(--m3-purple);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
}
.denom-chip-btn:active {
  transform: var(--interactive-scale);
}

/* ── Rate preview card ── */
.rate-preview-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-md);
  margin-top: 4px;
}
.naira-equivalent-label {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.naira-amount-value {
  font: var(--type-headline);
  color: var(--m3-purple);
  margin: var(--spacing-xs) 0;
  font-weight: 800;
}
.rate-conversion-text {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}
</style>
