<template>
  <!-- Detached Glassmorphic Navbar -->
  <header
    class="fixed top-3 left-3 right-3 z-50 transition-all duration-500"
    :class="scrolled ? 'top-2' : 'top-3'"
  >
    <div
      class="max-w-7xl mx-auto rounded-2xl px-5 h-[60px] flex items-center justify-between transition-all duration-500"
      :class="scrolled
        ? 'bg-white/85 backdrop-blur-2xl border border-white/60 shadow-xl shadow-[#3c0ca0]/8'
        : 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-[#3c0ca0]/5'"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
        <div class="relative w-full h-12 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
            <img
              src="@/assets/logo.png"
              alt="KorpaBee Logo"
              class="w-full h-full object-contain"
            />
          </div>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1f1635]/70">
        <a @click.prevent="navigate('home')" href="#home"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Home</a>
        <a @click.prevent="navigate('about')" href="#about"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">About</a>
        <a @click.prevent="navigate('features')" href="#features"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Features</a>
        <a @click.prevent="navigate('contact')" href="#contact"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Contact</a>
        <router-link to="/privacy"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Privacy</router-link>
        <router-link to="/terms"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Terms</router-link>
        <router-link to="/disclaimer"
          class="px-3 py-1.5 rounded-lg hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all duration-200 cursor-pointer">Disclaimer</router-link>
      </nav>

      <!-- CTA Buttons -->
      <div class="hidden sm:flex items-center gap-2.5 shrink-0">
        <!-- <router-link to="/login"
          class="text-[11px] font-bold text-[#3c0ca0] hover:text-[#2d0979] px-4 py-2 rounded-xl hover:bg-[#3c0ca0]/8 transition-all duration-200">
          Sign In
        </router-link> -->
        <!-- <button @click="handleRegisterClick"
          class="relative overflow-hidden bg-[#3c0ca0] hover:bg-[#2d0979] text-white text-[11px] font-bold px-5 py-2.5 rounded-xl tracking-wide shadow-md shadow-[#3c0ca0]/25 active:scale-[0.97] transition-all duration-200 group cursor-pointer">
          
          <span class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
          <span class="relative">Join Free</span>
        </button> -->
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#3c0ca0]/8 text-[#3c0ca0] hover:bg-[#3c0ca0]/15 transition-colors"
        aria-label="Toggle menu"
      >
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="max-w-7xl mx-auto mt-2 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-xl shadow-[#3c0ca0]/8 px-5 py-5"
      >
        <nav class="flex flex-col gap-1 mb-4">
          <a @click.prevent="navigate('home'); mobileMenuOpen = false" href="#home"
            class="text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Home</a>
          <a @click.prevent="navigate('about'); mobileMenuOpen = false" href="#about"
            class="text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">About</a>
          <a @click.prevent="navigate('features'); mobileMenuOpen = false" href="#features"
            class="text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Features</a>
          <a @click.prevent="navigate('contact'); mobileMenuOpen = false" href="#contact"
            class="text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Contact</a>
          <router-link to="/privacy" @click="mobileMenuOpen = false"
            class="text-left text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Privacy Policy</router-link>
          <router-link to="/terms" @click="mobileMenuOpen = false"
            class="text-left text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Terms of Service</router-link>
          <router-link to="/disclaimer" @click="mobileMenuOpen = false"
            class="text-left text-sm font-bold text-[#1f1635] px-3 py-2.5 rounded-xl hover:bg-[#3c0ca0]/8 hover:text-[#3c0ca0] transition-all cursor-pointer">Disclaimer</router-link>
        </nav>
        <div class="h-px bg-[#e9e5f5] w-full mb-4"></div>
        <div class="flex flex-col gap-3">
          <!-- <router-link to="/login" @click="mobileMenuOpen = false"
            class="text-center text-sm font-bold text-[#3c0ca0] py-2.5 border border-[#3c0ca0]/20 rounded-xl hover:bg-[#3c0ca0]/5 transition-colors">Sign In</router-link> -->
          <!-- <button @click="handleRegisterClickMobile"
            class="text-center text-sm font-bold bg-[#3c0ca0] text-white py-2.5 rounded-xl shadow-md shadow-[#3c0ca0]/20 hover:bg-[#2d0979] transition-colors cursor-pointer">
            Join Free
          </button> -->
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInstallPrompt } from '@/composables/useInstallPrompt'

const emit = defineEmits(['open-modal'])

const router = useRouter()
const route = useRoute()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)

const { promptInstall } = useInstallPrompt()

const handleRegisterClick = async () => {
  const result = await promptInstall()
  if (result !== 'dismissed' && result !== 'accepted') {
    router.push('/register')
  }
}

const handleRegisterClickMobile = async () => {
  mobileMenuOpen.value = false
  const result = await promptInstall()
  if (result !== 'dismissed' && result !== 'accepted') {
    router.push('/register')
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navigate = (id) => {
  if (route.name !== 'landing') {
    router.push({ path: '/', hash: `#${id}` })
  } else {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>
