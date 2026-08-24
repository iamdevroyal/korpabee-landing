// composables/useToast.js
import { ref } from 'vue'

// Module-level singleton so any component can push/read toasts
const toasts = ref([])
let _nextId = 1

export function useToast() {
    /**
     * Show a toast notification.
     *
     * @param {object} options
     * @param {string} options.title    - Bold heading line
     * @param {string} options.message - Body text
     * @param {number} [options.duration=4000] - Auto-dismiss delay in ms
     */
    function showToast({ title = 'Notification', message = '', duration = 4000 } = {}) {
        const id = _nextId++
        toasts.value.push({ id, title, message, duration })
    }

    /**
     * Remove a toast by its id (called by NotifToast on @close).
     */
    function removeToast(id) {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return { toasts, showToast, removeToast }
}