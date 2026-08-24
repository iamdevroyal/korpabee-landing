<template>
  <Teleport to="body">
    <Transition name="banner-slide">
      <div
        v-if="visible && challenge"
        class="challenge-banner"
        :class="{ dismissed: isDismissed }"
        role="alert"
        aria-live="polite"
      >
        <!-- Left accent -->
        <div class="banner-accent"></div>

        <!-- Icon -->
        <div class="banner-icon">🏆</div>

        <!-- Text -->
        <div class="banner-text">
          <p class="banner-title">Challenge Ending {{ daysLeftLabel }}!</p>
          <p class="banner-sub">{{ challenge.title }}</p>
        </div>

        <!-- CTA -->
        <button class="banner-cta" @click="goToChallenges">View</button>

        <!-- Dismiss -->
        <button class="banner-dismiss" @click="dismiss" aria-label="Dismiss">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const props = defineProps({
  /** Route name to navigate to when CTA is clicked */
  challengeRoute: {
    type: String,
    default: 'savings-groups',
  },
})

const router    = useRouter()
const gameStore = useSavingsGameStore()

// Pick the most urgent challenge (fewest days left)
const challenge = computed(() =>
  [...gameStore.urgentChallenges].sort((a, b) => a.days_left - b.days_left)[0] ?? null
)

const daysLeftLabel = computed(() => {
  const d = challenge.value?.days_left ?? 0
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return `in ${d} Days`
})

const isDismissed = ref(false)
const STORAGE_KEY = 'challenge_banner_dismissed_id'

const visible = computed(() => {
  if (!challenge.value || isDismissed.value) return false
  return true
})

function dismiss() {
  isDismissed.value = true
  // Remember dismissal per challenge ID for this session
  try {
    sessionStorage.setItem(STORAGE_KEY, String(challenge.value?.id))
  } catch (_) { /* ignore */ }
}

function goToChallenges() {
  router.push({ name: props.challengeRoute })
  dismiss()
}

onMounted(() => {
  // Auto-restore dismiss state from session
  try {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed && challenge.value && dismissed === String(challenge.value.id)) {
      isDismissed.value = true
    }
  } catch (_) { /* ignore */ }

  // Also pre-load challenges if not yet fetched
  gameStore.fetchActiveChallenges()
})
</script>

<style scoped>
.challenge-banner {
  position: fixed;
  bottom: 90px;              /* above bottom nav bar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 700;
  width: calc(100% - 32px);
  max-width: 480px;

  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px 12px 16px;
  border-radius: 20px;
  overflow: hidden;

  background: linear-gradient(135deg, #1A1535, #2D2060);
  border: 1.5px solid rgba(99,102,241,0.3);
  box-shadow: 0 8px 32px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.2);

  pointer-events: all;
}

/* Left accent glow bar */
.banner-accent {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #FBBF24, #F59E0B);
  border-radius: 99px;
}

.banner-icon {
  font-size: 22px;
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(251,191,36,0.4));
}

.banner-text { flex: 1; min-width: 0; }

.banner-title {
  font-size: 12px; font-weight: 900; color: #FBBF24;
  margin: 0 0 1px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}

.banner-sub {
  font-size: 11px; color: rgba(255,255,255,0.65);
  font-weight: 600; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.banner-cta {
  padding: 7px 14px;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  border: none; border-radius: 12px;
  color: #1A1535; font-size: 11px; font-weight: 900;
  cursor: pointer; flex-shrink: 0;
  transition: opacity 0.18s;
}
.banner-cta:hover { opacity: 0.9; }

.banner-dismiss {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.1);
  border: none; border-radius: 8px;
  color: rgba(255,255,255,0.5);
  cursor: pointer; flex-shrink: 0;
  transition: all 0.18s;
}
.banner-dismiss:hover { background: rgba(255,255,255,0.18); color: #fff; }

/* Transition */
.banner-slide-enter-active, .banner-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.banner-slide-enter-from, .banner-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.95);
}
</style>
