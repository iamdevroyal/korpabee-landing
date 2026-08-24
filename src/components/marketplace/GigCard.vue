<template>
  <div class="gig-card group bg-white border border-violet-100/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full">
    <!-- Card Image Header -->
    <div class="card-img relative h-36 bg-slate-50 overflow-hidden flex-shrink-0">
      <img 
        v-if="gig.cover_image" 
        :src="gig.cover_image" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
      />
      <div 
        v-else 
        class="w-full h-full bg-gradient-to-br from-violet-50 to-indigo-100/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 ease-out"
      >
        <svg class="w-10 h-10 text-violet-300/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 8L2 22M17.5 15H9M12 11h-3" />
        </svg>
      </div>

      <!-- Restricted Badge (Verified Pro Only) -->
      <div 
        v-if="gig.category?.is_restricted" 
        class="restricted-badge absolute top-3 left-3 w-7 h-7 rounded-full bg-navy-950/80 backdrop-blur-md flex items-center justify-center shadow-md shadow-navy-950/10 border border-white/10" 
        title="Verified Pro workers only"
      >
        <LockClosedIcon class="w-3.5 h-3.5 text-white" />
      </div>

      <!-- Slots Badge -->
      <div class="slots-badge absolute top-3 right-3 px-2.5 py-1 bg-navy-950/80 backdrop-blur-md rounded-full text-[9px] font-extrabold text-white tracking-wider uppercase shadow-md border border-white/10">
        {{ gig.filled_slots }}/{{ gig.total_slots }} Slots
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body p-4 flex flex-col flex-grow">
      <div class="card-category text-[9px] font-extrabold text-violet-600 uppercase tracking-widest mb-1.5 truncate">
        {{ gig.category?.name || 'Task' }}
      </div>
      
      <h3 class="card-title text-xs font-black text-navy-950 leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors duration-200 mb-3 min-h-[2.4em]">
        {{ gig.title }}
      </h3>

      <!-- Divider -->
      <div class="mt-auto pt-3 border-t border-violet-50 flex items-end justify-between">
        <div class="flex flex-col">
          <span class="reward-label text-[8px] text-slate-400 font-extrabold uppercase tracking-widest mb-0.5">Reward</span>
          <span class="reward-amount text-base font-black text-navy-950 tracking-tight">
            K{{ Number(gig.reward_per_slot).toLocaleString() }}
          </span>
        </div>

        <div 
          v-if="gig.remaining_slots > 0 && !gig.is_expired" 
          class="open-pill px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
        >
          {{ gig.remaining_slots }} Open
        </div>
        <div 
          v-else 
          class="closed-pill px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-400 rounded-full text-[9px] font-extrabold uppercase tracking-wider"
        >
          {{ gig.is_expired ? 'Expired' : 'Filled' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LockClosedIcon } from '@heroicons/vue/24/solid'

defineProps({
  gig: { type: Object, required: true },
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
