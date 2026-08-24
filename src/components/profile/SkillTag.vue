<template>
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-50 text-navy-800 border border-navy-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-200 transition-colors duration-200">
    {{ name }}
  </span>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
