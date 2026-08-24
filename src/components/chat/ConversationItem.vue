<template>
  <div
    @click="emit('click')"
    :class="[
      'flex items-center space-x-3 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border',
      isActive
        ? 'bg-teal-500/5 border-teal-500/25 shadow-sm'
        : 'bg-white border-transparent hover:bg-gray-50/50 hover:border-navy-50/50'
    ]"
  >
    <!-- Avatar -->
    <div class="relative flex-shrink-0">
      <img
        :src="conversation.avatar || defaultAvatar"
        class="w-11 h-11 rounded-full border border-navy-100 object-cover"
        alt="Avatar"
      />
      <!-- Online indicator dot — top-left for visibility -->
      <span
        v-if="conversation.is_online"
        class="absolute top-0 left-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
        title="Online now"
      ></span>
      <!-- Unread indicator dot — top-right -->
      <span
        v-if="conversation.unread_count > 0"
        class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white"
      >
        {{ conversation.unread_count }}
      </span>
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-bold text-navy-900 truncate">
          {{ conversation.name }}
        </h4>
        <span class="text-[10px] text-gray-400 font-medium whitespace-nowrap">
          {{ formatTime(conversation.last_message_at || conversation.created_at) }}
        </span>
      </div>

      <div class="flex items-center justify-between mt-1 text-xs">
        <!-- Message preview -->
        <p :class="['truncate flex-1 pr-2', conversation.unread_count > 0 ? 'text-navy-950 font-bold' : 'text-gray-400']">
          {{ messagePreview }}
        </p>

        <!-- Indicators -->
        <div class="flex items-center space-x-1.5 flex-shrink-0 text-gray-400">
          <svg v-if="conversation.is_muted" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5L6.859 11H5a1 1 0 100 2h1.859l2.274 3.5A1 1 0 0011 16V4a1 1 0 00-1-1z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  conversation: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const defaultAvatar = 'https://via.placeholder.com/150'

const messagePreview = computed(() => {
  const lastMsg = props.conversation.last_message
  if (!lastMsg) return 'No messages yet'
  if (lastMsg.is_deleted) return 'This message was deleted.'
  
  const fileName = lastMsg.media?.[0]?.file_name || lastMsg.file_name || ''
  const urlOrName = (lastMsg.media_url || '') + ' ' + fileName + ' ' + (lastMsg.media?.[0]?.url || '')
  const isVoice = lastMsg.type === 'voice' || lastMsg.type === 'audio' || urlOrName.includes('voice-note')

  if (isVoice) {
    return '🎤 Sent a voice note'
  } else if (lastMsg.type === 'image') {
    return '📷 Sent an image'
  } else if (lastMsg.type === 'video') {
    return '🎥 Sent a video'
  } else if (lastMsg.type === 'document' || lastMsg.media?.[0]?.type === 'document' || (urlOrName.trim().length > 0 && !isVoice && lastMsg.type !== 'image' && lastMsg.type !== 'video')) {
    return fileName ? `📄 ${fileName}` : '📄 Sent a document'
  } else if (lastMsg.type === 'text' && lastMsg.message) {
    return lastMsg.message
  }
  return fileName ? `📄 ${fileName}` : '📁 Sent a file'
})

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const today = new Date()
  
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
</script>
