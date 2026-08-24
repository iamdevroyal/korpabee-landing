import client from './client.js'

export const moderationApi = {
  reportContent: (data)  => client.post('/moderation/reports', data),
  blockUser:     (uuid)  => client.post(`/moderation/block/${uuid}`),
  unblockUser:   (uuid)  => client.post(`/moderation/unblock/${uuid}`),
  getBlocked:    ()      => client.get('/moderation/blocked'),
}
