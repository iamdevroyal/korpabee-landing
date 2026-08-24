<template>
  <div class="missions-section">
    <!-- Header with completion counter -->
    <div class="missions-header">
      <div>
        <h3 class="missions-title">🎯 Daily Missions</h3>
        <p class="missions-sub">Reset at midnight · Earn bonus points</p>
      </div>
      <div class="missions-counter" :class="{ 'all-done': allDone }">
        <span class="counter-done">{{ completedCount }}</span>
        <span class="counter-sep">/</span>
        <span class="counter-total">{{ total }}</span>
        <span class="counter-label">done</span>
      </div>
    </div>

    <!-- All done state -->
    <div v-if="allDone && !loading" class="all-done-banner">
      <span class="all-done-icon">🎉</span>
      <div>
        <p class="all-done-title">All missions complete!</p>
        <p class="all-done-sub">+{{ totalPtsEarned.toFixed(0) }} bonus points earned today. Come back tomorrow!</p>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-else-if="loading" class="missions-list">
      <div v-for="i in 3" :key="i" class="mission-skeleton"></div>
    </div>

    <!-- Mission rows -->
    <div v-else class="missions-list">
      <div
        v-for="mission in missions"
        :key="mission.id"
        class="mission-row"
        :class="{ 'is-complete': mission.completed }"
      >
        <!-- Left: icon -->
        <div class="mission-icon-wrap" :class="{ complete: mission.completed }">
          <span class="mission-icon">{{ mission.completed ? '✅' : mission.icon_emoji }}</span>
        </div>

        <!-- Middle: title + progress -->
        <div class="mission-body">
          <div class="mission-top-row">
            <p class="mission-title" :class="{ done: mission.completed }">{{ mission.title }}</p>
            <span class="mission-pts">+{{ mission.bonus_points.toFixed(0) }} pts</span>
          </div>
          <p class="mission-desc">{{ mission.description }}</p>

          <!-- Progress bar (only for amount/streak missions) -->
          <div v-if="showBar(mission)" class="mission-bar-track">
            <div
              class="mission-bar-fill"
              :class="{ complete: mission.completed }"
              :style="{ width: mission.progress_pct + '%' }"
            ></div>
          </div>

          <!-- Progress label -->
          <p v-if="mission.target_value > 1" class="mission-progress-label">
            <span v-if="mission.type === 'save_amount'">
              ₦{{ formatAmount(mission.progress_value) }} / ₦{{ formatAmount(mission.target_value) }}
            </span>
            <span v-else-if="mission.type === 'save_streak'">
              {{ mission.progress_value.toFixed(0) }} / {{ mission.target_value.toFixed(0) }} days
            </span>
          </p>
        </div>

        <!-- Right: status checkmark -->
        <div class="mission-status">
          <div v-if="mission.completed" class="checkmark-circle">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div v-else class="pending-circle"></div>
        </div>
      </div>
    </div>

    <!-- Refresh -->
    <button class="refresh-btn" @click="refresh" :disabled="loading">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
      Refresh missions
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const gameStore = useSavingsGameStore()

const loading        = computed(() => gameStore.loading)
const missions       = computed(() => gameStore.missions)
const completedCount = computed(() => gameStore.missionsCompletedCount)
const total          = computed(() => missions.value.length)
const allDone        = computed(() => total.value > 0 && completedCount.value === total.value)
const totalPtsEarned = computed(() =>
  missions.value.filter(m => m.completed).reduce((acc, m) => acc + m.bonus_points, 0)
)

function showBar(mission) {
  return ['save_amount', 'save_streak'].includes(mission.type)
}

function formatAmount(val) {
  const n = parseFloat(val) || 0
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toFixed(0)
}

async function refresh() {
  await gameStore.fetchTodaysMissions(true)
}

onMounted(() => gameStore.fetchTodaysMissions())
</script>

<style scoped>
.missions-section { display: flex; flex-direction: column; gap: 14px; }

/* Header */
.missions-header { display: flex; justify-content: space-between; align-items: flex-start; }
.missions-title { font-size: 16px; font-weight: 900; color: #1A1535; margin: 0; }
.missions-sub   { font-size: 11px; color: #A8A4C4; font-weight: 600; margin: 2px 0 0; }

.missions-counter {
  display: flex; align-items: baseline; gap: 1px;
  background: #F1F5F9; border-radius: 12px; padding: 6px 12px;
  flex-shrink: 0;
}
.missions-counter.all-done { background: #D1FAE5; }

.counter-done  { font-size: 18px; font-weight: 900; color: #10B981; }
.counter-sep   { font-size: 13px; font-weight: 600; color: #94A3B8; margin: 0 1px; }
.counter-total { font-size: 13px; font-weight: 700; color: #64748B; }
.counter-label { font-size: 9px; font-weight: 700; color: #94A3B8; text-transform: uppercase; margin-left: 4px; letter-spacing: 0.4px; }

/* All done banner */
.all-done-banner {
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
  border: 1.5px solid rgba(16,185,129,0.2);
  border-radius: 20px; padding: 16px;
}

.all-done-icon { font-size: 32px; }
.all-done-title { font-size: 14px; font-weight: 900; color: #047857; margin: 0 0 2px; }
.all-done-sub   { font-size: 11px; color: #065F46; font-weight: 600; margin: 0; }

/* Skeleton */
.missions-list { display: flex; flex-direction: column; gap: 10px; }
.mission-skeleton {
  height: 68px; border-radius: 16px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Mission row */
.mission-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1.5px solid rgba(99,102,241,0.07);
  border-radius: 18px;
  transition: all 0.2s;
}

.mission-row.is-complete {
  background: #F0FDF4;
  border-color: rgba(16,185,129,0.15);
}

/* Icon */
.mission-icon-wrap {
  width: 40px; height: 40px; border-radius: 14px;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.mission-icon-wrap.complete { background: rgba(16,185,129,0.12); }
.mission-icon { font-size: 20px; }

/* Body */
.mission-body { flex: 1; min-width: 0; }
.mission-top-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 6px; }

.mission-title {
  font-size: 13px; font-weight: 800; color: #1A1535; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mission-title.done { text-decoration: line-through; color: #94A3B8; }

.mission-pts {
  font-size: 11px; font-weight: 800; color: #6366F1;
  background: #EEF2FF; padding: 2px 7px; border-radius: 99px;
  flex-shrink: 0;
}

.mission-desc {
  font-size: 11px; color: #94A3B8; font-weight: 500;
  margin: 2px 0 6px; line-height: 1.4;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

/* Progress bar */
.mission-bar-track {
  height: 4px; background: #F1F5F9; border-radius: 99px;
  overflow: hidden; margin-bottom: 4px;
}

.mission-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366F1, #8B5CF6);
  border-radius: 99px;
  transition: width 0.5s ease;
}

.mission-bar-fill.complete {
  background: linear-gradient(90deg, #10B981, #059669);
}

.mission-progress-label {
  font-size: 10px; font-weight: 700; color: #A8A4C4; margin: 0;
}

/* Status */
.checkmark-circle {
  width: 24px; height: 24px; border-radius: 50%;
  background: #10B981; color: #fff;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.pending-circle {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px dashed rgba(99,102,241,0.25);
  flex-shrink: 0;
}

/* Refresh */
.refresh-btn {
  display: flex; align-items: center; gap: 5px;
  margin: 0 auto; padding: 7px 16px;
  border-radius: 99px; border: 1.5px solid rgba(99,102,241,0.15);
  background: transparent; color: #A8A4C4;
  font-size: 11px; font-weight: 700; cursor: pointer;
  transition: all 0.18s;
}
.refresh-btn:hover:not(:disabled) { color: #6366F1; border-color: rgba(99,102,241,0.3); }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
