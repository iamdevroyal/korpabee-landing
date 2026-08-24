import client from './client.js'

export const ppas = {
  search:         (params)           => client.get('/ppas', { params }),
  show:           (uuid)             => client.get(`/ppas/${uuid}`),
  getReviews:     (uuid, params)     => client.get(`/ppas/${uuid}/reviews`, { params }),
  submitReview:   (uuid, data)       => client.post(`/ppas/${uuid}/reviews`, data),
  editReview:     (uuid, rid, data)  => client.put(`/ppas/${uuid}/reviews/${rid}`, data),
  getMembers:     (uuid, params)     => client.get(`/ppas/${uuid}/members`, { params }),
  joinPPA:        (uuid)             => client.post(`/ppas/${uuid}/members`),
  leavePPA:       (uuid)             => client.delete(`/ppas/${uuid}/members`),
  getRequests:    (params)           => client.get('/ppa-requests', { params }),
  createRequest:  (data)             => client.post('/ppa-requests', data),
  deleteRequest:  (uuid)             => client.delete(`/ppa-requests/${uuid}`),
  contributePPA:  (data)             => client.post('/ppas/contribute', data),
  // Correct endpoint is /get-categories (not /ppa-categories)
  getCategories:  ()                 => client.get('/get-categories'),
}

export default ppas
