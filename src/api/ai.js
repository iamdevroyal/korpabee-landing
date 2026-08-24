import client from './client'

export const chatWithAi = (messages) => client.post('/ai/chat', { messages })
