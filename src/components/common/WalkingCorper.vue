<template>
  <div 
    ref="containerRef"
    class="walking-corper-container absolute inset-0 pointer-events-none overflow-visible select-none z-0"
    aria-hidden="true"
  >
    <!-- Character Movement Track -->
    <div
      class="corper-mover absolute transition-transform ease-in-out will-change-transform pointer-events-auto cursor-pointer"
      :style="moverStyle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <!-- Speech Bubble (pops up when pausing or clicked) -->
      <transition name="bubble-pop">
        <div 
          v-if="currentSpeech" 
          class="speech-bubble absolute -top-12 left-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md text-[#1f1635] text-[11px] font-black px-3 py-1.5 rounded-2xl shadow-lg border border-[#3c0ca0]/20 flex items-center gap-1.5 z-20 pointer-events-none"
          :style="{ transform: `translate(-50%, 0) scaleX(${facing})` }"
        >
          <span>{{ currentSpeech }}</span>
          <div class="speech-tail absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/95 border-b border-r border-[#3c0ca0]/20 rotate-45"></div>
        </div>
      </transition>

      <!-- Sparkle Emoji on Click -->
      <transition name="sparkle-rise">
        <div 
          v-if="sparkle" 
          class="absolute -top-16 left-1/2 text-2xl z-30 pointer-events-none animate-float-up"
          :style="{ transform: `translate(-50%, 0) scaleX(${facing})` }"
        >
          {{ sparkle }}
        </div>
      </transition>

      <!-- Walking Character Entity -->
      <div 
        class="corper-body relative flex flex-col items-center"
        :class="{
          'is-striding': isWalking && !isPaused,
          'is-saluting': isInteracting,
          'is-idle': !isWalking && !isInteracting
        }"
      >
        <!-- Animated 6-Frame Walk Cycle Sprite (Real Walking Legs) -->
        <div class="corper-sprite-frame relative overflow-hidden drop-shadow-[0_8px_16px_rgba(60,12,160,0.18)]">
          <div 
            class="corper-sprite"
            :class="{ 'animating-walk': isWalking && !isPaused }"
          ></div>
        </div>

        <!-- Soft Ground Contact Shadow -->
        <div 
          class="ground-shadow w-16 sm:w-20 h-3 bg-navy-950/20 rounded-full blur-[3px] -mt-1 transition-all duration-300"
          :class="{ 'shadow-stride': isWalking && !isPaused }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const containerRef = ref(null)

// Position & Kinematics state
const currentPos = ref({ x: 10, y: 15 })
const targetPos = ref({ x: 10, y: 15 })
const facing = ref(1) // 1 = right, -1 = left
const isWalking = ref(false)
const isPaused = ref(false)
const isInteracting = ref(false)
const moveDuration = ref(3.5) // seconds

// Dialogue & Micro-interaction state
const currentSpeech = ref('')
const sparkle = ref('')
let speechTimer = null
let moveTimeout = null
let interactionTimer = null

const speechPhrases = [
  'Corper wee! 🇳🇬',
  'Allawee loading... 💳',
  'At ease, Otunba! 😎',
  'Connect Faster! ✨',
  'Camp was movie! 🍿',
  'POP in a bit! 🎓',
  'Serving with smiles! 🌟',
  'KorpaBee active! 🐝'
]

// Waypoint boundary inside the Left Hero area
// Positions are expressed in percentage relative to container
const WAYPOINTS = [
  { x: 5, y: 5 },    // Top-left behind brand badge
  { x: 35, y: -2 },  // Top-center behind first line
  { x: 68, y: 12 },  // Peeking behind "Service Year"
  { x: 42, y: 28 },  // Behind "Connect Faster"
  { x: 12, y: 35 },  // Left middle
  { x: 58, y: 45 },  // Behind subtitle right side
  { x: 22, y: 58 },  // Above CTA buttons
  { x: 75, y: 30 },  // Far right edge near phone mockup
  { x: 8, y: 20 },   // Left of heading
]

let lastWaypointIdx = 0

// Computed CSS positioning for smooth continuous movement across container
const moverStyle = computed(() => {
  return {
    left: `${currentPos.value.x}%`,
    top: `${currentPos.value.y}%`,
    transform: `scaleX(${facing.value})`,
    transformOrigin: 'center bottom',
    transition: isWalking.value && !isPaused.value
      ? `left ${moveDuration.value}s cubic-bezier(0.42, 0, 0.58, 1), top ${moveDuration.value}s cubic-bezier(0.42, 0, 0.58, 1)`
      : 'left 0.4s ease-out, top 0.4s ease-out'
  }
})

// Calculate distance & natural walking duration
function getNextWaypoint() {
  let nextIdx
  do {
    nextIdx = Math.floor(Math.random() * WAYPOINTS.length)
  } while (nextIdx === lastWaypointIdx)
  
  lastWaypointIdx = nextIdx
  return WAYPOINTS[nextIdx]
}

function walkToNextWaypoint() {
  if (isInteracting.value || isPaused.value) return

  const next = getNextWaypoint()
  const dx = next.x - currentPos.value.x
  const dy = next.y - currentPos.value.y
  const distance = Math.hypot(dx, dy)

  // Determine direction to face based on horizontal movement
  if (Math.abs(dx) > 3) {
    facing.value = dx > 0 ? 1 : -1
  }

  // Realistic human walking speed: ~18-24 percentage units per second
  const speed = 14 + Math.random() * 6
  const duration = Math.max(2.2, Math.min(5.5, distance / speed))
  moveDuration.value = Number(duration.toFixed(2))

  // Begin stride
  isWalking.value = true
  targetPos.value = next
  currentPos.value = next

  // Schedule arrival
  clearTimeout(moveTimeout)
  moveTimeout = setTimeout(() => {
    // Arrived at waypoint
    isWalking.value = false

    // 35% chance to show speech bubble on idle pause
    if (Math.random() < 0.35 && !currentSpeech.value) {
      triggerSpeech(speechPhrases[Math.floor(Math.random() * speechPhrases.length)], 2600)
    }

    // Pause for 1.2s to 3.2s before next journey
    const idlePause = 1400 + Math.random() * 2000
    moveTimeout = setTimeout(() => {
      walkToNextWaypoint()
    }, idlePause)
  }, duration * 1000)
}

function triggerSpeech(text, durationMs = 2800) {
  currentSpeech.value = text
  clearTimeout(speechTimer)
  speechTimer = setTimeout(() => {
    currentSpeech.value = ''
  }, durationMs)
}

function handleMouseEnter() {
  // Gentle slow down or wave
  if (!isInteracting.value) {
    triggerSpeech('Hey there! 👋', 2200)
  }
}

function handleMouseLeave() {
  // Resume natural walking after speech clears
}

function handleClick() {
  // Interactive salute / cheer
  isInteracting.value = true
  isWalking.value = false
  clearTimeout(moveTimeout)

  // Floating celebratory emoji
  const sparkles = ['🇳🇬', '✨', '🎖️', '🔥', '🎉', '💪']
  sparkle.value = sparkles[Math.floor(Math.random() * sparkles.length)]

  triggerSpeech(speechPhrases[Math.floor(Math.random() * speechPhrases.length)], 3000)

  // Play audio whistle if available and user interaction allows
  try {
    const audio = new Audio('/src/assets/whistle.wav')
    audio.volume = 0.25
    audio.play().catch(() => {})
  } catch (e) {
    // Audio autoplay restrictions or missing file handled gracefully
  }

  clearTimeout(interactionTimer)
  interactionTimer = setTimeout(() => {
    isInteracting.value = false
    sparkle.value = ''
    walkToNextWaypoint()
  }, 2800)
}

// Pause animation if document is hidden to conserve battery
function handleVisibilityChange() {
  if (document.hidden) {
    isPaused.value = true
    clearTimeout(moveTimeout)
  } else {
    isPaused.value = false
    walkToNextWaypoint()
  }
}

onMounted(() => {
  // Start walking cycle after a brief initial entrance delay
  document.addEventListener('visibilitychange', handleVisibilityChange)
  moveTimeout = setTimeout(() => {
    walkToNextWaypoint()
  }, 800)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  clearTimeout(moveTimeout)
  clearTimeout(speechTimer)
  clearTimeout(interactionTimer)
})
</script>

<style scoped>
/* ── 6-Frame Walk Cycle Sprite (Real Walking Legs) ── */
.corper-sprite-frame {
  --frame-w: 80px;
  --frame-h: 205px;
  width: var(--frame-w);
  height: var(--frame-h);
}

@media (min-width: 640px) {
  .corper-sprite-frame {
    --frame-w: 96px;
    --frame-h: 247px;
  }
}

.corper-sprite {
  width: calc(var(--frame-w) * 6);
  height: var(--frame-h);
  background-image: url('@/assets/corper_walk_spritesheet.png');
  background-size: calc(var(--frame-w) * 6) var(--frame-h);
  background-repeat: no-repeat;
  background-position: 0 0;
  will-change: transform;
}

/* Steps(6) cycles through all 6 walking frames in real time */
.animating-walk {
  animation: walk-frames 0.76s steps(6) infinite;
}

@keyframes walk-frames {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(calc(-1 * var(--frame-w) * 6), 0, 0);
  }
}

/* Subtle torso walking bob (natural human gait, no hopping) */
.is-striding {
  animation: corper-stride 0.38s ease-in-out infinite alternate;
  transform-origin: bottom center;
}

@keyframes corper-stride {
  0% {
    transform: translateY(0px) rotate(-0.5deg);
  }
  50% {
    transform: translateY(-2px) rotate(0deg);
  }
  100% {
    transform: translateY(0px) rotate(0.5deg);
  }
}

/* Ground shadow breathing during walk */
.shadow-stride {
  animation: shadow-pulse 0.44s ease-in-out infinite alternate;
}

@keyframes shadow-pulse {
  0% {
    transform: scale(1);
    opacity: 0.35;
  }
  50% {
    transform: scale(0.75);
    opacity: 0.18;
  }
  100% {
    transform: scale(1);
    opacity: 0.35;
  }
}

/* ── Idle Animation ── */
.is-idle {
  animation: corper-idle 2.4s ease-in-out infinite;
  transform-origin: bottom center;
}

@keyframes corper-idle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-3px) rotate(0.8deg);
  }
}

/* ── Saluting / Cheering Reaction ── */
.is-saluting {
  animation: corper-salute 0.5s ease-out forwards;
}

@keyframes corper-salute {
  0% {
    transform: scale(1) translateY(0);
  }
  40% {
    transform: scale(1.12) translateY(-10px);
  }
  70% {
    transform: scale(1.05) translateY(-4px);
  }
  100% {
    transform: scale(1.08) translateY(-6px);
  }
}

/* ── Speech Bubble Transitions ── */
.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bubble-pop-enter-from,
.bubble-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px) scale(0.8);
}

/* ── Sparkle Floating Up ── */
@keyframes float-up {
  0% {
    opacity: 0;
    transform: translate(-50%, 8px) scale(0.6);
  }
  30% {
    opacity: 1;
    transform: translate(-50%, -10px) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -36px) scale(1.4);
  }
}

.animate-float-up {
  animation: float-up 1.6s ease-out forwards;
}
</style>
