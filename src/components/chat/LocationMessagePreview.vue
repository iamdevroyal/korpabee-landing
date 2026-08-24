<template>
  <button
    type="button"
    @click="emit('open-map')"
    :class="[
      'location-preview-card group flex flex-col justify-between w-48 h-48 sm:w-52 sm:h-52 rounded-2xl p-4 transition-all duration-300 text-left relative overflow-hidden border shadow-sm select-none cursor-pointer',
      isMe
        ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
        : 'bg-gradient-to-br from-violet-50/80 to-teal-50/80 hover:from-violet-100/80 hover:to-teal-100/80 border-navy-100/80 text-navy-900 dark:bg-navy-800/80 dark:border-navy-700 dark:text-white'
    ]"
  >
    <!-- Map Graphic / Icon Header -->
    <div class="flex items-center justify-between w-full z-10">
      <div
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105',
          isMe ? 'bg-white/20 text-white' : 'bg-teal-500/15 text-teal-600 dark:text-teal-400'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>

      <!-- Expand / Map Badge -->
      <span
        :class="[
          'px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider',
          isMe ? 'bg-white/15 text-teal-100' : 'bg-teal-600/10 text-teal-700 dark:bg-teal-400/20 dark:text-teal-300'
        ]"
      >
        Map
      </span>
    </div>

    <!-- Center Pattern / Pin Highlight -->
    <div class="my-auto text-center z-10 py-1">
      <p :class="['text-sm font-extrabold tracking-tight', isMe ? 'text-white' : 'text-navy-900 dark:text-white']">
        Shared Location
      </p>
      <p :class="['text-[11px] font-mono mt-0.5 opacity-80 truncate', isMe ? 'text-teal-100' : 'text-navy-600 dark:text-navy-300']">
        {{ location.latitude.toFixed(4) }}, {{ location.longitude.toFixed(4) }}
      </p>
    </div>

    <!-- Footer CTA -->
    <div
      :class="[
        'flex items-center justify-between pt-2 border-t text-xs font-bold w-full z-10',
        isMe ? 'border-white/15 text-white' : 'border-navy-100 dark:border-navy-700/60 text-teal-600 dark:text-teal-400'
      ]"
    >
      <span>Tap to view map</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>

    <!-- Background Subtle Compass Overlay -->
    <div class="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-28 w-28 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    </div>
  </button>
</template>

<script setup>
defineProps({
  location: { type: Object, required: true },
  isMe: { type: Boolean, default: false },
})

const emit = defineEmits(['open-map'])
</script>
