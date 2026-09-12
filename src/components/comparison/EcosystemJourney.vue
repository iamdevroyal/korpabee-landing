<template>
  <section id="ecosystem" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Section Header -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
          Ecosystem Flow: Where KorpaBee Fits
        </h2>
        <p class="text-xs sm:text-sm text-navy-600 mt-0.5 max-w-3xl">
          Unlike single-purpose apps, KorpaBee connects the full journey under one verified account.
        </p>
      </div>

      <!-- Linear Step Pipeline -->
      <div class="bg-white border border-[#e9e5f5] rounded-2xl p-5 shadow-sm mb-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          <button
            v-for="item in ecosystemJourney"
            :key="item.id"
            @click="activeStepId = item.id"
            class="flex flex-col items-center text-center p-3 rounded-xl border transition-all cursor-pointer"
            :class="activeStepId === item.id
              ? 'bg-purple-50 border-[#3c0ca0] text-[#3c0ca0]'
              : 'bg-slate-50 hover:bg-slate-100 border-transparent text-navy-700'"
          >
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1.5"
              :class="activeStepId === item.id ? 'bg-[#3c0ca0] text-white' : 'bg-slate-200 text-navy-700'"
            >
              {{ item.step }}
            </span>
            <span class="text-xs font-bold leading-tight">{{ item.name }}</span>
          </button>
        </div>
      </div>

      <!-- Active Stage Inspection Box -->
      <div class="bg-white border border-[#e9e5f5] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#e9e5f5] pb-3 mb-4">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-black bg-[#3c0ca0] text-white w-6 h-6 rounded-md flex items-center justify-center">
              {{ activeStep.step }}
            </span>
            <h3 class="text-lg font-bold text-[#1f1635]">
              {{ activeStep.name }} — <span class="text-[#3c0ca0]">{{ activeStep.tagline }}</span>
            </h3>
          </div>
          <span class="text-xs text-navy-500 font-semibold">Stage {{ activeStep.step }} of 9</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div class="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
            <div class="font-bold text-[#3c0ca0] uppercase tracking-wider text-[11px] mb-1">
              KorpaBee Integrated Approach
            </div>
            <p class="text-navy-800 leading-relaxed">
              {{ activeStep.description }}
            </p>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-navy-600 uppercase tracking-wider text-[11px] mb-1">
              Adjacent Platforms / Alternative
            </div>
            <p class="text-navy-700 leading-relaxed">
              {{ activeStep.competitorContrast }}
            </p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ECOSYSTEM_JOURNEY } from '@/data/competitorData'

const ecosystemJourney = ECOSYSTEM_JOURNEY
const activeStepId = ref(ecosystemJourney[0]?.id || 'nysc-identity')

const activeStep = computed(() => {
  return ecosystemJourney.find(s => s.id === activeStepId.value) || ecosystemJourney[0]
})
</script>
