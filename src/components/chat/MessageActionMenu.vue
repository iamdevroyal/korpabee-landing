<template>
  <div class="message-action-wrapper" :class="{ 'is-me': isMe }">
    <!-- Trigger chevron button -->
    <button
      type="button"
      class="action-trigger"
      :class="{ 'is-me': isMe, 'open': open }"
      @click.stop="toggleMenu"
      title="Message actions"
      :id="`msg-action-${messageUuid}`"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 15.5l-5-5h10l-5 5z"/>
      </svg>
    </button>

    <!-- Desktop Popover menu (hidden on mobile) -->
    <Transition name="pop">
      <div
        v-if="open && !isMobile"
        class="action-popover"
        :class="isMe ? 'popover-is-me' : 'popover-not-me'"
        @click.stop
        ref="popoverRef"
      >
        <!-- Reply -->
        <button class="action-item" @click="emit('reply'); close()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 22l-5-5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Reply</span>
        </button>

        <!-- Copy (shown when text OR media present) -->
        <button v-if="hasContent" class="action-item" @click="emit('copy'); close()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Copy</span>
        </button>

        <!-- Edit (own messages only, not deleted) -->
        <button v-if="isMe && !isDeleted && hasText" class="action-item" @click="emit('edit'); close()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Edit</span>
        </button>

        <!-- Flag (other user's messages only, not deleted) -->
        <button v-if="!isMe && !isDeleted" class="action-item action-item--flag" @click="emit('flag'); close()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="4" y1="22" x2="4" y2="15" stroke-linecap="round"/>
          </svg>
          <span>Flag</span>
        </button>

        <!-- Delete (own messages only, not deleted) -->
        <button v-if="isMe && !isDeleted" class="action-item action-item--delete" @click="emit('delete'); close()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </Transition>

    <!-- Mobile Bottom Sheet (Teleported to body for mobile responsive view) -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="open && isMobile" class="sheet-backdrop" @click.self="close" @keydown.esc="close">
          <Transition name="slide-up">
            <div v-if="open" class="bottom-sheet" @click.stop>
              <div class="sheet-handle"></div>
              <div class="sheet-header">
                <span class="sheet-title">Message Actions</span>
              </div>
              <div class="sheet-body">
                <!-- Reply -->
                <button class="sheet-item" @click="emit('reply'); close()">
                  <div class="sheet-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M15 22l-5-5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>Reply</span>
                </button>

                <!-- Copy -->
                <button v-if="hasContent" class="sheet-item" @click="emit('copy'); close()">
                  <div class="sheet-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>Copy text / link</span>
                </button>

                <!-- Edit -->
                <button v-if="isMe && !isDeleted && hasText" class="sheet-item" @click="emit('edit'); close()">
                  <div class="sheet-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>Edit message</span>
                </button>

                <!-- Flag -->
                <button v-if="!isMe && !isDeleted" class="sheet-item sheet-item--flag" @click="emit('flag'); close()">
                  <div class="sheet-icon-wrap text-amber-500 bg-amber-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="4" y1="22" x2="4" y2="15" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span>Report / Flag message</span>
                </button>

                <!-- Delete -->
                <button v-if="isMe && !isDeleted" class="sheet-item sheet-item--delete" @click="emit('delete'); close()">
                  <div class="sheet-icon-wrap text-red-500 bg-red-50">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <span>Delete message</span>
                </button>
              </div>

              <button class="sheet-cancel-btn" @click="close">
                Cancel
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  messageUuid: { type: String, required: true },
  isMe:        { type: Boolean, default: false },
  isDeleted:   { type: Boolean, default: false },
  hasText:     { type: Boolean, default: false },
  hasContent:  { type: Boolean, default: false }, // text OR media
})

const emit = defineEmits(['reply', 'copy', 'edit', 'flag', 'delete'])

const open       = ref(false)
const isMobile   = ref(false)
const popoverRef = ref(null)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 640
}

const toggleMenu = () => { open.value = !open.value }
const close      = () => { open.value = false }

const handleOutsideClick = (e) => {
  if (open.value && !isMobile.value && popoverRef.value && !popoverRef.value.contains(e.target)) {
    const trigger = document.getElementById(`msg-action-${props.messageUuid}`)
    if (!trigger?.contains(e.target)) close()
  }
}

const handleEsc = (e) => {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleEsc)
})
</script>

<style scoped>

/* Outer trigger position relative to bubble */
.message-action-wrapper {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -28px;
  z-index: 15;
}
.message-action-wrapper.is-me {
  left: -28px;
  right: auto;
}

/* Always-visible high-contrast chevron trigger button */
.action-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  cursor: pointer;
  opacity: 0.9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.15s ease;
  padding: 0;
}
.action-trigger:hover,
.action-trigger.open {
  background: #f3f4f6;
  color: #111827;
  opacity: 1 !important;
  border-color: #d1d5db;
  transform: scale(1.06);
}

/* Desktop Popover */
.action-popover {
  position: absolute;
  top: calc(100% + 4px);
  min-width: 150px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06);
  overflow: hidden;
  z-index: 100;
}
.popover-is-me {
  right: 0;
  left: auto;
}
.popover-not-me {
  left: 0;
  right: auto;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 14px;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
  white-space: nowrap;
}
.action-item:hover {
  background: #f3f4f6;
}
.action-item--flag {
  color: #d97706;
}
.action-item--flag:hover {
  background: #fffbeb;
}
.action-item--delete {
  color: #ef4444;
}
.action-item--delete:hover {
  background: #fef2f2;
}

/* Mobile Bottom Sheet */
.sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  z-index: 9990;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 12px 16px 24px;
  box-shadow: 0 -8px 30px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sheet-handle {
  width: 38px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  margin: 0 auto 4px;
}

.sheet-header {
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid #f3f4f6;
}

.sheet-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.sheet-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sheet-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: #ffffff;
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s;
}
.sheet-item:active {
  background: #f3f4f6;
}

.sheet-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sheet-item--flag { color: #d97706; }
.sheet-item--delete { color: #ef4444; }

.sheet-cancel-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
}
.sheet-cancel-btn:active {
  background: #e5e7eb;
}

/* Animations */
.pop-enter-active { animation: pop-in 0.14s ease; }
.pop-leave-active { animation: pop-in 0.1s ease reverse; }
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.9) translateY(-4px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { animation: slide-up-in 0.22s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-leave-active { animation: slide-up-in 0.18s ease reverse; }
@keyframes slide-up-in {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
</style>
