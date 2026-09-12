<template>
  <section class="py-12">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="bg-gradient-to-r from-[#3c0ca0] via-[#5e32c7] to-[#1c0d45] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
        <span class="inline-block text-[11px] font-black uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full text-purple-200">
          Be Part of the Future
        </span>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-3xl mx-auto">
          Ready to Reimagine Your Service Year?
        </h2>

        <p class="text-xs sm:text-sm text-purple-100 max-w-2xl mx-auto leading-relaxed">
          Join thousands of prospective, serving, and past corps members building a safer, more connected, and highly rewarding NYSC journey.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            @click="$emit('open-waitlist')"
            class="bg-white text-[#3c0ca0] hover:bg-purple-50 font-black px-8 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Join the Waitlist Free
          </button>
          
          <router-link
            to="/"
            class="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-white/20 transition-colors"
          >
            Return to Homepage
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineEmits(['open-waitlist'])
</script>
