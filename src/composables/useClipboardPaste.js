import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Watches for image/screenshot paste events and forwards each pasted
 * image as a File. Text paste is ignored - the message textbox already
 * handles that natively.
 *
 * @param {(file: File) => void} onImageFile
 */
export function useClipboardPaste(onImageFile) {
  const isSupported = typeof window !== 'undefined' && 'ClipboardEvent' in window

  const handlePaste = (event) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const raw = item.getAsFile()
        if (!raw) continue
        const named = new File([raw], raw.name || `pasted-image-${Date.now()}.png`, {
          type: raw.type,
        })
        onImageFile?.(named)
      }
    }
  }

  onMounted(() => {
    if (isSupported) window.addEventListener('paste', handlePaste)
  })
  onBeforeUnmount(() => {
    if (isSupported) window.removeEventListener('paste', handlePaste)
  })

  return { isSupported }
}
