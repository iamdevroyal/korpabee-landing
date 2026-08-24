<template>
  <div class="national-lb">

    <!-- ── Opt-out gate ────────────────────────────────────────────────────── -->
    <div v-if="!optedIn" class="optin-gate">
      <div class="optin-icon">🌍</div>
      <h3 class="optin-title">National Leaderboard</h3>
      <p class="optin-desc">
        See how you rank against savers across the whole country.
        Your score is the only thing visible — no name, no balance.
      </p>
      <div class="privacy-pills">
        <span class="pill">✅ Scores only, no balances</span>
        <span class="pill">✅ First initial + surname displayed</span>
        <span class="pill">✅ Opt out anytime in Settings</span>
      </div>
      <button class="optin-btn" :disabled="joiningNational" @click="joinNational">
        <span v-if="joiningNational" class="spin-sm"></span>
        <span v-else>Join National Leaderboard</span>
      </button>
    </div>

    <!-- ── Loading ──────────────────────────────────────────────────────────── -->
    <div v-else-if="loading" class="lb-loading">
      <div class="spin-ring"></div>
      <p>Loading rankings…</p>
    </div>

    <!-- ── Error ────────────────────────────────────────────────────────────── -->
    <div v-else-if="error" class="lb-empty">
      <p class="empty-icon">😞</p>
      <p class="empty-text">Could not load leaderboard</p>
      <button class="retry-btn" @click="load">Try Again</button>
    </div>

    <!-- ── Rankings ─────────────────────────────────────────────────────────── -->
    <template v-else>
      <!-- My rank hero card -->
      <div class="my-rank-card" v-if="myRank">
        <div class="my-rank-left">
          <span class="my-rank-label">Your Rank</span>
          <span class="my-rank-num">#{{ myRank }}</span>
        </div>
        <div class="my-rank-right">
          <span class="my-score-label">Score this month</span>
          <span class="my-score-val">{{ formatScore(myScore) }}</span>
        </div>
      </div>

      <div v-else class="my-rank-card no-rank">
        <span class="no-rank-text">💡 Save today to appear on the national board</span>
      </div>

      <!-- Period label -->
      <div class="period-header">
        <span class="period-label">📅 {{ periodLabel }}</span>
        <span class="period-note">Top {{ entries.length }} opt-in savers · Updates nightly</span>
      </div>

      <!-- List -->
      <div class="lb-list">
        <TransitionGroup name="fade-row" tag="div">
          <div
            v-for="entry in entries"
            :key="entry.rank"
            class="lb-row"
            :class="{
              'is-me': entry.is_me,
              'top-3': entry.rank <= 3,
            }"
          >
            <div class="rank-col">
              <span v-if="entry.rank === 1" class="medal">🥇</span>
              <span v-else-if="entry.rank === 2" class="medal">🥈</span>
              <span v-else-if="entry.rank === 3" class="medal">🥉</span>
              <span v-else class="rank-num">#{{ entry.rank }}</span>
            </div>

            <div class="avatar-col">
              <img v-if="entry.avatar" :src="entry.avatar" class="avatar-img" alt="" />
              <div v-else class="avatar-placeholder">{{ entry.display_name[0] }}</div>
            </div>

            <div class="name-col">
              <p class="display-name" :class="{ 'me-name': entry.is_me }">
                {{ entry.display_name }}
                <span v-if="entry.is_me" class="you-chip">YOU</span>
              </p>
            </div>

            <div class="score-col">
              {{ formatScore(entry.score) }}
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Privacy footer -->
      <p class="privacy-note">
        🔒 Only your score is visible to others — not your name or balance.
        <button class="opt-out-link" @click="optOut">Opt out</button>
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { savingsGameApi } from '@/api/savingsGame.js'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const store   = useSavingsGameStore()
const loading = ref(false)
const error   = ref(false)
const data    = ref(null)
const joiningNational = ref(false)

const optedIn  = computed(() => store.preferences?.national_leaderboard_opt_in ?? false)
const myRank   = computed(() => data.value?.my_rank ?? null)
const myScore  = computed(() => data.value?.my_score ?? 0)
const entries  = computed(() => data.value?.entries ?? [])
const periodLabel = computed(() => {
  if (!data.value?.period_start) return 'This Month'
  const d = new Date(data.value.period_start)
  return d.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })
})

function formatScore(val) {
  const n = parseFloat(val ?? 0)
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k pts'
  return n.toFixed(0) + ' pts'
}

async function load() {
  if (!optedIn.value) return
  loading.value = true
  error.value   = false
  try {
    const res = await savingsGameApi.getNationalLeaderboard()
    data.value = res.data?.data ?? res.data ?? null
  } catch (e) {
    // 403 = not opted in — update local store
    if (e?.response?.status === 403) {
      await store.getPreferences()
    } else {
      error.value = true
    }
  } finally {
    loading.value = false
  }
}

async function joinNational() {
  joiningNational.value = true
  try {
    await savingsGameApi.updatePreferences({ national_leaderboard_opt_in: true })
    await store.getPreferences()
    await load()
  } catch (e) {
    console.error('Failed to opt in', e)
  } finally {
    joiningNational.value = false
  }
}

async function optOut() {
  try {
    await savingsGameApi.updatePreferences({ national_leaderboard_opt_in: false })
    await store.getPreferences()
    data.value = null
  } catch (e) {
    console.error('Failed to opt out', e)
  }
}

onMounted(load)
</script>

<style scoped>
.national-lb { display: flex; flex-direction: column; gap: 14px; }

/* Opt-in gate */
.optin-gate {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 14px; padding: 20px 8px;
}
.optin-icon { font-size: 42px; }
.optin-title { font-size: 17px; font-weight: 900; color: #1A1535; margin: 0; }
.optin-desc { font-size: 13px; color: #64748B; line-height: 1.6; margin: 0; }

.privacy-pills { display: flex; flex-direction: column; gap: 6px; }
.pill {
  font-size: 11px; font-weight: 700; color: #4F46E5;
  background: #EEF2FF; border-radius: 99px; padding: 5px 12px;
  white-space: nowrap;
}

.optin-btn {
  background: linear-gradient(135deg, #6366F1, #818CF8);
  color: #fff; border: none; border-radius: 16px;
  padding: 13px 28px; font-size: 14px; font-weight: 900;
  cursor: pointer; width: 100%; max-width: 280px;
  box-shadow: 0 4px 16px rgba(99,102,241,0.3);
  transition: transform 0.15s, box-shadow 0.15s;
}
.optin-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
.optin-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* My rank hero */
.my-rank-card {
  display: flex; justify-content: space-between; align-items: center;
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
  border-radius: 20px; padding: 18px 20px; color: #fff;
}
.my-rank-card.no-rank {
  background: linear-gradient(135deg, #E0E7FF, #EEF2FF);
  justify-content: center;
}
.no-rank-text { font-size: 12px; font-weight: 700; color: #4F46E5; }
.my-rank-label, .my-score-label { font-size: 10px; font-weight: 700; opacity: 0.8; display: block; }
.my-rank-num { font-size: 32px; font-weight: 900; line-height: 1; }
.my-score-val { font-size: 20px; font-weight: 900; }

/* Period header */
.period-header { display: flex; justify-content: space-between; align-items: center; }
.period-label { font-size: 12px; font-weight: 900; color: #1A1535; }
.period-note  { font-size: 10px; color: #94A3B8; font-weight: 600; }

/* Loading / empty */
.lb-loading, .lb-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 0; color: #A8A4C4; gap: 8px; text-align: center;
}
.empty-icon { font-size: 36px; }
.empty-text { font-size: 13px; font-weight: 700; color: #94A3B8; margin: 0; }

.retry-btn {
  padding: 8px 18px; background: #EEF2FF;
  border: none; border-radius: 12px; color: #4F46E5; font-size: 12px; font-weight: 800;
  cursor: pointer;
}

/* Leaderboard list */
.lb-list { display: flex; flex-direction: column; gap: 6px; }

.lb-row {
  display: flex; align-items: center; gap: 10px;
  background: #F8F7FF; border: 1.5px solid rgba(99,102,241,0.06);
  border-radius: 16px; padding: 10px 14px; transition: all 0.2s;
}
.lb-row.is-me {
  background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
  border-color: rgba(99,102,241,0.22);
}
.lb-row.top-3 { border-color: rgba(245,158,11,0.18); }

.rank-col { width: 32px; flex-shrink: 0; text-align: center; }
.medal { font-size: 20px; }
.rank-num { font-size: 12px; font-weight: 900; color: #94A3B8; }

.avatar-col { width: 34px; height: 34px; flex-shrink: 0; }
.avatar-img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; }
.avatar-placeholder {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, #C7D2FE, #A5B4FC);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900; color: #4F46E5;
}

.name-col { flex: 1; min-width: 0; }
.display-name {
  font-size: 13px; font-weight: 700; color: #1A1535; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.display-name.me-name { color: #4F46E5; }
.you-chip {
  display: inline-block; font-size: 9px; font-weight: 900; color: #fff;
  background: #6366F1; border-radius: 6px; padding: 1px 5px; margin-left: 5px;
}

.score-col { font-size: 13px; font-weight: 900; color: #1A1535; flex-shrink: 0; }

/* Privacy footer */
.privacy-note {
  font-size: 10px; color: #CBD5E1; font-weight: 500;
  text-align: center; margin: 0;
}
.opt-out-link {
  background: none; border: none; color: #94A3B8; font-size: 10px;
  font-weight: 700; cursor: pointer; text-decoration: underline; padding: 0; margin-left: 4px;
}

/* Spin ring */
.spin-ring {
  width: 24px; height: 24px;
  border: 3px solid rgba(99,102,241,0.15); border-top-color: #6366F1;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.spin-sm {
  width: 14px; height: 14px; display: inline-block;
  border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
  border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle;
}
@keyframes spin { to { transform: rotate(360deg); } }

.fade-row-enter-active, .fade-row-leave-active { transition: all 0.25s ease; }
.fade-row-enter-from, .fade-row-leave-to { opacity: 0; transform: translateY(6px); }
</style>
