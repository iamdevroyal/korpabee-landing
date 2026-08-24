<template>
  <div class="submission-card-wrapper">
    <!-- MOBILE VIEW (Card Layout) -->
    <div class="lg:hidden bg-white border border-violet-100/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-start justify-between gap-4 mb-4">
        <div class="flex gap-3 items-center min-w-0">
          <img 
            v-if="submission.gig?.cover_image" 
            :src="submission.gig.cover_image" 
            class="w-12 h-12 rounded-2xl object-cover border border-violet-50 flex-shrink-0" 
          />
          <div v-else class="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <BriefcaseIcon class="w-5 h-5 text-violet-300" />
          </div>
          <div class="min-w-0">
            <router-link 
              :to="`/gigs/${submission.gig?.uuid}`" 
              class="font-black text-xs text-navy-950 truncate leading-tight hover:underline block"
            >
              {{ submission.gig?.title }}
            </router-link>
            <div class="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1.5">
              {{ role === 'poster' ? 'Worker' : 'Poster' }}:
              <span class="text-navy-900 font-black">{{ role === 'poster' ? submission.worker?.name : submission.gig?.poster?.name }}</span>
            </div>
          </div>
        </div>
        <div 
          class="status-badge px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap"
          :class="statusClass(submission.status)"
        >
          {{ submission.status.replace('_', ' ') }}
        </div>
      </div>

      <!-- Proof details -->
      <div 
        v-if="submission.proof_description" 
        class="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4 text-[11px] text-slate-600 font-medium leading-relaxed"
      >
        <span class="font-extrabold text-navy-950 text-[9px] uppercase tracking-wider block mb-1">Worker Proof:</span>
        {{ submission.proof_description }}
      </div>

      <div 
        v-if="submission.rejection_reason" 
        class="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 mb-4 text-[11px] text-rose-600 font-semibold leading-relaxed"
      >
        <span class="font-extrabold text-rose-800 text-[9px] uppercase tracking-wider block mb-1">Rejection Reason:</span>
        {{ submission.rejection_reason }}
      </div>

      <!-- Countdown -->
      <div 
        v-if="submission.status === 'pending'" 
        class="countdown-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold mb-4"
        :class="countdownClass"
      >
        <ClockIcon class="w-3.5 h-3.5" />
        <span>{{ isPast ? 'Auto-approving…' : countdownLabel }}</span>
      </div>

      <!-- Footer & Actions -->
      <div class="flex justify-between items-center border-t border-violet-50 pt-4 mt-1 flex-wrap gap-3">
        <div>
          <span class="text-[8px] text-slate-400 font-extrabold uppercase tracking-widest block mb-0.5">Payout</span>
          <div class="text-base font-black text-navy-950">K{{ Number(submission.payout_amount).toLocaleString() }}</div>
          <div class="text-[9px] text-slate-400 font-semibold mt-1">{{ fmtDate(submission.submitted_at) }}</div>
        </div>

        <div class="flex gap-2 flex-wrap ml-auto">
          <template v-if="role === 'poster' && submission.status === 'pending'">
            <button 
              class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-sm transition-colors" 
              @click="$emit('approve', submission)"
            >
              Approve
            </button>
            <button 
              class="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-colors" 
              @click="$emit('reject', submission)"
            >
              Reject
            </button>
          </template>
          <button 
            v-if="submission.status === 'rejected' || submission.status === 'pending'"
            class="px-3.5 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-extrabold uppercase tracking-wider rounded-xl transition-colors" 
            @click="$emit('dispute', submission)"
          >
            Dispute
          </button>
        </div>
      </div>
    </div>

    <!-- DESKTOP VIEW (Data-Table Row) -->
    <div class="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 bg-white border border-violet-100/85 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <!-- Gig Info (Col 1-3) -->
      <div class="col-span-3 flex items-center gap-3 min-w-0">
        <img 
          v-if="submission.gig?.cover_image" 
          :src="submission.gig.cover_image" 
          class="w-10 h-10 rounded-xl object-cover border border-violet-50 flex-shrink-0" 
        />
        <div v-else class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <BriefcaseIcon class="w-4 h-4 text-violet-300" />
        </div>
        <div class="min-w-0">
          <router-link 
            :to="`/gigs/${submission.gig?.uuid}`" 
            class="font-black text-xs text-navy-950 truncate hover:underline block leading-snug"
          >
            {{ submission.gig?.title }}
          </router-link>
          <div class="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">
            {{ role === 'poster' ? 'Worker' : 'Poster' }}:
            <span class="text-navy-900 font-black">{{ role === 'poster' ? submission.worker?.name : submission.gig?.poster?.name }}</span>
          </div>
        </div>
      </div>

      <!-- Proof & Rejection (Col 4-6) -->
      <div class="col-span-3 min-w-0 text-[11px] text-slate-500 leading-normal">
        <div v-if="submission.proof_description" class="line-clamp-2" :title="submission.proof_description">
          <span class="font-extrabold text-navy-950 text-[9px] uppercase tracking-wider block">Proof:</span>
          {{ submission.proof_description }}
        </div>
        <div v-if="submission.rejection_reason" class="text-rose-600 line-clamp-2 mt-1" :title="submission.rejection_reason">
          <span class="font-extrabold text-rose-800 text-[9px] uppercase tracking-wider block">Rejected:</span>
          {{ submission.rejection_reason }}
        </div>
      </div>

      <!-- Date & Deadline (Col 7-8) -->
      <div class="col-span-2 text-center">
        <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
          {{ fmtDate(submission.submitted_at) }}
        </div>
        <div 
          v-if="submission.status === 'pending'" 
          class="countdown-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold"
          :class="countdownClass"
        >
          <ClockIcon class="w-3 h-3" />
          <span>{{ isPast ? 'Auto-approving…' : countdownLabel }}</span>
        </div>
      </div>

      <!-- Status Badge (Col 9) -->
      <div class="col-span-1 flex justify-center">
        <div 
          class="status-badge px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap"
          :class="statusClass(submission.status)"
        >
          {{ submission.status.replace('_', ' ') }}
        </div>
      </div>

      <!-- Payout (Col 10) -->
      <div class="col-span-1 text-right">
        <span class="text-xs font-black text-navy-950 block">K{{ Number(submission.payout_amount).toLocaleString() }}</span>
      </div>

      <!-- Actions (Col 11-12) -->
      <div class="col-span-2 flex justify-end gap-1.5">
        <template v-if="role === 'poster' && submission.status === 'pending'">
          <button 
            class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm transition-colors" 
            @click="$emit('approve', submission)"
          >
            Approve
          </button>
          <button 
            class="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-colors" 
            @click="$emit('reject', submission)"
          >
            Reject
          </button>
        </template>
        <button 
          v-if="submission.status === 'rejected' || submission.status === 'pending'"
          class="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[9px] font-extrabold uppercase tracking-wider rounded-lg transition-colors" 
          @click="$emit('dispute', submission)"
        >
          Dispute
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown.js'
import { ClockIcon, BriefcaseIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  submission: { type: Object, required: true },
  role: { type: String, required: true }, // 'worker' | 'poster'
})

defineEmits(['approve', 'reject', 'dispute'])

const { label: countdownLabel, isPast, isUrgent } = useCountdown(() => props.submission.review_deadline_at)

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

const statusClass = (status) => {
  return {
    pending: 'bg-blue-50 text-blue-700 border border-blue-100',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    auto_approved: 'bg-teal-50 text-teal-700 border border-teal-100',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-100',
    disputed: 'bg-pink-50 text-pink-700 border border-pink-100',
  }[status] ?? 'bg-slate-50 text-slate-500'
}

const countdownClass = computed(() => {
  if (isPast.value) {
    return 'bg-rose-50 text-rose-600 border border-rose-100'
  }
  if (isUrgent.value) {
    return 'bg-amber-50 text-amber-700 border border-amber-200/60 animate-pulse'
  }
  return 'bg-slate-50 text-slate-500 border border-slate-100'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
