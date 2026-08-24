<template>
  <div class="group-wars">

    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="wars-header">
      <div class="wars-icon-wrap">
        <span class="wars-icon">⚔️</span>
      </div>
      <div>
        <h3 class="wars-title">Group Wars</h3>
        <p class="wars-sub">{{ scopeLabel }} competition</p>
      </div>
      <!-- Live rank badge -->
      <div v-if="liveRank" class="live-rank-badge">
        <span class="live-dot"></span>
        #{{ liveRank }} Live
      </div>
    </div>

    <!-- ── Loading ─────────────────────────────────────────────────────────── -->
    <div v-if="loading" class="wars-loading">
      <div class="spin-ring"></div>
      <p>Loading standings…</p>
    </div>

    <!-- ── Error ───────────────────────────────────────────────────────────── -->
    <div v-else-if="error" class="wars-empty">
      <p class="empty-icon">😞</p>
      <p class="empty-text">Couldn't load standings</p>
      <button class="retry-btn" @click="load">Try Again</button>
    </div>

    <!-- ── No data ─────────────────────────────────────────────────────────── -->
    <div v-else-if="noData" class="wars-empty">
      <p class="empty-icon">🌍</p>
      <p class="empty-text">No group competition data yet</p>
      <p class="empty-hint">Standings update each night after savings activity</p>
    </div>

    <!-- ── Standings ───────────────────────────────────────────────────────── -->
    <template v-else>
      <!-- Period tabs -->
      <div class="period-tabs">
        <button
          v-for="p in periods"
          :key="p.key"
          class="period-tab"
          :class="{ active: activePeriod === p.key }"
          @click="activePeriod = p.key"
        >{{ p.label }}</button>
      </div>

      <!-- Standings list for active period -->
      <div class="standings-list">
        <TransitionGroup name="row-slide" tag="div">
          <div
            v-for="row in activeStandings"
            :key="row.group_id"
            class="standing-row"
            :class="{
              'my-group': row.is_my_group,
              'top-three': row.rank <= 3
            }"
          >
            <!-- Rank -->
            <div class="rank-col">
              <span v-if="row.rank === 1" class="rank-medal gold">🥇</span>
              <span v-else-if="row.rank === 2" class="rank-medal silver">🥈</span>
              <span v-else-if="row.rank === 3" class="rank-medal bronze">🥉</span>
              <span v-else class="rank-num">#{{ row.rank }}</span>
            </div>

            <!-- Group info -->
            <div class="group-col">
              <p class="group-name" :class="{ 'is-mine': row.is_my_group }">
                {{ row.group_name }}
                <span v-if="row.is_my_group" class="you-tag">YOU</span>
              </p>
              <p class="group-meta">{{ row.member_count }} active member{{ row.member_count !== 1 ? 's' : '' }}</p>
            </div>

            <!-- Scores -->
            <div class="score-col">
              <p class="score-total">{{ formatScore(row.total_score) }}</p>
              <p class="score-avg">{{ formatScore(row.average_score) }}/member</p>
            </div>

            <!-- Trend arrow (simple: highlight own group) -->
            <div class="trend-col" v-if="row.is_my_group">
              <span class="trend-arrow up" title="Your group">▲</span>
            </div>
            <div class="trend-col" v-else></div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer note -->
      <p class="snapshot-note">
        📸 Rankings update nightly · Live rank updates every 24h
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { savingsGameApi } from '@/api/savingsGame.js'

const props = defineProps({
  groupUuid: {
    type: String,
    required: true,
  },
})

const loading      = ref(false)
const error        = ref(false)
const wars         = ref(null)
const activePeriod = ref('weekly')

const periods = [
  { key: 'weekly',  label: '📅 This Week' },
  { key: 'monthly', label: '🗓️ This Month' },
]

const noData = computed(() => {
  if (!wars.value) return false
  const d = wars.value[activePeriod.value]
  return !d || !d.standings || d.standings.length === 0
})

const activeStandings = computed(() => {
  return wars.value?.[activePeriod.value]?.standings ?? []
})

const liveRank = computed(() => wars.value?.live_weekly_rank ?? null)

const scopeLabel = computed(() => {
  const s = wars.value?.competitive_scope
  if (s === 'platoon')  return 'Platoon-level'
  if (s === 'state')    return 'State-level'
  if (s === 'national') return 'National'
  return 'Group'
})

function formatScore(val) {
  const n = parseFloat(val ?? 0)
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k pts'
  return n.toFixed(0) + ' pts'
}

async function load() {
  if (!props.groupUuid) return
  loading.value = true
  error.value   = false
  try {
    const res = await savingsGameApi.getGroupWars(props.groupUuid)
    wars.value = res.data ?? res
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => props.groupUuid, load)
</script>

<style scoped>
.group-wars { display: flex; flex-direction: column; gap: 14px; }

/* Header */
.wars-header {
  display: flex; align-items: center; gap: 12px;
}

.wars-icon-wrap {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.wars-icon { font-size: 22px; }

.wars-title { font-size: 15px; font-weight: 900; color: #1A1535; margin: 0; }
.wars-sub   { font-size: 11px; color: #A8A4C4; font-weight: 600; margin: 0; }

.live-rank-badge {
  margin-left: auto;
  display: flex; align-items: center; gap: 5px;
  background: #EEF2FF; border-radius: 99px;
  padding: 5px 10px; font-size: 11px; font-weight: 900; color: #4F46E5;
}

.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #10B981;
  animation: pulse-dot 1.5s ease infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(0.75); }
}

/* Loading / empty */
.wars-loading, .wars-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 0; color: #A8A4C4; gap: 8px; text-align: center;
}
.empty-icon { font-size: 36px; }
.empty-text { font-size: 13px; font-weight: 700; margin: 0; color: #94A3B8; }
.empty-hint { font-size: 11px; font-weight: 500; margin: 0; color: #CBD5E1; line-height: 1.5; }

.retry-btn {
  padding: 8px 18px; background: #EEF2FF;
  border: none; border-radius: 12px; color: #4F46E5; font-size: 12px; font-weight: 800;
  cursor: pointer; margin-top: 4px;
}

/* Period tabs */
.period-tabs {
  display: flex; gap: 6px;
  background: #EEECFB; padding: 4px; border-radius: 16px; width: max-content;
}

.period-tab {
  padding: 7px 14px; border-radius: 12px;
  font-size: 11px; font-weight: 700; color: #A8A4C4;
  border: none; background: transparent; cursor: pointer; transition: all 0.2s;
  white-space: nowrap;
}
.period-tab.active { background: #fff; color: #6366F1; box-shadow: 0 1px 6px rgba(99,102,241,0.12); }

/* Standings list */
.standings-list { display: flex; flex-direction: column; gap: 6px; }

/* Row */
.standing-row {
  display: flex; align-items: center; gap: 10px;
  background: #F8F7FF;
  border: 1.5px solid rgba(99,102,241,0.06);
  border-radius: 16px;
  padding: 11px 14px;
  transition: all 0.2s;
}

.standing-row.my-group {
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border-color: rgba(99,102,241,0.2);
  box-shadow: 0 2px 8px rgba(99,102,241,0.08);
}

.standing-row.top-three { border-color: rgba(245,158,11,0.2); }

/* Rank column */
.rank-col { width: 36px; flex-shrink: 0; text-align: center; }
.rank-medal { font-size: 22px; line-height: 1; }
.rank-num { font-size: 13px; font-weight: 900; color: #94A3B8; }

/* Group column */
.group-col { flex: 1; min-width: 0; }
.group-name {
  font-size: 13px; font-weight: 800; color: #1A1535; margin: 0 0 1px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.group-name.is-mine { color: #4F46E5; }
.you-tag {
  display: inline-block; font-size: 9px; font-weight: 900; color: #fff;
  background: #6366F1; border-radius: 6px; padding: 1px 5px; margin-left: 5px;
  vertical-align: middle;
}
.group-meta { font-size: 10px; color: #94A3B8; font-weight: 600; margin: 0; }

/* Score column */
.score-col { text-align: right; flex-shrink: 0; }
.score-total { font-size: 13px; font-weight: 900; color: #1A1535; margin: 0; }
.score-avg   { font-size: 10px; color: #94A3B8; font-weight: 600; margin: 0; }

/* Trend */
.trend-col { width: 16px; flex-shrink: 0; text-align: center; }
.trend-arrow.up { color: #10B981; font-size: 10px; }

/* Snapshot note */
.snapshot-note {
  font-size: 10px; color: #CBD5E1; font-weight: 500;
  text-align: center; margin: 0;
}

/* Spin ring */
.spin-ring {
  width: 24px; height: 24px;
  border: 3px solid rgba(99,102,241,0.15);
  border-top-color: #6366F1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Row slide transition */
.row-slide-enter-active, .row-slide-leave-active { transition: all 0.25s ease; }
.row-slide-enter-from, .row-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>
