import client from './client.js'

export const marketplaceApi = {
  // Categories
  getCategories: () => client.get('/gigs/categories'),

  // Gigs
  getGigs:   (params = {}) => client.get('/gigs', { params }),
  getGig:    (uuid)        => client.get(`/gigs/${uuid}`),
  createGig: (data)        => client.post('/gigs', data),
  updateGig: (uuid, data)  => client.put(`/gigs/${uuid}`, data),
  cancelGig: (uuid)        => client.post(`/gigs/${uuid}/cancel`),

  // Submissions
  submitWork:        (gigUuid, data) => client.post(`/gigs/${gigUuid}/submissions`, data),
  getMySubmissions:  (params = {})   => client.get('/submissions/me', { params }),
  reviewSubmission:  (uuid, data)    => client.put(`/submissions/${uuid}/review`, data),
  disputeSubmission: (uuid, data)    => client.post(`/submissions/${uuid}/dispute`, data),

  // KorpaCoin wallet
  getWallet:         ()     => client.get('/wallet/korpacoin'),
  fundWallet:        (data) => client.post('/wallet/korpacoin/fund', data),
  unfundWallet:      (data) => client.post('/wallet/korpacoin/unfund', data),
  requestWithdrawal: (data) => client.post('/wallet/korpacoin/withdraw', data),
}
