<template>
  <div class="korpacoin-card bg-white border border-violet-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
    <!-- Header -->
    <div class="card-header flex items-center justify-between mb-5">
      <span v-if="wallet?.is_verified_pro" class="pro-badge px-2.5 py-1 bg-violet-50 text-violet-600 border border-violet-100 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
        Verified Pro
      </span>
      <span v-else-if="wallet?.is_verified_lite" class="lite-badge px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[9px] font-extrabold uppercase tracking-wider">
        Verified Lite
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="!wallet" class="loading-state flex justify-center py-8">
      <div class="spinner w-6 h-6 border-2 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
    </div>

    <!-- Loaded Content -->
    <template v-else>
      <div class="balances-row grid grid-cols-2 gap-4 mb-5">
        <div class="balance-box bg-gradient-to-br from-violet-50/40 to-indigo-50/10 border border-violet-100/60 rounded-2xl p-4">
          <div class="balance-label text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Available</div>
          <div class="balance-amount text-xl font-black text-navy-950 tracking-tight">
            K{{ Number(wallet.available_balance).toLocaleString() }}
          </div>
        </div>
        <div class="balance-box bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
          <div class="balance-label text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Locked in Gigs</div>
          <div class="balance-amount text-xl font-black text-navy-950 tracking-tight">
            K{{ Number(wallet.locked_balance).toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- Quota Info -->
      <div 
        v-if="wallet.monthly_quota?.limit !== null && wallet.monthly_quota" 
        class="quota-row flex items-center justify-between bg-amber-50/60 border border-amber-100 rounded-2xl px-4 py-3 mb-5 text-[11px] font-extrabold text-amber-800"
      >
        <span class="uppercase tracking-wider">Monthly tasks used</span>
        <span class="text-xs">{{ wallet.monthly_quota.used }} / {{ wallet.monthly_quota.limit }}</span>
      </div>
      <div 
        v-else-if="wallet.monthly_quota" 
        class="quota-row flex items-center justify-between bg-violet-50/60 border border-violet-100 rounded-2xl px-4 py-3 mb-5 text-[11px] font-extrabold text-violet-700"
      >
        <span class="uppercase tracking-wider">Monthly tasks</span>
        <span class="text-xs uppercase">Unlimited</span>
      </div>

      <!-- Actions -->
      <div class="wallet-actions grid grid-cols-2 gap-3">
        <button 
          class="btn-wallet-action py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-2xl shadow-md shadow-violet-600/15 transition-all active:scale-[0.98]" 
          @click="openFund"
        >
          Fund
        </button>
        <button 
          class="btn-wallet-action py-3.5 border border-violet-200 text-violet-600 hover:bg-violet-50/50 text-[11px] font-extrabold uppercase tracking-wider rounded-2xl transition-colors active:scale-[0.98]" 
          @click="openUnfund"
        >
          To Wallet
        </button>
      </div>
    </template>

    <!-- Fund Modal: main wallet -> KorpaCoin -->
    <Teleport to="body">
      <div 
        v-if="showFundModal" 
        class="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" 
        @click.self="showFundModal = false"
      >
        <div class="modal-card bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 max-h-[85vh] sm:max-h-[90vh] border border-violet-100/50 overflow-hidden">
          <!-- Sticky Header -->
          <div class="modal-header flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <h3 class="text-base font-black text-navy-950 uppercase tracking-wider">Fund KorpaCoin</h3>
            <button 
              class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg transition-colors" 
              @click="showFundModal = false"
            >
              ×
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="modal-body flex-grow overflow-y-auto p-6 space-y-4">
            <p class="fee-note flex items-center gap-1.5 text-[10px] text-violet-700 bg-violet-50 border border-violet-100 p-3.5 rounded-2xl font-bold leading-relaxed">
              <span>Moves money from your KorpaBee wallet into KorpaCoin so you can post gigs. Instant, no fee.</span>
            </p>

            <div class="form-group">
              <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amount (₦) *</label>
              <input 
                v-model.number="fundForm.amount" 
                type="number" 
                min="100" 
                step="100" 
                class="form-input w-full px-4 py-3 border border-violet-100 rounded-2xl text-xs font-bold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                required 
              />
              <div class="text-[10px] text-slate-400 font-semibold mt-2">
                From your KorpaBee wallet: <span class="font-extrabold text-navy-950">₦{{ Number(financeStore.balance ?? 0).toLocaleString() }}</span> available
              </div>
            </div>

            <div class="fee-summary bg-slate-50/80 border border-slate-100 rounded-2xl p-4.5 text-xs font-semibold">
              <div class="flex justify-between py-1 text-slate-500">
                <span>Amount</span>
                <strong class="text-navy-950">₦{{ (fundForm.amount || 0).toLocaleString() }}</strong>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-3 mt-3 text-sm font-black text-navy-950">
                <span>KorpaCoin Received</span>
                <strong class="text-violet-600">K{{ (fundForm.amount || 0).toLocaleString() }}</strong>
              </div>
            </div>
          </div>

          <!-- Sticky Footer -->
          <div class="modal-footer flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button 
              class="btn-cancel flex-1 py-3 border border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider rounded-2xl text-[10px] hover:bg-slate-50 transition-colors" 
              @click="showFundModal = false"
            >
              Cancel
            </button>
            <button 
              class="btn-primary flex-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold uppercase tracking-wider rounded-2xl text-[10px] shadow-lg shadow-violet-600/15 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              :disabled="fundSubmitting || !canFund" 
              @click="handleFund"
            >
              <span v-if="fundSubmitting" class="spinner-sm w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>Fund KorpaCoin</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Unfund Modal: KorpaCoin -> main wallet -->
    <Teleport to="body">
      <div 
        v-if="showUnfundModal" 
        class="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" 
        @click.self="showUnfundModal = false"
      >
        <div class="modal-card bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 max-h-[85vh] sm:max-h-[90vh] border border-violet-100/50 overflow-hidden">
          <!-- Sticky Header -->
          <div class="modal-header flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <h3 class="text-base font-black text-navy-950 uppercase tracking-wider">Move to Main Wallet</h3>
            <button 
              class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg transition-colors" 
              @click="showUnfundModal = false"
            >
              ×
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="modal-body flex-grow overflow-y-auto p-6 space-y-4">
            <p class="fee-note flex items-center gap-1.5 text-[10px] text-violet-700 bg-violet-50 border border-violet-100 p-3.5 rounded-2xl font-bold leading-relaxed">
              <span>Moves KorpaCoin back to your KorpaBee wallet as spendable Naira. Instant, no fee — cheaper than withdrawing to a bank.</span>
            </p>

            <div class="form-group">
              <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amount (₦) *</label>
              <input 
                v-model.number="unfundForm.amount" 
                type="number" 
                min="100" 
                step="100" 
                class="form-input w-full px-4 py-3 border border-violet-100 rounded-2xl text-xs font-bold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                required 
              />
              <div class="text-[10px] text-slate-400 font-semibold mt-2">
                Available in KorpaCoin: <span class="font-extrabold text-navy-950">K{{ Number(wallet?.available_balance ?? 0).toLocaleString() }}</span>
              </div>
            </div>

            <div class="fee-summary bg-slate-50/80 border border-slate-100 rounded-2xl p-4.5 text-xs font-semibold">
              <div class="flex justify-between py-1 text-slate-500">
                <span>Amount</span>
                <strong class="text-navy-950">K{{ (unfundForm.amount || 0).toLocaleString() }}</strong>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-3 mt-3 text-sm font-black text-navy-950">
                <span>Wallet Credit</span>
                <strong class="text-violet-600">₦{{ (unfundForm.amount || 0).toLocaleString() }}</strong>
              </div>
            </div>
          </div>

          <!-- Sticky Footer -->
          <div class="modal-footer flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button 
              class="btn-cancel flex-1 py-3 border border-slate-200 text-slate-555 font-extrabold uppercase tracking-wider rounded-2xl text-[10px] hover:bg-slate-55 transition-colors" 
              @click="showUnfundModal = false"
            >
              Cancel
            </button>
            <button 
              class="btn-primary flex-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold uppercase tracking-wider rounded-2xl text-[10px] shadow-lg shadow-violet-600/15 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              :disabled="unfundSubmitting || !canUnfund" 
              @click="handleUnfund"
            >
              <span v-if="unfundSubmitting" class="spinner-sm w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>Move to Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Withdraw Modal: KorpaCoin -> bank -->
    <Teleport to="body">
      <div 
        v-if="showWithdrawModal" 
        class="modal-overlay fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" 
        @click.self="showWithdrawModal = false"
      >
        <div class="modal-card bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300 max-h-[85vh] sm:max-h-[90vh] border border-violet-100/50 overflow-hidden">
          <!-- Sticky Header -->
          <div class="modal-header flex justify-between items-center px-6 py-4 border-b border-slate-100 flex-shrink-0">
            <h3 class="text-base font-black text-navy-950 uppercase tracking-wider">Withdraw to Bank</h3>
            <button 
              class="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-lg transition-colors" 
              @click="showWithdrawModal = false"
            >
              ×
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="modal-body flex-grow overflow-y-auto p-6 space-y-4">
            <p v-if="wallet?.is_verified_pro" class="fee-note flex items-center gap-1.5 text-[10px] text-violet-700 bg-violet-50 border border-violet-100 p-3.5 rounded-2xl font-bold leading-relaxed">
              <span>✓ Verified Pro members withdraw free of charge.</span>
            </p>

            <div class="form-group">
              <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Amount (₦) *</label>
              <input 
                v-model.number="withdrawForm.amount" 
                type="number" 
                min="5000" 
                step="100" 
                class="form-input w-full px-4 py-3 border border-violet-100 rounded-2xl text-xs font-bold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                required 
              />
              <div class="text-[10px] text-slate-400 font-semibold mt-2">Minimum withdrawal: <span class="font-extrabold text-navy-950">₦5,000</span></div>
            </div>

            <div class="form-group">
              <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Bank Name *</label>
              <input 
                v-model="withdrawForm.bank_name" 
                type="text" 
                class="form-input w-full px-4 py-3 border border-violet-100 rounded-2xl text-xs font-semibold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                required 
              />
            </div>

            <div class="form-row grid grid-cols-2 gap-3">
              <div class="form-group">
                <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Account Number *</label>
                <input 
                  v-model="withdrawForm.account_number" 
                  type="text" 
                  maxlength="10" 
                  class="form-input w-full px-3 py-3 border border-violet-100 rounded-2xl text-xs font-bold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Account Name *</label>
                <input 
                  v-model="withdrawForm.account_name" 
                  type="text" 
                  class="form-input w-full px-3 py-3 border border-violet-100 rounded-2xl text-xs font-semibold text-navy-950 focus:border-violet-500 focus:outline-none transition-colors" 
                  required 
                />
              </div>
            </div>

            <div class="fee-summary bg-slate-50/80 border border-slate-100 rounded-2xl p-4.5 text-xs font-semibold">
              <div class="flex justify-between py-1 text-slate-500">
                <span>Amount</span>
                <strong class="text-navy-950">₦{{ (withdrawForm.amount || 0).toLocaleString() }}</strong>
              </div>
              <div class="flex justify-between py-1 text-slate-500">
                <span>Withdrawal Fee ({{ feePercent }}%)</span>
                <span class="text-navy-950">₦{{ feeAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-3 mt-3 text-sm font-black text-navy-950">
                <span>You'll Receive</span>
                <strong class="text-violet-600">₦{{ payoutAmount.toLocaleString() }}</strong>
              </div>
            </div>
          </div>

          <!-- Sticky Footer -->
          <div class="modal-footer flex gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <button 
              class="btn-cancel flex-1 py-3 border border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider rounded-2xl text-[10px] hover:bg-slate-50 transition-colors" 
              @click="showWithdrawModal = false"
            >
              Cancel
            </button>
            <button 
              class="btn-primary flex-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold uppercase tracking-wider rounded-2xl text-[10px] shadow-lg shadow-violet-600/15 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              :disabled="withdrawSubmitting || !canWithdraw" 
              @click="handleWithdraw"
            >
              <span v-if="withdrawSubmitting" class="spinner-sm w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span v-else>Confirm Withdrawal</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMarketplaceStore } from '@/stores/marketplace.js'
import { useFinanceStore } from '@/stores/finance.js'

const marketplaceStore = useMarketplaceStore()
const financeStore = useFinanceStore()

const showFundModal     = ref(false)
const showUnfundModal   = ref(false)
const showWithdrawModal = ref(false)

const fundSubmitting     = ref(false)
const unfundSubmitting   = ref(false)
const withdrawSubmitting = ref(false)

const fundForm     = ref({ amount: 1000 })
const unfundForm   = ref({ amount: 1000 })
const withdrawForm = ref({ amount: 5000, bank_name: '', account_number: '', account_name: '' })

const wallet = computed(() => marketplaceStore.wallet)

const canFund   = computed(() => (fundForm.value.amount || 0) >= 100)
const canUnfund = computed(() => (unfundForm.value.amount || 0) >= 100 && (unfundForm.value.amount || 0) <= (wallet.value?.available_balance ?? 0))

const feePercent  = computed(() => (wallet.value?.is_verified_pro ? 0 : 10))
const feeAmount   = computed(() => Math.round((withdrawForm.value.amount || 0) * (feePercent.value / 100) * 100) / 100)
const payoutAmount= computed(() => (withdrawForm.value.amount || 0) - feeAmount.value)

const canWithdraw = computed(() =>
  (withdrawForm.value.amount || 0) >= 5000 &&
  withdrawForm.value.bank_name.trim() &&
  withdrawForm.value.account_number.trim().length === 10 &&
  withdrawForm.value.account_name.trim()
)

const openFund = async () => {
  if (financeStore.balance === undefined || financeStore.balance === null) {
    await financeStore.fetchWallet().catch(() => {})
  }
  showFundModal.value = true
}

const openUnfund = () => { showUnfundModal.value = true }

const handleFund = async () => {
  fundSubmitting.value = true
  try {
    await marketplaceStore.fundWallet({ amount: fundForm.value.amount })
    await financeStore.fetchWallet().catch(() => {})
    showFundModal.value = false
    fundForm.value = { amount: 1000 }
  } catch (e) {
    alert(e.response?.data?.message ?? 'Failed to fund KorpaCoin wallet.')
  } finally { fundSubmitting.value = false }
}

const handleUnfund = async () => {
  unfundSubmitting.value = true
  try {
    await marketplaceStore.unfundWallet({ amount: unfundForm.value.amount })
    await financeStore.fetchWallet().catch(() => {})
    showUnfundModal.value = false
    unfundForm.value = { amount: 1000 }
  } catch (e) {
    alert(e.response?.data?.message ?? 'Failed to move KorpaCoin to your main wallet.')
  } finally { unfundSubmitting.value = false }
}

const handleWithdraw = async () => {
  withdrawSubmitting.value = true
  try {
    await marketplaceStore.requestWithdrawal({ ...withdrawForm.value })
    showWithdrawModal.value = false
    alert('Withdrawal requested — processing same day or next business day.')
    withdrawForm.value = { amount: 5000, bank_name: '', account_number: '', account_name: '' }
  } catch (e) {
    alert(e.response?.data?.message ?? 'Failed to request withdrawal.')
  } finally { withdrawSubmitting.value = false }
}

onMounted(async () => {
  if (!marketplaceStore.wallet) await marketplaceStore.fetchWallet().catch(() => {})
})
</script>
