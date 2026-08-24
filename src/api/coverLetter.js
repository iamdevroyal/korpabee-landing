import client from './client.js'

export const coverLetterApi = {
  /**
   * GET /api/v1/cover-letters
   * Paginated list of the authenticated user's cover letters.
   */
  list(page = 1) {
    return client.get('/cover-letters', { params: { page } })
  },

  /**
   * Get a single cover letter by ID.
   */
  get(id) {
    return client.get(`/cover-letters/${id}`)
  },

  /**
   * Generate a cover letter from job description + profile.
   */
  generate(payload) {
    return client.post('/cover-letters/generate', payload)
  },

  /**
   * Save or update cover letter content.
   */
  save(id, payload) {
    return client.put(`/cover-letters/${id}`, payload)
  },

  /**
   * Delete a cover letter.
   */
  remove(id) {
    return client.delete(`/cover-letters/${id}`)
  },

  /**
   * Returns the redirect URL for PDF download.
   */
  downloadUrl(id) {
    const base  = getApiBaseUrl()
    const token = localStorage.getItem('kb_token')
    return `${base}/cover-letters/${id}/download?token=${token}`
  },
}
