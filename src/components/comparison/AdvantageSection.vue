<template>
  <section id="advantage" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Section Header -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
          The KorpaBee Advantage
        </h2>
        <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
          Five core differences that set KorpaBee apart from generic social networks and vertical apps.
        </p>
      </div>

      <!-- 5 Differentiators Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div
          v-for="item in advantages"
          :key="item.number"
          class="bg-white border border-[#e9e5f5] rounded-2xl p-5 sm:p-6 shadow-sm hover:border-[#3c0ca0]/40 transition-colors flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-black text-[#3c0ca0] bg-purple-50 px-2 py-0.5 rounded">
                0{{ item.number }}
              </span>
              <span class="text-[11px] text-navy-500 font-semibold">
                {{ item.subtitle }}
              </span>
            </div>

            <h3 class="text-base font-black text-[#1f1635] mb-2">
              {{ item.title }}
            </h3>

            <p class="text-xs text-navy-700 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ADVANTAGES } from '@/data/competitorData'

const advantages = ADVANTAGES
</script>
