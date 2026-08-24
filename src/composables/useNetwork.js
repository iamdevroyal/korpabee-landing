/**
 * useNetwork.js
 *
 * Reactive singleton for network connectivity state.
 * Wraps navigator.onLine + browser online/offline events.
 *
 * Usage:
 *   const { isOnline, guardOnline } = useNetwork()
 *
 *   // In a template button:
 *   @click="guardOnline(handleSubmit)"
 *
 *   // In a store action:
 *   if (!isOnline.value) return   // serve persisted cache silently
 */
import { ref } from 'vue'

// Singleton state — shared across all useNetwork() callers
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)

// Event listeners attached once at module load
if (typeof window !== 'undefined') {
  window.addEventListener('online',  () => { isOnline.value = true  })
  window.addEventListener('offline', () => { isOnline.value = false })
}

export function useNetwork() {
  /**
   * Wrap a write-action handler so it is a no-op when offline.
   * The UI should show `useUiStore().showToast(...)` — this helper does that
   * automatically so call sites stay clean.
   *
   * @param {Function} fn - the action to guard
   * @returns {Function} - wrapped function that is a no-op offline
   */
  const guardOnline = (fn) => async (...args) => {
    if (!isOnline.value) {
      const { useUiStore } = await import('@/stores/ui')
      useUiStore().showToast("You're offline. Connect to the internet to do this.", 'warning')
      return
    }
    return fn(...args)
  }

  return {
    isOnline,
    guardOnline,
  }
}
