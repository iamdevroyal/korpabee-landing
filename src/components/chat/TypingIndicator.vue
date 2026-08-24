<template>
  <div v-if="typingText" class="flex items-center space-x-2 px-4 py-2 text-xs text-gray-400 font-medium">
    <!-- Animated jumping dots -->
    <div class="flex space-x-1 items-center h-3">
      <div class="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
      <div class="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div class="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
    <span>{{ typingText }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
})

const typingText = computed(() => {
  if (props.users.length === 0) return ''
  if (props.users.length === 1) {
    return `${props.users[0]} is typing...`
  }
  if (props.users.length === 2) {
    return `${props.users[0]} and ${props.users[1]} are typing...`
  }
  return 'Several users are typing...'
})
</script>
