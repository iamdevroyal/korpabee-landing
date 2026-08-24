<template>
  <Teleport to="body">
    <Transition name="buzz-modal">
      <div v-if="isOpen && buzz" class="bvm-overlay" @click.self="close">
        <div class="bvm-card" role="dialog" aria-modal="true" aria-label="Buzz detail">

          <!-- ── Header ──────────────────────────────────────────────────── -->
          <div class="bvm-header">
            <div class="bvm-creator">
              <div class="bvm-avatar" :style="creatorAvatarStyle">
                <router-link :to="`/users/${buzz.creator?.uuid}`" class="dropdown-item">
                <img v-if="buzz.creator?.avatar" :src="buzz.creator.avatar" alt="Avatar" />
                <span v-else>{{ creatorInitials }}</span>
                </router-link>
              </div>
              <div class="bvm-creator-info">
                <router-link :to="`/users/${buzz.creator?.uuid}`" class="dropdown-item">
                <p class="bvm-creator-name">{{ buzz.creator?.name || 'Corper' }}</p>
                </router-link>
                <p class="bvm-creator-time">{{ formatTime(buzz.created_at) }}</p>
              </div>
            </div>
            <button class="bvm-close" @click="close" aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- ── Scrollable body ─────────────────────────────────────────── -->
          <div class="bvm-body">

            <!-- ── Reshare type: wrap original buzz content ──────────────── -->
            <template v-if="buzz.type === 'reshare'">
              <!-- Sharer's own caption (if any) -->
              <p v-if="buzz.content" class="bvm-reshare-caption">{{ buzz.content }}</p>

              <!-- Original buzz card -->
              <div v-if="!buzz.original_buzz?.deleted" class="bvm-original-card">
                <!-- Original creator row -->
                <div class="bvm-original-creator">
                  <div class="bvm-original-avatar" :style="originalCreatorAvatarStyle">
                    <img v-if="buzz.original_buzz?.creator?.avatar" :src="buzz.original_buzz.creator.avatar" alt="" />
                    <span v-else>{{ originalCreatorInitials }}</span>
                  </div>
                  <span class="bvm-original-name">{{ buzz.original_buzz?.creator?.name || 'Corper' }}</span>
                </div>
                <!-- Original image buzz -->
                <div v-if="isOriginalImageType && originalMediaItems.length > 0" class="bvm-media">
                  <div class="bvm-media-track" :class="`bvm-media-track--${Math.min(originalMediaItems.length, 3)}`">
                    <div
                      v-for="(m, i) in originalMediaItems.slice(0, 4)"
                      :key="i"
                      class="bvm-media-cell"
                      @click="lightboxIndex = i; lightboxOpen = true"
                    >
                      <img :src="m.url" class="bvm-media-img" alt="Buzz media" />
                      <div v-if="i === 3 && originalMediaItems.length > 4" class="bvm-media-more">
                        +{{ originalMediaItems.length - 4 }}
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Original text buzz -->
                <div v-else class="bvm-text-card" :style="originalTextCardStyle">
                  <p class="bvm-text-body" style="font-size:1.1rem">{{ buzz.original_buzz?.content || '' }}</p>
                </div>
              </div>
              <div v-else class="bvm-original-deleted">Original buzz was deleted</div>
            </template>

            <!-- ── Image type ─────────────────────────────────────────────── -->
            <div v-else-if="isImageType && mediaItems.length > 0" class="bvm-media">
              <div class="bvm-media-track" :class="`bvm-media-track--${Math.min(mediaItems.length, 3)}`">
                <div
                  v-for="(m, i) in mediaItems.slice(0, 4)"
                  :key="i"
                  class="bvm-media-cell"
                  @click="lightboxIndex = i; lightboxOpen = true"
                >
                  <img :src="m.url" class="bvm-media-img" alt="Buzz media" />
                  <div v-if="i === 3 && mediaItems.length > 4" class="bvm-media-more">
                    +{{ mediaItems.length - 4 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Text / Story type — colored bg card -->
            <div
              v-else-if="buzz.content"
              class="bvm-text-card"
              :style="textCardStyle"
            >
              <p class="bvm-text-body" :style="textBodyStyle">{{ buzz.content }}</p>
            </div>

            <!-- Caption below images -->
            <p v-if="isImageType && buzz.content" class="bvm-caption">{{ buzz.content }}</p>

            <!-- ── Engagement bar ───────────────────────────────────────────── -->
            <div class="bvm-engagement">
              <div class="bvm-engagement-counts">
                <!-- Reshared badge -->
                <span v-if="buzz.is_reshared" class="bvm-reshared-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  Reshared
                </span>
                <span class="bvm-count-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  {{ localLikesCount }} {{ localLikesCount === 1 ? 'like' : 'likes' }}
                </span>
                <span class="bvm-count-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ localCommentsCount }} {{ localCommentsCount === 1 ? 'comment' : 'comments' }}
                </span>
                <span v-if="buzz.views_count" class="bvm-count-item">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ buzz.views_count }}
                </span>
              </div>

              <!-- Action buttons -->
              <div class="bvm-actions">
                <!-- Like -->
                <button
                  class="bvm-action-btn"
                  :class="{ 'bvm-action-btn--liked': localIsLiked }"
                  :disabled="likeLoading"
                  @click="handleLike"
                  aria-label="Like"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" :fill="localIsLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span>{{ localIsLiked ? 'Liked' : 'Like' }}</span>
                </button>

                <!-- Comment (scrolls to input) -->
                <button
                  class="bvm-action-btn"
                  :class="{ 'bvm-action-btn--active': showComments }"
                  @click="openComments"
                  aria-label="Comment"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>Comment</span>
                </button>

                <!-- Save -->
                <button
                  class="bvm-action-btn"
                  :class="{ 'bvm-action-btn--saved': localIsSaved }"
                  :disabled="saveLoading"
                  @click="handleSave"
                  aria-label="Save"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" :fill="localIsSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                  <span>{{ localIsSaved ? 'Saved' : 'Save' }}</span>
                </button>

                <!-- Reshare — hidden on own buzzes -->
                <button
                  v-if="!buzz?.is_mine"
                  class="bvm-action-btn bvm-action-btn--reshare"
                  @click="reshareOptionsOpen = true"
                  aria-label="Reshare"
                  id="reshare-buzz-btn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                  <span>Reshare</span>
                </button>

                <!-- Report -->
                <button
                  v-if="!buzz?.is_mine"
                  class="bvm-action-btn"
                  @click="openReportBuzzModal"
                  aria-label="Report"
                  title="Report Buzz"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"/>
                  </svg>
                  <span>Report</span>
                </button>
              </div>
            </div>

            <!-- ── Comments section ───────────────────────────────────── -->
            <div v-if="showComments" class="bvm-comments" ref="commentsRef">
              <div class="bvm-comments-header">
                <span class="bvm-comments-title">Comments</span>
              </div>

              <!-- Comment input -->
              <div class="bvm-comment-input-row">
                <div class="bvm-comment-avatar" :style="currentUserAvatarStyle">
                  <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Your avatar" />
                  <span v-else>{{ currentUserInitials }}</span>
                </div>
                <div class="bvm-comment-input-wrap">
                  <textarea
                    ref="commentInputRef"
                    v-model="commentDraft"
                    class="bvm-comment-textarea"
                    placeholder="Write a comment…"
                    rows="1"
                    maxlength="500"
                    :disabled="commentSubmitting"
                    @keydown.enter.exact.prevent="submitComment"
                    @input="autoGrow"
                  ></textarea>
                  <div class="bvm-comment-input-footer">
                    <span class="bvm-char-count" :class="{ 'bvm-char-count--warn': commentDraft.length > 450 }">
                      {{ commentDraft.length }}/500
                    </span>
                    <button
                      class="bvm-comment-submit"
                      :disabled="!commentDraft.trim() || commentSubmitting"
                      @click="submitComment"
                    >
                      <svg v-if="!commentSubmitting" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      <svg v-else class="bvm-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" opacity=".75"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Comment error -->
              <p v-if="commentError" class="bvm-comment-error">{{ commentError }}</p>

              <!-- Comment list -->
              <div v-if="commentsLoading && comments.length === 0" class="bvm-comments-loading">
                <div v-for="n in 3" :key="n" class="bvm-comment-skeleton">
                  <div class="bvm-skeleton-avatar"></div>
                  <div class="bvm-skeleton-lines">
                    <div class="bvm-skeleton-line bvm-skeleton-line--name"></div>
                    <div class="bvm-skeleton-line bvm-skeleton-line--text"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="comments.length === 0 && !commentsLoading" class="bvm-comments-empty">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No comments yet. Be the first!</p>
              </div>

              <div v-else class="bvm-comment-list">
                <div
                  v-for="comment in comments"
                  :key="comment.uuid"
                  class="bvm-comment-item"
                >
                  <!-- Author avatar -->
                  <div class="bvm-comment-user-avatar" :style="commentAvatarStyle(comment)">
                    <img v-if="comment.user?.avatar" :src="comment.user.avatar" alt="" />
                    <span v-else>{{ commentInitials(comment) }}</span>
                  </div>

                  <div class="bvm-comment-content-wrap">
                    <!-- Bubble -->
                    <div class="bvm-comment-bubble">
                      <p class="bvm-comment-author">{{ comment.user?.name || 'Corper' }}</p>
                      <p class="bvm-comment-text">{{ comment.content || comment.body }}</p>
                    </div>

                    <!-- Meta row -->
                    <div class="bvm-comment-meta">
                      <span class="bvm-comment-time">{{ formatTime(comment.created_at) }}</span>
                      <button
                        v-if="comment.is_mine"
                        class="bvm-comment-delete"
                        :disabled="deletingCommentIds.has(comment.uuid)"
                        @click="handleDeleteComment(comment)"
                      >
                        {{ deletingCommentIds.has(comment.uuid) ? 'Deleting…' : 'Delete' }}
                      </button>
                      <button
                        v-else
                        class="bvm-comment-delete"
                        @click="openReportCommentModal(comment)"
                      >
                        Report
                      </button>
                    </div>

                    <!-- Replies (max 2 shown inline; collapsible) -->
                    <div v-if="comment.replies?.length" class="bvm-replies">
                      <div
                        v-for="reply in visibleReplies(comment)"
                        :key="reply.uuid"
                        class="bvm-reply-item"
                      >
                        <div class="bvm-comment-user-avatar bvm-comment-user-avatar--sm" :style="commentAvatarStyle(reply)">
                          <img v-if="reply.user?.avatar" :src="reply.user.avatar" alt="" />
                          <span v-else>{{ commentInitials(reply) }}</span>
                        </div>
                        <div class="bvm-comment-content-wrap">
                          <div class="bvm-comment-bubble bvm-comment-bubble--reply">
                            <p class="bvm-comment-author">{{ reply.user?.name || 'Corper' }}</p>
                            <p class="bvm-comment-text">{{ reply.content || reply.body }}</p>
                          </div>
                          <div class="bvm-comment-meta">
                            <span class="bvm-comment-time">{{ formatTime(reply.created_at) }}</span>
                            <button
                              v-if="reply.is_mine"
                              class="bvm-comment-delete"
                              :disabled="deletingCommentIds.has(reply.uuid)"
                              @click="handleDeleteComment(reply)"
                            >
                              {{ deletingCommentIds.has(reply.uuid) ? 'Deleting…' : 'Delete' }}
                            </button>
                            <button
                              v-else
                              class="bvm-comment-delete"
                              @click="openReportCommentModal(reply)"
                            >
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        v-if="comment.replies.length > 2"
                        class="bvm-toggle-replies"
                        @click="toggleReplies(comment.uuid)"
                      >
                        {{ expandedReplies.has(comment.uuid)
                            ? 'Hide replies'
                            : `View ${comment.replies.length - 2} more repl${comment.replies.length - 2 === 1 ? 'y' : 'ies'}`
                        }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Load more -->
              <button
                v-if="commentsHasMore && !commentsLoading"
                class="bvm-load-more"
                @click="loadMoreComments"
              >
                Load more comments
              </button>
              <div v-if="commentsLoading && comments.length > 0" class="bvm-comments-inline-loader">
                <svg class="bvm-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" opacity=".75"/>
                </svg>
              </div>
            </div>

          </div><!-- end .bvm-body -->
        </div><!-- end .bvm-card -->
      </div>
    </Transition>

    <!-- ── Image Lightbox ──────────────────────────────────────────────── -->
    <Transition name="bvm-lightbox">
      <div v-if="lightboxOpen" class="bvm-lightbox-backdrop" @click.self="lightboxOpen = false">
        <button class="bvm-lightbox-close" @click="lightboxOpen = false" aria-label="Close lightbox">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button v-if="mediaItems.length > 1" class="bvm-lightbox-nav bvm-lightbox-nav--prev" @click="lightboxIndex = (lightboxIndex - 1 + mediaItems.length) % mediaItems.length">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <img :src="mediaItems[lightboxIndex]?.url" class="bvm-lightbox-img" />
        <button v-if="mediaItems.length > 1" class="bvm-lightbox-nav bvm-lightbox-nav--next" @click="lightboxIndex = (lightboxIndex + 1) % mediaItems.length">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div v-if="mediaItems.length > 1" class="bvm-lightbox-dots">
          <button
            v-for="(_, i) in mediaItems"
            :key="i"
            class="bvm-lightbox-dot"
            :class="{ 'bvm-lightbox-dot--active': i === lightboxIndex }"
            @click="lightboxIndex = i"
          />
        </div>
      </div>
    </Transition>

    <ReportModal
      v-if="reportModalOpen && reportTargetId"
      :open="reportModalOpen"
      :target-type="reportTargetType"
      :target-id="reportTargetId"
      @close="reportModalOpen = false"
    />

    <!-- Reshare Options Modal -->
    <BuzzReshareOptionsModal
      v-if="reshareOptionsOpen"
      v-model="reshareOptionsOpen"
      @select-buzz="reshareBuzzModalOpen = true"
      @select-feed="shareToFeedModalOpen = true"
    />

    <!-- Reshare Buzz Modal -->
    <ReshareBuzzModal
      v-if="reshareBuzzModalOpen && buzz"
      v-model="reshareBuzzModalOpen"
      :buzz="buzz"
      @reshared="onBuzzReshared"
    />

    <!-- Share Buzz to Feed Modal -->
    <ShareBuzzToFeedModal
      v-if="shareToFeedModalOpen && buzz"
      v-model="shareToFeedModalOpen"
      :buzz="buzz"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { getBuzzComments, createBuzzComment, deleteBuzzComment } from '@/api/buzz'
import ReportModal from '@/components/shared/ReportModal.vue'
import BuzzReshareOptionsModal from './BuzzReshareOptionsModal.vue'
import ReshareBuzzModal from './ReshareBuzzModal.vue'
import ShareBuzzToFeedModal from './ShareBuzzToFeedModal.vue'

// ── Props / Emits ────────────────────────────────────────────────────────────
const props = defineProps({
  isOpen:      { type: Boolean, default: false },
  buzz:        { type: Object,  default: null  },
  currentUser: { type: Object,  default: null  },
  // Store action callbacks — passed from FeedView so the modal stays decoupled
  onToggleLike: { type: Function, default: null },
  onToggleSave: { type: Function, default: null },
})

const emit = defineEmits(['close', 'liked', 'saved', 'comment-added', 'comment-removed'])

// ── Close ────────────────────────────────────────────────────────────────────
const close = () => emit('close')

// ── Scroll-lock body & hide floating widgets when open ─────────────────────
watch(() => props.isOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
  if (val) {
    document.body.classList.add('bvm-active')
  } else {
    document.body.classList.remove('bvm-active')
  }
}, { immediate: true })

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.body.classList.remove('bvm-active')
})

// ── Like state (mirrors buzz prop, optimistically updated) ───────────────────
const localIsLiked    = ref(false)
const localLikesCount = ref(0)
const likeLoading     = ref(false)

// ── Save state ───────────────────────────────────────────────────────────────
const localIsSaved  = ref(false)
const saveLoading   = ref(false)

// ── Reshare modals ────────────────────────────────────────────────────────────
const reshareOptionsOpen   = ref(false)
const reshareBuzzModalOpen = ref(false)
const shareToFeedModalOpen = ref(false)

function onBuzzReshared() {
  // shares_count is updated by the store after BuzzController responds;
  // we just close the modal which ReshareBuzzModal handles internally
}

// ── Comments count (local mirror so it updates instantly) ────────────────────
const localCommentsCount = ref(0)

// ── Report state ─────────────────────────────────────────────────────────────
const reportModalOpen  = ref(false)
const reportTargetType = ref('buzz')
const reportTargetId   = ref(0)

function openReportBuzzModal() {
  const id = props.buzz?.id ?? props.buzz?.uuid
  if (!id) return
  reportTargetType.value = 'buzz'
  reportTargetId.value   = id
  reportModalOpen.value  = true
}

function openReportCommentModal(comment) {
  const id = comment?.id ?? comment?.uuid
  if (!id) return
  reportTargetType.value = 'buzz_comment'
  reportTargetId.value   = id
  reportModalOpen.value  = true
}

// Sync local mirrors whenever the buzz prop changes (new modal open)
watch(() => props.buzz, (b) => {
  if (!b) return
  localIsLiked.value    = !!b.is_liked
  localLikesCount.value = b.likes_count ?? 0
  localIsSaved.value    = !!b.is_saved
  localCommentsCount.value = b.comments_count ?? 0
}, { immediate: true })

// Keep in sync when the store mutates the same object (e.g. from feed)
watch(() => props.buzz?.is_liked,    (v) => { if (v !== undefined) localIsLiked.value = !!v })
watch(() => props.buzz?.likes_count, (v) => { if (v !== undefined) localLikesCount.value = v })
watch(() => props.buzz?.is_saved,    (v) => { if (v !== undefined) localIsSaved.value = !!v })
watch(() => props.buzz?.comments_count, (v) => { if (v !== undefined) localCommentsCount.value = v })

async function handleLike() {
  if (likeLoading.value || !props.onToggleLike) return
  likeLoading.value = true
  // Optimistic
  const wasLiked = localIsLiked.value
  localIsLiked.value    = !wasLiked
  localLikesCount.value = wasLiked ? localLikesCount.value - 1 : localLikesCount.value + 1
  try {
    await props.onToggleLike(props.buzz)
    emit('liked', { uuid: props.buzz.uuid, is_liked: localIsLiked.value, likes_count: localLikesCount.value })
  } catch {
    // Rollback (store already rolls back internally too)
    localIsLiked.value    = wasLiked
    localLikesCount.value = wasLiked ? localLikesCount.value + 1 : localLikesCount.value - 1
  } finally {
    likeLoading.value = false
  }
}

async function handleSave() {
  if (saveLoading.value || !props.onToggleSave) return
  saveLoading.value = true
  const wasSaved = localIsSaved.value
  localIsSaved.value = !wasSaved
  try {
    await props.onToggleSave(props.buzz)
    emit('saved', { uuid: props.buzz.uuid, is_saved: localIsSaved.value })
  } catch {
    localIsSaved.value = wasSaved
  } finally {
    saveLoading.value = false
  }
}

// ── Comments ─────────────────────────────────────────────────────────────────
const showComments    = ref(false)
const commentsRef     = ref(null)
const comments        = ref([])
const commentsLoading = ref(false)
const commentsHasMore = ref(false)
const commentsCursor  = ref(null)
const commentError    = ref('')
const expandedReplies = ref(new Set())
const deletingCommentIds = ref(new Set())

// Reset comments when a new buzz is opened
watch(() => props.buzz?.uuid, () => {
  comments.value     = []
  showComments.value = false
  commentsHasMore.value = false
  commentsCursor.value  = null
  commentError.value    = ''
  expandedReplies.value = new Set()
})

async function openComments() {
  showComments.value = true
  if (comments.value.length === 0) await fetchComments()
  await nextTick()
  commentsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  commentInputRef.value?.focus()
}

async function fetchComments(cursor = null) {
  if (!props.buzz?.uuid) return
  commentsLoading.value = true
  try {
    const params = { per_page: 10 }
    if (cursor) params.cursor = cursor
    const res = await getBuzzComments(props.buzz.uuid, params)
    const newItems = res.data ?? []
    comments.value      = cursor ? [...comments.value, ...newItems] : newItems
    commentsCursor.value = res.meta?.next_cursor ?? null
    commentsHasMore.value = !!res.meta?.next_cursor
  } catch {
    // silently fail — user can retry via load-more
  } finally {
    commentsLoading.value = false
  }
}

async function loadMoreComments() {
  if (!commentsHasMore.value || commentsLoading.value) return
  await fetchComments(commentsCursor.value)
}

// ── Comment input ─────────────────────────────────────────────────────────────
const commentDraft      = ref('')
const commentSubmitting = ref(false)
const commentInputRef   = ref(null)

function autoGrow(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

async function submitComment() {
  const text = commentDraft.value.trim()
  if (!text || commentSubmitting.value) return
  commentError.value    = ''
  commentSubmitting.value = true
  try {
    const res = await createBuzzComment(props.buzz.uuid, { content: text })
    const newComment = res.data
    comments.value.unshift(newComment)
    localCommentsCount.value++
    commentDraft.value = ''
    if (commentInputRef.value) {
      commentInputRef.value.style.height = 'auto'
    }
    emit('comment-added', { buzzUuid: props.buzz.uuid })
  } catch (err) {
    commentError.value = err?.response?.data?.message ?? 'Could not post comment. Try again.'
  } finally {
    commentSubmitting.value = false
  }
}

async function handleDeleteComment(comment) {
  if (deletingCommentIds.value.has(comment.uuid)) return
  deletingCommentIds.value = new Set([...deletingCommentIds.value, comment.uuid])
  try {
    await deleteBuzzComment(comment.id ?? comment.uuid)
    comments.value = comments.value.filter(c => c.uuid !== comment.uuid).map(c => ({
      ...c,
      replies: c.replies?.filter(r => r.uuid !== comment.uuid) ?? [],
    }))
    localCommentsCount.value = Math.max(0, localCommentsCount.value - 1)
    emit('comment-removed', { buzzUuid: props.buzz.uuid })
  } catch {
    // noop — let the user retry
  } finally {
    const next = new Set(deletingCommentIds.value)
    next.delete(comment.uuid)
    deletingCommentIds.value = next
  }
}

function toggleReplies(uuid) {
  const next = new Set(expandedReplies.value)
  next.has(uuid) ? next.delete(uuid) : next.add(uuid)
  expandedReplies.value = next
}

function visibleReplies(comment) {
  if (!comment.replies) return []
  if (expandedReplies.value.has(comment.uuid)) return comment.replies
  return comment.replies.slice(0, 2)
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
const lightboxOpen  = ref(false)
const lightboxIndex = ref(0)

// ── Display helpers ───────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
  'linear-gradient(135deg,#EC4899,#F472B6)',
  'linear-gradient(135deg,#10B981,#34D399)',
  'linear-gradient(135deg,#F59E0B,#FBBF24)',
  'linear-gradient(135deg,#3B82F6,#60A5FA)',
]

function colorSeed(str) {
  let h = 0
  for (let i = 0; i < (str || '').length; i++) h = ((h << 5) - h) + (str || '').charCodeAt(i)
  return Math.abs(h)
}

const creatorInitials = computed(() => {
  const name = props.buzz?.creator?.name || ''
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'C'
})

const creatorAvatarStyle = computed(() => {
  const seed = colorSeed(props.buzz?.creator?.name || '')
  return { background: AVATAR_COLORS[seed % AVATAR_COLORS.length] }
})

const currentUserInitials = computed(() => {
  const name = props.currentUser?.name || ''
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'Me'
})

const currentUserAvatarStyle = computed(() => {
  const seed = colorSeed(props.currentUser?.name || '')
  return { background: AVATAR_COLORS[seed % AVATAR_COLORS.length] }
})

function commentAvatarStyle(comment) {
  const seed = colorSeed(comment.user?.name || '')
  return { background: AVATAR_COLORS[seed % AVATAR_COLORS.length] }
}

function commentInitials(comment) {
  const name = comment.user?.name || 'C'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

const isImageType = computed(() => {
  const t = props.buzz?.type
  return t === 'image' || t === 'story'
})

const mediaItems = computed(() => props.buzz?.media || [])

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

// ── Reshare helpers (requires BUZZ_BG_MAP above) ─────────────────────
const isOriginalImageType = computed(() => {
  const t = props.buzz?.original_buzz?.type
  return t === 'image' || t === 'story'
})

const originalMediaItems = computed(() => props.buzz?.original_buzz?.media || [])

const originalCreatorInitials = computed(() => {
  const name = props.buzz?.original_buzz?.creator?.name || 'C'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
})

const originalCreatorAvatarStyle = computed(() => {
  const seed = colorSeed(props.buzz?.original_buzz?.creator?.name || '')
  return { background: AVATAR_COLORS[seed % AVATAR_COLORS.length] }
})

const originalTextCardStyle = computed(() => {
  const ob = props.buzz?.original_buzz
  const bg = ob?.bg || ob?.bg_color || ob?.background
  if (bg && bg !== 'none' && BUZZ_BG_MAP[bg]) return { background: BUZZ_BG_MAP[bg] }
  if (bg && (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('linear-gradient'))) return { background: bg }
  const seed = colorSeed(ob?.uuid || '')
  const fallbacks = [
    'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
    'linear-gradient(135deg,#EC4899,#F472B6)',
    'linear-gradient(135deg,#10B981,#34D399)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
    'linear-gradient(135deg,#3B82F6,#0EA5E9)',
    'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  ]
  return { background: fallbacks[seed % fallbacks.length] }
})

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

const textCardStyle = computed(() => {
  const bg = props.buzz?.bg || props.buzz?.bg_color || props.buzz?.background
  if (bg && bg !== 'none' && BUZZ_BG_MAP[bg]) return { background: BUZZ_BG_MAP[bg] }
  if (bg && (bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('linear-gradient'))) return { background: bg }
  const seed = colorSeed(props.buzz?.uuid || '')
  const fallbacks = [
    'linear-gradient(135deg,#6C5CE7,#8B7CF8)',
    'linear-gradient(135deg,#EC4899,#F472B6)',
    'linear-gradient(135deg,#10B981,#34D399)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
    'linear-gradient(135deg,#3B82F6,#0EA5E9)',
    'linear-gradient(135deg,#8B5CF6,#7C3AED)',
  ]
  return { background: fallbacks[seed % fallbacks.length] }
})

const textBodyStyle = computed(() => {
  const len = props.buzz?.content?.length || 0
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

  const fontStyle = props.buzz?.font_style
  const fontWeight = props.buzz?.font_weight

  return {
    fontSize,
    lineHeight,
    fontFamily: FONT_FAMILY_MAP[fontStyle] || FONT_FAMILY_MAP.sans,
    fontWeight: FONT_WEIGHT_MAP[fontWeight] || FONT_WEIGHT_MAP.bold,
  }
})

const formatTime = (dateString) => {
  if (!dateString) return ''
  const secs = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (secs < 60) return 'Just now'
  const m = Math.floor(secs / 60);   if (m < 60)   return `${m}m ago`
  const h = Math.floor(secs / 3600); if (h < 24)   return `${h}h ago`
  const d = Math.floor(secs / 86400);               return `${d}d ago`
}
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────────────────────────────── */
.bvm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(26, 21, 53, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── Card ─────────────────────────────────────────────────────────────────── */
.bvm-card {
  background: #fff;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(108, 92, 231, 0.22);
}

/* ── Header ───────────────────────────────────────────────────────────────── */
.bvm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #F0EEFF;
  flex-shrink: 0;
}

.bvm-creator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bvm-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
  border: 2px solid rgba(255,255,255,0.85);
  box-shadow: 0 2px 6px rgba(108,92,231,0.18);
}
.bvm-avatar img { width: 100%; height: 100%; object-fit: cover; }
.bvm-creator-info { display: flex; flex-direction: column; gap: 1px; }
.bvm-creator-name { font-size: 13px; font-weight: 700; color: #1A1535; }
.bvm-creator-time { font-size: 11px; color: #A8A4C4; }

.bvm-close {
  width: 32px; height: 32px;
  border-radius: 50%; border: none;
  background: #F0EEFF; color: #6C5CE7;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, transform 0.15s;
  flex-shrink: 0;
}
.bvm-close:hover { background: #6C5CE7; color: #fff; transform: scale(1.08); }

/* ── Scrollable body ──────────────────────────────────────────────────────── */
.bvm-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: #E8E4FF transparent;
}
.bvm-body::-webkit-scrollbar { width: 4px; }
.bvm-body::-webkit-scrollbar-thumb { background: #E8E4FF; border-radius: 4px; }

/* ── Media grid ───────────────────────────────────────────────────────────── */
.bvm-media { padding: 0; }

.bvm-media-track {
  display: grid;
  gap: 2px;
}
.bvm-media-track--1 { grid-template-columns: 1fr; }
.bvm-media-track--2 { grid-template-columns: 1fr 1fr; }
.bvm-media-track--3 { grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; }
.bvm-media-track--3 .bvm-media-cell:first-child { grid-column: 1 / -1; }

.bvm-media-cell {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #f4f4f4;
}
.bvm-media-cell:hover .bvm-media-img { transform: scale(1.03); }
.bvm-media-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  max-height: 380px;
  transition: transform 0.2s ease;
}
.bvm-media-more {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.52);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; color: #fff;
}

/* ── Text card ────────────────────────────────────────────────────────────── */
.bvm-text-card {
  padding: 24px 20px;
  min-height: 200px;
  max-height: 52vh;
  display: flex; align-items: center; justify-content: center;
  box-sizing: border-box;
  overflow-y: auto;
  word-break: break-word;
}
.bvm-text-body {
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0,0,0,0.25);
  word-break: break-word;
  white-space: pre-wrap;
  margin: 0;
  max-width: 100%;
}

/* ── Caption under image ──────────────────────────────────────────────────── */
.bvm-caption {
  padding: 12px 16px 0;
  font-size: 13.5px; color: #1A1535; line-height: 1.55;
  word-break: break-word;
}

/* ── Engagement bar ───────────────────────────────────────────────────────── */
.bvm-engagement {
  padding: 10px 16px 12px;
  border-top: 1px solid #F0EEFF;
}

.bvm-engagement-counts {
  display: flex; align-items: center; gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F0EEFF;
  margin-bottom: 4px;
}

.bvm-count-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #6E6A8A;
}

.bvm-actions {
  display: flex; align-items: center; gap: 4px;
  padding-top: 4px;
}

.bvm-action-btn {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 8px 4px;
  border: none; border-radius: 10px;
  background: transparent;
  font-size: 12.5px; font-weight: 600; color: #6E6A8A;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.bvm-action-btn:hover:not(:disabled) { background: #F8F7FF; color: #1A1535; }
.bvm-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.bvm-action-btn--liked { color: #EF4444 !important; }
.bvm-action-btn--liked:hover:not(:disabled) { background: #FFF1F1 !important; }
.bvm-action-btn--active { color: #6C5CE7; background: #F0EEFF; }
.bvm-action-btn--saved { color: #6C5CE7 !important; }
.bvm-action-btn--saved:hover:not(:disabled) { background: #F0EEFF !important; }
.bvm-action-btn--reshare:hover:not(:disabled) { background: #eef2ff !important; color: #6366f1 !important; }

.bvm-reshared-badge {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; color: #6366f1;
  background: #eef2ff; border-radius: 20px; padding: 2px 8px;
}

/* ── Comments section ─────────────────────────────────────────────────────── */
.bvm-comments {
  border-top: 1px solid #F0EEFF;
  display: flex; flex-direction: column;
}

.bvm-comments-header {
  padding: 12px 16px 8px;
  display: flex; align-items: center; justify-content: space-between;
}
.bvm-comments-title { font-size: 13px; font-weight: 700; color: #1A1535; }

/* Comment input row */
.bvm-comment-input-row {
  display: flex; gap: 10px;
  padding: 0 16px calc(14px + var(--mobile-nav-height, 0px));
}

.bvm-comment-avatar {
  width: 32px; height: 32px;
  border-radius: 50%; flex-shrink: 0;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
  margin-top: 2px;
}
.bvm-comment-avatar img { width: 100%; height: 100%; object-fit: cover; }

.bvm-comment-input-wrap {
  flex: 1;
  background: #F8F7FF;
  border: 1.5px solid #E8E4FF;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.bvm-comment-input-wrap:focus-within { border-color: #6C5CE7; }

.bvm-comment-textarea {
  width: 100%;
  padding: 9px 12px 4px;
  border: none; outline: none;
  background: transparent;
  font-size: 13px; color: #1A1535;
  resize: none;
  font-family: inherit;
  line-height: 1.45;
  display: block;
  min-height: 36px;
  box-sizing: border-box;
}
.bvm-comment-textarea::placeholder { color: #A8A4C4; }
.bvm-comment-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

.bvm-comment-input-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 8px; padding: 4px 8px 6px;
}

.bvm-char-count { font-size: 10px; color: #C4BEFF; font-weight: 600; }
.bvm-char-count--warn { color: #EF4444; }

.bvm-comment-submit {
  width: 28px; height: 28px;
  border-radius: 8px; border: none;
  background: #6C5CE7; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.bvm-comment-submit:hover:not(:disabled) { background: #5b4dd1; }
.bvm-comment-submit:disabled { opacity: 0.4; cursor: not-allowed; }

.bvm-comment-error {
  font-size: 11.5px; color: #EF4444;
  padding: 0 16px 8px;
  font-weight: 500;
}

/* Skeletons */
.bvm-comments-loading {
  display: flex; flex-direction: column; gap: 12px;
  padding: 8px 16px 16px;
}
.bvm-comment-skeleton { display: flex; gap: 10px; }
.bvm-skeleton-avatar { width: 32px; height: 32px; border-radius: 50%; background: #F0EEFF; flex-shrink: 0; }
.bvm-skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.bvm-skeleton-line { border-radius: 6px; background: #F0EEFF; height: 10px; }
.bvm-skeleton-line--name { width: 35%; }
.bvm-skeleton-line--text { width: 75%; }

/* Empty */
.bvm-comments-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 24px 16px;
  color: #A8A4C4; font-size: 12.5px; font-weight: 500; text-align: center;
}

/* Comment list */
.bvm-comment-list {
  display: flex; flex-direction: column; gap: 14px;
  padding: 4px 16px 16px;
}

.bvm-comment-item { display: flex; gap: 10px; }
.bvm-comment-user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%; flex-shrink: 0;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: #fff;
  margin-top: 2px;
}
.bvm-comment-user-avatar--sm { width: 26px; height: 26px; font-size: 10px; }
.bvm-comment-user-avatar img { width: 100%; height: 100%; object-fit: cover; }

.bvm-comment-content-wrap { flex: 1; min-width: 0; }

.bvm-comment-bubble {
  background: #F8F7FF;
  border-radius: 0 14px 14px 14px;
  padding: 8px 12px;
  display: inline-block;
  max-width: 100%;
}
.bvm-comment-bubble--reply {
  background: #FFF;
  border: 1px solid #F0EEFF;
}
.bvm-comment-author { font-size: 12px; font-weight: 700; color: #1A1535; margin-bottom: 2px; }
.bvm-comment-text { font-size: 13px; color: #3D3A5C; line-height: 1.45; word-break: break-word; }

.bvm-comment-meta {
  display: flex; align-items: center; gap: 10px;
  padding: 4px 4px 0;
}
.bvm-comment-time { font-size: 11px; color: #A8A4C4; font-weight: 500; }
.bvm-comment-delete {
  font-size: 11px; color: #EF4444; font-weight: 600;
  background: none; border: none; cursor: pointer; padding: 0;
  opacity: 0.7; transition: opacity 0.15s;
}
.bvm-comment-delete:hover:not(:disabled) { opacity: 1; }
.bvm-comment-delete:disabled { opacity: 0.4; cursor: not-allowed; }

/* Replies */
.bvm-replies { margin-top: 8px; display: flex; flex-direction: column; gap: 8px; padding-left: 6px; border-left: 2px solid #F0EEFF; }
.bvm-reply-item { display: flex; gap: 8px; }

.bvm-toggle-replies {
  font-size: 11.5px; color: #6C5CE7; font-weight: 700;
  background: none; border: none; cursor: pointer;
  padding: 4px 0 0; text-align: left;
}
.bvm-toggle-replies:hover { text-decoration: underline; }

/* Load more */
.bvm-load-more {
  margin: 4px 16px 16px;
  width: calc(100% - 32px);
  padding: 9px;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  background: #fff;
  color: #6C5CE7; font-size: 12.5px; font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.bvm-load-more:hover { background: #F8F7FF; }

.bvm-comments-inline-loader {
  display: flex; justify-content: center; padding: 8px 0 16px;
  color: #6C5CE7;
}

/* ── Spin animation ───────────────────────────────────────────────────────── */
.bvm-spin { animation: bvm-spin 0.8s linear infinite; }
@keyframes bvm-spin { to { transform: rotate(360deg); } }

/* ── Modal transition ─────────────────────────────────────────────────────── */
.buzz-modal-enter-active, .buzz-modal-leave-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.buzz-modal-enter-from, .buzz-modal-leave-to {
  opacity: 0; transform: scale(0.95);
}

/* ── Lightbox ─────────────────────────────────────────────────────────────── */
.bvm-lightbox-backdrop {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.92);
  display: flex; align-items: center; justify-content: center;
}
.bvm-lightbox-img {
  max-width: 90vw; max-height: 85vh;
  object-fit: contain; border-radius: 8px;
}
.bvm-lightbox-close {
  position: absolute; top: 16px; right: 16px;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.12); border: none; color: #fff;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 10;
}
.bvm-lightbox-close:hover { background: rgba(255,255,255,0.22); }
.bvm-lightbox-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,0.12); border: none; color: #fff;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 10;
}
.bvm-lightbox-nav:hover { background: rgba(255,255,255,0.24); }
.bvm-lightbox-nav--prev { left: 16px; }
.bvm-lightbox-nav--next { right: 16px; }
.bvm-lightbox-dots {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 6px;
}
.bvm-lightbox-dot {
  width: 7px; height: 7px; border-radius: 50%; border: none;
  background: rgba(255,255,255,0.3); cursor: pointer; padding: 0;
  transition: background 0.2s, transform 0.2s;
}
.bvm-lightbox-dot--active { background: #fff; transform: scale(1.3); }
.bvm-lightbox-enter-active, .bvm-lightbox-leave-active { transition: opacity 0.2s; }
.bvm-lightbox-enter-from, .bvm-lightbox-leave-to { opacity: 0; }

/* ── Mobile ───────────────────────────────────────────────────────────────── */
@media (max-width: 540px) {
  .bvm-overlay { padding: 0; align-items: flex-end; }
  .bvm-card { max-width: 100%; border-radius: 20px 20px 0 0; max-height: 92vh; }
  .bvm-text-card { padding: 32px 20px; min-height: 180px; }
  .bvm-text-body { font-size: 17px; }
}

/* ── Reshare rendering ────────────────────────────────────────────────────── */
.bvm-reshare-caption {
  font-size: 0.95rem;
  color: #e2e8f0;
  margin: 0 0 12px;
  padding: 0 4px;
  line-height: 1.5;
}
.bvm-original-card {
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
  margin-bottom: 8px;
}
.bvm-original-creator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 6px;
}
.bvm-original-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
  overflow: hidden;
  flex-shrink: 0;
}
.bvm-original-avatar img { width: 100%; height: 100%; object-fit: cover; }
.bvm-original-name { font-size: 0.8rem; font-weight: 600; color: #cbd5e1; }
.bvm-original-deleted {
  font-size: 0.85rem;
  color: #64748b;
  text-align: center;
  padding: 24px;
  border: 1px dashed rgba(255,255,255,0.1);
  border-radius: 12px;
  margin-bottom: 8px;
}
</style>