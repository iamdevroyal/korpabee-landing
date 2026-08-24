<template>
  <div class="leaderboard-wrap">
    <!-- My rank sticky card (when outside visible page) -->
    <div v-if="myEntry && !isMyRankVisible" class="my-rank-card">
      <div class="my-rank-badge">#{{ myEntry.rank }}</div>
      <div class="my-rank-info">
        <span class="my-rank-name">You</span>
        <span class="my-rank-score">{{ myEntry.score.toLocaleString() }} pts</span>
      </div>
      <span class="my-rank-label">Your rank</span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="lb-loading">
      <div v-for="i in 5" :key="i" class="lb-skeleton"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!entries.length" class="lb-empty">
      <span>🏆</span>
      <p>No scores yet — be the first to save!</p>
    </div>

    <!-- Entries -->
    <div v-else class="lb-list">
      <div
        v-for="entry in entries"
        :key="entry.user?.id ?? entry.rank"
        :ref="el => setEntryRef(entry, el)"
        class="lb-row"
        :class="{
          'lb-row--me': isMe(entry),
          'lb-row--top1': entry.rank === 1,
          'lb-row--top2': entry.rank === 2,
          'lb-row--top3': entry.rank === 3,
        }"
      >
        <!-- Rank medal -->
        <div class="rank-col">
          <span v-if="entry.rank === 1" class="medal">🥇</span>
          <span v-else-if="entry.rank === 2" class="medal">🥈</span>
          <span v-else-if="entry.rank === 3" class="medal">🥉</span>
          <span v-else class="rank-num">#{{ entry.rank }}</span>
        </div>

        <!-- Avatar + name -->
        <div class="user-col">
          <div class="lb-avatar" :style="avatarStyle(entry.user)">
            {{ initials(entry.user?.name) }}
          </div>
          <div class="user-info">
            <span class="user-name">{{ entry.user?.name ?? 'Anonymous' }}</span>
            <span class="user-you" v-if="isMe(entry)">• You</span>
          </div>
        </div>

        <!-- Score -->
        <div class="score-col">
          {{ formatScore(entry.score) }} pts
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="meta && meta.pages > 1" class="lb-pagination">
      <button
        class="page-btn"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
      >←</button>
      <span class="page-info">{{ currentPage }} / {{ meta.pages }}</span>
      <button
        class="page-btn"
        :disabled="currentPage >= meta.pages"
        @click="changePage(currentPage + 1)"
      >→</button>
    </div>

    <!-- Pull to refresh -->
    <button class="refresh-btn" @click="refresh" :disabled="loading">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
      Refresh
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const props = defineProps({
  groupUuid: { type: String, required: true },
})

const authStore  = useAuthStore()
const gameStore  = useSavingsGameStore()

const currentPage = ref(1)
const entryRefs   = ref({})

const leaderboardData = computed(() => gameStore.getLeaderboard(props.groupUuid, currentPage.value))
const entries         = computed(() => leaderboardData.value?.entries ?? [])
const myEntry         = computed(() => leaderboardData.value?.my_rank ?? null)
const meta            = computed(() => leaderboardData.value?.meta ?? null)
const loading         = computed(() => gameStore.loading)

// Track which entry refs contain the current user's row
const isMyRankVisible = computed(() => {
  if (!myEntry.value) return true
  return entries.value.some(e => isMe(e))
})

function setEntryRef(entry, el) {
  if (el) entryRefs.value[entry.rank] = el
}

function isMe(entry) {
  return entry.user?.id === authStore.user?.uuid || entry.user?.id === authStore.user?.id
}

function initials(name) {
  if (!name) return '?'
  return name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function avatarStyle(user) {
  if (user?.avatar) return { backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover' }
  return { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }
}

function formatScore(val) {
  const n = parseFloat(val) || 0
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toFixed(0)
}

async function load(force = false) {
  await gameStore.fetchGroupLeaderboard(props.groupUuid, currentPage.value, force)
}

async function refresh() {
  await load(true)
}

function changePage(page) {
  currentPage.value = page
  load()
}

onMounted(() => load())
watch(() => props.groupUuid, () => { currentPage.value = 1; load() })
</script>

<style scoped>
.leaderboard-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Sticky my-rank card */
.my-rank-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border: 1.5px solid rgba(99,102,241,0.2);
  border-radius: 14px;
  padding: 10px 14px;
  margin-bottom: 6px;
}

.my-rank-badge {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #6366F1;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.my-rank-info { flex: 1; }
.my-rank-name  { font-size: 13px; font-weight: 700; color: #1A1535; display: block; }
.my-rank-score { font-size: 11px; color: #6366F1; font-weight: 600; }
.my-rank-label { font-size: 10px; color: #A8A4C4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }

/* Skeleton loading */
.lb-loading { display: flex; flex-direction: column; gap: 8px; }
.lb-skeleton {
  height: 52px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200%;
  border-radius: 14px;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty state */
.lb-empty {
  text-align: center;
  padding: 32px;
  color: #A8A4C4;
  font-size: 13px;
  font-weight: 600;
}

.lb-empty span { font-size: 32px; display: block; margin-bottom: 8px; }

/* List */
.lb-list { display: flex; flex-direction: column; gap: 6px; }

.lb-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 14px;
  background: #fff;
  border: 1.5px solid rgba(99,102,241,0.06);
  transition: all 0.18s ease;
}

.lb-row:hover { background: #F8F7FF; border-color: rgba(99,102,241,0.12); }

.lb-row--me {
  background: #EEF2FF !important;
  border-color: rgba(99,102,241,0.2) !important;
}

.lb-row--top1 { border-color: rgba(250,204,21,0.35) !important; background: #FFFBEB !important; }
.lb-row--top2 { border-color: rgba(148,163,184,0.35) !important; background: #F8FAFC !important; }
.lb-row--top3 { border-color: rgba(217,119,6,0.25) !important; background: #FFFBF5 !important; }

/* Rank col */
.rank-col { width: 36px; text-align: center; flex-shrink: 0; }
.medal     { font-size: 20px; }
.rank-num  { font-size: 12px; font-weight: 800; color: #A8A4C4; }

/* User col */
.user-col  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.lb-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info    { display: flex; align-items: center; gap: 4px; min-width: 0; }
.user-name    { font-size: 13px; font-weight: 700; color: #1A1535; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-you     { font-size: 11px; color: #6366F1; font-weight: 600; }

/* Score */
.score-col {
  font-size: 13px;
  font-weight: 800;
  color: #6366F1;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Pagination */
.lb-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 0 4px;
}

.page-btn {
  width: 32px; height: 32px;
  border-radius: 10px;
  border: 1.5px solid rgba(99,102,241,0.2);
  background: #fff;
  color: #6366F1;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s;
}

.page-btn:hover:not(:disabled) { background: #EEF2FF; }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.page-info { font-size: 12px; font-weight: 700; color: #A8A4C4; }

/* Refresh */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 auto;
  padding: 7px 16px;
  border-radius: 99px;
  border: 1.5px solid rgba(99,102,241,0.15);
  background: transparent;
  color: #A8A4C4;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
}

.refresh-btn:hover:not(:disabled) { color: #6366F1; border-color: rgba(99,102,241,0.3); }
.refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
