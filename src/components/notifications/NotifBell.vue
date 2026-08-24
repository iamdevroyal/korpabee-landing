<template>
  <div class="notif-bell-wrap" ref="bellRef">
    <!-- Bell button -->
    <button
      class="bell-btn"
      :class="{ 'bell-btn--active': open, 'bell-btn--ringing': hasNew }"
      @click="toggleDropdown"
      title="Notifications"
      aria-label="Notifications"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span v-if="unreadCount > 0" class="bell-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </button>

    <!-- Dropdown popover -->
    <Transition name="bell-pop">
      <div v-if="open" class="bell-dropdown">
        <!-- Dropdown header -->
        <div class="bell-dropdown-header">
          <span class="bell-dropdown-title">Notifications</span>
          <div class="bell-dropdown-actions">
            <button v-if="unreadCount > 0" @click="markAllRead" class="bell-mark-all">Mark all read</button>
            <router-link to="/notifications" @click="open = false" class="bell-see-all">See all</router-link>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="bell-loader">
          <svg class="bell-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity:.25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style="opacity:.75"></path>
          </svg>
        </div>

        <!-- Empty state -->
        <div v-else-if="recentNotifs.length === 0" class="bell-empty">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p>No notifications yet</p>
        </div>

        <!-- Notification list (latest 6) -->
        <div v-else class="bell-notif-list">
          <button
            v-for="notif in recentNotifs"
            :key="notif.id"
            class="bell-notif-item"
            :class="{ 'bell-notif-item--unread': !notif.read_at }"
            @click="handleNotifClick(notif)"
          >
            <!-- Icon by type -->
            <div class="bell-notif-icon" :class="iconClass(notif)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" v-html="iconPath(notif)"></svg>
            </div>
            <!-- Content -->
            <div class="bell-notif-body">
              <p class="bell-notif-title">{{ notif.data?.title || 'Notification' }}</p>
              <p class="bell-notif-msg">{{ notif.data?.message }}</p>
              <span class="bell-notif-time">{{ formatTime(notif.created_at) }}</span>
            </div>
            <!-- Unread dot -->
            <div v-if="!notif.read_at" class="bell-notif-dot"></div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

const router = useRouter()
const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()

const open     = ref(false)
const hasNew   = ref(false)
const bellRef  = ref(null)

// Show only the 6 most recent
const recentNotifs = computed(() => notifications.value.slice(0, 6))

// Ring animation when a new unread arrives
watch(unreadCount, (newVal, oldVal) => {
  if (newVal > oldVal) {
    hasNew.value = true
    setTimeout(() => { hasNew.value = false }, 2000)
  }
})

const toggleDropdown = () => {
  open.value = !open.value
  if (open.value && notifications.value.length === 0) {
    fetchNotifications()
  }
}

const markAllRead = async () => {
  try { await markAllAsRead() } catch {}
}

const handleNotifClick = async (notif) => {
  if (!notif.read_at) {
    try { await markAsRead(notif.id) } catch {}
  }
  open.value = false
  if (notif.data?.action) {
    router.push(notif.data.action)
  }
}

// Click outside to close
const onOutsideClick = (e) => {
  if (bellRef.value && !bellRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => {
  fetchNotifications()
  document.addEventListener('click', onOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
})

// ── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  const seconds = Math.floor((Date.now() - d) / 1000)
  if (seconds < 60)   return 'Just now'
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago'
  if (seconds < 86400)return Math.floor(seconds / 3600) + 'h ago'
  return Math.floor(seconds / 86400) + 'd ago'
}

const iconClass = (notif) => {
  const type = notif.type || ''
  const category = notif.data?.category || ''
  if (type.includes('WalletTransaction') || category === 'wallet_transaction') return 'icon--wallet'
  if (type.includes('PostLiked'))      return 'icon--like'
  if (type.includes('PostCommented'))  return 'icon--comment'
  if (type.includes('ConnectionRequest')) return 'icon--connect'
  if (type.includes('ConnectionAccepted'))return 'icon--connect'
  if (type.includes('NewFollower'))    return 'icon--follow'
  if (type.includes('NewMessage'))     return 'icon--message'
  return 'icon--default'
}

const iconPath = (notif) => {
  const type = notif.type || ''
  const category = notif.data?.category || ''
  if (type.includes('WalletTransaction') || category === 'wallet_transaction') return '<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>'
  if (type.includes('PostLiked'))      return '<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>'
  if (type.includes('PostCommented'))  return '<path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>'
  if (type.includes('Connection'))     return '<path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>'
  if (type.includes('NewFollower'))    return '<path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>'
  if (type.includes('NewMessage'))     return '<path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'
  return '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
}
</script>

<style scoped>
/* ── Bell button ── */
.notif-bell-wrap {
  position: relative;
}

.bell-btn {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #F8F7FF;
  border: 1.5px solid #E8E4FF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6E6A8A;
  transition: all 0.2s ease;
}

.bell-btn:hover, .bell-btn--active {
  background: #F0EEFF;
  color: #6C5CE7;
  border-color: #6C5CE7;
}

@keyframes bell-ring {
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50% { transform: rotate(-12deg); }
  20%, 40% { transform: rotate(12deg); }
}

.bell-btn--ringing svg {
  animation: bell-ring 0.6s ease-in-out;
}

.bell-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #EF4444;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #fff;
  line-height: 1;
}

/* ── Dropdown ── */
.bell-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 340px;
  max-height: 480px;
  background: #fff;
  border: 1px solid #E8E4FF;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(108, 92, 231, 0.15);
  overflow: hidden;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

/* Dropdown animation */
.bell-pop-enter-active,
.bell-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.bell-pop-enter-from,
.bell-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* Header */
.bell-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #F0EEFF;
  flex-shrink: 0;
}

.bell-dropdown-title {
  font-size: 13px;
  font-weight: 800;
  color: #1A1535;
}

.bell-dropdown-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bell-mark-all, .bell-see-all {
  font-size: 11px;
  font-weight: 600;
  color: #6C5CE7;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
  transition: opacity 0.15s;
}

.bell-mark-all:hover, .bell-see-all:hover { opacity: 0.7; }

/* Loader */
.bell-loader {
  display: flex;
  justify-content: center;
  padding: 32px;
}

.bell-spin {
  width: 22px;
  height: 22px;
  color: #6C5CE7;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Empty */
.bell-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 36px 20px;
  color: #A8A4C4;
}

.bell-empty p { font-size: 12px; font-weight: 500; }

/* Notif list */
.bell-notif-list {
  overflow-y: auto;
  flex: 1;
}

.bell-notif-list::-webkit-scrollbar { width: 4px; }
.bell-notif-list::-webkit-scrollbar-thumb { background: #E8E4FF; border-radius: 2px; }

.bell-notif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid #F8F7FF;
  cursor: pointer;
  background: #fff;
  border: none;
  width: 100%;
  text-align: left;
  transition: background 0.15s;
  position: relative;
}

.bell-notif-item:last-child { border-bottom: none; }
.bell-notif-item:hover { background: #FDFCFF; }
.bell-notif-item--unread { background: #F8F7FF; }

.bell-notif-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.icon--like    { background: #FFF1F2; color: #EF4444; }
.icon--comment { background: #F0EEFF; color: #6C5CE7; }
.icon--connect { background: #ECFDF5; color: #10B981; }
.icon--follow  { background: #FFF7ED; color: #F97316; }
.icon--message { background: #EFF6FF; color: #3B82F6; }
.icon--wallet  { background: #ECFDF5; color: #059669; }
.icon--default { background: #F8F7FF; color: #6E6A8A; }

.bell-notif-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bell-notif-title {
  font-size: 12px;
  font-weight: 700;
  color: #1A1535;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.bell-notif-msg {
  font-size: 11.5px;
  color: #6E6A8A;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 0;
}

.bell-notif-time {
  font-size: 10px;
  color: #A8A4C4;
  font-weight: 500;
}

.bell-notif-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6C5CE7;
  flex-shrink: 0;
  margin-top: 6px;
}

/* Mobile: full-width on small screens */
@media (max-width: 480px) {
  .bell-dropdown {
    width: calc(100vw - 24px);
    right: -12px;
  }
}
</style>
