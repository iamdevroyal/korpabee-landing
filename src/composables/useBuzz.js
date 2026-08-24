import { storeToRefs } from 'pinia'
import { useBuzzStore } from '@/stores/buzz'

export function useBuzz() {
  const store = useBuzzStore()
  const {
    items,
    nextCursor,
    loading,
    hasMore,
    feedType,
    submitting,
    error,
  } = storeToRefs(store)

  return {
    // ── Reactive state ────────────────────────────────────────────────────────
    items,
    nextCursor,
    loading,
    hasMore,
    feedType,
    submitting,
    error,

    // ── Actions ───────────────────────────────────────────────────────────────
    setFeedType:   store.setFeedType,
    resetFeed:     store.resetFeed,
    fetchFeed:     store.fetchFeed,
    createBuzz:    store.createBuzz,
    deleteBuzz:    store.deleteBuzz,
    toggleLike:    store.toggleLike,
    toggleSave:    store.toggleSave,
    addComment:    store.addComment,
    removeComment: store.removeComment,
  }
}
