<template>
  <!-- Outer group wrapper — hover reveals the action trigger -->
  <div
    :data-message-uuid="message.uuid"
    :class="[
      'msg-group flex items-end space-x-2 my-2.5 max-w-[80%] relative',
      isMe ? 'ml-auto flex-row-reverse space-x-reverse' : 'mr-auto'
    ]"
  >
    <!-- Sender Avatar -->
    <img
      v-if="showAvatar && !isMe"
      :src="message.sender?.avatar || 'https://via.placeholder.com/150'"
      class="w-7 h-7 rounded-full border border-navy-100 object-cover flex-shrink-0"
      alt="Avatar"
    />
    <div v-else-if="showAvatar && isMe" class="w-7"></div>

    <!-- Message Bubble Body -->
    <div class="flex flex-col relative">
      <!-- Sender Name (only in group chats when not me) -->
      <span v-if="showSenderName && !isMe" class="text-[10px] font-bold text-gray-400 mb-0.5 ml-3">
        {{ message.sender?.name }}
      </span>

      <!-- Bubble Container -->
      <div
        :class="[
          'rounded-2xl px-4 py-2.5 shadow-sm text-sm relative transition-all duration-300 border',
          isMe
            ? 'bg-gradient-to-br from-teal-500 to-teal-600 border-transparent text-white rounded-br-none'
            : 'bg-white border-navy-100/50 text-navy-800 rounded-bl-none',
          message.error ? 'border-red-300 bg-red-50 text-red-800' : '',
          highlightFlash ? 'ring-2 ring-teal-400 ring-offset-1' : '',
        ]"
      >
        <!-- ── WhatsApp-style Quoted Reply Block ─────────────────────── -->
        <div
          v-if="message.reply_to"
          :class="[
            'border-l-2 pl-2 py-1 mb-2 text-xs rounded cursor-pointer select-none transition-colors',
            isMe
              ? 'border-teal-200 bg-white/10 hover:bg-white/20 text-teal-50'
              : 'border-teal-400 bg-teal-50 hover:bg-teal-100 text-gray-600'
          ]"
          @click="$emit('scroll-to-message', message.reply_to.uuid)"
          title="Jump to original message"
        >
          <p class="font-bold text-[11px] mb-0.5" :class="isMe ? 'text-teal-200' : 'text-teal-600'">
            {{ message.reply_to.sender?.name || 'Unknown' }}
          </p>
          <p class="truncate max-w-[220px] text-[11px] leading-snug">
            <template v-if="message.reply_to.is_deleted">
              <em class="opacity-60">This message was deleted</em>
            </template>
            <template v-else-if="message.reply_to.message">
              {{ message.reply_to.message }}
            </template>
            <template v-else-if="message.reply_to.type === 'image'">📷 Photo</template>
            <template v-else-if="message.reply_to.type === 'video'">🎥 Video</template>
            <template v-else-if="message.reply_to.type === 'voice'">🎤 Voice note</template>
            <template v-else>📄 Attachment</template>
          </p>
        </div>

        <!-- ── Deleted Message ──────────────────────────────────────── -->
        <p v-if="message.is_deleted" class="italic text-xs opacity-60 flex items-center gap-1.5">
          <span>🚫</span>
          <span>This message was deleted</span>
        </p>

        <template v-else>
          <!-- Multiple Media Content -->
          <template v-if="message.media && message.media.length > 0">
            <!-- Visual Media Grid (Images & Videos) -->
            <div v-if="visualMedia.length > 0" :class="['grid gap-1.5 mb-2 rounded-lg overflow-hidden max-w-[320px]', visualMedia.length === 1 ? 'grid-cols-1' : 'grid-cols-2']">
              <div v-for="(item, idx) in visualMedia" :key="item.uuid || idx" class="relative group aspect-square bg-black overflow-hidden rounded-md border border-navy-100/30">
                <img
                  v-if="item.type === 'image'"
                  :src="item.url"
                  class="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  @click="openMediaCarousel(item.url)"
                  alt=""
                />
                <video
                  v-else-if="item.type === 'video'"
                  :src="item.url"
                  controls
                  class="w-full h-full object-cover"
                />
                <!-- Uploading state overlay -->
                <div v-if="item.is_uploading" class="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:.25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:.75"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Non-Visual Media List (Audio & Docs) -->
            <div v-if="nonVisualMedia.length > 0" class="flex flex-col gap-2 mb-2 max-w-[290px]">
              <div v-for="(item, idx) in nonVisualMedia" :key="item.uuid || idx" class="rounded-lg">
                <VoiceNoteBubble
                  v-if="isAudioItem(item)"
                  :src="item.url"
                  :is-me="isMe"
                  :sender-avatar="message.sender?.avatar"
                  :duration="item.duration || 0"
                />
                <DocumentMessageCard
                  v-else
                  :url="item.url"
                  :file-name="item.file_name || 'Document'"
                  :file-size="item.file_size"
                  :is-me="isMe"
                  :is-uploading="item.is_uploading"
                />
              </div>
            </div>
          </template>

          <!-- Legacy Single Media Content Fallback -->
          <template v-else-if="message.media_url">
            <div class="mb-2 rounded-lg overflow-hidden max-w-[290px]">
              <img
                v-if="message.type === 'image'"
                :src="message.media_url"
                class="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                @click="openMediaCarousel(message.media_url)"
              />
              <video
                v-else-if="message.type === 'video'"
                :src="message.media_url"
                controls
                class="w-full h-auto max-h-[200px] object-cover bg-black"
              />
              <VoiceNoteBubble
                v-else-if="message.type === 'voice' || message.type === 'audio' || isAudioUrl(message.media_url)"
                :src="message.media_url"
                :is-me="isMe"
                :sender-avatar="message.sender?.avatar"
              />
              <DocumentMessageCard
                v-else
                :url="message.media_url"
                :file-name="message.file_name || 'Attachment'"
                :file-size="message.file_size"
                :is-me="isMe"
              />
            </div>
          </template>

          <!-- Shared Location Message -->
          <LocationMessagePreview
            v-if="parsedLocation"
            :location="parsedLocation"
            :is-me="isMe"
            @open-map="showMapModal = true"
          />

          <!-- Text Message -->
          <p v-else-if="message.message" class="break-words leading-relaxed whitespace-pre-wrap">{{ message.message }}</p>
        </template>

        <!-- ── Time, Read Status, Edited badge ───────────────────────── -->
        <div :class="['flex items-center space-x-1 justify-end mt-1 text-[9px]', isMe ? 'text-teal-100' : 'text-gray-400']">
          <!-- Edited indicator -->
          <span v-if="message.is_edited && !message.is_deleted" class="italic opacity-70 mr-0.5">edited</span>
          <span>{{ formatTime(message.created_at) }}</span>

          <!-- Read status / sending indicator (own messages) -->
          <span v-if="isMe && !message.is_deleted" class="flex items-center ml-0.5">
            <svg v-if="message.is_sending" class="animate-spin h-3 w-3 text-teal-100" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" style="opacity:.25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:.75"></path>
            </svg>
            <button
              v-else-if="message.error"
              type="button"
              @click.stop="retrySend"
              class="flex items-center gap-1 text-red-500 hover:text-red-600 bg-red-100/90 hover:bg-red-200 px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ml-1 shadow-sm"
              title="Failed to send. Click to retry."
            >
              <svg class="h-3 w-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry</span>
            </button>
            <svg v-else-if="isRead" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M17 5L9.5 12.5L7 10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 5L14.5 12.5L13.5 11.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 15L9.5 17.5L5 13" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-65" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      <!-- ── Action Menu Trigger (outside bubble, positioned beside it) ── -->
      <MessageActionMenu
        v-if="!message.is_sending && !message.error"
        :message-uuid="message.uuid"
        :is-me="isMe"
        :is-deleted="message.is_deleted"
        :has-text="!!message.message"
        :has-content="!!(message.message || message.media_url || (message.media && message.media.length > 0))"
        class="action-menu-anchor"
        :class="isMe ? 'action-left' : 'action-right'"
        @reply="handleReply"
        @copy="handleCopy"
        @edit="editModalOpen = true"
        @flag="reportModalOpen = true"
        @delete="handleDelete"
      />
    </div>

    <!-- ── Media Carousel Modal ──────────────────────────────────────── -->
    <Transition name="fade">
      <div v-if="showModal" class="media-modal-backdrop" @click="closeModal" @keydown.esc="closeModal" tabindex="0" ref="modalRef">
        <button class="modal-close-btn" @click.stop="closeModal" title="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <button v-if="modalMediaItems.length > 1" class="carousel-arrow carousel-arrow--left" @click.stop="prevMedia" title="Previous">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button v-if="modalMediaItems.length > 1" class="carousel-arrow carousel-arrow--right" @click.stop="nextMedia" title="Next">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="modal-content-wrap" @click.stop>
          <img v-if="currentModalMedia?.type === 'image'" :src="currentModalMedia.url" class="modal-media-element object-contain select-none" alt="" />
          <video v-else-if="currentModalMedia?.type === 'video'" :src="currentModalMedia.url" controls autoplay class="modal-media-element object-contain bg-black" />
          <p class="modal-media-caption">{{ currentModalMedia?.file_name || 'Media Attachment' }}</p>
        </div>
        <div v-if="modalMediaItems.length > 1" class="carousel-dots">
          <span v-for="(item, idx) in modalMediaItems" :key="idx" :class="['carousel-dot', { 'carousel-dot--active': idx === activeIndex }]" @click.stop="activeIndex = idx" />
        </div>
      </div>
    </Transition>

    <!-- Location Map Modal -->
    <LocationMapModal
      :open="showMapModal"
      :location="parsedLocation"
      @close="showMapModal = false"
    />

    <!-- Edit Message Modal -->
    <EditMessageModal
      :open="editModalOpen"
      :message-uuid="message.uuid"
      :current-text="message.message || ''"
      @close="editModalOpen = false"
      @saved="editModalOpen = false"
    />

    <!-- Report / Flag Modal -->
    <ReportModal
      v-if="reportModalOpen && (message.id || message.uuid)"
      :open="reportModalOpen"
      target-type="message"
      :target-id="message.id ?? message.uuid"
      @close="reportModalOpen = false"
    />

    <!-- Custom Delete Message Modal -->
    <DeleteMessageModal
      :open="deleteModalOpen"
      :message-uuid="message.uuid"
      :message-text="message.message || ''"
      @close="deleteModalOpen = false"
      @deleted="deleteModalOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, ref, nextTick, onBeforeUnmount } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useChatStore } from '@/stores/chat'
import { parseLocationMessage } from '@/composables/useLocationMessage'
import LocationMessagePreview from '@/components/chat/LocationMessagePreview.vue'
import LocationMapModal from '@/components/chat/LocationMapModal.vue'
import ReportModal from '@/components/shared/ReportModal.vue'
import VoiceNoteBubble from '@/components/chat/VoiceNoteBubble.vue'
import DocumentMessageCard from '@/components/chat/DocumentMessageCard.vue'
import MessageActionMenu from '@/components/chat/MessageActionMenu.vue'
import EditMessageModal from '@/components/chat/EditMessageModal.vue'
import DeleteMessageModal from '@/components/chat/DeleteMessageModal.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showSenderName: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['reply-message', 'scroll-to-message'])

const { user }  = useAuth()
const chatStore = useChatStore()

const showModal       = ref(false)
const showMapModal    = ref(false)
const reportModalOpen = ref(false)
const editModalOpen   = ref(false)
const deleteModalOpen = ref(false)
const activeIndex     = ref(0)
const modalRef        = ref(null)
const highlightFlash  = ref(false)

const isMe = computed(() => props.message.sender?.uuid === user.value?.uuid)

const parsedLocation = computed(() => parseLocationMessage(props.message.message))

const retrySend = () => chatStore.retrySendMessage(props.message)

// ── Action handlers ───────────────────────────────────────────────────────

const handleReply = () => {
  emit('reply-message', props.message)
}

const handleCopy = async () => {
  const parts = []
  if (props.message.message) parts.push(props.message.message)
  if (!props.message.message && props.message.media_url) parts.push(props.message.media_url)
  const text = parts.join('\n')
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Fallback for browsers without clipboard API
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

const handleDelete = () => {
  deleteModalOpen.value = true
}

// ── Flash highlight (triggered by parent scrolling to this message) ───────
const flash = () => {
  highlightFlash.value = true
  setTimeout(() => { highlightFlash.value = false }, 1200)
}
defineExpose({ flash })

// ── Media helpers ─────────────────────────────────────────────────────────
const isAudioItem = (item) => {
  if (!item) return false
  if (item.type === 'voice' || item.type === 'audio') return true
  if (item.mime_type?.startsWith('audio/')) return true
  const nameOrUrl = (item.file_name || '') + ' ' + (item.url || '')
  if (nameOrUrl.includes('voice-note') || nameOrUrl.includes('voice_note')) return true
  if (item.url && /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(item.url)) return true
  return false
}

const isAudioUrl = (url) => {
  if (!url) return false
  if (url.includes('voice-note') || url.includes('voice_note')) return true
  return /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url)
}

const visualMedia = computed(() => {
  if (!props.message.media || props.message.media.length === 0) return []
  return props.message.media.filter(m => (m.type === 'image' || m.type === 'video') && !isAudioItem(m))
})

const nonVisualMedia = computed(() => {
  if (!props.message.media || props.message.media.length === 0) return []
  return props.message.media.filter(m => (m.type !== 'image' && m.type !== 'video') || isAudioItem(m))
})

const modalMediaItems = computed(() => {
  if (props.message.media && props.message.media.length > 0) {
    const list = props.message.media.filter(m => m.type === 'image' || m.type === 'video')
    if (list.length > 0) return list
  }
  if (props.message.media_url && (props.message.type === 'image' || props.message.type === 'video')) {
    return [{ uuid: props.message.uuid, url: props.message.media_url, type: props.message.type, file_name: 'Media Attachment' }]
  }
  return []
})

const currentModalMedia = computed(() => modalMediaItems.value[activeIndex.value] || null)

const isRead = computed(() => {
  if (!isMe.value) return false
  if (props.message.is_sending) return false
  const conversation = chatStore.activeConversation
  if (!conversation) return false
  const messageTime = new Date(props.message.created_at).getTime()
  const otherMembers = conversation.members?.filter(m => m.uuid !== user.value?.uuid) || []
  if (otherMembers.length === 0) return false
  if (conversation.type === 'dm') {
    const other = otherMembers[0]
    if (!other.last_read_at) return false
    return new Date(other.last_read_at).getTime() >= (messageTime - 1000)
  }
  return otherMembers.every(m => m.last_read_at && new Date(m.last_read_at).getTime() >= (messageTime - 1000))
})

// ── Carousel ──────────────────────────────────────────────────────────────
const openMediaCarousel = (activeUrl) => {
  const list = modalMediaItems.value
  const idx  = list.findIndex(m => m.url === activeUrl)
  activeIndex.value = idx !== -1 ? idx : 0
  showModal.value   = true
  window.addEventListener('keydown', handleKeyDown)
  nextTick(() => modalRef.value?.focus())
}
const closeModal = () => {
  showModal.value = false
  window.removeEventListener('keydown', handleKeyDown)
}
const nextMedia = () => {
  const len = modalMediaItems.value.length
  if (len > 1) activeIndex.value = (activeIndex.value + 1) % len
}
const prevMedia = () => {
  const len = modalMediaItems.value.length
  if (len > 1) activeIndex.value = (activeIndex.value - 1 + len) % len
}
const handleKeyDown = (e) => {
  if (e.key === 'ArrowRight' || e.key === 'Right') nextMedia()
  else if (e.key === 'ArrowLeft' || e.key === 'Left') prevMedia()
  else if (e.key === 'Escape' || e.key === 'Esc') closeModal()
}
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeyDown))

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* ── Action Menu positioning ─────────────────────────────────────────── */
.action-menu-anchor {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.action-left  { left: -26px; }
.action-right { right: -26px; }

/* Reveal trigger on group hover / focus-within */
.msg-group:hover :deep(.action-trigger),
.msg-group:focus-within :deep(.action-trigger) {
  opacity: 1 !important;
}

/* ── Media Modal Overlay ─────────────────────────────────────────────── */
.media-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 8, 20, 0.94);
  backdrop-filter: blur(12px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  outline: none;
}

.modal-close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  z-index: 10100;
}
.modal-close-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.06); }

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  z-index: 10050;
}
.carousel-arrow:hover { background: rgba(255,255,255,0.18); transform: translateY(-50%) scale(1.08); }
.carousel-arrow--left  { left: 24px; }
.carousel-arrow--right { right: 24px; }

.modal-content-wrap {
  max-width: 85vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.modal-media-element {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  box-shadow: 0 12px 48px rgba(0,0,0,0.65);
}
.modal-media-caption {
  color: rgba(255,255,255,0.75);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  max-width: 450px;
  word-break: break-all;
}

.carousel-dots {
  position: absolute;
  bottom: 24px;
  display: flex;
  gap: 8px;
}
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.carousel-dot--active { background: #10B981; transform: scale(1.3); }

/* ── Animations ──────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
