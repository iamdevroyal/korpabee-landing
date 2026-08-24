import client from './client'

export const getMe = () => client.get('/me')
export const updateMe = (payload) => client.put('/me', payload)
export const uploadAvatar = (formData) => {
  return client.post('/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const uploadCoverPhoto = (formData) => {
  return client.post('/me/cover-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export const deleteAccount = () => client.delete('/me')

export const searchUsers = (params) => client.get('/users/search', { params })
export const getUser = (uuid) => client.get(`/users/${uuid}`)
export const followUser = (uuid) => client.post(`/users/${uuid}/follow`)
export const unfollowUser = (uuid) => client.delete(`/users/${uuid}/follow`)
export const getUserFollowers = (uuid, params) => client.get(`/users/${uuid}/followers`, { params })
export const getUserFollowing = (uuid, params) => client.get(`/users/${uuid}/following`, { params })

// Settings & Preferences
export const getSettings = () => client.get('/me/settings')
export const updateNotificationSettings = (payload) => client.put('/me/settings/notifications', payload)
export const updatePrivacySettings = (payload) => client.put('/me/settings/privacy', payload)
export const updatePreferences = (payload) => client.put('/me/settings/preferences', payload)

// Presence heartbeat — call every ~55s while the app is open
export const pingPresence = () => client.post('/me/ping')
// Immediately clear presence when user disables show_online_status
export const goOffline = () => client.post('/me/offline')

export const getUserPosts = (uuid, params) => client.get(`/users/${uuid}/posts`, { params })
export const getUserBuzzes = (uuid, params) => client.get(`/users/${uuid}/buzzes`, { params })