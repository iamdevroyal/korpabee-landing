<template>
  <div class="settings-section">
    <div class="settings-header">
      <h3 class="settings-title">⚙️ Save & Win Settings</h3>
      <p class="settings-sub">Personalise your savings game experience</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="settings-loading">
      <div class="spin-ring"></div>
      <p>Loading preferences...</p>
    </div>

    <template v-else>
      <!-- ── Notifications ──────────────────────────────────────────────────── -->
      <div class="pref-group">
        <p class="pref-group-label">🔔 Notifications</p>

        <div class="pref-row" v-for="pref in notificationPrefs" :key="pref.key">
          <div class="pref-info">
            <p class="pref-name">{{ pref.label }}</p>
            <p class="pref-desc">{{ pref.desc }}</p>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs[pref.key] }"
            :aria-label="`Toggle ${pref.label}`"
            @click="toggle(pref.key)"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- ── Display ───────────────────────────────────────────────────────── -->
      <div class="pref-group">
        <p class="pref-group-label">👁️ Display</p>

        <div class="pref-row" v-for="pref in displayPrefs" :key="pref.key">
          <div class="pref-info">
            <p class="pref-name">{{ pref.label }}</p>
            <p class="pref-desc">{{ pref.desc }}</p>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs[pref.key] }"
            :aria-label="`Toggle ${pref.label}`"
            @click="toggle(pref.key)"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- ── Streak Protection ─────────────────────────────────────────────── -->
      <div class="pref-group">
        <p class="pref-group-label">🛡️ Streak Protection</p>

        <div class="pref-row">
          <div class="pref-info">
            <p class="pref-name">Auto Freeze</p>
            <p class="pref-desc">Automatically use a streak freeze when you miss a day (limited uses).</p>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs.auto_freeze_enabled }"
            aria-label="Toggle auto freeze"
            @click="toggle('auto_freeze_enabled')"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- ── Phase 5: Privacy & Visibility ─────────────────────────── -->
      <div class="pref-group pref-group-highlight">
        <p class="pref-group-label">🌍 National Leaderboard</p>

        <div class="national-optin-row">
          <div class="national-optin-info">
            <p class="pref-name">Join National Rankings</p>
            <p class="pref-desc">Compete with savers nationwide. Only your score is visible — displayed as initial + surname (e.g. J. Smith). You can opt out anytime.</p>
            <div class="optin-pills">
              <span class="optin-pill">🔒 Scores only</span>
              <span class="optin-pill">👤 Initials displayed</span>
              <span class="optin-pill">🚫 No balances shared</span>
            </div>
          </div>
          <button
            class="toggle"
            :class="{ on: prefs.national_leaderboard_opt_in }"
            aria-label="Toggle national leaderboard participation"
            @click="toggle('national_leaderboard_opt_in')"
          >
            <span class="toggle-knob"></span>
          </button>
        </div>
      </div>

      <!-- Save indicator -->
      <Transition name="fade">
        <div v-if="saveState === 'saving'" class="save-status saving">
          Saving...
        </div>
        <div v-else-if="saveState === 'saved'" class="save-status saved">
          ✓ Saved
        </div>
        <div v-else-if="saveState === 'error'" class="save-status error">
          ✗ Failed to save
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { savingsGameApi } from '@/api/savingsGame.js'

const loading   = ref(true)
const saveState = ref(null) // null | 'saving' | 'saved' | 'error'
let   saveTimer = null

const prefs = reactive({
  notify_streak_at_risk:      true,
  notify_streak_broken:       true,
  notify_challenge_ending:    true,
  notify_rank_change:         false,
  notify_badge_earned:        true,
  notify_mission_complete:    true,
  notify_reward_granted:      true,
  show_amount_on_leaderboard: false,
  show_streak_flame:          true,
  auto_freeze_enabled:        false,
  national_leaderboard_opt_in: false, // Phase 5
})

const notificationPrefs = [
  { key: 'notify_streak_at_risk',   label: 'Streak at Risk',      desc: 'Alert when you\'re about to break your streak.' },
  { key: 'notify_streak_broken',    label: 'Streak Broken',       desc: 'Notification when your streak resets.' },
  { key: 'notify_challenge_ending', label: 'Challenge Ending',    desc: 'Reminder when a challenge closes in 3 days.' },
  { key: 'notify_rank_change',      label: 'Rank Changes',        desc: 'Alert when your leaderboard position changes.' },
  { key: 'notify_badge_earned',     label: 'Badge Earned',        desc: 'Celebrate every new badge you unlock.' },
  { key: 'notify_mission_complete', label: 'Mission Complete',    desc: 'Daily mission completion alerts.' },
  { key: 'notify_reward_granted',   label: 'Reward Received',     desc: 'Notification when a challenge prize is credited.' },
]

const displayPrefs = [
  { key: 'show_amount_on_leaderboard', label: 'Show Saved Amount', desc: 'Allow others to see your saved amount on leaderboards (off = privacy mode).' },
  { key: 'show_streak_flame',          label: 'Flame Indicator',   desc: 'Show the animated flame beside your streak counter.' },
]

async function toggle(key) {
  prefs[key] = !prefs[key]
  await save()
}

async function save() {
  clearTimeout(saveTimer)
  saveState.value = 'saving'
  try {
    await savingsGameApi.updatePreferences({ ...prefs })
    saveState.value = 'saved'
  } catch (_) {
    saveState.value = 'error'
  }
  saveTimer = setTimeout(() => { saveState.value = null }, 2500)
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await savingsGameApi.getPreferences()
    const data = res.data ?? res ?? {}
    Object.assign(prefs, data)
  } catch (_) { /* use defaults */ }
  loading.value = false
})
</script>

<style scoped>
.settings-section { display: flex; flex-direction: column; gap: 20px; }

.settings-header { margin-bottom: 4px; }
.settings-title { font-size: 16px; font-weight: 900; color: #1A1535; margin: 0; }
.settings-sub   { font-size: 11px; color: #A8A4C4; font-weight: 600; margin: 2px 0 0; }

/* Loading */
.settings-loading {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 40px 0; color: #A8A4C4;
}

/* Group */
.pref-group {
  background: #fff;
  border: 1.5px solid rgba(99,102,241,0.07);
  border-radius: 22px;
  overflow: hidden;
}

.pref-group-label {
  font-size: 10px; font-weight: 900; color: #A8A4C4;
  text-transform: uppercase; letter-spacing: 0.6px;
  padding: 14px 18px 10px;
  margin: 0;
  border-bottom: 1px solid rgba(99,102,241,0.06);
}

/* Row */
.pref-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(99,102,241,0.05);
}
.pref-row:last-child { border-bottom: none; }

.pref-info { flex: 1; min-width: 0; }
.pref-name { font-size: 13px; font-weight: 800; color: #1A1535; margin: 0 0 2px; }
.pref-desc { font-size: 11px; color: #94A3B8; font-weight: 500; margin: 0; line-height: 1.4; }

/* Toggle */
.toggle {
  width: 44px; height: 26px;
  border-radius: 99px; border: none;
  background: #E2E8F0;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.25s;
  outline: none;
}

.toggle.on { background: #6366F1; }

.toggle-knob {
  position: absolute;
  top: 3px; left: 3px;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toggle.on .toggle-knob { transform: translateX(18px); }

/* Spin ring */
.spin-ring {
  width: 24px; height: 24px;
  border: 3px solid rgba(99,102,241,0.15);
  border-top-color: #6366F1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Save status */
.save-status {
  text-align: center;
  font-size: 11px; font-weight: 800;
  padding: 8px 16px; border-radius: 99px;
  align-self: center;
}
.save-status.saving { color: #94A3B8; background: #F1F5F9; }
.save-status.saved  { color: #047857; background: #D1FAE5; }
.save-status.error  { color: #DC2626; background: #FEF2F2; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Phase 5 — National Leaderboard opt-in group */
.pref-group-highlight {
  background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%);
  border-color: rgba(99,102,241,0.18);
}

.national-optin-row {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 16px 18px;
}

.national-optin-info { flex: 1; min-width: 0; }

.optin-pills {
  display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;
}

.optin-pill {
  font-size: 10px; font-weight: 700; color: #4F46E5;
  background: rgba(99,102,241,0.1);
  border-radius: 99px; padding: 3px 9px;
  white-space: nowrap;
}
</style>
