<template>
  <router-link
    :to="{ path: '/search', query: { q: '#' + name, type: 'posts' } }"
    class="inline-flex items-center text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200"
  >
    #{{ name }}
  </router-link>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
