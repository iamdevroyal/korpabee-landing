<template>
  <div
    class="txn-item"
    role="button"
    tabindex="0"
    @click="$emit('click', transaction)"
    @keydown.enter="$emit('click', transaction)"
  >
    <div class="txn-icon" :class="iconClass">
      <component :is="txnIcon" class="icon" />
    </div>

    <div class="txn-info">
      <div class="txn-desc">{{ transaction.description || typeLabel }}</div>
      <div class="txn-meta">
        <span class="txn-ref">{{ transaction.reference }}</span>
        <span class="txn-dot">·</span>
        <span class="txn-date">{{ formatDate(transaction.created_at) }}</span>
      </div>
    </div>

    <div class="txn-amount" :class="amountClass">
      {{ amountPrefix }}₦{{ formatAmount(transaction.amount) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowUpIcon, ArrowDownIcon, LockClosedIcon, LockOpenIcon, BanknotesIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({ transaction: Object })
defineEmits(['click'])

const iconMap = {
  credit:  { icon: ArrowDownIcon,  cls: 'green', prefix: '+' },
  debit:   { icon: ArrowUpIcon,    cls: 'red',   prefix: '-' },
  lock:    { icon: LockClosedIcon, cls: 'amber', prefix: '' },
  unlock:  { icon: LockOpenIcon,   cls: 'blue',  prefix: '' },
  fee:     { icon: BanknotesIcon,  cls: 'gray',  prefix: '-' },
}

const typeLabel    = computed(() => props.transaction.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))
const txnMeta      = computed(() => iconMap[props.transaction.type] ?? iconMap.debit)
const txnIcon      = computed(() => txnMeta.value.icon)
const iconClass    = computed(() => txnMeta.value.cls)
const amountClass  = computed(() => txnMeta.value.cls === 'green' ? 'positive' : txnMeta.value.cls === 'red' ? 'negative' : '')
const amountPrefix = computed(() => txnMeta.value.prefix)

const formatAmount = (n) => Number(n ?? 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })
const formatDate   = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : ''
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────
   FLUTTER-STYLE TACTILE LIST ROW
   ───────────────────────────────────────────────────────────────────────── */
.txn-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 14px 16px;
  background-color: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-lg);
  cursor: pointer;
  outline: none;
  overflow: hidden;
  isolation: isolate;
  transition: background-color var(--duration-short) var(--ease-out),
              border-color var(--duration-short) var(--ease-out),
              transform var(--duration-short) var(--ease-out);
}

/* Material InkWell / radial active state simulation */
.txn-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 75%);
  opacity: 0;
  transition: opacity var(--duration-short) var(--ease-out);
  z-index: 0;
}

.txn-item:hover {
  background-color: var(--m3-surface-container);
  border-color: rgba(255, 255, 255, 0.12);
}
.txn-item:hover::after {
  opacity: 1;
}

.txn-item:active {
  transform: var(--interactive-scale);
}

.txn-item:focus-visible {
  box-shadow: 0 0 0 2px var(--m3-primary);
  border-color: var(--m3-primary);
}

.txn-icon {
  position: relative;
  z-index: 1;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform var(--duration-short) var(--ease-out);
}

.txn-item:active .txn-icon {
  transform: scale(0.95);
}

.txn-icon .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.5; /* Material 3 thicker strokes */
}

/* Custom rounded shapes/colors matching the design spec */
.txn-icon.green { background-color: var(--m3-success-container); color: var(--m3-success); }
.txn-icon.red   { background-color: var(--m3-error-container);  color: var(--m3-error); }
.txn-icon.amber { background-color: var(--m3-warning-container); color: var(--m3-warning); }
.txn-icon.blue  { background-color: var(--m3-blue-container);    color: var(--m3-blue); }
.txn-icon.gray  { background-color: rgba(255, 255, 255, 0.06);   color: var(--m3-on-surface-variant); }

.txn-info {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
}

.txn-desc {
  font: var(--type-body-lg);
  color: var(--m3-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.15px;
}

.txn-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: 2px;
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
}

.txn-ref {
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  font-size: 10px;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: var(--m3-surface-container-high);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--m3-outline);
}

.txn-dot {
  color: rgba(255, 255, 255, 0.15);
}

.txn-amount {
  position: relative;
  z-index: 1;
  font: var(--type-title-md);
  font-weight: 800;
  color: var(--m3-on-surface);
  flex-shrink: 0;
  padding-left: var(--spacing-sm);
  letter-spacing: -0.2px;
}

.txn-amount.positive {
  color: var(--m3-success);
}

.txn-amount.negative {
  color: var(--m3-error);
}
</style>