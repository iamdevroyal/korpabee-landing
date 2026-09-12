<template>
  <section id="hero" class="pt-8 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Brand Pill -->
      <div class="flex items-center justify-center mb-5">
        <span class="inline-flex items-center gap-1.5 text-xs font-bold text-[#3c0ca0] bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 px-3.5 py-1 rounded-full">
          The KorpaBee Mission
        </span>
      </div>

      <!-- Main Headline -->
      <div class="text-center max-w-4xl mx-auto space-y-4">
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1f1635] leading-[1.1]">
          The Operating System for Nigeria’s National Service Year
        </h1>

        <p class="text-sm sm:text-base lg:text-lg text-navy-700 leading-relaxed max-w-3xl mx-auto">
          Every year, over 350,000 Nigerian graduates are mobilized across 36 states and the FCT. KorpaBee unites their entire journey — connecting community, housing, verified PPA reviews, jobs, and gamified savings into one digital home.
        </p>

        <!-- CTA / Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href="#modules"
            class="bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wide transition-colors cursor-pointer"
          >
            Explore Product Modules
          </a>
          <button
            @click="$emit('open-waitlist')"
            class="bg-white hover:bg-purple-50 text-[#3c0ca0] border border-[#3c0ca0]/30 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm tracking-wide transition-colors cursor-pointer"
          >
            Join KorpaBee Free
          </button>
        </div>
      </div>

      <!-- Key Numbers Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
        <div class="bg-white border border-[#e9e5f5] p-4 rounded-2xl text-center shadow-xs">
          <div class="text-2xl sm:text-3xl font-black text-[#3c0ca0]">36 + FCT</div>
          <div class="text-xs font-bold text-[#1f1635] mt-1">State Coverage</div>
          <p class="text-[11px] text-navy-500 mt-0.5">Every orientation camp & local PPA</p>
        </div>

        <div class="bg-white border border-[#e9e5f5] p-4 rounded-2xl text-center shadow-xs">
          <div class="text-2xl sm:text-3xl font-black text-[#3c0ca0]">8 Core</div>
          <div class="text-xs font-bold text-[#1f1635] mt-1">Product Modules</div>
          <p class="text-[11px] text-navy-500 mt-0.5">From feeds & chat to housing & jobs</p>
        </div>

        <div class="bg-white border border-[#e9e5f5] p-4 rounded-2xl text-center shadow-xs">
          <div class="text-2xl sm:text-3xl font-black text-[#3c0ca0]">1 Unified</div>
          <div class="text-xs font-bold text-[#1f1635] mt-1">Verified Identity</div>
          <p class="text-[11px] text-navy-500 mt-0.5">State code, batch & platoon tied</p>
        </div>

        <div class="bg-white border border-[#e9e5f5] p-4 rounded-2xl text-center shadow-xs">
          <div class="text-2xl sm:text-3xl font-black text-[#3c0ca0]">350k+</div>
          <div class="text-xs font-bold text-[#1f1635] mt-1">Corpers Annually</div>
          <p class="text-[11px] text-navy-500 mt-0.5">Serving the next generation of talent</p>
        </div>
      </div>

      <!-- Quick Section Anchor Ribbon -->
      <div class="flex items-center justify-center flex-wrap gap-2 pt-8 border-b border-[#e9e5f5] pb-6 mt-6">
        <a href="#problem-solution" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          The Problem & Solution
        </a>
        <span class="text-navy-300">•</span>
        <a href="#modules" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Product Modules
        </a>
        <span class="text-navy-300">•</span>
        <a href="#savings" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Save & Win & Allawee
        </a>
        <span class="text-navy-300">•</span>
        <a href="#timeline" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Service Lifecycle
        </a>
        <span class="text-navy-300">•</span>
        <a href="#security" class="text-xs font-semibold text-navy-600 hover:text-[#3c0ca0] px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors">
          Trust & Security
        </a>
      </div>

    </div>
  </section>
</template>

<script setup>
defineEmits(['open-waitlist'])
</script>
