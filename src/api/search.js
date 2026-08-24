import client from './client'

export const searchApi = {
  globalSearch: (params) => client.get('/search', { params }),
}

export default searchApi
