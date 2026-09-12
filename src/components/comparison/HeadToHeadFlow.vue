<template>
  <section id="compare" class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header without long intro -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
            Side-by-Side Comparison
          </h2>
          <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
            Compare KorpaBee directly against each platform across all 10 core modules.
          </p>
        </div>

        <div class="text-xs font-bold text-navy-500">
          Comparing: <span class="text-[#3c0ca0] font-extrabold">{{ selectedCompetitor.name }}</span>
        </div>
      </div>

      <!-- Competitor Selectors -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
        <button
          v-for="comp in competitorList"
          :key="comp.id"
          @click="selectedId = comp.id"
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border"
          :class="selectedId === comp.id
            ? 'bg-[#3c0ca0] text-white border-[#3c0ca0] shadow-sm'
            : 'bg-white hover:bg-purple-50 text-navy-700 border-[#e9e5f5]'"
        >
          {{ comp.name }}
        </button>
      </div>

      <!-- Side-by-Side Comparison Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- KorpaBee Column -->
        <div class="bg-white border-2 border-[#3c0ca0]/30 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#e9e5f5]">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black text-[#1f1635]">KorpaBee</h3>
                <span class="text-[10px] font-bold bg-[#3c0ca0]/10 text-[#3c0ca0] px-2 py-0.5 rounded">
                  Ecosystem
                </span>
              </div>
              <p class="text-xs text-navy-600 mt-0.5">All-in-one NYSC social, living & career platform</p>
            </div>
            <span class="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
              10/10 Covered
            </span>
          </div>

          <!-- Feature List -->
          <div class="space-y-2">
            <div
              v-for="col in matrixColumns"
              :key="col.id"
              class="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/40 border border-purple-100 text-xs"
            >
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span class="font-bold text-[#1f1635]">{{ col.label }}</span>
              </div>
              <span class="text-[10px] font-extrabold text-[#3c0ca0] bg-white px-2 py-0.5 rounded border border-purple-200">
                Core Feature
              </span>
            </div>
          </div>

          <div class="mt-5 pt-4 border-t border-[#e9e5f5] text-xs text-navy-600">
            <span class="font-bold text-[#1f1635]">Lifecycle:</span> Continuous from orientation camp to post-NYSC corporate hiring.
          </div>
        </div>

        <!-- Selected Competitor Column -->
        <div class="bg-white border border-[#e9e5f5] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-[#e9e5f5]">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-xl font-black text-[#1f1635]">{{ selectedCompetitor.name }}</h3>
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded border"
                    :class="selectedCompetitor.threatBadge"
                  >
                    {{ selectedCompetitor.threatLevel }}
                  </span>
                </div>
                <p class="text-xs text-navy-600 mt-0.5">{{ selectedCompetitor.category }}</p>
              </div>

              <a
                :href="selectedCompetitor.websiteUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs font-bold text-[#3c0ca0] hover:underline"
              >
                Website ↗
              </a>
            </div>

            <!-- Feature Scores -->
            <div class="space-y-2">
              <div
                v-for="col in matrixColumns"
                :key="col.id"
                class="flex items-center justify-between p-2.5 rounded-lg border text-xs"
                :class="getCompetitorRowClass(selectedCompetitor.scores[col.id])"
              >
                <div class="flex items-center gap-2">
                  <span class="font-bold">{{ getScoreBadge(selectedCompetitor.scores[col.id]).symbol }}</span>
                  <span class="font-medium text-[#1f1635]">{{ col.label }}</span>
                </div>
                <span
                  class="text-[10px] font-bold px-2 py-0.5 rounded border"
                  :class="getScoreBadge(selectedCompetitor.scores[col.id]).badgeColor"
                >
                  {{ getScoreBadge(selectedCompetitor.scores[col.id]).label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Direct Comparison Notes -->
          <div class="mt-5 pt-4 border-t border-[#e9e5f5] space-y-2 text-xs">
            <div>
              <span class="font-bold text-[#1f1635]">Summary: </span>
              <span class="text-navy-700">{{ selectedCompetitor.summary }}</span>
            </div>
            <div>
              <span class="font-bold text-[#3c0ca0]">Competitive Context: </span>
              <span class="text-navy-700">{{ selectedCompetitor.relevance }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { COMPETITORS, MATRIX_COLUMNS, SYMBOL_LEGEND } from '@/data/competitorData'

const competitorList = computed(() => COMPETITORS.filter(c => !c.isHero))
const selectedId = ref(competitorList.value[0]?.id || 'kopaville')

const selectedCompetitor = computed(() => {
  return competitorList.value.find(c => c.id === selectedId.value) || competitorList.value[0]
})

const matrixColumns = MATRIX_COLUMNS

const getScoreBadge = (scoreKey) => {
  return SYMBOL_LEGEND[scoreKey] || SYMBOL_LEGEND.none
}

const getCompetitorRowClass = (scoreKey) => {
  if (scoreKey === 'core' || scoreKey === 'strong' || scoreKey === 'freelance') {
    return 'bg-purple-50/40 border-purple-100'
  }
  if (scoreKey === 'partial') {
    return 'bg-amber-50/40 border-amber-100'
  }
  return 'bg-slate-50/60 border-slate-100 text-navy-400'
}
</script>
