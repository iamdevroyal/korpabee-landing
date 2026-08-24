import client from './client.js'

export const housing = {
  searchProperties: (params, config = {}) => client.get('/properties', { params, ...config }),
  propertyCategories: (config = {}) => client.get('/properties/categories', config),
  showProperty: (uuid, config = {}) => client.get(`/properties/${uuid}`, config),
  createProperty: (data) => {
    const hasFiles = Array.isArray(data.images) && data.images.length > 0
    if (!hasFiles) return client.post('/properties', data)

    const form = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images') return
      if (value === null || value === undefined) return
      if (typeof value === 'object') form.append(key, JSON.stringify(value))
      else form.append(key, value)
    })
    data.images.forEach((file) => form.append('images[]', file))

    return client.post('/properties', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  updateProperty: (uuid, data) => client.put(`/properties/${uuid}`, data),
  deleteProperty: (uuid) => client.delete(`/properties/${uuid}`),
  submitReview: (uuid, data) => client.post(`/properties/${uuid}/reviews`, data),
  getReviews: (uuid, params, config = {}) => client.get(`/properties/${uuid}/reviews`, { params, ...config }),
  browseRoommates: (params, config = {}) => client.get('/roommates', { params, ...config }),
  createRoommate: (data) => client.post('/roommates', data),
  updateRoommate: (uuid, data) => client.put(`/roommates/${uuid}`, data),
  deleteRoommate: (uuid) => client.delete(`/roommates/${uuid}`),
}

export default housing
