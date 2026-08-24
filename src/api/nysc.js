import client from './client'

export const getStates = () => client.get('/states')

export const getBatches = () => client.get('/batches')

export const getPlatoons = (params = {}) => client.get('/platoons', { params })
