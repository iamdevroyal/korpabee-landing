<template>
  <span
    v-if="type"
    :class="[
      'inline-flex items-center justify-center rounded-full p-0.5 border shadow-sm',
      badgeStyles[type] || badgeStyles.corper_verified
    ]"
    :title="badgeTitles[type] || 'Verified'"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M6.267 3.585a2 2 0 012.986-2.072 2 2 0 013.494 0 2 2 0 012.986 2.072 2 2 0 010 3.494 2 2 0 01-2.986 2.072 2 2 0 01-3.494 0 2 2 0 01-2.986-2.072 2 2 0 010-3.494zM12.293 8.293a1 1 0 011.414 0L17 11.586l-1.293 1.293a1 1 0 01-1.414 0L12 10.586l-2.293 2.293a1 1 0 01-1.414 0L7 11.586l3.293-3.293a1 1 0 011.414 0z" clip-rule="evenodd" />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'corper_verified'
  }
})

const badgeStyles = {
  corper_verified: 'bg-indigo-500 text-white border-indigo-400',
  ppa_verified: 'bg-navy-700 text-white border-navy-600',
  admin_verified: 'bg-gold-500 text-white border-gold-400',
  business_verified: 'bg-gold-500 text-white border-gold-400'
}

const badgeTitles = {
  corper_verified: 'Verified Corper',
  ppa_verified: 'PPA Verified',
  admin_verified: 'KorpaBee Admin',
  business_verified: 'Verified Business'
}
</script>
