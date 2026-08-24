import client from './client'

export const getGlobalFeed = (params) => client.get('/feed', { params })
export const getStateFeed = (params) => client.get('/feed/state', { params })
export const getPlatoonFeed = (params) => client.get('/feed/platoon', { params })
export const getBatchFeed = (params) => client.get('/feed/batch', { params })

export const getTrendingHashtags = () => client.get('/hashtags/trending')

export const createPost = (formData) =>
  client.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const getPost = (uuid) => client.get(`/posts/${uuid}`)
export const updatePost = (uuid, payload) => client.put(`/posts/${uuid}`, payload)
export const deletePost = (uuid) => client.delete(`/posts/${uuid}`)

export const likePost = (uuid) => client.post(`/posts/${uuid}/like`)
export const unlikePost = (uuid) => client.delete(`/posts/${uuid}/like`)

// ── Share / Reshare ───────────────────────────────────────────────────────────
export const sharePost = (uuid, payload) => client.post(`/posts/${uuid}/share`, payload)

// ── Impression tracking (scroll-based batch) ──────────────────────────────────
export const batchPostImpressions = (uuids) => client.post('/posts/impressions', { uuids })

// ── Comments ──────────────────────────────────────────────────────────────────
export const getComments = (postUuid, params) => client.get(`/posts/${postUuid}/comments`, { params })
export const createComment = (postUuid, payload) => client.post(`/posts/${postUuid}/comments`, payload)
export const deleteComment = (id) => client.delete(`/comments/${id}`)

// ── Comment reactions ─────────────────────────────────────────────────────────
export const likeComment = (id) => client.post(`/comments/${id}/like`)
export const unlikeComment = (id) => client.delete(`/comments/${id}/like`)