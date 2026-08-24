<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      v-model="query"
      @input="onInput"
      :placeholder="placeholder"
      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-navy-100 bg-white/80 focus:bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm shadow-sm"
    />
    <button
      v-if="query"
      @click="clearSearch"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-navy-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...'
  },
  delay: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'clear'])
const query = ref('')
let timeout = null

const onInput = () => {
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', query.value)
  }, props.delay)
}

const clearSearch = () => {
  query.value = ''
  emit('clear')
  emit('search', '')
}
</script>
