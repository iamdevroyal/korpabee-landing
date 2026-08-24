import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'

export function useNotifications() {
  const store = useNotificationsStore()
  const { notifications, unreadCount, loading } = storeToRefs(store)

  return {
    notifications,
    unreadCount,
    loading,
    fetchNotifications: store.fetchNotifications,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    deleteNotification: store.deleteNotification,
    saveFCMToken: store.saveFCMToken,
    removeFCMToken: store.removeFCMToken,
    handleIncomingNotification: store.handleIncomingNotification,
  }
}
