<template>
  <Transition name="cookie-slide">
    <div
      v-if="isVisible"
      class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-[#1f1635]/95 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl z-[9999] text-left text-white"
    >
      <div class="space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2 text-[#aca064]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 animate-pulse">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h4 class="text-xs font-black uppercase tracking-wider font-sans">Cookie Consent</h4>
          </div>
          <button @click="declineCookies" class="text-white/40 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Description -->
        <p class="text-[11px] leading-relaxed text-white/85 font-sans">
          We use cookies to improve your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you agree to our use of cookies as detailed in our 
          <router-link to="/privacy" class="text-[#aca064] underline hover:text-[#c4b67b] transition-colors font-bold">Privacy Policy</router-link>.
        </p>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-1">
          <button
            @click="declineCookies"
            class="flex-1 py-2 px-4 rounded-xl border border-white/20 hover:bg-white/5 text-[10px] uppercase tracking-wider font-extrabold transition-colors text-white/90"
          >
            Decline
          </button>
          <button
            @click="acceptCookies"
            class="flex-1 py-2 px-4 rounded-xl bg-[#3c0ca0] hover:bg-[#2b1461] border border-[#3c0ca0] text-[10px] uppercase tracking-wider font-extrabold transition-colors shadow-md shadow-[#3c0ca0]/20"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  // Check if user already set preference
  const consent = localStorage.getItem('korpabee_cookies_accepted');
  if (!consent) {
    // Show banner after a slight delay
    setTimeout(() => {
      isVisible.value = true;
    }, 1500);
  }
});

function acceptCookies() {
  localStorage.setItem('korpabee_cookies_accepted', 'true');
  isVisible.value = false;
}

function declineCookies() {
  localStorage.setItem('korpabee_cookies_accepted', 'false');
  isVisible.value = false;
}
</script>

<style scoped>
.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}

.cookie-slide-enter-from {
  transform: translateY(24px) scale(0.95);
  opacity: 0;
}

.cookie-slide-leave-to {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
</style>
