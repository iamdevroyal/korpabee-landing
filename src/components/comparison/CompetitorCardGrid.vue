<template>
  <section id="profiles" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Section Header -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
          Competitor Profiles
        </h2>
        <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
          Public offerings, feature overlap tags, and official platform links for the 9 comparison platforms.
        </p>
      </div>

      <!-- 9 Platform Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div
          v-for="comp in competitors"
          :key="comp.id"
          class="bg-white border border-[#e9e5f5] rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#3c0ca0]/30 transition-colors"
        >
          <div class="space-y-3">
            
            <!-- Card Header -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="text-lg font-black text-[#1f1635]">
                  {{ comp.name }}
                </h3>
                <span class="text-xs text-navy-500 font-medium block">
                  {{ comp.category }}
                </span>
              </div>

              <span
                class="text-[10px] font-bold px-2 py-0.5 rounded border shrink-0"
                :class="comp.threatBadge"
              >
                {{ comp.threatLevel.split('—')[0].trim() }}
              </span>
            </div>

            <!-- Positioning -->
            <p class="text-xs text-navy-700 leading-relaxed">
              {{ comp.summary }}
            </p>

            <!-- Overlaps -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-navy-400 mb-1">
                Key Overlaps
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in comp.keyOverlap"
                  :key="tag"
                  class="text-[10px] font-medium text-navy-700 bg-slate-100 px-2 py-0.5 rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Competitive Relevance -->
            <div class="bg-purple-50/50 border border-purple-100 rounded-xl p-3 text-xs">
              <div class="text-[10px] font-bold uppercase tracking-wider text-[#3c0ca0] mb-0.5">
                Competitive Relevance
              </div>
              <p class="text-navy-800 leading-relaxed text-[11px]">
                {{ comp.relevance }}
              </p>
            </div>

          </div>

          <!-- Bottom Official Link -->
          <div class="mt-4 pt-3 border-t border-[#e9e5f5] flex items-center justify-between text-xs">
            <span class="text-navy-400 text-[11px]">Verified Source</span>
            <a
              :href="comp.websiteUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="font-bold text-[#3c0ca0] hover:underline"
            >
              Visit Platform ↗
            </a>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { COMPETITORS } from '@/data/competitorData'

const competitors = computed(() => COMPETITORS.filter(c => !c.isHero))
</script>
