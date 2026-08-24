import { ref, onUnmounted } from 'vue'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getApiBaseUrl } from '@/api/client'

window.Pusher = Pusher

// Module-level Echo singleton — shared across all composable invocations
let echoInstance = null
let _currentToken = null

/**
 * Get or create the Echo instance.
 * Automatically re-creates if the token has changed (e.g., after re-login).
 */
function getEcho() {
  const token = localStorage.getItem('kb_token')
  if (!token) {
    // No token — disconnect and clear
    if (echoInstance) {
      echoInstance.disconnect()
      echoInstance = null
      _currentToken = null
    }
    return null
  }

  // Re-create if token changed (re-login scenario)
  if (echoInstance && _currentToken !== token) {
    echoInstance.disconnect()
    echoInstance = null
  }

  if (echoInstance) return echoInstance

  const baseUrl   = getApiBaseUrl()
  const authEndpoint = baseUrl.replace(/\/api\/v\d+$/, '') + '/broadcasting/auth'

  const envHost = import.meta.env.VITE_REVERB_HOST
  let activeHost = envHost || '127.0.0.1'
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname
    if (host !== 'localhost' && host !== '127.0.0.1' && (!envHost || envHost === '127.0.0.1' || envHost === 'localhost')) {
      activeHost = host
    }
  }

  echoInstance = new Echo({
    broadcaster:       'reverb',
    key:               import.meta.env.VITE_REVERB_APP_KEY || 'korpabeekey123',
    wsHost:            activeHost,
    wsPort:            parseInt(import.meta.env.VITE_REVERB_PORT || '8085'),
    wssPort:           parseInt(import.meta.env.VITE_REVERB_PORT || '8085'),
    forceTLS:          import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:        'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  })

  _currentToken = token
  return echoInstance
}

export function useReverb() {
  const activeChannels = ref([])

  // ── Chat channel ─────────────────────────────────────────────────────────

  const subscribeToChat = (conversationUuid, handlers = {}) => {
    const echo = getEcho()
    if (!echo) return null

    const channelName = `chat.${conversationUuid}`
    const channel = echo.private(channelName)

    if (handlers.onMessage) {
      channel.listen('.App\\Modules\\Chat\\Events\\MessageSent', handlers.onMessage)
    }
    if (handlers.onRead) {
      channel.listen('.App\\Modules\\Chat\\Events\\MessageRead', handlers.onRead)
    }
    if (handlers.onTyping) {
      channel.listen('.App\\Modules\\Chat\\Events\\UserTyping', handlers.onTyping)
    }
    if (handlers.onMessageUpdated) {
      channel.listen('.App\\Modules\\Chat\\Events\\MessageUpdated', handlers.onMessageUpdated)
    }
    if (handlers.onMessageDeleted) {
      channel.listen('.App\\Modules\\Chat\\Events\\MessageDeleted', handlers.onMessageDeleted)
    }

    activeChannels.value.push({ name: channelName, type: 'private' })
    return channel
  }

  const unsubscribeFromChat = (conversationUuid) => {
    const echo = getEcho()
    if (!echo) return

    const channelName = `chat.${conversationUuid}`
    echo.leaveChannel(channelName)
    activeChannels.value = activeChannels.value.filter(ch => ch.name !== channelName)
  }

  // ── User/notification channel ─────────────────────────────────────────────

  const subscribeToUser = (userUuid, handlers = {}) => {
    const echo = getEcho()
    if (!echo) return null

    const channelName = `user.${userUuid}`
    const channel = echo.private(channelName)

    const onNotification =
      typeof handlers === 'function' ? handlers : handlers?.onNotification

    // Receive Laravel DB notifications broadcast via the user channel
    channel.notification((notification) => {
      if (onNotification) onNotification(notification)
    })

    if (handlers && typeof handlers === 'object') {
      if (handlers.onConnectionRequestSent) {
        channel.listen(
          '.App\\Modules\\Discover\\Events\\ConnectionRequestSent',
          handlers.onConnectionRequestSent,
        )
      }
      if (handlers.onConnectionRequestAccepted) {
        channel.listen(
          '.App\\Modules\\Discover\\Events\\ConnectionRequestAccepted',
          handlers.onConnectionRequestAccepted,
        )
      }
    }

    activeChannels.value.push({ name: channelName, type: 'private' })
    return channel
  }

  const unsubscribeFromUser = (userUuid) => {
    const echo = getEcho()
    if (!echo) return

    const channelName = `user.${userUuid}`
    echo.leaveChannel(channelName)
    activeChannels.value = activeChannels.value.filter(ch => ch.name !== channelName)
  }

  // ── Lifecycle cleanup ──────────────────────────────────────────────────────

  const disconnect = () => {
    if (echoInstance) {
      echoInstance.disconnect()
      echoInstance = null
      _currentToken = null
    }
  }

  onUnmounted(() => {
    const echo = getEcho()
    if (!echo) return
    activeChannels.value.forEach(ch => echo.leaveChannel(ch.name))
  })

  return {
    getEcho,
    subscribeToChat,
    unsubscribeFromChat,
    subscribeToUser,
    unsubscribeFromUser,
    disconnect,
  }
}
