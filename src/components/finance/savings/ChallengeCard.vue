<template>
  <div class="challenge-card" :class="`type-${challenge.type}`">
    <!-- Status ribbon -->
    <div class="status-ribbon" :class="challenge.status">
      {{ statusLabel }}
    </div>

    <!-- Header -->
    <div class="card-header">
      <div class="challenge-icon">{{ typeIcon }}</div>
      <div class="challenge-meta">
        <h4 class="challenge-title">{{ challenge.title }}</h4>
        <div class="challenge-group" v-if="challenge.group">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {{ challenge.group.name }}
        </div>
      </div>
      <!-- Days left badge -->
      <div class="days-left" :class="{ urgent: challenge.days_left <= 3, ended: challenge.status === 'ended' }">
        <template v-if="challenge.status === 'ended'">Done</template>
        <template v-else>
          <span class="days-num">{{ challenge.days_left }}</span>
          <span class="days-label">day{{ challenge.days_left !== 1 ? 's' : '' }}</span>
        </template>
      </div>
    </div>

    <!-- Description -->
    <p v-if="challenge.description" class="challenge-desc">{{ challenge.description }}</p>

    <!-- Type explainer pill -->
    <div class="type-pill">
      <span class="type-dot"></span>
      {{ typeLabel }}
    </div>

    <!-- Date range -->
    <div class="date-range">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      {{ formatDate(challenge.starts_at) }} → {{ formatDate(challenge.ends_at) }}
    </div>

    <!-- My participation row -->
    <div v-if="challenge.my_participation" class="my-participation">
      <div class="participation-item">
        <span class="pi-label">Status</span>
        <span class="pi-value" :class="{ ineligible: !challenge.my_participation.eligible }">
          {{ challenge.my_participation.eligible ? 'Eligible ✓' : 'Ineligible ✗' }}
        </span>
      </div>
      <div v-if="challenge.my_participation.final_rank" class="participation-item">
        <span class="pi-label">Your Rank</span>
        <span class="pi-value rank">#{{ challenge.my_participation.final_rank }}</span>
      </div>
      <div v-if="challenge.my_participation.reward_granted" class="participation-item">
        <span class="pi-value reward-granted">🎁 Reward received!</span>
      </div>
    </div>

    <!-- Rewards preview -->
    <div v-if="challenge.rewards?.length" class="rewards-row">
      <div
        v-for="reward in challenge.rewards.slice(0, 3)"
        :key="reward.rank"
        class="reward-chip"
        :class="`rank-${reward.rank}`"
      >
        <span class="reward-rank">{{ rankEmoji(reward.rank) }}</span>
        <span class="reward-val">{{ formatReward(reward) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  challenge: { type: Object, required: true },
})

const typeLabel = computed(() => ({
  highest_saver:   'Highest total saved',
  streak_champion: 'Longest streak',
  most_consistent: 'Most qualifying days',
})[props.challenge.type] ?? props.challenge.type)

const typeIcon = computed(() => ({
  highest_saver:   '💰',
  streak_champion: '🔥',
  most_consistent: '📅',
})[props.challenge.type] ?? '🏆')

const statusLabel = computed(() => ({
  active:    'LIVE',
  upcoming:  'SOON',
  ended:     'ENDED',
  cancelled: 'CANCELLED',
})[props.challenge.status] ?? props.challenge.status.toUpperCase())

function rankEmoji(rank) {
  return ['🥇','🥈','🥉'][rank - 1] ?? `#${rank}`
}

function formatReward(reward) {
  if (reward.reward_type === 'wallet_credit') return `₦${Number(reward.reward_value).toLocaleString()}`
  if (reward.reward_type === 'points_bonus')  return `+${reward.reward_value.toFixed(0)} pts`
  if (reward.reward_type === 'badge')          return '🏅 Badge'
  return reward.description ?? reward.reward_type
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.challenge-card {
  position: relative;
  background: #fff;
  border-radius: 24px;
  border: 1.5px solid rgba(99,102,241,0.09);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(99,102,241,0.04);
  transition: all 0.2s;
}

.challenge-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.08); }

/* Left accent stripe by type */
.challenge-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  border-radius: 24px 0 0 24px;
}
.type-highest_saver::before   { background: linear-gradient(180deg, #10B981, #059669); }
.type-streak_champion::before { background: linear-gradient(180deg, #F97316, #EA580C); }
.type-most_consistent::before { background: linear-gradient(180deg, #6366F1, #4F46E5); }

/* Status ribbon */
.status-ribbon {
  position: absolute;
  top: 12px; right: -8px;
  font-size: 9px; font-weight: 900;
  padding: 3px 12px;
  border-radius: 99px 0 0 99px;
  letter-spacing: 0.6px;
}
.status-ribbon.active    { background: #D1FAE5; color: #047857; }
.status-ribbon.upcoming  { background: #FEF3C7; color: #B45309; }
.status-ribbon.ended     { background: #F1F5F9; color: #94A3B8; }
.status-ribbon.cancelled { background: #FEF2F2; color: #EF4444; }

/* Header */
.card-header {
  display: flex; align-items: flex-start; gap: 10px; padding-right: 40px;
}

.challenge-icon {
  width: 40px; height: 40px; border-radius: 14px;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}

.challenge-meta { flex: 1; min-width: 0; }
.challenge-title { font-size: 14px; font-weight: 900; color: #1A1535; margin: 0 0 3px; }
.challenge-group {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; color: #A8A4C4; font-weight: 600;
}

.days-left {
  display: flex; flex-direction: column; align-items: center;
  background: #EEF2FF; border-radius: 10px; padding: 5px 10px;
  flex-shrink: 0; min-width: 44px;
}
.days-left.urgent { background: #FEF2F2; }
.days-left.ended  { background: #F1F5F9; font-size: 10px; font-weight: 700; color: #94A3B8; }
.days-num  { font-size: 16px; font-weight: 900; color: #6366F1; line-height: 1; }
.days-left.urgent .days-num { color: #EF4444; }
.days-label { font-size: 9px; font-weight: 700; color: #A8A4C4; text-transform: uppercase; }

/* Description */
.challenge-desc {
  font-size: 12px; color: #64748B; margin: 0; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Type pill */
.type-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 99px;
  font-size: 10px; font-weight: 800;
  background: #EEF2FF; color: #6366F1;
  align-self: flex-start;
}
.type-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #6366F1;
}

/* Date range */
.date-range {
  display: flex; align-items: center; gap: 4px;
  font-size: 10px; color: #94A3B8; font-weight: 600;
}

/* Participation */
.my-participation {
  display: flex; gap: 10px; flex-wrap: wrap;
  padding: 10px; background: #F8F7FF;
  border-radius: 12px;
}
.participation-item { display: flex; flex-direction: column; gap: 2px; }
.pi-label { font-size: 9px; font-weight: 700; color: #A8A4C4; text-transform: uppercase; }
.pi-value { font-size: 12px; font-weight: 800; color: #1A1535; }
.pi-value.ineligible { color: #EF4444; }
.pi-value.rank { color: #6366F1; }
.pi-value.reward-granted { color: #10B981; font-size: 12px; }

/* Rewards row */
.rewards-row { display: flex; gap: 6px; }
.reward-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: 10px;
  font-size: 11px; font-weight: 700;
}
.reward-chip.rank-1 { background: rgba(250,204,21,0.15); color: #B45309; }
.reward-chip.rank-2 { background: rgba(148,163,184,0.15); color: #475569; }
.reward-chip.rank-3 { background: rgba(217,119,6,0.12);  color: #92400E; }

.reward-rank { font-size: 14px; }
.reward-val  { font-size: 11px; font-weight: 800; }
</style>
