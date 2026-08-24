import client from './client'

export const getNotifications = (params) => client.get('/notifications', { params })
export const markAsRead = (id) => client.post(`/notifications/${id}/read`)
export const markAllAsRead = () => client.post('/notifications/read-all')
export const deleteNotification = (id) => client.delete(`/notifications/${id}`)

export const registerDeviceToken = (payload) => client.post('/device-tokens', payload)
export const deregisterDeviceToken = (token) => client.delete(`/device-tokens/${token}`)
