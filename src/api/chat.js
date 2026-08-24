import client from './client'

export const getConversations  = (params) => client.get('/conversations', { params })
export const createConversation = (payload) => client.post('/conversations', payload)
export const getConversation   = (uuid) => client.get(`/conversations/${uuid}`)
export const updateConversation = (uuid, payload) => client.put(`/conversations/${uuid}`, payload)
export const muteConversation  = (uuid, payload) => client.post(`/conversations/${uuid}/mute`, payload)

// Group member management
export const addMember    = (uuid, payload)           => client.post(`/conversations/${uuid}/members`, payload)
export const removeMember = (uuid, userUuid)          => client.delete(`/conversations/${uuid}/members/${userUuid}`)

// Invite links
export const generateInvite    = (uuid)  => client.post(`/conversations/${uuid}/invite`)
export const previewInvite     = (code)  => client.get(`/conversations/invite/${code}`)
export const joinViaInvite     = (code)  => client.post(`/conversations/invite/${code}/join`)
export const leaveConversation = (uuid)  => client.delete(`/conversations/${uuid}/leave`)

// Messages
export const getMessages    = (uuid, params)   => client.get(`/conversations/${uuid}/messages`, { params })
export const createMessage  = (uuid, formData) => client.post(`/conversations/${uuid}/messages`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const markMessagesRead  = (uuid) => client.post(`/conversations/${uuid}/read`)
export const sendTypingStatus  = (uuid, payload) => client.post(`/conversations/${uuid}/typing`, payload)
export const updateMessage     = (uuid, payload) => client.put(`/messages/${uuid}`, payload)
export const deleteMessage     = (uuid) => client.delete(`/messages/${uuid}`)
