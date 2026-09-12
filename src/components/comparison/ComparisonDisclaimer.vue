<template>
  <section id="methodology" class="py-12 border-t border-[#e9e5f5] bg-white/60">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="space-y-6">
        
        <!-- Header -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-purple-50 text-[#3c0ca0] flex items-center justify-center font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <h3 class="text-base font-black text-[#1f1635]">
            How We Compare — Methodology & Editorial Standards
          </h3>
        </div>

        <!-- Official Disclaimer Copy from Section 11 -->
        <blockquote class="text-xs sm:text-sm text-navy-800 leading-relaxed bg-purple-50/50 border-l-4 border-[#3c0ca0] p-4 rounded-r-2xl italic">
          “This comparison is based on publicly available product information, app store listings, and published capabilities. It is intended to provide an architectural perspective of Nigerian and African platforms operating in adjacent categories. Product features change frequently, so individual capabilities may evolve over time.”
        </blockquote>

        <!-- Reference Sources Grid -->
        <div>
          <div class="text-[11px] font-black uppercase tracking-wider text-navy-500 mb-3">
            Public Product Verification Sources
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            <div
              v-for="source in sources"
              :key="source.name"
              class="p-2.5 rounded-xl border border-[#e9e5f5] bg-white text-xs flex items-center justify-between"
            >
              <div>
                <span class="font-extrabold text-[#1f1635]">{{ source.name }}</span>
                <span class="text-[10px] text-navy-500 block">{{ source.platform }}</span>
              </div>
              <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {{ source.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Editorial Guardrails Summary -->
        <div class="text-[10px] text-navy-500 space-y-1 pt-2">
          <p>
            * Strategic relevance and threat indicators reflect architectural capability overlap rather than formal commercial rankings or financial market share.
          </p>
          <p>
            * “Not Evident” denotes that a given feature is not prominently highlighted as an active core offering in current public documentation, rather than asserting complete technical absence.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { DATA_SOURCES } from '@/data/competitorData'

const sources = DATA_SOURCES
</script>
