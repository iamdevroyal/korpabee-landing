<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-navy-100/50"
    >
      <div class="p-4 flex-1 flex items-start space-x-3">
        <!-- Badge Type / Avatar -->
        <div class="flex-shrink-0 pt-0.5">
          <div class="h-10 w-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border border-teal-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
        
        <!-- Text details -->
        <div class="flex-1 w-0">
          <p class="text-sm font-bold text-navy-900">{{ title }}</p>
          <p class="mt-1 text-xs text-gray-500 leading-relaxed">{{ message }}</p>
        </div>
      </div>
      
      <!-- Close button -->
      <div class="flex border-l border-gray-100">
        <button
          @click="close"
          class="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-semibold text-gray-400 hover:text-navy-900 focus:outline-none transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Notification'
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 4000
  }
})

const emit = defineEmits(['close'])

const show = ref(true)

const close = () => {
  show.value = false
  emit('close')
}

onMounted(() => {
  setTimeout(() => {
    close()
  }, props.duration)
})
</script>
