// api/buzzhives.js
import client from './client'

// ── Feed ──────────────────────────────────────────────────────────────────────
// Matches backend: GET /api/v1/buzzhives  and  GET /api/v1/buzzhives/following
export const getBuzzHivesFeed      = (params) => client.get('/buzzhives',           { params })
export const getBuzzHivesFollowing = (params) => client.get('/buzzhives/following', { params })

// ── Single buzz ───────────────────────────────────────────────────────────────
export const getBuzzHive    = (uuid) => client.get(`/buzzhives/${uuid}`)
export const deleteBuzzHive = (uuid) => client.delete(`/buzzhives/${uuid}`)

// ── Engagement ────────────────────────────────────────────────────────────────
export const likeBuzzHive    = (uuid) => client.post(`/buzzhives/${uuid}/like`)
export const unlikeBuzzHive  = (uuid) => client.delete(`/buzzhives/${uuid}/like`)
export const saveBuzzHive    = (uuid) => client.post(`/buzzhives/${uuid}/save`)
export const unsaveBuzzHive  = (uuid) => client.delete(`/buzzhives/${uuid}/save`)
export const trackBuzzView   = (uuid) => client.post(`/buzzhives/${uuid}/view`)

// ── Comments ──────────────────────────────────────────────────────────────────
export const getBuzzHiveComments   = (uuid, params)            => client.get(`/buzzhives/${uuid}/comments`, { params })
export const createBuzzHiveComment = (uuid, payload)           => client.post(`/buzzhives/${uuid}/comments`, payload)
export const deleteBuzzHiveComment = (buzzUuid, commentUuid)   => client.delete(`/buzzhives/${buzzUuid}/comments/${commentUuid}`)
export const likeBuzzHiveComment   = (buzzUuid, commentUuid)   => client.post(`/buzzhives/${buzzUuid}/comments/${commentUuid}/like`)
export const unlikeBuzzHiveComment = (buzzUuid, commentUuid)   => client.delete(`/buzzhives/${buzzUuid}/comments/${commentUuid}/like`)

// ── Creator follow (delegates to User module routes) ──────────────────────────
export const followCreator   = (creatorUuid) => client.post(`/users/${creatorUuid}/follow`)
export const unfollowCreator = (creatorUuid) => client.delete(`/users/${creatorUuid}/follow`)
