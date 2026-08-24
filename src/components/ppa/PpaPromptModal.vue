<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-none">
        <div class="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden">
          
          <!-- Top Decorative Glow -->
          <div class="absolute -top-12 inset-x-0 h-24 bg-gradient-to-b from-violet-600/30 to-transparent blur-xl pointer-events-none"></div>

          <!-- Icon Badge -->
          <div class="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mx-auto mb-4 flex items-center justify-center text-3xl shadow-inner">
            🏢
          </div>

          <h3 class="text-white font-bold text-xl sm:text-2xl mb-2">
            Do you have a PPA?
          </h3>
          <p class="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
            Help future corpers by sharing details about your Place of Primary Assignment! Your contribution makes NYSC deployment easier for everyone.
          </p>

          <div class="space-y-3">
            <button
              @click="$emit('yes')"
              class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-violet-600/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <span>✨ Yes, I have a PPA</span>
            </button>

            <button
              @click="$emit('need-ppa')"
              class="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <span>🙋 No, I need a PPA</span>
            </button>

            <button
              @click="$emit('skip')"
              class="text-slate-500 hover:text-slate-400 text-xs font-medium pt-2 block w-full transition-colors"
            >
              Skip for now
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: { type: Boolean, default: false },
})

defineEmits(['yes', 'need-ppa', 'skip'])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
