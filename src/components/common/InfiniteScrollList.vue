<template>
  <div>
    <!-- Slotted list items -->
    <slot />

    <!-- Sentinel element for IntersectionObserver -->
    <div ref="sentinel" class="h-10 w-full flex items-center justify-center my-4">
      <div v-if="loading" class="flex items-center space-x-2 text-teal-600">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm font-medium">Loading more...</span>
      </div>
      <div v-else-if="!hasMore && showFinishedMessage" class="text-sm text-gray-400 font-medium">
        No more items to display.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInfiniteScroll } from '@/composables/useInfiniteScroll'

const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  hasMore: {
    type: Boolean,
    required: true
  },
  showFinishedMessage: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['load-more'])
const sentinel = ref(null)

// Initialize infinite scroll
useInfiniteScroll(sentinel, () => {
  if (props.hasMore && !props.loading) {
    emit('load-more')
  }
}, {
  disabled: !props.hasMore || props.loading
})
</script>
