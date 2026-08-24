<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click="emit('close')">
        <div class="relative w-full max-w-lg bg-white dark:bg-navy-900 rounded-2xl shadow-2xl overflow-hidden border border-navy-100 dark:border-navy-800 flex flex-col" @click.stop>
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-navy-100 dark:border-navy-800 bg-gray-50/50 dark:bg-navy-950/50">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-sm font-bold text-navy-900 dark:text-white">Shared Location</h3>
                <p class="text-[11px] text-gray-500 dark:text-navy-400 font-mono">
                  {{ location?.latitude }}, {{ location?.longitude }}
                </p>
              </div>
            </div>
            <button @click="emit('close')" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Map Body -->
          <div class="relative w-full h-[320px] sm:h-[380px] bg-gray-100 dark:bg-navy-950">
            <iframe
              v-if="location?.latitude && location?.longitude"
              class="w-full h-full border-none"
              :src="embedSrc"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Shared location map"
            ></iframe>
          </div>

          <!-- Footer Action -->
          <div class="px-5 py-3.5 border-t border-navy-100 dark:border-navy-800 bg-gray-50/50 dark:bg-navy-950/50 flex items-center justify-between">
            <span class="text-xs text-gray-500 dark:text-navy-400 font-medium">Interactive Map View</span>
            <a
              v-if="location?.mapsUrl"
              :href="location.mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm"
            >
              <span>Open in Google Maps</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  location: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const embedSrc = computed(() => {
  if (!props.location?.latitude || !props.location?.longitude) return ''
  return `https://maps.google.com/maps?q=${props.location.latitude},${props.location.longitude}&z=15&output=embed`
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
