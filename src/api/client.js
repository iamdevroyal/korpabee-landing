import axios from 'axios'

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost')) {
    return envUrl
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8000/api/v1`
    }
  }
  return envUrl || 'http://127.0.0.1:8000/api/v1'
}

const client = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor — 1: reject mutating requests immediately when offline
// GET requests pass through so the Workbox NetworkFirst cache can serve them.
client.interceptors.request.use(
  (config) => {
    const isMutating = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())
    if (isMutating && !navigator.onLine) {
      const err = new Error('You are offline. Please connect to the internet to do this.')
      err.isOfflineError = true
      err.code = 'ERR_OFFLINE'
      return Promise.reject(err)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Request interceptor — 2: inject Bearer token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kb_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle global errors (401 logout, 429 rate limit)
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const status = error.response.status
      const isLogoutRequest = error.config?.url?.includes('/auth/logout')
      // skipAuthCheck: true allows callers (e.g. fetchMe) to opt-out of the global
      // logout-on-401 behaviour. Only fire auth-logout when:
      //   1. The caller hasn't opted out
      //   2. A token actually exists in storage (it's a real token-invalid 401, not an anonymous one)
      const skipAuthCheck = error.config?.skipAuthCheck === true
      const hasToken = !!localStorage.getItem('kb_token')

      if (status === 503) {
        window.dispatchEvent(new CustomEvent('system-maintenance', {
          detail: { message: error.response.data?.message || 'The platform is currently undergoing maintenance.' }
        }))
      } else if (status === 401 && !isLogoutRequest && !skipAuthCheck && hasToken) {
        // Clear local storage and dispatch event to alert components
        localStorage.removeItem('kb_token')
        localStorage.removeItem('kb_user')
        window.dispatchEvent(new CustomEvent('auth-logout'))
      } else if (status === 429) {
        window.dispatchEvent(new CustomEvent('api-rate-limit', {
          detail: { message: error.response.data?.message || 'Too many requests. Please slow down.' }
        }))
      }
    }
    return Promise.reject(error)
  }
)

export default client
