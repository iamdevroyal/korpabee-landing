<template>
  <div class="min-h-screen bg-[#f8f7fd] text-[#1f1635] font-sans selection:bg-[#3c0ca0]/10 selection:text-[#3c0ca0] pb-12 relative">
    
    <!-- Top Sticky Navigation Bar -->
    <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e9e5f5]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        <!-- Logo & Return Link -->
        <div class="flex items-center gap-4">
          <router-link to="/" class="flex items-center gap-2 group shrink-0" title="KorpaBee Home">
            <div class="relative w-28 h-9 flex items-center justify-center overflow-hidden">
              <img src="@/assets/logo.png" alt="KorpaBee Logo" class="w-full h-full object-contain" />
            </div>
          </router-link>

          <span class="hidden md:inline-block w-px h-5 bg-[#e9e5f5]"></span>

          <router-link
            to="/"
            class="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-navy-600 hover:text-[#3c0ca0] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Home</span>
          </router-link>
        </div>

        <!-- Section Navigation Anchors -->
        <nav class="hidden lg:flex items-center gap-1 text-xs font-semibold text-navy-600">
          <a href="#hero" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">Mission</a>
          <a href="#problem-solution" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">The Reality</a>
          <a href="#modules" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">8 Modules</a>
          <a href="#savings" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">Save &amp; Win</a>
          <a href="#timeline" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">Lifecycle</a>
          <a href="#security" class="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 hover:text-[#3c0ca0] transition-colors">Trust &amp; Safety</a>
        </nav>

        <!-- Right Side Button -->
        <div class="flex items-center gap-2.5">
          <router-link
            to="/"
            class="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg bg-navy-50 text-navy-700 hover:text-[#3c0ca0]"
            title="Return to home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </router-link>

          <button
            @click="openWaitlistModal"
            class="bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Join Waitlist
          </button>
        </div>

      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10">
      <AboutHero @open-waitlist="openWaitlistModal" />
      <ProblemSolution />
      <ProductModulesShowcase />
      <GamifiedSavingsHighlight />
      <EcosystemTimeline />
      <SecurityTrustPillars />
      <AboutCta @open-waitlist="openWaitlistModal" />
    </main>

    <!-- Page Footer -->
    <footer class="max-w-7xl mx-auto px-6 pt-8 text-xs text-navy-600 border-t border-[#e9e5f5] mt-6">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="font-bold text-[#1f1635]">KorpaBee</span>
          <span class="text-navy-400">© 2026. All rights reserved.</span>
        </div>

        <div class="flex items-center gap-4 text-xs font-semibold text-navy-600">
          <router-link to="/" class="hover:text-[#3c0ca0] transition-colors">Home</router-link>
          <router-link to="/about" class="text-[#3c0ca0] font-bold">About</router-link>
          <router-link to="/privacy" class="hover:text-[#3c0ca0] transition-colors">Privacy</router-link>
          <router-link to="/terms" class="hover:text-[#3c0ca0] transition-colors">Terms</router-link>
          <router-link to="/disclaimer" class="hover:text-[#3c0ca0] transition-colors">Disclaimer</router-link>
        </div>
      </div>
    </footer>

    <!-- Waitlist Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="waitlistModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
          @click.self="closeWaitlistModal"
        >
          <div class="bg-white border border-[#e9e5f5] rounded-2xl p-6 max-w-md w-full shadow-xl relative">
            <button
              @click="closeWaitlistModal"
              class="absolute top-4 right-4 text-navy-400 hover:text-navy-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Form State -->
            <div v-if="!waitlistSuccess" class="space-y-3 text-left">
              <h3 class="text-lg font-bold text-[#1f1635]">Join the KorpaBee Waitlist</h3>
              <p class="text-xs text-navy-700 leading-relaxed">
                Be the first to access KorpaBee. Enter your email below to reserve your early access.
              </p>

              <div class="pt-2">
                <iframe
                  ref="tallyIframeRef"
                  :src="tallyEmbedUrl"
                  width="100%"
                  height="200"
                  frameborder="0"
                  marginheight="0"
                  marginwidth="0"
                  title="Join the Waitlist"
                  class="w-full border-none block"
                ></iframe>
              </div>
            </div>

            <!-- Success State -->
            <div v-else class="text-center py-4 space-y-3">
              <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-emerald-600">You're on the list!</h3>
              <p class="text-xs text-navy-700">
                We have saved your spot and will update you via email soon.
              </p>
              <button
                @click="closeWaitlistModal"
                class="bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-bold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Scroll To Top Utility -->
    <ScrollToTop />

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AboutHero from '@/components/about/AboutHero.vue'
import ProblemSolution from '@/components/about/ProblemSolution.vue'
import ProductModulesShowcase from '@/components/about/ProductModulesShowcase.vue'
import GamifiedSavingsHighlight from '@/components/about/GamifiedSavingsHighlight.vue'
import EcosystemTimeline from '@/components/about/EcosystemTimeline.vue'
import SecurityTrustPillars from '@/components/about/SecurityTrustPillars.vue'
import AboutCta from '@/components/about/AboutCta.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'

const TALLY_FORM_ID = 'rjbzBX'
const tallyEmbedUrl = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`

const waitlistModalOpen = ref(false)
const waitlistSuccess = ref(false)
const tallyIframeRef = ref(null)

const openWaitlistModal = () => {
  waitlistModalOpen.value = true
  waitlistSuccess.value = false
}

const closeWaitlistModal = () => {
  waitlistModalOpen.value = false
}

const handleTallyMessage = (event) => {
  if (typeof event.origin !== 'string' || !event.origin.includes('tally.so')) return

  let payload = event.data
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return
    }
  }

  if (payload?.event === 'Tally.FormSubmitted') {
    waitlistSuccess.value = true
  }
}

onMounted(() => {
  window.addEventListener('message', handleTallyMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleTallyMessage)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
