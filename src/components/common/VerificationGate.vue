<template>
  <!-- Use display:contents so this wrapper div is invisible to layout,
       allowing the flex/height chain from AppLayout to reach the slot contents -->
  <div v-if="isVerified" style="display: contents;">
    <slot />
  </div>
  <div v-else class="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white rounded-2xl p-8 text-center border border-gold-500/20 shadow-xl max-w-md mx-auto my-8">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 text-gold-500 mb-6 border border-gold-500/30 animate-pulse">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    </div>
    <h3 class="text-xl font-bold mb-2 tracking-wide text-gold-500">NYSC Verification Required</h3>
    <p class="text-gray-300 text-sm mb-6 leading-relaxed">
      This is a premium, verified-only feature. Please complete your NYSC verification to unlock access to the feed, chat, opportunities, and more.
    </p>
    <router-link
      to="/onboarding/verify"
      class="inline-block px-6  py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white transition-all duration-300 shadow-lg shadow-teal-500/20 transform hover:-translate-y-0.5 active:translate-y-0"
    >
      Verify Account Now
    </router-link>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isVerified } = useAuth()
</script>
