import client from './client.js'

export const savingsGameApi = {
  // ── Summary ─────────────────────────────────────────────────────────────────
  getSummary: () =>
    client.get('/savings-game/me/summary'),

  // ── Leaderboards ──────────────────────────────────────────────────────────
  getGroupLeaderboard: (groupUuid, params = {}) =>
    client.get(`/savings-game/leaderboards/group/${groupUuid}`, { params }),

  getMyLeaderboards: () =>
    client.get('/savings-game/my-leaderboards'),

  // Phase 2 — Badges & Missions
  getBadges: () =>
    client.get('/savings-game/badges'),

  getTodaysMissions: () =>
    client.get('/savings-game/missions/today'),

  // Phase 3 — Challenges
  getActiveChallenges: () =>
    client.get('/savings-game/challenges/active'),

  getGroupChallenges: (groupUuid) =>
    client.get(`/savings-game/challenges/group/${groupUuid}`),

  getMyChallengeResults: () =>
    client.get('/savings-game/challenges/my-results'),

  // Phase 3 — Settings / Preferences
  getPreferences: () =>
    client.get('/savings-game/preferences'),

  updatePreferences: (data) =>
    client.patch('/savings-game/preferences', data),

  // Phase 4 — Group Wars
  getGroupWars: (groupUuid) =>
    client.get(`/savings-game/group-wars/${groupUuid}`),

  // Phase 5 — National Leaderboard
  getNationalLeaderboard: () =>
    client.get('/savings-game/national-leaderboard'),
}
