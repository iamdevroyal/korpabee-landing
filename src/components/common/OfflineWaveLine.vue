<template>
  <transition name="wave-slide">
    <div v-if="!isOnline" class="offline-wave-bar" aria-hidden="true">
      <svg
        class="offline-wave-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 12"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          class="offline-wave-path"
          d="M0 6 C60 0, 120 12, 180 6 C240 0, 300 12, 360 6 C420 0, 480 12, 540 6 C600 0, 660 12, 720 6 C780 0, 840 12, 900 6 C960 0, 1020 12, 1080 6 C1140 0, 1200 12, 1260 6 C1320 0, 1380 12, 1440 6"
          stroke="#ef4444"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </transition>
</template>

<script setup>
import { useNetwork } from '@/composables/useNetwork'

const { isOnline } = useNetwork()
</script>

<style scoped>
/* Fixed at the absolute top of the viewport — zero layout impact */
.offline-wave-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 12px;
  z-index: 9999;
  pointer-events: none;   /* never intercepts clicks */
  overflow: hidden;
}

.offline-wave-svg {
  width: 200%;           /* 2× width so we can scroll it */
  height: 100%;
  animation: wave-scroll 3s linear infinite;
}

.offline-wave-path {
  stroke-dasharray: 20 4;
  animation: wave-dash 1.6s ease-in-out infinite alternate;
}

/* Scroll the doubled SVG so the wave appears to flow endlessly */
@keyframes wave-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Gently vary the dash offset so the wave "pulses" */
@keyframes wave-dash {
  from { stroke-dashoffset: 0;   opacity: 0.85; }
  to   { stroke-dashoffset: 24;  opacity: 1;    }
}

/* Slide in from the top — 10px travel, fast */
.wave-slide-enter-active,
.wave-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.wave-slide-enter-from,
.wave-slide-leave-to {
  transform: translateY(-12px);
  opacity: 0;
}
</style>
