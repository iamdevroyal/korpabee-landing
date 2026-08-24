<template>
  <span
    v-if="tier"
    :class="[
      'inline-flex items-center justify-center rounded-full p-0.5 border shadow-sm',
      badgeStyles[tier] || badgeStyles.lite
    ]"
    :title="badgeTitles[tier] || 'Verified'"
  >
    <!-- Lite: clean circular check -->
    <svg
      v-if="tier === 'lite'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-3 w-3"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>

    <!-- Pro: faceted gem-check, more premium weight -->
    <svg
      v-else-if="tier === 'pro'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-3 w-3"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6 2.5L2 7l8 10.5L18 7l-4-4.5H6z" opacity="0.35" />
      <path d="M6 2.5L2 7h16l-4-4.5H6z" opacity="0.6" />
      <path
        fill-rule="evenodd"
        d="M13.207 8.293a1 1 0 00-1.414 0L9 11.086 7.707 9.793a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </span>
</template>

<script setup>
defineProps({
  tier: {
    type: String,
    default: 'lite'
  }
})

const badgeStyles = {
  lite: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400',
  pro: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-400'
}

const badgeTitles = {
  lite: 'Verified Lite',
  pro: 'Verified Pro'
}
</script>