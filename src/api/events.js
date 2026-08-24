import client from './client.js'

export const events = {
  discover: (params) => client.get('/events', { params }),
  categories: () => client.get('/events/categories'),
  show: (uuid) => client.get(`/events/${uuid}`),
  create: (data) => client.post('/events', data),
  update: (uuid, data) => client.put(`/events/${uuid}`, data),
  cancel: (uuid) => client.delete(`/events/${uuid}`),
  rsvp: (uuid) => client.post(`/events/${uuid}/rsvp`),
  cancelRsvp: (uuid) => client.delete(`/events/${uuid}/rsvp`),
  attendees: (uuid, params) => client.get(`/events/${uuid}/attendees`, { params }),
}

export default events
