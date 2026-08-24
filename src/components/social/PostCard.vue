<template>
  <div ref="cardRoot" class="bg-white rounded-2xl border border-navy-100/50 p-5 shadow-sm hover:shadow-md transition-all duration-300">
    <!-- Post Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <router-link :to="`/users/${post.user?.uuid}`" class="block relative">
          <img
            :src="post.user?.avatar || 'https://via.placeholder.com/150'"
            class="w-11 h-11 rounded-full border border-navy-150 object-cover hover:opacity-90 transition-opacity"
            alt="Avatar"
          />
          <span v-if="post.user?.is_online" class="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Online now"></span>
        </router-link>
        <div>
          <div class="flex items-center space-x-1.5">
            <router-link :to="`/users/${post.user?.uuid}`" class="text-sm font-extrabold text-navy-900 hover:text-teal-600 transition-colors">
              {{ post.user?.name }}
            </router-link>
            <VerificationBadge v-if="post.user?.corper_profile?.is_verified" type="corper_verified" />
            <PremiumBadge v-if="post.user?.corper_profile?.is_verified_pro" tier="pro"/>
            <PremiumBadge v-else-if="post.user?.corper_profile?.is_verified_lite" tier="lite"/>
          </div>
          <div class="flex items-center space-x-1.5 mt-0.5 text-xs text-gray-400 font-medium">
            <span>{{ formatTime(post.created_at) }}</span>
            <span>•</span>
            <span class="capitalize text-indigo-600 font-semibold">{{ post.visibility }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <FollowButton
          v-if="post.user?.uuid !== currentUser?.uuid"
          :user-uuid="post.user?.uuid"
          :initial-is-following="post.user?.is_following"
        />
        <button
          v-if="post.user?.uuid !== currentUser?.uuid"
          @click="reportModalOpen = true"
          class="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          title="Report Post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        </button>
        <button
          v-if="post.user?.uuid === currentUser?.uuid || currentUser?.role === 'admin' || currentUser?.role === 'moderator'"
          @click="deleteHandler"
          class="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          title="Delete Post"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Reshared-from banner ──────────────────────────────────────────────── -->
    <div v-if="post.is_shared && post.user" class="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold mb-2 -mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      <span>{{ post.user.name }} reshared</span>
    </div>

    <!-- Post Content -->
    <div class="mb-4">
      <div
        v-if="post.bg && post.bg !== 'none'"
        class="p-6 rounded-2xl text-center text-white shadow-sm overflow-hidden my-2 cursor-pointer"
        :style="cardBgStyle"
      >
        <p class="whitespace-pre-wrap leading-relaxed drop-shadow text-base sm:text-lg" :style="cardTextStyle">
          {{ post.content }}
        </p>
      </div>
      <div
        v-else
        ref="contentEl"
        :class="[
          'text-sm text-navy-800 leading-relaxed break-words whitespace-pre-wrap',
          !isExpanded ? 'line-clamp-4-custom' : ''
        ]"
        :style="cardTextStyle"
      >
        <template v-for="(part, index) in parsedContent" :key="index">
          <HashtagChip v-if="part.isHashtag" :name="part.name" />
          <span v-else>{{ part.text }}</span>
        </template>
      </div>
      <button
        v-if="hasMoreText && (!post.bg || post.bg === 'none')"
        @click="isExpanded = !isExpanded"
        class="text-indigo-600 hover:text-indigo-700 text-xs font-bold mt-1 inline-block focus:outline-none transition-colors"
      >
        {{ isExpanded ? 'Show less' : 'See more' }}
      </button>
    </div>

    <!-- ── Original Post Preview (reshare) ──────────────────────────────────── -->
    <OriginalPostPreview
      v-if="post.is_shared && post.original_post"
      :post="post.original_post"
      class="mb-4"
    />

    <!-- ── Media Grid ── -->
    <div v-if="post.media && post.media.length > 0" class="mb-4 overflow-hidden rounded-xl border border-navy-55/35">

      <!-- 1 item: full width, tall -->
      <div v-if="post.media.length === 1" class="media-single" @click="openLightbox(0)">
        <img v-if="post.media[0].type === 'image'" :src="post.media[0].url" class="media-single-img" />
        <!-- Video with ad-break support -->
        <template v-else-if="post.media[0].type === 'video'">
          <div class="media-single" style="position:relative;">
            <video
              ref="postVideoEl"
              :src="post.media[0].url"
              controls
              class="media-single-img bg-black"
              @play="onVideoPlay"
              @timeupdate="onVideoTimeUpdate"
              @pause="onVideoPause"
            />
          </div>
        </template>
      </div>

      <!-- 2 items: side by side equal squares -->
      <div v-else-if="post.media.length === 2" class="media-grid-2">
        <div v-for="(item, i) in post.media" :key="i" class="media-cell" @click="openLightbox(i)">
          <img v-if="item.type === 'image'" :src="item.url" class="media-cell-img" />
          <video v-else :src="item.url" class="media-cell-img bg-black" />
          <div class="media-play-overlay" v-if="item.type === 'video'"><PlayIcon /></div>
        </div>
      </div>

      <!-- 3 items: tall left + 2 stacked right -->
      <div v-else-if="post.media.length === 3" class="media-grid-3">
        <div class="media-cell media-cell-tall" @click="openLightbox(0)">
          <img v-if="post.media[0].type === 'image'" :src="post.media[0].url" class="media-cell-img" />
          <video v-else :src="post.media[0].url" class="media-cell-img bg-black" />
          <div class="media-play-overlay" v-if="post.media[0].type === 'video'"><PlayIcon /></div>
        </div>
        <div class="media-grid-3-right">
          <div v-for="i in [1, 2]" :key="i" class="media-cell" @click="openLightbox(i)">
            <img v-if="post.media[i].type === 'image'" :src="post.media[i].url" class="media-cell-img" />
            <video v-else :src="post.media[i].url" class="media-cell-img bg-black" />
            <div class="media-play-overlay" v-if="post.media[i].type === 'video'"><PlayIcon /></div>
          </div>
        </div>
      </div>

      <!-- 4+ items: 2x2 grid, last cell shows overflow -->
      <div v-else class="media-grid-4">
        <div
          v-for="(item, i) in post.media.slice(0, 4)"
          :key="i"
          class="media-cell"
          @click="openLightbox(i)"
        >
          <img v-if="item.type === 'image'" :src="item.url" class="media-cell-img" />
          <video v-else :src="item.url" class="media-cell-img bg-black" />
          <div class="media-play-overlay" v-if="item.type === 'video'"><PlayIcon /></div>
          <div v-if="i === 3 && post.media.length > 4" class="media-overflow-badge">
            +{{ post.media.length - 4 }}
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons Counters -->
    <div class="flex items-center justify-between text-xs text-gray-400 font-medium py-2.5 border-t border-b border-navy-50/50">
      <div class="flex items-center space-x-1.5 hover:text-indigo-600 cursor-pointer">
        <span>{{ post.likes_count }} Likes</span>
      </div>
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer" @click="toggleComments">
          <span>{{ post.comments_count }} Comments</span>
        </div>
        <!-- Shares count — only shown once at least 1 share exists -->
        <div v-if="post.shares_count" class="flex items-center space-x-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>{{ post.shares_count }}</span>
        </div>
        <!-- Views count — always shown -->
        <div class="flex items-center space-x-1 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{{ formatCount(post.views_count || 0) }} Views</span>
        </div>
      </div>
    </div>

    <!-- Interactive Actions -->
    <div class="flex items-center justify-around py-1.5">
      <button
        @click="likeHandler"
        :class="[
          'flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300',
          post.is_liked ? 'text-red-500 bg-red-500/5' : 'text-gray-500 hover:text-navy-900 hover:bg-gray-50'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" :fill="post.is_liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>Like</span>
      </button>
      <button
        @click="toggleComments"
        :class="[
          'flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-navy-900 hover:bg-gray-50 transition-all duration-300',
          showComments ? 'text-indigo-300 bg-indigo-500/5' : ''
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>Comment</span>
      </button>
      <!-- Share button — hidden on reshares that are themselves reshares (prevent chain resharing) -->
      <button
        v-if="!post.is_shared || post.original_post"
        @click="shareModalOpen = true"
        class="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
        id="share-post-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span>Share</span>
      </button>
    </div>

    <CommentList
      v-if="showComments"
      :post-uuid="post.uuid"
      @comment-added="post.comments_count++"
      @comment-removed="post.comments_count = Math.max(0, post.comments_count - 1)"
    />

    <!-- Ad Break Overlay — mounted inside the post card's stacking context,
         teleported to body so it sits above all other content. -->
    <AdBreakOverlay
      v-if="adBreakActive && adBreakAd"
      :ad="adBreakAd"
      :tracking-token="adBreakToken"
      :token-timestamp="adBreakTimestamp"
      :muted="postVideoMuted"
      @complete="onAdBreakComplete"
    />
  </div>

  <!-- ── Lightbox Modal ── -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div v-if="lightboxOpen" class="lightbox-backdrop" @click.self="closeLightbox">

        <!-- Close -->
        <button class="lightbox-close" @click="closeLightbox">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Counter -->
        <div class="lightbox-counter">{{ lightboxIndex + 1 }} / {{ post.media.length }}</div>

        <!-- Prev -->
        <button v-if="post.media.length > 1" class="lightbox-nav lightbox-nav-prev" @click="prevMedia">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <!-- Media -->
        <div class="lightbox-media-wrap">
          <Transition :name="slideDirection" mode="out-in">
            <div :key="lightboxIndex" class="lightbox-media-inner">
              <img
                v-if="currentMedia.type === 'image'"
                :src="currentMedia.url"
                class="lightbox-img"
                @click.stop
              />
              <video
                v-else-if="currentMedia.type === 'video'"
                :src="currentMedia.url"
                controls
                autoplay
                class="lightbox-video"
                @click.stop
              />
            </div>
          </Transition>
        </div>

        <!-- Next -->
        <button v-if="post.media.length > 1" class="lightbox-nav lightbox-nav-next" @click="nextMedia">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <!-- Post details panel -->
        <div class="lightbox-details" @click.stop>
          <!-- Author -->
          <div class="lightbox-author">
            <img
              :src="post.user?.avatar || 'https://via.placeholder.com/150'"
              class="lightbox-author-avatar"
            />
            <div>
              <p class="lightbox-author-name">{{ post.user?.name }}</p>
              <p class="lightbox-author-meta">{{ formatTime(post.created_at) }} • {{ post.visibility }}</p>
            </div>
          </div>
          <!-- Content -->
          <p v-if="post.content" class="lightbox-content">{{ post.content }}</p>
          <!-- Dots -->
          <div v-if="post.media.length > 1" class="lightbox-dots">
            <button
              v-for="(_, i) in post.media"
              :key="i"
              class="lightbox-dot"
              :class="{ 'lightbox-dot-active': i === lightboxIndex }"
              @click="goToMedia(i)"
            />
          </div>
          <!-- Actions -->
          <div class="lightbox-actions">
            <button
              @click="likeHandler"
              :class="['lightbox-action-btn', post.is_liked ? 'lightbox-action-liked' : '']"
            >
              <svg class="h-4 w-4" :fill="post.is_liked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ post.likes_count }} Likes</span>
            </button>
            <button class="lightbox-action-btn" @click="closeLightbox(); showComments = true">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ post.comments_count }} Comments</span>
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>

  <ReportModal
    v-if="reportModalOpen && (post?.id || post?.uuid)"
    :open="reportModalOpen"
    target-type="post"
    :target-id="post.id ?? post.uuid"
    @close="reportModalOpen = false"
  />

  <!-- Share post modal -->
  <SharePostModal
    v-if="shareModalOpen"
    v-model="shareModalOpen"
    :post="shareTarget"
    @shared="onPostShared"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFeed } from '@/composables/useFeed'
import { useNetwork } from '@/composables/useNetwork'
import { usePostImpressions } from '@/composables/usePostImpressions'
import { getNextAd } from '@/api/ads'
import VerificationBadge from '@/components/profile/VerificationBadge.vue'
import PremiumBadge from '@/components/profile/PremiumBadge.vue'
import FollowButton from '@/components/profile/FollowButton.vue'
import HashtagChip from './HashtagChip.vue'
import CommentList from './CommentList.vue'
import AdBreakOverlay from './AdBreakOverlay.vue'
import ReportModal from '@/components/shared/ReportModal.vue'
import SharePostModal from './SharePostModal.vue'
import OriginalPostPreview from './OriginalPostPreview.vue'

// Inline play icon to avoid extra import
const PlayIcon = {
  template: `<svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.45)"/><polygon points="10,8 18,12 10,16" fill="white"/></svg>`
}

const props = defineProps({
  post: { type: Object, required: true }
})

const emit = defineEmits(['deleted'])

const { user: currentUser } = useAuth()
const { toggleLike, deletePost } = useFeed()
const { guardOnline } = useNetwork()

// ── Share modal ───────────────────────────────────────────────────────────────
const shareModalOpen = ref(false)
// When sharing a reshare, we pass the original post so the modal previews it
const shareTarget = computed(() => {
  if (props.post.is_shared && props.post.original_post && !props.post.original_post.deleted) {
    return props.post.original_post
  }
  return props.post
})

function onPostShared() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (document.documentElement) {
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
  }
  if (document.body) {
    document.body.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const scrollContainers = document.querySelectorAll('main, .overflow-y-auto, #app-content, .feed-container')
  scrollContainers.forEach((el) => {
    if (el && el.scrollTop > 0) {
      el.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

const showComments = ref(false)
const reportModalOpen = ref(false)
const toggleComments = () => { showComments.value = !showComments.value }

// ── Impression tracking ───────────────────────────────────────────────────────
const cardRoot = ref(null)
const { register: registerImpression } = usePostImpressions(cardRoot, props.post.uuid)

// ─── See More / Show Less state ───
const contentEl = ref(null)
const isExpanded = ref(false)
const hasMoreText = ref(false)

// ── Utility: compact number format ────────────────────────────────────────────
function formatCount(n) {
  if (!n) return 0
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n
}

function checkTruncation() {
  nextTick(() => {
    if (contentEl.value) {
      hasMoreText.value = contentEl.value.scrollHeight > contentEl.value.clientHeight
    }
  })
}

onMounted(() => {
  checkTruncation()
  // Register card with impression observer after DOM is ready
  nextTick(() => registerImpression())
})

watch(() => props.post.content, () => {
  isExpanded.value = false
  checkTruncation()
})

// ─── Video ad-break state ─────────────────────────────────────────────────────
// Only active for posts where post.has_ad_break === true.
// The ad is preloaded on first play to avoid a loading gap at trigger time.

const postVideoEl      = ref(null)          // ref to the <video> element
const postVideoMuted   = ref(false)         // tracks mute state to pass to overlay
const adBreakFired     = ref(false)         // fired-once guard (seek/scrub safe)
const adBreakPreloaded = ref(false)         // tracks whether preload call went out
const adBreakActive    = ref(false)         // true while overlay is shown
const adBreakAd        = ref(null)          // preloaded ad object
const adBreakToken     = ref(null)          // HMAC token
const adBreakTimestamp = ref(null)          // token timestamp

/**
 * Preload the ad-break ad as soon as the user starts playing the video.
 * Called once — subsequent play events are ignored via adBreakPreloaded guard.
 */
async function onVideoPlay() {
  postVideoMuted.value = postVideoEl.value?.muted ?? false

  if (!props.post.has_ad_break || adBreakPreloaded.value || adBreakFired.value) return
  adBreakPreloaded.value = true

  try {
    const res = await getNextAd('video_break')
    if (res?.data?.data) {
      adBreakAd.value        = res.data.data.ad
      adBreakToken.value     = res.data.data.tracking_token
      adBreakTimestamp.value = res.data.data.expires_at
        ? Math.floor(new Date(res.data.data.expires_at).getTime() / 1000)
        : null
    }
  } catch (err) {
    // Preload failed — ad break will be silently skipped at trigger time
    console.error('[PostCard] ad preload failed', err)
  }
}

function onVideoPause() {
  postVideoMuted.value = postVideoEl.value?.muted ?? false
}

/**
 * @timeupdate handler — fires the ad break once when playhead crosses the threshold.
 * The fired-once flag prevents re-triggering on seek/scrub.
 */
function onVideoTimeUpdate() {
  if (!props.post.has_ad_break) return
  if (adBreakFired.value) return
  if (!adBreakAd.value) return     // ad not preloaded yet — skip silently

  const breakAt = props.post.ad_break_at_seconds
  if (!breakAt) return

  const current = postVideoEl.value?.currentTime ?? 0
  if (current >= breakAt) {
    adBreakFired.value  = true    // never re-trigger
    adBreakActive.value = true
    postVideoEl.value?.pause()   // pause the post video
  }
}

/**
 * Called when the ad-break overlay emits @complete.
 * Hides the overlay and resumes the post video.
 */
function onAdBreakComplete() {
  adBreakActive.value = false
  postVideoEl.value?.play().catch(() => {})
}

// ── Lightbox state ──
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const slideDirection = ref('slide-left')

const currentMedia = computed(() => props.post.media?.[lightboxIndex.value] || {})

const openLightbox = (index) => {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const prevMedia = () => {
  slideDirection.value = 'slide-right'
  lightboxIndex.value = (lightboxIndex.value - 1 + props.post.media.length) % props.post.media.length
}

const nextMedia = () => {
  slideDirection.value = 'slide-left'
  lightboxIndex.value = (lightboxIndex.value + 1) % props.post.media.length
}

const goToMedia = (i) => {
  slideDirection.value = i > lightboxIndex.value ? 'slide-left' : 'slide-right'
  lightboxIndex.value = i
}

// Keyboard navigation
const onKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextMedia()
  if (e.key === 'ArrowLeft') prevMedia()
  if (e.key === 'Escape') closeLightbox()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

// ── Parsed content ──
const parsedContent = computed(() => {
  const text = props.post.content
  if (!text) return []
  return text.split(/(\s+)/).map(token => {
    if (token.startsWith('#') && token.length > 1) {
      return { isHashtag: true, text: token, name: token.replace(/[^\w]/g, '') }
    }
    return { isHashtag: false, text: token }
  })
})

const BUZZ_BG_MAP = {
  violet:    'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
  sunset:    'linear-gradient(135deg,#F59E0B,#EF4444)',
  forest:    'linear-gradient(135deg,#10B981,#059669)',
  ocean:     'linear-gradient(135deg,#3B82F6,#8B5CF6)',
  rose:      'linear-gradient(135deg,#EC4899,#F43F5E)',
  night:     'linear-gradient(135deg,#1A1535,#2D2B55)',
  nysc:      'linear-gradient(135deg,#16A34A,#15803D)',
  midnight:  'linear-gradient(135deg,#0F172A,#1E293B)',
  gold:      'linear-gradient(135deg,#F59E0B,#D97706)',
  neon:      'linear-gradient(135deg,#06B6D4,#3B82F6)',
  cherry:    'linear-gradient(135deg,#DC2626,#991B1B)',
  lavender:  'linear-gradient(135deg,#A855F7,#EC4899)',
  fire:      'linear-gradient(135deg,#EA580C,#CA8A04)',
}

const FONT_FAMILY_MAP = {
  sans:       "Inter, system-ui, -apple-system, sans-serif",
  serif:      "Georgia, 'Times New Roman', Merriweather, serif",
  mono:       "'Courier New', Courier, monospace",
  cursive:    "'Caveat', 'Comic Sans MS', cursive",
  impact:     "Impact, 'Arial Black', sans-serif",
}

const FONT_WEIGHT_MAP = {
  normal: "400",
  medium: "500",
  bold:   "700",
  black:  "900",
}

const cardBgStyle = computed(() => {
  const bg = props.post?.bg
  if (bg && bg !== 'none' && BUZZ_BG_MAP[bg]) return { background: BUZZ_BG_MAP[bg] }
  if (bg && (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('linear-gradient'))) return { background: bg }
  return {}
})

const cardTextStyle = computed(() => {
  const fontStyle = props.post?.font_style
  const fontWeight = props.post?.font_weight
  const styles = {}
  if (fontStyle && FONT_FAMILY_MAP[fontStyle]) styles.fontFamily = FONT_FAMILY_MAP[fontStyle]
  if (fontWeight && FONT_WEIGHT_MAP[fontWeight]) styles.fontWeight = FONT_WEIGHT_MAP[fontWeight]
  return styles
})

const likeHandler = guardOnline(async () => {
  try { await toggleLike(props.post) } catch (err) { console.error(err) }
})

const deleteHandler = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    await deletePost(props.post.uuid)
    emit('deleted', props.post.uuid)
  } catch (err) {
    console.error('Failed to delete post:', err)
  }
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) return interval + 'y ago'
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) return interval + 'mo'
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) return interval + 'd ago'
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) return interval + 'h ago'
  interval = Math.floor(seconds / 60)
  if (interval >= 1) return interval + 'm ago'
  return 'Just now'
}
</script>

<style scoped>
/* ── Media: single ── */
.media-single {
  cursor: pointer;
  overflow: hidden;
}
.media-single-img {
  width: 100%;
  max-height: 440px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.media-single:hover .media-single-img {
  transform: scale(1.02);
}

/* ── Media cell (shared) ── */
.media-cell {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #0f0f0f;
}
.media-cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.media-cell:hover .media-cell-img {
  transform: scale(1.04);
}

/* ── 2-item grid ── */
.media-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  height: 280px;
}
.media-grid-2 .media-cell {
  height: 100%;
}

/* ── 3-item grid ── */
.media-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  height: 300px;
}
.media-cell-tall {
  height: 100%;
}
.media-grid-3-right {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  height: 100%;
}
.media-grid-3-right .media-cell {
  height: 100%;
}

/* ── 4-item grid ── */
.media-grid-4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  height: 320px;
}
.media-grid-4 .media-cell {
  height: 100%;
}

/* ── Overflow badge ── */
.media-overflow-badge {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

/* ── Play overlay ── */
.media-play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* ── Lightbox backdrop ── */
.lightbox-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

/* ── Lightbox close ── */
.lightbox-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}
.lightbox-close:hover { background: rgba(255,255,255,0.22); }

/* ── Counter ── */
.lightbox-counter {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 10;
}

/* ── Nav arrows ── */
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}
.lightbox-nav:hover { background: rgba(255,255,255,0.24); }
.lightbox-nav-prev { left: 12px; }
.lightbox-nav-next { right: 12px; }

/* on mobile, shift arrows inward when details panel is shown */
@media (max-width: 768px) {
  .lightbox-nav { top: 38%; }
}

/* ── Media area ── */
.lightbox-media-wrap {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 60px 64px 0;
  max-height: calc(100vh - 220px);
}
.lightbox-media-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}
.lightbox-video {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  display: block;
}

/* ── Details panel ── */
.lightbox-details {
  width: 100%;
  max-width: 640px;
  padding: 16px 20px 20px;
  margin-top: 12px;
  background: rgba(255,255,255,0.06);
  border-top: 1px solid rgba(255,255,255,0.1);
  border-radius: 0 0 8px 8px;
}

.lightbox-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.lightbox-author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.2);
  flex-shrink: 0;
}
.lightbox-author-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  line-height: 1.2;
}
.lightbox-author-meta {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-top: 1px;
  text-transform: capitalize;
}
.lightbox-content {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

/* ── Dots ── */
.lightbox-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 12px;
}
.lightbox-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}
.lightbox-dot-active {
  background: #fff;
  transform: scale(1.3);
}

/* ── Lightbox actions ── */
.lightbox-actions {
  display: flex;
  gap: 12px;
}
.lightbox-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.lightbox-action-btn:hover { background: rgba(255,255,255,0.18); }
.lightbox-action-liked { color: #f87171; }

/* ── Lightbox transition ── */
.lightbox-enter-active, .lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from, .lightbox-leave-to {
  opacity: 0;
}

/* ── Slide transitions ── */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.22s ease;
}
.slide-left-enter-from  { transform: translateX(40px); opacity: 0; }
.slide-left-leave-to    { transform: translateX(-40px); opacity: 0; }
.slide-right-enter-from { transform: translateX(-40px); opacity: 0; }
.slide-right-leave-to   { transform: translateX(40px); opacity: 0; }

/* ── Mobile ── */
@media (max-width: 768px) {
  .lightbox-media-wrap {
    padding: 52px 12px 0;
    max-height: calc(100vh - 240px);
  }
  .lightbox-details {
    padding: 12px 16px 16px;
  }
  .media-grid-2 { height: 200px; }
  .media-grid-3 { height: 240px; }
  .media-grid-4 { height: 260px; }
}

.line-clamp-4-custom {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>