import { ref } from 'vue'

/**
 * Wraps the Contact Picker API (navigator.contacts) for "Share Contact".
 * Feature-detects and never throws — unsupported browsers just get
 * `error.value === 'unsupported'` back.
 *
 * @returns {{
 *   isSupported: boolean,
 *   error: import('vue').Ref<null|'unsupported'|'error'>,
 *   pickContact: () => Promise<null|{ name?: string[], tel?: string[], email?: string[] }>
 * }}
 */
export function useContactPicker() {
  const isSupported =
    typeof navigator !== 'undefined' && 'contacts' in navigator && 'ContactsManager' in window
  const error = ref(null)

  const pickContact = async () => {
    error.value = null

    if (!isSupported) {
      error.value = 'unsupported'
      return null
    }

    try {
      const properties = ['name', 'tel', 'email']
      const [contact] = await navigator.contacts.select(properties, { multiple: false })
      return contact || null
    } catch {
      // Includes the user cancelling the picker - treat as a silent no-op, not an error.
      return null
    }
  }

  return { isSupported, error, pickContact }
}
