<template>
  <div class="relative flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="absolute inset-0 transform -rotate-90 pointer-events-none"
    >
      <defs>
        <linearGradient :id="`story-ring-grad-${instanceId}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="50%" stop-color="#ec4899" />
          <stop offset="100%" stop-color="#f43f5e" />
        </linearGradient>
      </defs>

      <!-- Single story: solid circle -->
      <circle
        v-if="count <= 1"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="hasUnviewed ? `url(#story-ring-grad-${instanceId})` : '#475569'"
        :stroke-width="strokeWidth"
      />

      <!-- Multiple stories: segmented arcs -->
      <template v-else>
        <circle
          v-for="(seg, idx) in segments"
          :key="idx"
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="hasUnviewed ? `url(#story-ring-grad-${instanceId})` : '#475569'"
          :stroke-width="strokeWidth"
          :stroke-dasharray="`${seg.dashLen} ${seg.gapLen}`"
          :stroke-dashoffset="seg.offset"
          stroke-linecap="round"
        />
      </template>
    </svg>

    <!-- Slot for avatar image -->
    <div class="relative z-10 rounded-full overflow-hidden flex items-center justify-center bg-slate-800" :style="avatarStyle">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count:       { type: Number,  default: 1 },
  hasUnviewed: { type: Boolean, default: true },
  size:        { type: Number,  default: 64 },
  strokeWidth: { type: Number,  default: 2.5 },
})

const instanceId = Math.random().toString(36).substring(2, 7)

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth - 2) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const avatarStyle = computed(() => {
  const innerSize = props.size - (props.strokeWidth * 2) - 6
  return {
    width: `${innerSize}px`,
    height: `${innerSize}px`,
  }
})

const segments = computed(() => {
  if (props.count <= 1) return []

  const n = props.count
  const circ = circumference.value
  const gapAngle = Math.max(4, 14 - n) // dynamically adjust gap width based on segment count
  const gapLen = (gapAngle / 360) * circ
  const dashLen = (circ - (n * gapLen)) / n

  const list = []
  for (let i = 0; i < n; i++) {
    const offset = -i * (dashLen + gapLen)
    list.push({ dashLen, gapLen, offset })
  }
  return list
})
</script>
