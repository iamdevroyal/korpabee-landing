<template>
  <section id="matrix" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Section Header without long intro -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
            Main Comparison Table
          </h2>
          <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
            Overview of 10 platforms across social, career, living, commerce, and finance capabilities.
          </p>
        </div>

        <!-- Legend in header on larger screens -->
        <div class="hidden lg:flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ✅ Core
          </span>
          <span class="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            ✅ Strong
          </span>
          <span class="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ◐ Partial
          </span>
          <span class="inline-flex items-center gap-1 font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            — None
          </span>
        </div>
      </div>

      <!-- Category Filter Pills & Search -->
      <div class="bg-white border border-[#e9e5f5] rounded-2xl p-3 mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        <!-- Category Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="cat in categoryFilters"
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
            :class="activeCategory === cat.id
              ? 'bg-[#3c0ca0] text-white'
              : 'bg-navy-50 hover:bg-purple-50 text-navy-700'"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative w-full md:w-56 shrink-0">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search platform..."
            class="w-full bg-slate-50 focus:bg-white border border-[#e9e5f5] focus:border-[#3c0ca0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-navy-900 outline-none transition-all placeholder:text-navy-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-navy-400 absolute left-2.5 top-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>

      </div>

      <!-- Main Responsive Table Container -->
      <div class="bg-white border border-[#e9e5f5] rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto max-w-full">
          <table class="w-full text-left border-collapse min-w-[960px]">
            <!-- Table Header -->
            <thead>
              <tr class="bg-slate-50 border-b border-[#e9e5f5] text-[11px] font-bold uppercase tracking-wider text-navy-700 sticky top-0 z-20">
                <!-- Sticky First Column -->
                <th scope="col" class="py-3 px-4 sticky left-0 z-30 bg-slate-100 border-r border-[#e9e5f5] min-w-[150px]">
                  Platform
                </th>

                <th
                  v-for="col in displayedColumns"
                  :key="col.id"
                  scope="col"
                  class="py-3 px-2 text-center text-navy-700"
                >
                  <span>{{ col.shortLabel }}</span>
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-[#e9e5f5] text-xs">
              <tr
                v-for="platform in filteredPlatforms"
                :key="platform.id"
                class="transition-colors"
                :class="platform.isHero ? 'bg-purple-50/70 font-semibold' : 'hover:bg-slate-50/60'"
              >
                <!-- Sticky Platform Name -->
                <th
                  scope="row"
                  class="py-3 px-4 sticky left-0 z-10 border-r border-[#e9e5f5] whitespace-nowrap"
                  :class="platform.isHero ? 'bg-purple-50 text-[#3c0ca0] font-extrabold' : 'bg-white text-[#1f1635] font-bold'"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ platform.name }}</span>
                    <span v-if="platform.isHero" class="text-[9px] bg-[#3c0ca0] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      Featured
                    </span>
                  </div>
                </th>

                <!-- Scores Columns -->
                <td
                  v-for="col in displayedColumns"
                  :key="col.id"
                  class="py-3 px-2 text-center align-middle"
                >
                  <div class="inline-flex items-center justify-center gap-1">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold"
                      :class="getCellStyle(platform.scores[col.id], platform.isHero)"
                    >
                      <span>{{ getCellLegend(platform.scores[col.id]).symbol }}</span>
                      <span v-if="getCellBadgeText(platform.scores[col.id])" class="text-[9px] uppercase">
                        {{ getCellBadgeText(platform.scores[col.id]) }}
                      </span>
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Clean Accessible Legend Footer -->
        <div class="p-4 bg-slate-50 border-t border-[#e9e5f5] text-xs text-navy-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <span class="font-bold text-[#1f1635]">Legend:</span>
            <span>✅ Core = Central to platform</span>
            <span>✅ Strong = Major active offering</span>
            <span>◐ Partial = Adjacent / limited scope</span>
            <span>— None = Not evident in public product</span>
          </div>
          <div class="text-[11px] text-navy-400">
            Based on publicly available product descriptions (2026).
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { COMPETITORS, MATRIX_COLUMNS, SYMBOL_LEGEND } from '@/data/competitorData'

const searchQuery = ref('')
const activeCategory = ref('all')

const categoryFilters = [
  { id: 'all', label: 'All Columns' },
  { id: 'community', label: 'Community' },
  { id: 'career', label: 'Jobs & Career' },
  { id: 'commerce', label: 'Marketplace' },
  { id: 'living', label: 'Housing' },
  { id: 'finance', label: 'Finance' },
  { id: 'nysc', label: 'NYSC Focus' }
]

const displayedColumns = computed(() => {
  if (activeCategory.value === 'all') return MATRIX_COLUMNS
  return MATRIX_COLUMNS.filter(col => col.category === activeCategory.value)
})

const filteredPlatforms = computed(() => {
  if (!searchQuery.value.trim()) return COMPETITORS
  const query = searchQuery.value.toLowerCase().trim()
  return COMPETITORS.filter(p => p.name.toLowerCase().includes(query))
})

const getCellLegend = (scoreKey) => {
  return SYMBOL_LEGEND[scoreKey] || SYMBOL_LEGEND.none
}

const getCellBadgeText = (scoreKey) => {
  if (scoreKey === 'core') return 'Core'
  if (scoreKey === 'strong') return 'Strong'
  if (scoreKey === 'freelance') return 'Freelance'
  return ''
}

const getCellStyle = (scoreKey, isHero) => {
  if (isHero) {
    return 'bg-purple-100/70 border-purple-200 text-[#3c0ca0]'
  }
  if (scoreKey === 'core') {
    return 'bg-emerald-50 border-emerald-200 text-emerald-700'
  }
  if (scoreKey === 'strong') {
    return 'bg-purple-50 border-purple-200 text-purple-700'
  }
  if (scoreKey === 'freelance') {
    return 'bg-blue-50 border-blue-200 text-blue-700'
  }
  if (scoreKey === 'partial') {
    return 'bg-amber-50 border-amber-200 text-amber-700'
  }
  return 'bg-slate-100 border-slate-200 text-slate-400'
}
</script>
