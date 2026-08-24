<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && currentBuzz"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl select-none p-2 sm:p-4"
      >
        <!-- Background Ambient Blur -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-25 blur-3xl">
          <img v-if="currentBuzz.media?.[0]?.url" :src="currentBuzz.media[0].url" class="w-full h-full object-cover scale-125" alt="" />
          <div v-else-if="currentBuzz.bg" class="w-full h-full" :style="getBgStyle(currentBuzz.bg)" />
        </div>

        <!-- Main Story Player Container -->
        <div
          class="relative w-full max-w-sm sm:max-w-md h-[88vh] max-h-[800px] rounded-2xl sm:rounded-3xl bg-slate-900 overflow-hidden shadow-2xl flex flex-col border border-slate-800/80"
          @mousedown="onPauseHold"
          @mouseup="onResumeHold"
          @mouseleave="onResumeHold"
          @touchstart="onPauseHold"
          @touchend="onResumeHold"
        >
          <!-- Top Progress Bars Header -->
          <div class="absolute top-0 inset-x-0 z-30 p-3 sm:p-4 space-y-2.5 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent">
            <!-- Progress Bar Segments -->
            <div class="flex items-center gap-1.5 w-full">
              <div
                v-for="(b, idx) in currentGroupBuzzes"
                :key="b.uuid"
                class="flex-1 h-1 rounded-full bg-white/25 overflow-hidden"
              >
                <div
                  class="h-full bg-white transition-all ease-linear"
                  :style="progressStyle(idx)"
                />
              </div>
            </div>

            <!-- Creator Header Strip -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img
                  :src="currentGroup?.creator?.avatar || `https://www.gravatar.com/avatar/${currentGroup?.creator?.uuid}?d=identicon`"
                  class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 object-cover"
                  alt=""
                />
                <div>
                  <h4 class="text-white font-bold text-xs leading-tight drop-shadow">
                    {{ currentGroup?.creator?.name || 'Corper' }}
                  </h4>
                  <p class="text-white/70 text-[10px] font-medium leading-tight">
                    {{ formatTime(currentBuzz.created_at) }}
                  </p>
                </div>
              </div>

              <!-- Top Action Icons (Pause Indicator, Views Counter & Close) -->
              <div class="flex items-center gap-2">
                <!-- Held / Paused Indicator -->
                <div v-if="isHeld || anyReshareModalOpen" class="px-2 py-0.5 rounded-full bg-amber-500/80 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                  Paused
                </div>

                <!-- Views Counter Badge -->
                <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-semibold">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{{ currentBuzz.views_count || 0 }}</span>
                </div>

                <button
                  @click.stop="close"
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-black/80 text-white/90 flex items-center justify-center transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Story Canvas Content -->
          <div class="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
            <!-- ── Reshare type: show original buzz content ────────────────── -->
            <template v-if="currentBuzz.type === 'reshare'">
              <div class="w-full h-full flex flex-col overflow-y-auto">
                <!-- Sharer caption (if any) -->
                <div v-if="currentBuzz.content" class="px-5 pt-16 pb-2 text-white/80 text-sm font-medium">
                  {{ currentBuzz.content }}
                </div>

                <!-- Original buzz card -->
                <div v-if="currentBuzz.original_buzz && !currentBuzz.original_buzz.deleted" class="flex-1 flex flex-col mx-3 mb-3 rounded-xl overflow-hidden border border-white/10">
                  <!-- Original creator strip -->
                  <div class="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm">
                    <img v-if="currentBuzz.original_buzz.creator?.avatar" :src="currentBuzz.original_buzz.creator.avatar" class="w-6 h-6 rounded-full object-cover" alt="" />
                    <div v-else class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" :style="{ background: 'linear-gradient(135deg,#6C5CE7,#8B7CF8)' }">
                      {{ (currentBuzz.original_buzz.creator?.name || 'C').charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-white/70 text-xs font-semibold">{{ currentBuzz.original_buzz.creator?.name || 'Corper' }}</span>
                  </div>
                  <!-- Original text buzz -->
                  <div
                    v-if="!currentBuzz.original_buzz.media?.length"
                    class="flex-1 flex items-center justify-center p-5 text-center"
                    :style="getBgStyle(currentBuzz.original_buzz.bg)"
                  >
                    <p class="text-white drop-shadow-md break-words max-w-full whitespace-pre-wrap" :style="getStoryBodyStyle(currentBuzz.original_buzz)">
                      {{ currentBuzz.original_buzz.content }}
                    </p>
                  </div>
                  <!-- Original image buzz -->
                  <div v-else-if="currentBuzz.original_buzz.media[0]?.type === 'image'" class="flex-1 relative">
                    <img :src="currentBuzz.original_buzz.media[0].url" class="w-full h-full object-contain" alt="" />
                    <div v-if="currentBuzz.original_buzz.content" class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 to-transparent">
                      <p class="text-white text-xs">{{ currentBuzz.original_buzz.content }}</p>
                    </div>
                  </div>
                  <!-- Original video buzz -->
                  <div v-else-if="currentBuzz.original_buzz.media[0]?.type === 'video'" class="flex-1 relative flex items-center justify-center bg-black">
                    <video :src="currentBuzz.original_buzz.media[0].url" class="w-full h-full object-contain" controls playsinline />
                  </div>
                </div>
                <div v-else class="flex-1 flex items-center justify-center text-white/40 text-sm px-6 pt-16">
                  Original buzz was deleted
                </div>
              </div>
            </template>

            <!-- Text Buzz with Custom Background -->
            <div
              v-else-if="currentBuzz.type === 'text' || (!currentBuzz.media?.length && currentBuzz.bg)"
              class="w-full h-full flex items-center justify-center p-6 sm:p-8 text-center overflow-y-auto"
              :style="getBgStyle(currentBuzz.bg)"
            >
              <p class="text-white drop-shadow-md break-words max-w-full whitespace-pre-wrap" :style="getStoryBodyStyle(currentBuzz)">
                {{ currentBuzz.content }}
              </p>
            </div>

            <!-- Image Buzz -->
            <template v-else-if="currentBuzz.media?.[0]?.type === 'image'">
              <img
                :src="currentBuzz.media[0].url"
                class="w-full h-full object-contain"
                alt=""
              />
              <div v-if="currentBuzz.content" class="absolute bottom-28 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
                <p class="text-white text-xs sm:text-sm font-semibold leading-relaxed drop-shadow">
                  {{ currentBuzz.content }}
                </p>
              </div>
            </template>

            <!-- Video Buzz -->
            <template v-else-if="currentBuzz.media?.[0]?.type === 'video' || currentBuzz.video_url">
              <video
                ref="videoRef"
                :src="currentBuzz.media?.[0]?.url || currentBuzz.video_url"
                class="w-full h-full object-contain"
                autoplay
                playsinline
                muted
                @ended="nextStory"
                @loadedmetadata="onVideoLoaded"
              />
              <div v-if="currentBuzz.content" class="absolute bottom-28 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
                <p class="text-white text-xs sm:text-sm font-semibold leading-relaxed drop-shadow">
                  {{ currentBuzz.content }}
                </p>
              </div>
            </template>
          </div>

          <!-- Click Navigation Overlay (Left half = Prev, Right half = Next) -->
          <div class="absolute inset-x-0 top-16 bottom-28 z-20 flex">
            <div class="w-1/2 h-full cursor-pointer" @click="prevStory" />
            <div class="w-1/2 h-full cursor-pointer" @click="nextStory" />
          </div>

          <!-- Bottom Actions & Reply Bar Container -->
          <div class="relative z-30 p-3 sm:p-4 pb-14 sm:pb-6 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent flex flex-col gap-2.5">
            <!-- Action Row (Like, Comment Drawer Toggle, Save) -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  @click.stop="toggleLike"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <span>{{ currentBuzz.is_liked ? '❤️' : '🤍' }}</span>
                  <span>{{ currentBuzz.likes_count || 0 }}</span>
                </button>

                <!-- Comments Toggle Button -->
                <button
                  @click.stop="toggleCommentsSheet"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{{ currentBuzz.comments_count || 0 }} Comments</span>
                </button>
              </div>

              <div class="flex items-center gap-2">
                <!-- Reshare Button — hidden on own buzzes -->
                <button
                  v-if="currentBuzz && !currentBuzz.is_mine"
                  @click.stop="openReshareOptions"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md transition-all"
                  title="Reshare Buzz"
                  id="story-reshare-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  <span>Reshare</span>
                </button>

                <button
                  @click.stop="toggleSave"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <span>{{ currentBuzz.is_saved ? '🔖 Saved' : '🔖 Save' }}</span>
                </button>
              </div>
            </div>

            <!-- Quick Reply Comment Field -->
            <form @submit.prevent="submitComment" class="flex items-center gap-2">
              <input
                v-model="commentInput"
                type="text"
                :placeholder="`Reply to ${currentGroup?.creator?.name || 'Corper'}...`"
                class="flex-1 bg-white/10 border border-white/15 focus:border-violet-500 rounded-full px-4 py-2 text-xs text-white placeholder-white/50 focus:outline-none backdrop-blur-md"
                @focus="onPauseHold"
                @blur="onResumeHold"
              />
              <button
                type="submit"
                :disabled="!commentInput.trim() || sendingComment"
                class="px-3.5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center flex-shrink-0"
              >
                <span v-if="!sendingComment">Send</span>
                <span v-else class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              </button>
            </form>
          </div>

          <!-- Slide-up Comments Drawer Sheet -->
          <Transition name="slide-up">
            <div
              v-if="showCommentsSheet"
              class="absolute inset-x-0 bottom-0 top-16 z-40 bg-slate-950/95 backdrop-blur-xl rounded-t-3xl border-t border-slate-800 p-4 flex flex-col justify-between"
            >
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 class="text-white font-bold text-sm flex items-center gap-2">
                  <span>Comments</span>
                  <span class="text-violet-400 text-xs font-normal">({{ commentsList.length }})</span>
                </h3>
                <button
                  @click="toggleCommentsSheet"
                  class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <!-- Comments List -->
              <div class="flex-1 overflow-y-auto py-3 space-y-3">
                <div v-if="loadingComments" class="text-center py-6 text-white/50 text-xs">
                  Loading comments...
                </div>
                <div v-else-if="!commentsList.length" class="text-center py-6 text-white/40 text-xs">
                  No comments yet. Be the first to reply!
                </div>
                <div v-else v-for="c in commentsList" :key="c.uuid || c.id" class="flex gap-2.5 text-left">
                  <img
                    :src="c.user?.avatar || `https://www.gravatar.com/avatar/${c.user?.uuid}?d=identicon`"
                    class="w-7 h-7 rounded-full object-cover border border-white/20"
                    alt=""
                  />
                  <div class="flex-1 bg-white/5 rounded-2xl p-2.5 text-xs">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-white font-bold text-[11px]">{{ c.user?.name || 'Corper' }}</span>
                      <span class="text-white/40 text-[9px]">{{ formatTime(c.created_at) }}</span>
                    </div>
                    <p class="text-white/90 leading-relaxed">{{ c.content }}</p>
                  </div>
                </div>
              </div>

              <!-- Comment Sheet Form -->
              <form @submit.prevent="submitComment" class="pt-2 border-t border-slate-800 flex gap-2">
                <input
                  v-model="commentInput"
                  type="text"
                  placeholder="Write a comment..."
                  class="flex-1 bg-white/10 border border-white/15 focus:border-violet-500 rounded-full px-3.5 py-2 text-xs text-white placeholder-white/50 focus:outline-none"
                />
                <button
                  type="submit"
                  :disabled="!commentInput.trim() || sendingComment"
                  class="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all"
                >
                  Post
                </button>
              </form>
            </div>
          </Transition>

          <!-- Reshare Options Modal -->
          <BuzzReshareOptionsModal
            v-if="reshareOptionsOpen"
            v-model="reshareOptionsOpen"
            @select-buzz="openReshareBuzzModal"
            @select-feed="openShareToFeedModal"
          />

          <!-- Reshare Buzz Modal -->
          <ReshareBuzzModal
            v-if="reshareBuzzModalOpen && currentBuzz"
            v-model="reshareBuzzModalOpen"
            :buzz="currentBuzz"
            @reshared="onBuzzReshared"
          />

          <!-- Share Buzz to Feed Modal -->
          <ShareBuzzToFeedModal
            v-if="shareToFeedModalOpen && currentBuzz"
            v-model="shareToFeedModalOpen"
            :buzz="currentBuzz"
          />

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useBuzzStore } from '@/stores/buzz'
import * as buzzApi from '@/api/buzz'
import dayjs from 'dayjs'
import BuzzReshareOptionsModal from './BuzzReshareOptionsModal.vue'
import ReshareBuzzModal from './ReshareBuzzModal.vue'
import ShareBuzzToFeedModal from './ShareBuzzToFeedModal.vue'

const props = defineProps({
  isOpen:            { type: Boolean, default: false },
  storyGroups:       { type: Array,   default: () => [] },
  initialGroupIndex: { type: Number,  default: 0 },
  initialStoryIndex: { type: Number,  default: 0 },
})

const emit = defineEmits(['close'])

const buzzStore = useBuzzStore()

const groupIndex           = ref(0)
const storyIndex           = ref(0)
const progress             = ref(0)
const timer                = ref(null)
const videoRef             = ref(null)
const isHeld               = ref(false)
const commentInput         = ref('')
const sendingComment       = ref(false)
const showCommentsSheet    = ref(false)
const commentsList         = ref([])
const reshareOptionsOpen   = ref(false)
const reshareBuzzModalOpen = ref(false)
const shareToFeedModalOpen = ref(false)

const anyReshareModalOpen = computed(() => {
  return reshareOptionsOpen.value || reshareBuzzModalOpen.value || shareToFeedModalOpen.value
})

function openReshareOptions() {
  onPauseHold()
  reshareOptionsOpen.value = true
}

function openReshareBuzzModal() {
  onPauseHold()
  reshareBuzzModalOpen.value = true
}

function openShareToFeedModal() {
  onPauseHold()
  shareToFeedModalOpen.value = true
}

function onBuzzReshared(resharedData) {
  if (currentBuzz.value) {
    currentBuzz.value.shares_count = (currentBuzz.value.shares_count || 0) + 1
  }
}

watch(anyReshareModalOpen, (val) => {
  if (!val) {
    onResumeHold()
  }
})

watch(() => props.isOpen, (val) => {
  if (val) {
    document.body.classList.add('bvm-active')
  } else {
    document.body.classList.remove('bvm-active')
  }
}, { immediate: true })
const loadingComments    = ref(false)

const currentGroup = computed(() => props.storyGroups[groupIndex.value] || null)
const currentGroupBuzzes = computed(() => currentGroup.value?.buzzes || [])
const currentBuzz = computed(() => currentGroupBuzzes.value[storyIndex.value] || null)

function formatTime(d) {
  return d ? dayjs(d).fromNow() : ''
}

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

function getBgStyle(bgId) {
  if (bgId && bgId !== 'none' && BUZZ_BG_MAP[bgId]) return { background: BUZZ_BG_MAP[bgId], color: '#ffffff' }
  if (bgId && (bgId.startsWith('#') || bgId.startsWith('rgb'))) return { backgroundColor: bgId, color: '#ffffff' }
  if (bgId && bgId.includes('gradient')) return { background: bgId, color: '#ffffff' }
  return { background: 'linear-gradient(135deg,#6C5CE7,#8B7CF8)', color: '#ffffff' }
}

function getStoryBodyStyle(buzz) {
  const len = buzz?.content?.length || 0
  let fontSize = '1.35rem'
  let lineHeight = '1.45'

  if (len <= 60) {
    fontSize = '1.5rem'
    lineHeight = '1.4'
  } else if (len <= 150) {
    fontSize = '1.2rem'
    lineHeight = '1.45'
  } else if (len <= 300) {
    fontSize = '1.025rem'
    lineHeight = '1.5'
  } else {
    fontSize = '0.925rem'
    lineHeight = '1.5'
  }

  const fontStyle = buzz?.font_style
  const fontWeight = buzz?.font_weight

  return {
    fontSize,
    lineHeight,
    fontFamily: FONT_FAMILY_MAP[fontStyle] || FONT_FAMILY_MAP.sans,
    fontWeight: FONT_WEIGHT_MAP[fontWeight] || FONT_WEIGHT_MAP.bold,
  }
}

function progressStyle(idx) {
  if (idx < storyIndex.value) return { width: '100%' }
  if (idx === storyIndex.value) return { width: `${progress.value}%` }
  return { width: '0%' }
}

function startProgress(durationMs = 5000) {
  stopProgress()
  progress.value = 0
  const interval = 50
  const step = (interval / durationMs) * 100

  timer.value = setInterval(() => {
    if (!isHeld.value && !showCommentsSheet.value && !anyReshareModalOpen.value) {
      progress.value += step
      if (progress.value >= 100) {
        stopProgress()
        nextStory()
      }
    }
  }, interval)
}

function stopProgress() {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

function onPauseHold() {
  isHeld.value = true
  if (videoRef.value && typeof videoRef.value.pause === 'function') {
    videoRef.value.pause()
  }
}

function onResumeHold() {
  if (anyReshareModalOpen.value || showCommentsSheet.value) return
  isHeld.value = false
  if (videoRef.value && typeof videoRef.value.play === 'function') {
    videoRef.value.play()
  }
}

function nextStory() {
  if (storyIndex.value < currentGroupBuzzes.value.length - 1) {
    storyIndex.value++
  } else if (groupIndex.value < props.storyGroups.length - 1) {
    groupIndex.value++
    storyIndex.value = 0
  } else {
    close()
  }
}

function prevStory() {
  if (storyIndex.value > 0) {
    storyIndex.value--
  } else if (groupIndex.value > 0) {
    groupIndex.value--
    storyIndex.value = props.storyGroups[groupIndex.value].buzzes.length - 1
  }
}

function onVideoLoaded() {
  if (videoRef.value && videoRef.value.duration) {
    const durationMs = videoRef.value.duration * 1000
    startProgress(durationMs)
  }
}

function toggleLike() {
  if (currentBuzz.value) {
    buzzStore.toggleLike(currentBuzz.value)
  }
}

function toggleSave() {
  if (currentBuzz.value) {
    buzzStore.toggleSave(currentBuzz.value)
  }
}

async function toggleCommentsSheet() {
  showCommentsSheet.value = !showCommentsSheet.value
  if (showCommentsSheet.value && currentBuzz.value) {
    onPauseHold()
    fetchComments()
  } else {
    onResumeHold()
  }
}

async function fetchComments() {
  if (!currentBuzz.value) return
  loadingComments.value = true
  try {
    const res = await buzzApi.getBuzzComments(currentBuzz.value.uuid)
    commentsList.value = res.data ?? []
  } catch (err) {
    console.error('Failed to fetch comments:', err)
  } finally {
    loadingComments.value = false
  }
}

async function submitComment() {
  if (!commentInput.value.trim() || !currentBuzz.value) return
  sendingComment.value = true
  try {
    const newComment = await buzzStore.addComment(currentBuzz.value.uuid, commentInput.value.trim())
    if (newComment) {
      commentsList.value.unshift(newComment)
    }
    commentInput.value = ''
  } catch (err) {
    console.error('Failed to submit comment:', err)
  } finally {
    sendingComment.value = false
  }
}

function close() {
  stopProgress()
  showCommentsSheet.value = false
  emit('close')
}

watch([currentBuzz], ([buzz]) => {
  if (buzz && props.isOpen) {
    buzzStore.recordView(buzz.uuid)
    if (buzz.type !== 'video' && !buzz.video_url) {
      startProgress(5000)
    }
    if (showCommentsSheet.value) {
      fetchComments()
    }
  }
}, { immediate: true })

watch(() => props.isOpen, (open) => {
  if (open) {
    groupIndex.value = props.initialGroupIndex
    storyIndex.value = props.initialStoryIndex
  } else {
    stopProgress()
  }
})

onBeforeUnmount(() => {
  stopProgress()
  document.body.classList.remove('bvm-active')
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
