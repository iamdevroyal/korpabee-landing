import { storeToRefs } from 'pinia'
import { useFeedStore } from '@/stores/feed'

export function useFeed() {
  const store = useFeedStore()
  const { posts, nextCursor, loading, hasMore, feedType, trendingHashtags, loadingTrending } = storeToRefs(store)

  return {
    posts,
    nextCursor,
    loading,
    hasMore,
    feedType,
    trendingHashtags,
    loadingTrending,
    setFeedType: store.setFeedType,
    resetFeed: store.resetFeed,
    fetchFeed: store.fetchFeed,
    fetchTrendingHashtags: store.fetchTrendingHashtags,
    createPost: store.createPost,
    deletePost: store.deletePost,
    toggleLike: store.toggleLike,
    addComment: store.addComment,
    removeComment: store.removeComment,
  }
}
