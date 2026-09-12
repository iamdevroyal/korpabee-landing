<template>
  <section id="rankings" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Section Header -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
          Strategic Relevance Assessment
        </h2>
        <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
          How adjacent platforms classify in relation to KorpaBee’s multi-module scope.
        </p>
      </div>

      <!-- Clean Ranking Table -->
      <div class="bg-white border border-[#e9e5f5] rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-[#e9e5f5] text-[11px] font-bold uppercase text-navy-700">
                <th scope="col" class="py-3 px-4">Platform</th>
                <th scope="col" class="py-3 px-4">Category</th>
                <th scope="col" class="py-3 px-4">Relevance / Threat</th>
                <th scope="col" class="py-3 px-4">Comparative Assessment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#e9e5f5]">
              <tr
                v-for="item in strategicRankings"
                :key="item.name"
                class="hover:bg-slate-50/60 transition-colors"
              >
                <td class="py-3 px-4 font-bold text-[#1f1635]">
                  {{ item.name }}
                </td>
                <td class="py-3 px-4 text-navy-600 font-medium">
                  {{ item.category }}
                </td>
                <td class="py-3 px-4">
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded border inline-block"
                    :class="getThreatBadgeClass(item.threat)"
                  >
                    {{ item.threat }}
                  </span>
                </td>
                <td class="py-3 px-4 text-navy-700 leading-relaxed max-w-md">
                  {{ item.note }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-4 bg-slate-50 border-t border-[#e9e5f5] text-[11px] text-navy-500">
          * Strategic assessments reflect product capability overlap rather than commercial market share rankings.
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { STRATEGIC_RANKINGS } from '@/data/competitorData'

const strategicRankings = STRATEGIC_RANKINGS

const getThreatBadgeClass = (threat) => {
  if (threat.includes('Very High')) {
    return 'bg-rose-50 text-rose-700 border-rose-200'
  }
  if (threat.includes('High')) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-blue-50 text-blue-700 border-blue-200'
}
</script>
