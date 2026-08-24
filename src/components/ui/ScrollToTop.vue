<template>
  <transition name="fade">
    <button 
      v-if="show"
      @click="scrollToTop"
      class="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-primary/90 text-[#3c0ca0] shadow-lg shadow-primary/20 hover:bg-primary hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm border border-white/10"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon class="w-5 h-5" />
    </button>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUpIcon } from 'lucide-vue-next'

const show = ref(false)

const checkScroll = () => {
  show.value = window.scrollY > 500
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
