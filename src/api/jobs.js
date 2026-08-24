import client from './client.js'

export const jobs = {
  search: (params) => client.get('/jobs', { params }),
  categories: () => client.get('/jobs/categories'),
  show: (uuid) => client.get(`/jobs/${uuid}`),
  create: (data) => client.post('/jobs', data),
  saveJob: (uuid) => client.post(`/jobs/${uuid}/save`),
  unsaveJob: (uuid) => client.delete(`/jobs/${uuid}/save`),
  apply: (uuid, data) => client.post(`/jobs/${uuid}/apply`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  withdraw: (uuid) => client.put(`/jobs/${uuid}/apply`),
  myApplications: (params) => client.get('/me/applications', { params }),
  savedJobs: (params) => client.get('/me/saved-jobs', { params }),
  getCv: () => client.get('/me/cv'),
  uploadCv: (formData) => client.post('/me/cv', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

export default jobs
