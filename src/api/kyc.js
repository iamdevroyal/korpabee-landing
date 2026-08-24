import client from './client'

export const getKycStatus = (entityType = 'corper') =>
  client.get(`/kyc/status?entity_type=${entityType}`)

export const submitKyc = (formData) =>
  client.post('/kyc/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
