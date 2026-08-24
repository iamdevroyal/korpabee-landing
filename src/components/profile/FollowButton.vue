<template>
  <button
    @click.stop="toggleFollow"
    :disabled="loading"
    :class="[
      'px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center space-x-1 border',
      isFollowing
        ? 'bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-red-600 hover:border-red-300'
        : 'bg-gradient-to-r from-indigo-400 to-indigo-500 border-transparent text-white hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-teal-500/10'
    ]"
  >
    <template v-if="loading">
      <svg class="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </template>
    <template v-else>
      <span>{{ isFollowing ? 'Following' : 'Follow' }}</span>
    </template>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import { followUser, unfollowUser } from '@/api/user'

const props = defineProps({
  userUuid: {
    type: String,
    required: true
  },
  initialIsFollowing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:following'])

const isFollowing = ref(props.initialIsFollowing)
const loading = ref(false)

// Sync prop changes
watch(() => props.initialIsFollowing, (newVal) => {
  isFollowing.value = newVal
})

const toggleFollow = async () => {
  if (loading.value) return

  const originalState = isFollowing.value
  isFollowing.value = !originalState // Optimistic update
  emit('update:following', isFollowing.value)
  loading.value = true

  try {
    if (originalState) {
      await unfollowUser(props.userUuid)
    } else {
      await followUser(props.userUuid)
    }
  } catch (err) {
    // Revert state
    isFollowing.value = originalState
    emit('update:following', isFollowing.value)
    console.error('Failed to toggle follow status:', err)
  } finally {
    loading.value = false
  }
}
</script>
