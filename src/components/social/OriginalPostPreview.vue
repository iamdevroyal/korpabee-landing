<template>
  <!-- Read-only quoted card for reshared posts embedded inside PostCard -->
  <div class="original-post-preview">
    <!-- Tombstone -->
    <div v-if="post.deleted" class="opp-tombstone">
      <svg xmlns="http://www.w3.org/2000/svg" class="opp-tomb-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <span>Original post has been removed</span>
    </div>

    <!-- Real content -->
    <template v-else>
      <!-- Author row -->
      <div class="opp-header">
        <div class="opp-avatar">
          <img v-if="post.user?.avatar" :src="post.user.avatar" :alt="post.user.name" />
          <span v-else>{{ initials }}</span>
        </div>
        <div class="opp-meta">
          <span class="opp-name">{{ post.user?.name || 'Unknown' }}</span>
          <span v-if="post.created_at" class="opp-time">{{ formatTime(post.created_at) }}</span>
        </div>
      </div>

      <!-- Content text -->
      <p v-if="post.content" class="opp-content">{{ post.content }}</p>

      <!-- Media grid (max 2 shown) -->
      <div v-if="post.media?.length" class="opp-media-grid" :class="`opp-media-grid--${Math.min(post.media.length, 2)}`">
        <div
          v-for="(m, i) in post.media.slice(0, 2)"
          :key="i"
          class="opp-media-cell"
        >
          <img v-if="m.type === 'image'" :src="m.url" class="opp-media-img" alt="" />
          <div v-else class="opp-video-thumb">
            <svg xmlns="http://www.w3.org/2000/svg" class="opp-play" fill="white" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)" />
              <polygon points="10,8 18,12 10,16" fill="white" />
            </svg>
          </div>
          <div v-if="i === 1 && post.media.length > 2" class="opp-more">+{{ post.media.length - 2 }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  post: { type: Object, required: true }
})

const initials = computed(() => {
  const name = props.post.user?.name || '?'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
})

function formatTime(iso) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d) / 1000)
  if (diff < 60)  return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<script>
import { computed } from 'vue'
export default {}
</script>

<style scoped>
.original-post-preview {
  border: 1px solid #e8eaf0;
  border-radius: 12px;
  padding: 12px;
  background: #f9fafc;
  margin-top: 8px;
}

.opp-tombstone {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 13px;
  font-style: italic;
}
.opp-tomb-icon { width: 18px; height: 18px; }

.opp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.opp-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.opp-avatar img { width: 100%; height: 100%; object-fit: cover; }
.opp-meta { display: flex; flex-direction: column; }
.opp-name { font-size: 12px; font-weight: 700; color: #1a1f36; }
.opp-time { font-size: 11px; color: #9ca3af; }

.opp-content {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 8px;
  white-space: pre-wrap;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.opp-media-grid {
  display: grid;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
}
.opp-media-grid--1 { grid-template-columns: 1fr; }
.opp-media-grid--2 { grid-template-columns: 1fr 1fr; }

.opp-media-cell { position: relative; aspect-ratio: 16/9; background: #111; }
.opp-media-img { width: 100%; height: 100%; object-fit: cover; }
.opp-video-thumb {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: #111;
}
.opp-play { width: 36px; height: 36px; }
.opp-more {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 16px; font-weight: 700;
}
</style>
