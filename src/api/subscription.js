import client from './client.js'

export const subscriptionApi = {
  getPlans:           ()     => client.get('/subscriptions/corper/plans'),
  getSubscription:    ()     => client.get('/subscriptions/corper/active'),
  subscribe:          (data) => client.post('/subscriptions/corper/subscribe', data),
  cancelSubscription: ()     => client.post('/subscriptions/corper/cancel'),
  getInvoices:        ()     => client.get('/subscriptions/corper/invoices'),
}
