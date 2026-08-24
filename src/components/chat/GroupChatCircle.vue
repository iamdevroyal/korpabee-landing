<template>
  <button class="group-circle-btn" @click="$emit('click', group)" :title="group.name">
    <!-- Avatar or Initials -->
    <div class="group-avatar" :style="!group.avatar ? avatarGradient : null">
      <img v-if="group.avatar" :src="group.avatar" :alt="group.name" class="group-avatar-img" />
      <span v-else class="group-initials">{{ initials }}</span>

      <!-- NYSC Shield Badge -->
      <span v-if="group.is_nysc_group" class="nysc-badge" title="Official NYSC Group">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7L12 2z"/>
        </svg>
      </span>

      <!-- Unread Badge -->
      <span v-if="group.unread_count > 0" class="unread-badge">
        {{ group.unread_count > 9 ? '9+' : group.unread_count }}
      </span>
    </div>

    <!-- Group Name -->
    <p class="group-name">{{ shortName }}</p>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  group: { type: Object, required: true },
})

defineEmits(['click'])

const initials = computed(() => {
  const words = (props.group.name || '').trim().split(/\s+/)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
})

const shortName = computed(() => {
  const name = props.group.name || ''
  return name.length > 12 ? name.substring(0, 11) + '…' : name
})

// Generate a deterministic gradient from the group name
const avatarGradient = computed(() => {
  const colors = [
    ['#6C5CE7', '#a29bfe'],
    ['#00b894', '#55efc4'],
    ['#e17055', '#fab1a0'],
    ['#0984e3', '#74b9ff'],
    ['#d63031', '#ff7675'],
    ['#6c5ce7', '#fd79a8'],
    ['#00cec9', '#81ecec'],
    ['#fdcb6e', '#ffeaa7'],
  ]
  const index = (props.group.name || '').charCodeAt(0) % colors.length
  const [from, to] = colors[index]
  return { background: `linear-gradient(135deg, ${from}, ${to})` }
})
</script>

<style scoped>
.group-circle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 12px;
  transition: background 0.15s ease;
  flex-shrink: 0;
  min-width: 64px;
}

.group-circle-btn:hover {
  background: #F0EEFF;
}

.group-avatar {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.group-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.group-initials {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
  line-height: 1;
}

/* NYSC Shield overlay — bottom-right of circle */
.nysc-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #00b894;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  z-index: 2;
}

/* Unread count badge — top-right */
.unread-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 17px;
  height: 17px;
  border-radius: 99px;
  background: #e53e3e;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 2px solid #fff;
  z-index: 3;
}

.group-name {
  font-size: 10px;
  font-weight: 500;
  color: #3D3568;
  text-align: center;
  line-height: 1.3;
  max-width: 60px;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
