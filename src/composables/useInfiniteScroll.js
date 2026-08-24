import { ref, onMounted, onUnmounted, watch } from 'vue'

export function useInfiniteScroll(sentinelRef, callback, options = {}) {
  const isIntersecting = ref(false)
  let observer = null

  const defaultOptions = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1,
    disabled: false,
    ...options,
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const initObserver = () => {
    cleanup()

    if (defaultOptions.disabled || !sentinelRef.value) return

    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
      if (entry.isIntersecting) {
        callback()
      }
    }, defaultOptions)

    observer.observe(sentinelRef.value)
  }

  onMounted(() => {
    initObserver()
  })

  onUnmounted(() => {
    cleanup()
  })

  // Re-initialize observer if sentinel ref changes or is enabled/disabled
  watch([sentinelRef, () => defaultOptions.disabled], () => {
    initObserver()
  })

  return {
    isIntersecting,
  }
}
