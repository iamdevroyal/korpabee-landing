// composables/useBuzzHives.js
import { storeToRefs } from 'pinia'
import { useBuzzHivesStore } from '@/stores/buzzhives'

export function useBuzzHives() {
  const store = useBuzzHivesStore()

  // storeToRefs exposes state + getters as reactive refs
  const {
    buzzes,
    loading,
    loadingMore,
    hasMore,
    error,
    feedType,
    activeBuzzIdx,
    activeBuzz,
    comments,
    commentsLoading,
  } = storeToRefs(store)

  return {
    // ── Reactive state / getters ─────────────────────────────────────────────
    buzzes,
    loading,
    loadingMore,
    hasMore,
    error,
    feedType,
    activeBuzzIdx,
    activeBuzz,
    comments,
    commentsLoading,

    // ── Actions ──────────────────────────────────────────────────────────────
    setFeedType:      store.setFeedType,
    resetFeed:        store.resetFeed,
    fetchFeed:        store.fetchFeed,
    loadMore:         store.loadMore,

    toggleLike:       store.toggleLike,
    toggleSave:       store.toggleSave,
    followCreator:    store.followCreator,
    unfollowCreator:  store.unfollowCreator,
    trackView:        store.trackView,
    deleteBuzz:       store.deleteBuzz,

    fetchComments:    store.fetchComments,
    addComment:       store.addComment,
    likeComment:      store.likeComment,
    deleteComment:    store.deleteComment,
  }
}
