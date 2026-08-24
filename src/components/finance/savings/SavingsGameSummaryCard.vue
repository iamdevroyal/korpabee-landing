<template>
  <div class="summary-card" :class="streakStatusClass">
    <!-- Flame + Streak -->
    <div class="streak-section">
      <div class="flame-wrap">
        <span class="flame-icon">🔥</span>
        <span class="streak-count">{{ currentStreak }}</span>
      </div>
      <div class="streak-meta">
        <p class="streak-label">Day Streak</p>
        <p class="streak-status-text" :class="streakStatusClass">
          {{ streakStatusLabel }}
        </p>
      </div>
    </div>

    <!-- Divider -->
    <div class="card-divider"></div>

    <!-- Today + Lifetime -->
    <div class="score-section">
      <div class="score-item">
        <span class="score-value">{{ formatScore(todayScore) }}</span>
        <span class="score-label">Today</span>
      </div>
      <div class="score-sep"></div>
      <div class="score-item">
        <span class="score-value">{{ formatScore(lifetimeScore) }}</span>
        <span class="score-label">Lifetime</span>
      </div>
    </div>

    <!-- Milestone progress bar -->
    <div v-if="nextMilestone" class="milestone-wrap">
      <div class="milestone-bar-track">
        <div
          class="milestone-bar-fill"
          :style="{ width: milestoneProgress + '%' }"
        ></div>
      </div>
      <p class="milestone-label">
        <span v-if="daysToMilestone === 0">🎉 Milestone reached!</span>
        <span v-else>{{ daysToMilestone }} day{{ daysToMilestone === 1 ? '' : 's' }} to {{ nextMilestone }}-day bonus</span>
      </p>
    </div>

    <!-- Qualifying badge -->
    <div v-if="todayQualifying" class="qualifying-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Saved today ✓
    </div>
    <div v-else class="qualifying-badge not-yet">
      Save today to keep your streak!
    </div>

    <!-- Loading shimmer -->
    <div v-if="loading" class="shimmer-overlay"></div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const gameStore = useSavingsGameStore()

const currentStreak   = computed(() => gameStore.currentStreak)
const longestStreak   = computed(() => gameStore.longestStreak)
const todayScore      = computed(() => gameStore.todayScore)
const lifetimeScore   = computed(() => gameStore.lifetimeScore)
const todayQualifying = computed(() => gameStore.todayQualifying)
const daysToMilestone = computed(() => gameStore.daysToMilestone)
const nextMilestone   = computed(() => gameStore.nextMilestone)
const loading         = computed(() => gameStore.loading)

const milestoneProgress = computed(() => {
  if (!nextMilestone.value) return 0
  const prev = prevMilestone(nextMilestone.value)
  const span  = nextMilestone.value - prev
  const done  = currentStreak.value - prev
  return Math.min(100, Math.round((done / span) * 100))
})

const streakStatusClass = computed(() => {
  const s = gameStore.streakStatus
  if (s === 'broken') return 'status-broken'
  if (s === 'frozen') return 'status-frozen'
  return 'status-active'
})

const streakStatusLabel = computed(() => {
  const s = gameStore.streakStatus
  if (s === 'broken') return 'Streak broken'
  if (s === 'frozen')  return 'Grace day used'
  return 'On fire!'
})

function prevMilestone(next) {
  const milestones = [0, 7, 14, 30, 60, 90]
  const idx = milestones.indexOf(next)
  return idx > 0 ? milestones[idx - 1] : 0
}

function formatScore(val) {
  const n = parseFloat(val) || 0
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000)    return (n / 1000).toFixed(1) + 'K'
  return n.toFixed(0)
}

onMounted(() => gameStore.fetchSummary())
</script>

<style scoped>
.summary-card {
  position: relative;
  background: linear-gradient(135deg, #1A1535 0%, #2D1B6E 100%);
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.25);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: -40px; right: -40px;
  width: 160px; height: 160px;
  background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

/* Streak */
.streak-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.flame-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.flame-icon {
  font-size: 32px;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(251,146,60,0.6));
  animation: flame-pulse 2s ease-in-out infinite;
}

@keyframes flame-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1) rotate(-3deg); }
}

.streak-count {
  font-size: 36px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -1px;
  line-height: 1;
}

.streak-meta { flex: 1; }

.streak-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin: 0;
}

.streak-status-text {
  font-size: 13px;
  font-weight: 700;
  margin: 2px 0 0;
}

.streak-status-text.status-active { color: #4ADE80; }
.streak-status-text.status-frozen { color: #FCD34D; }
.streak-status-text.status-broken { color: #F87171; }

/* Divider */
.card-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
}

/* Scores */
.score-section {
  display: flex;
  align-items: center;
  gap: 0;
}

.score-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-value {
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.5px;
}

.score-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.score-sep {
  width: 1px;
  height: 36px;
  background: rgba(255,255,255,0.1);
  margin: 0 12px;
}

/* Milestone */
.milestone-wrap { display: flex; flex-direction: column; gap: 6px; }

.milestone-bar-track {
  height: 5px;
  background: rgba(255,255,255,0.12);
  border-radius: 99px;
  overflow: hidden;
}

.milestone-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #A78BFA, #7C3AED);
  border-radius: 99px;
  transition: width 0.6s ease;
}

.milestone-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  margin: 0;
  text-align: right;
}

/* Qualifying badge */
.qualifying-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(74,222,128,0.15);
  color: #4ADE80;
  border: 1px solid rgba(74,222,128,0.25);
  align-self: flex-start;
}

.qualifying-badge.not-yet {
  background: rgba(251,146,60,0.15);
  color: #FB923C;
  border-color: rgba(251,146,60,0.25);
}

/* Shimmer overlay */
.shimmer-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
  background-size: 200%;
  animation: shimmer 1.5s infinite;
  border-radius: 24px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
