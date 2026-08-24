import client from './client'

// ── Buzz CRUD ────────────────────────────────────────────────────────────────
export const createBuzz = (formData) =>
  client.post('/buzz', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getBuzz = (uuid) => client.get(`/buzz/${uuid}`)
export const deleteBuzz = (uuid) => client.delete(`/buzz/${uuid}`)

// ── Buzz Feed ────────────────────────────────────────────────────────────────
// All params support: { cursor, per_page }
export const getGlobalBuzzFeed  = (params) => client.get('/buzz',          { params })
export const getStateBuzzFeed   = (params) => client.get('/buzz/state',    { params })
export const getPlatoonBuzzFeed = (params) => client.get('/buzz/platoon',  { params })
export const getBatchBuzzFeed   = (params) => client.get('/buzz/batch',    { params })

// ── Reactions & View Tracking ────────────────────────────────────────────────
export const likeBuzz   = (uuid) => client.post(`/buzz/${uuid}/like`)
export const unlikeBuzz = (uuid) => client.delete(`/buzz/${uuid}/like`)
export const recordBuzzView = (uuid) => client.post(`/buzz/${uuid}/view`)

// ── Save (bookmark) ──────────────────────────────────────────────────────────
export const saveBuzz   = (uuid) => client.post(`/buzz/${uuid}/save`)
export const unsaveBuzz = (uuid) => client.delete(`/buzz/${uuid}/save`)

// ── Reshare ───────────────────────────────────────────────────────────────────
export const reshareBuzz     = (uuid, payload) => client.post(`/buzz/${uuid}/reshare`, payload)
export const shareBuzzToFeed = (uuid, payload) => client.post(`/buzz/${uuid}/share-to-feed`, payload)

// ── Impression tracking (scroll-based batch) ──────────────────────────────────
export const batchBuzzImpressions = (uuids) => client.post('/buzz/impressions', { uuids })

// ── Comments ─────────────────────────────────────────────────────────────────
export const getBuzzComments   = (uuid, params) => client.get(`/buzz/${uuid}/comments`, { params })
export const createBuzzComment = (uuid, payload) => client.post(`/buzz/${uuid}/comments`, payload)
export const deleteBuzzComment = (id) => client.delete(`/buzz/comments/${id}`)
