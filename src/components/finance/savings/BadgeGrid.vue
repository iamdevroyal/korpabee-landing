<template>
  <div class="badge-section">
    <!-- Header -->
    <div class="section-header">
      <div>
        <h3 class="section-title">🏅 Your Badges</h3>
        <p class="section-sub">{{ earnedCount }} / {{ totalCount }} earned</p>
      </div>
      <!-- Category filter pills -->
      <div class="cat-pills">
        <button
          v-for="c in categories"
          :key="c.key"
          class="cat-pill"
          :class="{ active: activeCat === c.key }"
          @click="activeCat = c.key"
        >{{ c.label }}</button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="badge-grid">
      <div v-for="i in 8" :key="i" class="badge-skeleton"></div>
    </div>

    <!-- Badge grid -->
    <div v-else class="badge-grid">
      <div
        v-for="badge in filteredBadges"
        :key="badge.id"
        class="badge-chip"
        :class="{ earned: badge.earned, locked: !badge.earned }"
        @click="activeBadge = badge"
      >
        <div class="badge-emoji-wrap">
          <span class="badge-emoji">{{ badge.earned ? badge.icon_emoji : '🔒' }}</span>
        </div>
        <span class="badge-name">{{ badge.name }}</span>
        <span v-if="badge.earned" class="badge-earned-dot"></span>
      </div>
    </div>

    <!-- Badge detail tooltip/modal -->
    <Teleport to="body">
      <Transition name="scale-fade">
        <div v-if="activeBadge" class="badge-modal-overlay" @click.self="activeBadge = null">
          <div class="badge-modal">
            <div class="badge-modal-icon" :class="{ earned: activeBadge.earned }">
              {{ activeBadge.earned ? activeBadge.icon_emoji : '🔒' }}
            </div>
            <h4 class="badge-modal-name">{{ activeBadge.name }}</h4>
            <span class="badge-modal-cat">{{ activeBadge.category }}</span>
            <p class="badge-modal-desc">{{ activeBadge.description }}</p>
            <div v-if="activeBadge.earned" class="badge-modal-earned-date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Earned {{ formatDate(activeBadge.earned_at) }}
            </div>
            <div v-else class="badge-modal-locked-hint">
              Keep saving to unlock this badge!
            </div>
            <button class="badge-modal-close" @click="activeBadge = null">Close</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSavingsGameStore } from '@/stores/savingsGame.js'

const gameStore = useSavingsGameStore()

const loading     = computed(() => gameStore.loading)
const badges      = computed(() => gameStore.badges)
const earnedCount = computed(() => gameStore.earnedBadges.length)
const totalCount  = computed(() => badges.value.length)

const activeBadge = ref(null)
const activeCat   = ref('all')

const categories = [
  { key: 'all',         label: 'All' },
  { key: 'streak',      label: '🔥 Streak' },
  { key: 'volume',      label: '💰 Volume' },
  { key: 'consistency', label: '📅 Consistency' },
  { key: 'social',      label: '🤝 Social' },
]

const filteredBadges = computed(() => {
  if (activeCat.value === 'all') return badges.value
  return badges.value.filter(b => b.category === activeCat.value)
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => gameStore.fetchBadges())
</script>

<style scoped>
.badge-section { display: flex; flex-direction: column; gap: 16px; }

.section-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title { font-size: 16px; font-weight: 900; color: #1A1535; margin: 0; }
.section-sub   { font-size: 11px; color: #A8A4C4; font-weight: 600; margin: 2px 0 0; }

/* Category pills */
.cat-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-pill {
  padding: 5px 12px; border-radius: 99px; font-size: 11px; font-weight: 700;
  border: 1.5px solid rgba(99,102,241,0.12); background: #fff;
  color: #A8A4C4; cursor: pointer; transition: all 0.18s;
}
.cat-pill.active { background: #6366F1; color: #fff; border-color: #6366F1; }
.cat-pill:hover:not(.active) { color: #6366F1; border-color: rgba(99,102,241,0.25); }

/* Grid */
.badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

/* Skeleton */
.badge-skeleton {
  height: 96px; border-radius: 16px;
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* Badge chip */
.badge-chip {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 8px; border-radius: 16px;
  border: 1.5px solid rgba(99,102,241,0.08);
  background: #fff; cursor: pointer;
  position: relative; overflow: hidden;
  transition: all 0.2s;
}

.badge-chip:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(99,102,241,0.1); }

.badge-chip.earned {
  background: linear-gradient(135deg, #EEF2FF, #F3F0FF);
  border-color: rgba(99,102,241,0.2);
}

.badge-chip.locked {
  opacity: 0.55;
  filter: grayscale(0.5);
}

.badge-emoji-wrap {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
}

.badge-emoji { font-size: 20px; line-height: 1; }

.badge-name {
  font-size: 10px; font-weight: 700; color: #1A1535;
  text-align: center; line-height: 1.2;
  overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
}

.badge-earned-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #10B981; position: absolute; top: 8px; right: 8px;
}

/* Modal */
.badge-modal-overlay {
  position: fixed; inset: 0; z-index: 950;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}

.badge-modal {
  background: #fff; border-radius: 28px;
  padding: 32px 24px; max-width: 320px; width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}

.badge-modal-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: rgba(99,102,241,0.08);
  display: flex; align-items: center; justify-content: center;
  font-size: 36px;
}

.badge-modal-icon.earned { background: linear-gradient(135deg, #EEF2FF, #E0E7FF); }

.badge-modal-name { font-size: 18px; font-weight: 900; color: #1A1535; margin: 0; }

.badge-modal-cat {
  font-size: 10px; font-weight: 800; color: #6366F1;
  background: #EEF2FF; padding: 3px 10px; border-radius: 99px;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.badge-modal-desc { font-size: 13px; color: #64748B; line-height: 1.5; margin: 0; }

.badge-modal-earned-date {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #10B981; font-weight: 700;
}

.badge-modal-locked-hint {
  font-size: 11px; color: #FB923C; font-weight: 600;
  background: rgba(251,146,60,0.1); padding: 6px 12px; border-radius: 99px;
}

.badge-modal-close {
  margin-top: 4px; padding: 10px 28px; font-size: 13px; font-weight: 800;
  background: #EEF2FF; color: #6366F1; border: none; border-radius: 12px;
  cursor: pointer; transition: background 0.18s;
}
.badge-modal-close:hover { background: #E0E7FF; }

/* Transition */
.scale-fade-enter-active, .scale-fade-leave-active { transition: all 0.2s; }
.scale-fade-enter-from, .scale-fade-leave-to { opacity: 0; transform: scale(0.92); }
</style>
