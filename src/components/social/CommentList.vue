<template>
  <div class="cl-root">

    <!-- ── Top-level comment input ─────────────────────────────────────── -->
    <div class="cl-composer">
      <div class="cl-composer-avatar">
        <img v-if="user?.avatar" :src="user.avatar" alt="Your avatar" />
        <span v-else>{{ myInitials }}</span>
      </div>
      <div class="cl-composer-wrap" :class="{ 'cl-composer-wrap--focus': topFocused }">
        <textarea
          ref="topInputRef"
          v-model="topDraft"
          class="cl-textarea"
          placeholder="Write a comment…"
          rows="1"
          maxlength="500"
          :disabled="topSubmitting"
          @focus="topFocused = true"
          @blur="topFocused = false"
          @input="autoGrow($event)"
          @keydown.enter.exact.prevent="submitTop"
        ></textarea>
        <div class="cl-composer-footer">
          <span class="cl-charcount" :class="{ 'cl-charcount--warn': topDraft.length > 450 }">
            {{ topDraft.length }}/500
          </span>
          <button
            class="cl-send-btn"
            :disabled="!topDraft.trim() || topSubmitting"
            @click="submitTop"
          >
            <svg v-if="!topSubmitting" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <svg v-else class="cl-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" opacity=".75"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <p v-if="topError" class="cl-error">{{ topError }}</p>

    <!-- ── Loading skeleton ────────────────────────────────────────────── -->
    <div v-if="loading && comments.length === 0" class="cl-skeletons">
      <div v-for="n in 3" :key="n" class="cl-skeleton-row">
        <div class="cl-sk cl-sk-avatar"></div>
        <div class="cl-sk-lines">
          <div class="cl-sk cl-sk-name"></div>
          <div class="cl-sk cl-sk-text"></div>
        </div>
      </div>
    </div>

    <!-- ── Empty ────────────────────────────────────────────────────────── -->
    <div v-else-if="!loading && comments.length === 0" class="cl-empty">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span>No comments yet — be the first!</span>
    </div>

    <!-- ── Comment list ─────────────────────────────────────────────────── -->
    <div v-else class="cl-list">
      <div
        v-for="comment in comments"
        :key="comment.id ?? comment.uuid"
        class="cl-thread"
        :class="{ 'cl-thread--highlight': justPostedId === (comment.id ?? comment.uuid) }"
      >
        <!-- Parent comment row -->
        <CommentRow
          :comment="comment"
          :current-user="user"
          :deleting="deletingIds.has(comment.id ?? comment.uuid)"
          @like="handleLike(comment)"
          @reply="openReply(comment)"
          @delete="handleDelete(comment)"
          @report="triggerReport(comment)"
        />

        <!-- ── Replies ──────────────────────────────────────────────────── -->
        <div v-if="comment.replies?.length || replyDraftFor === (comment.id ?? comment.uuid)" class="cl-replies">

          <!-- Existing replies -->
          <div v-if="comment.replies?.length">
            <CommentRow
              v-for="reply in visibleReplies(comment)"
              :key="reply.id ?? reply.uuid"
              :comment="reply"
              :current-user="user"
              :is-reply="true"
              :deleting="deletingIds.has(reply.id ?? reply.uuid)"
              @like="handleLike(reply)"
              @delete="handleDelete(reply, comment)"
              @report="triggerReport(reply)"
            />

            <!-- Show / hide remaining replies -->
            <button
              v-if="comment.replies.length > REPLIES_PREVIEW"
              class="cl-toggle-replies"
              @click="toggleReplies(comment.id ?? comment.uuid)"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path v-if="expandedIds.has(comment.id ?? comment.uuid)" d="M18 15l-6-6-6 6"/>
                <path v-else d="M6 9l6 6 6-6"/>
              </svg>
              {{
                expandedIds.has(comment.id ?? comment.uuid)
                  ? 'Hide replies'
                  : `${comment.replies.length - REPLIES_PREVIEW} more repl${comment.replies.length - REPLIES_PREVIEW === 1 ? 'y' : 'ies'}`
              }}
            </button>
          </div>

          <!-- Reply composer -->
          <div v-if="replyDraftFor === (comment.id ?? comment.uuid)" class="cl-reply-composer">
            <div class="cl-composer-avatar cl-composer-avatar--sm">
              <img v-if="user?.avatar" :src="user.avatar" alt="" />
              <span v-else>{{ myInitials }}</span>
            </div>
            <div class="cl-composer-wrap" :class="{ 'cl-composer-wrap--focus': replyFocused }">
              <textarea
                :ref="el => { if (el) replyInputRefs[comment.id ?? comment.uuid] = el }"
                v-model="replyDraft"
                class="cl-textarea"
                :placeholder="`Reply to ${comment.user?.name ?? 'Corper'}…`"
                rows="1"
                maxlength="500"
                :disabled="replySubmitting"
                @focus="replyFocused = true"
                @blur="replyFocused = false"
                @input="autoGrow($event)"
                @keydown.enter.exact.prevent="submitReply(comment)"
                @keydown.escape="closeReply"
              ></textarea>
              <div class="cl-composer-footer">
                <button class="cl-cancel-btn" @click="closeReply">Cancel</button>
                <span class="cl-charcount" :class="{ 'cl-charcount--warn': replyDraft.length > 450 }">
                  {{ replyDraft.length }}/500
                </span>
                <button
                  class="cl-send-btn"
                  :disabled="!replyDraft.trim() || replySubmitting"
                  @click="submitReply(comment)"
                >
                  <svg v-if="!replySubmitting" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  <svg v-else class="cl-spin" width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" opacity=".75"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <p v-if="replyError && replyDraftFor === (comment.id ?? comment.uuid)" class="cl-error cl-error--reply">
            {{ replyError }}
          </p>
        </div>
      </div>
    </div>

    <!-- ── Pagination ───────────────────────────────────────────────────── -->
    <button
      v-if="hasMore && !loading"
      class="cl-load-more"
      @click="loadMore"
    >
      Load more comments
    </button>
    <div v-if="loading && comments.length > 0" class="cl-inline-loader">
      <svg class="cl-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity=".25"/>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z" opacity=".75"/>
      </svg>
    </div>

    <ReportModal
      v-if="reportModalOpen && reportingCommentId"
      :open="reportModalOpen"
      target-type="comment"
      :target-id="reportingCommentId"
      @close="reportModalOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, defineComponent, h } from 'vue'
import { useAuth } from '@/composables/useAuth'
import {
  getComments,
  createComment,
  deleteComment as deleteCommentApi,
  likeComment,
  unlikeComment,
} from '@/api/feed'
import ReportModal from '@/components/shared/ReportModal.vue'

// ── Props / emits ─────────────────────────────────────────────────────────────
const props = defineProps({
  postUuid: { type: String, required: true },
})
const emit = defineEmits(['comment-added', 'comment-removed'])

// ── Auth ──────────────────────────────────────────────────────────────────────
const { user } = useAuth()
const myInitials = computed(() => {
  const n = user.value?.name || ''
  return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'Me'
})

// ── Feed state ────────────────────────────────────────────────────────────────
const comments   = ref([])
const loading    = ref(false)
const hasMore    = ref(false)
const page       = ref(1)
const PER_PAGE   = 15

const reportingCommentId = ref(null)
const reportModalOpen    = ref(false)

function triggerReport(comment) {
  reportingCommentId.value = comment.id ?? comment.uuid
  reportModalOpen.value    = true
}

const REPLIES_PREVIEW = 2 // how many replies to show before "show more"
const expandedIds = ref(new Set())

function toggleReplies(id) {
  const s = new Set(expandedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedIds.value = s
}

function visibleReplies(comment) {
  if (!comment.replies?.length) return []
  const id = comment.id ?? comment.uuid
  if (expandedIds.value.has(id)) return comment.replies
  return comment.replies.slice(0, REPLIES_PREVIEW)
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchComments(pg = 1) {
  loading.value = true
  try {
    const res = await getComments(props.postUuid, { page: pg, per_page: PER_PAGE })
    const incoming = res.data ?? []
    const meta     = res.meta ?? {}

    comments.value = pg === 1 ? incoming : [...comments.value, ...incoming]
    page.value     = pg
    hasMore.value  = meta.current_page < meta.last_page
  } catch (err) {
    console.error('[CommentList] fetchComments failed:', err)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || loading.value) return
  await fetchComments(page.value + 1)
}

onMounted(() => fetchComments(1))

// ── Top-level comment input ───────────────────────────────────────────────────
const topDraft      = ref('')
const topSubmitting = ref(false)
const topFocused    = ref(false)
const topError      = ref('')
const topInputRef   = ref(null)
const justPostedId  = ref(null)

function autoGrow(e) {
  const el = e.target
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

async function submitTop() {
  const text = topDraft.value.trim()
  if (!text || topSubmitting.value) return
  topError.value    = ''
  topSubmitting.value = true
  try {
    const res = await createComment(props.postUuid, { content: text })
    const newComment = { ...res.data, replies: [] }
    comments.value.unshift(newComment)
    topDraft.value = ''
    if (topInputRef.value) topInputRef.value.style.height = 'auto'
    justPostedId.value = newComment.id ?? newComment.uuid
    setTimeout(() => { justPostedId.value = null }, 1800)
    emit('comment-added')
  } catch (err) {
    topError.value = err?.response?.data?.message ?? 'Could not post comment.'
  } finally {
    topSubmitting.value = false
  }
}

// ── Reply input ───────────────────────────────────────────────────────────────
const replyDraftFor   = ref(null)   // id/uuid of the parent comment being replied to
const replyDraft      = ref('')
const replySubmitting = ref(false)
const replyFocused    = ref(false)
const replyError      = ref('')
const replyInputRefs  = {}

async function openReply(comment) {
  const id = comment.id ?? comment.uuid
  if (replyDraftFor.value === id) {
    closeReply()
    return
  }
  replyDraftFor.value = id
  replyDraft.value    = ''
  replyError.value    = ''
  await nextTick()
  replyInputRefs[id]?.focus()
}

function closeReply() {
  replyDraftFor.value = null
  replyDraft.value    = ''
  replyError.value    = ''
}

async function submitReply(parentComment) {
  const text = replyDraft.value.trim()
  if (!text || replySubmitting.value) return
  replyError.value    = ''
  replySubmitting.value = true
  try {
    const res = await createComment(props.postUuid, {
      content:   text,
      parent_id: parentComment.id,
    })
    const newReply = res.data
    // Splice reply into parent's replies array
    const target = comments.value.find(
      c => (c.id ?? c.uuid) === (parentComment.id ?? parentComment.uuid)
    )
    if (target) {
      target.replies = target.replies ? [newReply, ...target.replies] : [newReply]
    }
    replyDraft.value = ''
    closeReply()
    emit('comment-added')
  } catch (err) {
    replyError.value = err?.response?.data?.message ?? 'Could not post reply.'
  } finally {
    replySubmitting.value = false
  }
}

// ── Like / unlike comment ─────────────────────────────────────────────────────
const likingIds = ref(new Set())

async function handleLike(comment) {
  const id = comment.id ?? comment.uuid
  if (likingIds.value.has(id)) return

  // Optimistic
  const wasLiked     = !!comment.is_liked
  const wasCount     = comment.likes_count ?? 0
  comment.is_liked   = !wasLiked
  comment.likes_count = wasLiked ? Math.max(0, wasCount - 1) : wasCount + 1

  const next = new Set(likingIds.value)
  next.add(id)
  likingIds.value = next

  try {
    wasLiked
      ? await unlikeComment(comment.id)
      : await likeComment(comment.id)
  } catch {
    // Rollback
    comment.is_liked    = wasLiked
    comment.likes_count = wasCount
  } finally {
    const s = new Set(likingIds.value)
    s.delete(id)
    likingIds.value = s
  }
}

// ── Delete comment ────────────────────────────────────────────────────────────
const deletingIds = ref(new Set())

async function handleDelete(comment, parentComment = null) {
  const id = comment.id ?? comment.uuid
  if (deletingIds.value.has(id)) return

  const s = new Set(deletingIds.value)
  s.add(id)
  deletingIds.value = s

  try {
    await deleteCommentApi(comment.id)

    if (parentComment) {
      // It's a reply — remove from parent's replies array
      const parent = comments.value.find(
        c => (c.id ?? c.uuid) === (parentComment.id ?? parentComment.uuid)
      )
      if (parent?.replies) {
        parent.replies = parent.replies.filter(r => (r.id ?? r.uuid) !== id)
      }
    } else {
      comments.value = comments.value.filter(c => (c.id ?? c.uuid) !== id)
    }
    emit('comment-removed')
  } catch (err) {
    console.error('[CommentList] delete failed:', err)
  } finally {
    const s2 = new Set(deletingIds.value)
    s2.delete(id)
    deletingIds.value = s2
  }
}
</script>

<!-- ── CommentRow sub-component (defined inline to keep this a single file) ── -->
<script>
import { computed, defineComponent, h } from 'vue'

// Utility used by the sub-component
function formatTime(dateString) {
  if (!dateString) return ''
  const secs = Math.floor((Date.now() - new Date(dateString)) / 1000)
  if (secs < 60)   return 'Just now'
  const m = Math.floor(secs / 60);   if (m < 60)  return `${m}m ago`
  const h2 = Math.floor(secs / 3600); if (h2 < 24) return `${h2}h ago`
  const d = Math.floor(secs / 86400); if (d < 30)  return `${d}d ago`
  const mo = Math.floor(d / 30);      if (mo < 12) return `${mo}mo ago`
  return Math.floor(mo / 12) + 'y ago'
}

const COLORS = [
  '#6C5CE7','#EC4899','#10B981','#F59E0B','#3B82F6','#8B5CF6',
]
function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h) + name.charCodeAt(i)
  return COLORS[Math.abs(h) % COLORS.length]
}
function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'C'
}

export const CommentRow = defineComponent({
  name: 'CommentRow',
  props: {
    comment:     { type: Object,  required: true },
    currentUser: { type: Object,  default: null  },
    isReply:     { type: Boolean, default: false },
    deleting:    { type: Boolean, default: false },
  },
  emits: ['like', 'reply', 'delete', 'report'],
  setup(props, { emit }) {
    const canDelete = computed(() => {
      if (!props.currentUser) return false
      return (
        props.comment.user?.uuid === props.currentUser.uuid ||
        props.currentUser.role === 'admin' ||
        props.currentUser.role === 'moderator'
      )
    })

    return () => {
      const c    = props.comment
      const name = c.user?.name ?? 'Corper'
      const size = props.isReply ? 26 : 30

      return h('div', { class: ['cl-row', props.isReply && 'cl-row--reply'] }, [
        // Avatar
        h('div', {
          class: 'cl-row-avatar',
          style: {
            width: size + 'px', height: size + 'px',
            background: avatarColor(name),
            flexShrink: 0,
          },
        }, c.user?.avatar
          ? [h('img', { src: c.user.avatar, style: 'width:100%;height:100%;object-fit:cover;border-radius:50%;' })]
          : [h('span', null, initials(name))]
        ),

        // Content
        h('div', { class: 'cl-row-body', style: 'flex:1;min-width:0;' }, [
          // Bubble
          h('div', { class: ['cl-bubble', props.isReply && 'cl-bubble--reply'] }, [
            h('p', { class: 'cl-bubble-author' }, name),
            h('p', { class: 'cl-bubble-text' }, c.content),
          ]),

          // Meta row
          h('div', { class: 'cl-meta' }, [
            h('span', { class: 'cl-meta-time' }, formatTime(c.created_at)),

            // Like button
            h('button', {
              class: ['cl-meta-action', c.is_liked && 'cl-meta-action--liked'],
              onClick: () => emit('like'),
            }, [
              h('svg', { width: 11, height: 11, viewBox: '0 0 24 24',
                fill: c.is_liked ? 'currentColor' : 'none',
                stroke: 'currentColor', 'stroke-width': 2 }, [
                h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' }),
              ]),
              c.likes_count > 0 ? h('span', null, ` ${c.likes_count}`) : null,
            ]),

            // Reply button (only on top-level)
            !props.isReply
              ? h('button', { class: 'cl-meta-action', onClick: () => emit('reply') }, 'Reply')
              : null,

            // Delete button
            canDelete.value
              ? h('button', {
                  class: 'cl-meta-action cl-meta-action--delete',
                  disabled: props.deleting,
                  onClick: () => emit('delete'),
                }, props.deleting ? '…' : 'Delete')
              : null,

            // Report button
            (!canDelete.value && props.currentUser)
              ? h('button', {
                  class: 'cl-meta-action cl-meta-action--report',
                  onClick: () => emit('report'),
                }, 'Report')
              : null,
          ]),
        ]),
      ])
    }
  },
})
</script>

<style scoped>
/* ── Root ─────────────────────────────────────────────────────────────────── */
.cl-root {
  padding: 14px 0 4px;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Composer ─────────────────────────────────────────────────────────────── */
.cl-composer {
  display: flex;
  gap: 10px;
  padding: 0 0 12px;
  align-items: flex-start;
}
.cl-reply-composer {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  align-items: flex-start;
}

.cl-composer-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #6C5CE7;
  color: #fff; font-size: 11px; font-weight: 800;
  margin-top: 2px;
}
.cl-composer-avatar--sm { width: 26px; height: 26px; font-size: 10px; }
.cl-composer-avatar img { width: 100%; height: 100%; object-fit: cover; }

.cl-composer-wrap {
  flex: 1;
  background: #F9F8FF;
  border: 1.5px solid #E8E4FF;
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.cl-composer-wrap--focus { border-color: #6C5CE7; }

.cl-textarea {
  display: block;
  width: 100%;
  padding: 8px 12px 4px;
  border: none; outline: none;
  background: transparent;
  font-size: 13px; color: #1A1535;
  resize: none;
  font-family: inherit;
  line-height: 1.45;
  min-height: 34px;
  box-sizing: border-box;
}
.cl-textarea::placeholder { color: #B0ABCC; }
.cl-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

.cl-composer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 3px 7px 6px;
}

.cl-charcount { font-size: 10px; color: #C4BEFF; font-weight: 600; }
.cl-charcount--warn { color: #EF4444; }

.cl-cancel-btn {
  font-size: 11px; font-weight: 600; color: #A8A4C4;
  background: none; border: none; cursor: pointer; padding: 0 4px;
  transition: color 0.15s;
}
.cl-cancel-btn:hover { color: #6C5CE7; }

.cl-send-btn {
  width: 26px; height: 26px;
  border-radius: 8px; border: none;
  background: #6C5CE7; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  flex-shrink: 0;
}
.cl-send-btn:hover:not(:disabled) { background: #5b4dd1; }
.cl-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Error ────────────────────────────────────────────────────────────────── */
.cl-error {
  font-size: 11.5px; color: #EF4444; font-weight: 500;
  padding: 0 0 8px;
}
.cl-error--reply { padding-left: 34px; }

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
.cl-skeletons { display: flex; flex-direction: column; gap: 12px; padding: 4px 0 8px; }
.cl-skeleton-row { display: flex; gap: 10px; }
.cl-sk { background: #F0EEFF; border-radius: 6px; animation: cl-pulse 1.4s ease-in-out infinite; }
.cl-sk-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; }
.cl-sk-lines { flex: 1; display: flex; flex-direction: column; gap: 6px; padding-top: 4px; }
.cl-sk-name { height: 10px; width: 30%; }
.cl-sk-text { height: 10px; width: 70%; }
@keyframes cl-pulse {
  0%, 100% { opacity: 1 } 50% { opacity: 0.45 }
}

/* ── Empty ────────────────────────────────────────────────────────────────── */
.cl-empty {
  display: flex; align-items: center; gap: 8px;
  color: #B0ABCC; font-size: 12.5px; font-weight: 500;
  padding: 12px 0;
}

/* ── Comment list ─────────────────────────────────────────────────────────── */
.cl-list { display: flex; flex-direction: column; gap: 14px; padding: 4px 0 8px; }

.cl-thread {
  display: flex; flex-direction: column; gap: 0;
  border-radius: 12px;
  transition: background 0.4s;
}
.cl-thread--highlight { animation: cl-highlight 1.8s ease; }
@keyframes cl-highlight {
  0%   { background: rgba(108,92,231,0.07); }
  100% { background: transparent; }
}

/* ── Replies container ────────────────────────────────────────────────────── */
.cl-replies {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
  padding-left: 38px;
  border-left: 2px solid #F0EEFF;
  margin-left: 15px;
}

.cl-toggle-replies {
  display: flex; align-items: center; gap: 4px;
  background: none; border: none; cursor: pointer;
  font-size: 11.5px; color: #6C5CE7; font-weight: 700;
  padding: 2px 0;
  transition: opacity 0.15s;
}
.cl-toggle-replies:hover { opacity: 0.75; }

/* ── CommentRow (rendered via defineComponent/h) ──────────────────────────── */
:deep(.cl-row) {
  display: flex; gap: 9px; align-items: flex-start;
}
:deep(.cl-row--reply) {
  padding: 0;
}
:deep(.cl-row-avatar) {
  border-radius: 50%;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 800; color: #fff;
  flex-shrink: 0;
  margin-top: 2px;
}
:deep(.cl-bubble) {
  background: #F4F3FF;
  border-radius: 0 12px 12px 12px;
  padding: 7px 12px;
  display: inline-block;
  max-width: 100%;
}
:deep(.cl-bubble--reply) {
  background: #fff;
  border: 1px solid #EDE9FE;
}
:deep(.cl-bubble-author) {
  font-size: 11.5px; font-weight: 700; color: #1A1535; margin-bottom: 2px;
}
:deep(.cl-bubble-text) {
  font-size: 12.5px; color: #3D3A5C; line-height: 1.45; word-break: break-word;
}
:deep(.cl-meta) {
  display: flex; align-items: center; gap: 10px;
  padding: 4px 2px 0;
  flex-wrap: wrap;
}
:deep(.cl-meta-time) {
  font-size: 10.5px; color: #B0ABCC; font-weight: 500;
}
:deep(.cl-meta-action) {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; font-weight: 700; color: #9C96C0;
  background: none; border: none; cursor: pointer; padding: 0;
  transition: color 0.15s;
}
:deep(.cl-meta-action:hover) { color: #6C5CE7; }
:deep(.cl-meta-action--liked) { color: #EF4444 !important; }
:deep(.cl-meta-action--liked:hover) { color: #DC2626 !important; }
:deep(.cl-meta-action--delete:hover) { color: #EF4444 !important; }
:deep(.cl-meta-action:disabled) { opacity: 0.4; cursor: not-allowed; }

/* ── Load more ────────────────────────────────────────────────────────────── */
.cl-load-more {
  width: 100%;
  padding: 8px;
  border: 1.5px solid #E8E4FF;
  border-radius: 10px;
  background: transparent;
  color: #6C5CE7; font-size: 12px; font-weight: 700;
  cursor: pointer; margin-top: 4px;
  transition: background 0.15s;
}
.cl-load-more:hover { background: #F9F8FF; }

.cl-inline-loader {
  display: flex; justify-content: center; padding: 8px 0;
  color: #6C5CE7;
}

/* ── Spin ─────────────────────────────────────────────────────────────────── */
.cl-spin { animation: cl-spin 0.8s linear infinite; }
@keyframes cl-spin { to { transform: rotate(360deg); } }
</style>