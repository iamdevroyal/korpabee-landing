import client from './client'

export const getDiscoverSections = () => client.get('/discover')

export const getPlatoonRecommendations = (params) => client.get('/discover/platoon', { params })
export const getStateRecommendations = (params) => client.get('/discover/state', { params })
export const getBatchRecommendations = (params) => client.get('/discover/batch', { params })
export const getGlobalRecommendations = (params) => client.get('/discover/global', { params })

export const getPreferences = () => client.get('/discover/preferences')
export const updatePreferences = (payload) => client.post('/discover/preferences', payload)

export const requestConnection = (userUuid) => client.post('/connections/request', { user_uuid: userUuid })
export const acceptConnection = (userUuid) => client.post('/connections/accept', { user_uuid: userUuid })
export const rejectConnection = (userUuid) => client.post('/connections/reject', { user_uuid: userUuid })

export const getConnections = (params) => client.get('/connections', { params })
export const getReceivedRequests = (params) => client.get('/connections/requests/received', { params })
export const getSentRequests = (params) => client.get('/connections/requests/sent', { params })
export const getConnectionCounts = () => client.get('/connections/counts')
export const cancelConnection = (userUuid) => client.post('/connections/cancel', { user_uuid: userUuid })
export const removeConnection = (userUuid) => client.post('/connections/remove', { user_uuid: userUuid })
