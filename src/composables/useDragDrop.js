import { ref } from 'vue'

/**
 * Desktop-only drag-and-drop file upload support. Bind the returned
 * handlers to a drop-zone element's dragenter/dragover/dragleave/drop
 * events, and use `isDragging` to toggle a drag overlay.
 *
 * @param {(files: File[]) => void} onFilesDropped
 */
export function useDragDrop(onFilesDropped) {
  const isDragging = ref(false)
  let dragCounter = 0

  const isDesktop =
    typeof window !== 'undefined' &&
    !('ontouchstart' in window) &&
    !/Mobi|Android/i.test(navigator.userAgent || '')

  const onDragEnter = (event) => {
    if (!isDesktop) return
    if (!event.dataTransfer?.types?.includes('Files')) return
    event.preventDefault()
    dragCounter += 1
    isDragging.value = true
  }

  const onDragOver = (event) => {
    if (!isDesktop) return
    if (!event.dataTransfer?.types?.includes('Files')) return
    event.preventDefault()
  }

  const onDragLeave = (event) => {
    if (!isDesktop) return
    event.preventDefault()
    dragCounter = Math.max(0, dragCounter - 1)
    if (dragCounter === 0) isDragging.value = false
  }

  const onDrop = (event) => {
    if (!isDesktop) return
    event.preventDefault()
    dragCounter = 0
    isDragging.value = false
    const files = Array.from(event.dataTransfer?.files || [])
    if (files.length) onFilesDropped?.(files)
  }

  return { isDesktop, isDragging, onDragEnter, onDragOver, onDragLeave, onDrop }
}
