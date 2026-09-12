<template>
  <section id="hero" class="pt-6 pb-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Clean Context Pill -->
      <div class="flex items-center justify-center mb-4">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3c0ca0] bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 px-3.5 py-1 rounded-full">
          Competitive Landscape
        </span>
      </div>

      <!-- Main Headline -->
      <div class="text-center max-w-3xl mx-auto space-y-3">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1f1635]">
          KorpaBee vs. The Alternatives
        </h1>

        <p class="text-sm sm:text-base text-navy-700 leading-relaxed max-w-2xl mx-auto">
          See where KorpaBee fits across social networking, jobs, marketplaces, housing, events, finance, and career development — built around the complete corps member journey.
        </p>

        <!-- Direct Actions -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#compare"
            class="bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide transition-colors cursor-pointer"
          >
            Compare Features
          </a>
          <a
            href="#matrix"
            class="bg-white hover:bg-slate-50 text-navy-800 border border-[#e9e5f5] font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide transition-colors cursor-pointer"
          >
            Comparison Table
          </a>
          <button
            @click="$emit('open-waitlist')"
            class="bg-purple-50 hover:bg-purple-100 text-[#3c0ca0] border border-purple-200 font-bold px-5 py-2.5 rounded-xl text-xs tracking-wide transition-colors cursor-pointer"
          >
            Join KorpaBee
          </button>
        </div>
      </div>

      <!-- Fast Quick Jump Bar -->
      <div class="flex items-center justify-center flex-wrap gap-2 pt-8 border-b border-[#e9e5f5] pb-6 mt-6">
        <a href="#compare" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Side-by-Side
        </a>
        <span class="text-navy-300">•</span>
        <a href="#matrix" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Comparison Table
        </a>
        <span class="text-navy-300">•</span>
        <a href="#ecosystem" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Ecosystem Flow
        </a>
        <span class="text-navy-300">•</span>
        <a href="#advantage" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Key Differentiators
        </a>
        <span class="text-navy-300">•</span>
        <a href="#rankings" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Strategic Relevance
        </a>
        <span class="text-navy-300">•</span>
        <a href="#profiles" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Competitors
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
defineEmits(['open-waitlist'])
</script>
