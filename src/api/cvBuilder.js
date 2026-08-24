import client from './client.js'

export const cvBuilderApi = {
  // Templates
  getTemplates() {
    return client.get('/cv-builder/templates')
  },

  // Drafts
  createDraft(payload) {
    return client.post('/cv-builder/drafts', payload)
  },

  // Generate CV JSON from job description + user profile
  generate(data) {
    return client.post('/cv-builder/generate', data)
  },

  // Save / Update CV draft
  save(data) {
    return client.post('/cv-builder/save', data)
  },

  // Export CV as PDF / DOCX
  exportCv(uuid, format) {
    return client.post(`/cv-builder/generated/${uuid}/export`, { format }, {
      responseType: 'blob',
    })
  },

  // Download — returns the download URL for backwards compatibility if needed
  getDownloadUrl(uuid, format) {
    const base = getApiBaseUrl()
    const token = localStorage.getItem('kb_token')
    return `${base}/cv-builder/generated/${uuid}/download/${format}?token=${token}`
  },
}
