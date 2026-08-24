<template>
  <!-- AdCountdownSkip: reusable countdown + skip button.
       Used by AdBreakOverlay (video ad break) and StoryAdSlot (buzz ads).

       - Uses requestAnimationFrame for accuracy (not setInterval).
       - Emits @skip-ready when countdown reaches zero.
       - Emits @skip when the user clicks the skip button.
       - If skippable=false, no skip button is ever shown. -->
  <div class="ad-countdown">
    <transition name="fade-in">
      <!-- Skip button — appears once countdown hits 0 -->
      <button
        v-if="skippable && skipsReady"
        class="ad-countdown__skip-btn"
        @click="onSkip"
        id="ad-skip-btn"
      >
        Skip Ad
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

      <!-- Countdown pill — shown while waiting -->
      <div v-else-if="skippable && !skipsReady" class="ad-countdown__pill">
        Skip in {{ remaining }}s
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  /** Seconds the user must watch before skip is offered */
  seconds:   { type: Number, default: 5 },
  /** Whether skipping is allowed at all */
  skippable: { type: Boolean, default: true },
})

const emit = defineEmits(['skip-ready', 'skip'])

const skipsReady = ref(false)
const remaining  = ref(props.seconds)

let rafId      = null
let startTime  = null

function tick(now) {
  if (!startTime) startTime = now
  const elapsed = (now - startTime) / 1000
  const left    = Math.max(0, props.seconds - elapsed)

  remaining.value = Math.ceil(left)

  if (left <= 0) {
    skipsReady.value = true
    emit('skip-ready')
    return // stop rAF loop
  }

  rafId = requestAnimationFrame(tick)
}

function onSkip() {
  if (skipsReady.value) {
    emit('skip')
  }
}

onMounted(() => {
  if (props.skippable && props.seconds > 0) {
    rafId = requestAnimationFrame(tick)
  } else if (props.skippable) {
    // seconds = 0 means immediately skippable
    skipsReady.value = true
    emit('skip-ready')
  }
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.ad-countdown {
  position: absolute;
  bottom: 16px;
  right: 12px;
  z-index: 20;
}

.ad-countdown__skip-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: #111;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  transition: background 0.15s, transform 0.1s;
}
.ad-countdown__skip-btn:hover {
  background: #fff;
  transform: scale(1.03);
}

.ad-countdown__pill {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.fade-in-enter-active { transition: opacity 0.3s ease; }
.fade-in-enter-from   { opacity: 0; }
</style>
