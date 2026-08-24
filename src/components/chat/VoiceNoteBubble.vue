<template>
  <div :class="['voice-note-bubble flex items-center gap-3 py-2 px-3 rounded-2xl transition-all select-none', isMe ? 'me-theme' : 'peer-theme']">
    <!-- Avatar & Mic Badge -->
    <div class="relative flex-shrink-0">
      <img
        :src="senderAvatar || defaultAvatar"
        class="w-10 h-10 rounded-full object-cover border-2 shadow-sm"
        :class="isMe ? 'border-white/30' : 'border-emerald-500/20'"
        alt=""
      />
      <div :class="['absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] shadow-sm', isMe ? 'bg-white text-teal-600' : 'bg-emerald-500 text-white']">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
    </div>

    <!-- Play / Pause Button -->
    <button
      type="button"
      @click="togglePlay"
      :class="[
        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 shadow-md',
        isMe
          ? 'bg-white text-teal-700 hover:bg-teal-50'
          : 'bg-emerald-500 text-white hover:bg-emerald-600'
      ]"
      :title="isPlaying ? 'Pause' : 'Play voice note'"
    >
      <!-- Loading spinner -->
      <svg v-if="isLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
      </svg>
      <!-- Pause icon -->
      <svg v-else-if="isPlaying" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
      </svg>
      <!-- Play icon -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>

    <!-- Waveform & Time Section -->
    <div class="flex-1 min-w-[140px] max-w-[220px] flex flex-col justify-center">
      <!-- Interactive Waveform Track -->
      <div
        ref="waveformRef"
        class="waveform-container flex items-center gap-[2.5px] h-6 cursor-pointer py-1"
        @click="onWaveformClick"
        @mousedown="startDragging"
      >
        <div
          v-for="(barHeight, idx) in waveformBars"
          :key="idx"
          class="waveform-bar transition-all duration-150"
          :style="{
            height: barHeight + '%',
            backgroundColor: getBarColor(idx)
          }"
        />
      </div>

      <!-- Time Readout & Speed Button -->
      <div class="flex items-center justify-between mt-1 text-[11px] font-medium font-mono">
        <span :class="isMe ? 'text-teal-100' : 'text-gray-500'">
          {{ isPlaying || currentTime > 0 ? formattedCurrentTime : formattedTotalDuration }}
        </span>

        <!-- Speed multiplier toggle -->
        <button
          type="button"
          @click.stop="toggleSpeed"
          :class="[
            'px-1.5 py-0.5 rounded text-[10px] font-bold tracking-tight transition-colors',
            isMe
              ? 'bg-white/20 text-white hover:bg-white/30'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
          title="Playback speed"
        >
          {{ playbackRate }}x
        </button>
      </div>
    </div>

    <!-- Hidden HTML5 Audio Element -->
    <audio
      ref="audioRef"
      :src="src"
      preload="metadata"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @pause="onPause"
      @play="onPlay"
      @waiting="isLoading = true"
      @canplay="isLoading = false"
      @error="onError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  isMe: {
    type: Boolean,
    default: false
  },
  senderAvatar: {
    type: String,
    default: ''
  },
  duration: {
    type: [Number, String],
    default: 0
  }
})

const defaultAvatar = 'https://via.placeholder.com/150'

// Global single active audio ID tracker
const activeAudioId = ref(null)
if (!window.__activeVoiceNoteId) {
  window.__activeVoiceNoteId = ref(null)
}

const instanceId = 'vn_' + Math.random().toString(36).substring(2, 9)

const audioRef = ref(null)
const waveformRef = ref(null)

const isPlaying = ref(false)
const isLoading = ref(false)
const currentTime = ref(0)
const totalDuration = ref(0)
const playbackRate = ref(1)
const isDragging = ref(false)

// 28 static height percentages representing natural voice waveform peaks
const waveformBars = [
  35, 60, 40, 75, 90, 50, 65, 80, 100, 70,
  45, 85, 95, 60, 40, 75, 90, 55, 65, 85,
  50, 70, 40, 60, 45, 30, 50, 35
]

// Audio event handlers
const onLoadedMetadata = () => {
  if (audioRef.value) {
    totalDuration.value = audioRef.value.duration || Number(props.duration) || 0
  }
}

const onTimeUpdate = () => {
  if (audioRef.value && !isDragging.value) {
    currentTime.value = audioRef.value.currentTime
    if (audioRef.value.duration) {
      totalDuration.value = audioRef.value.duration
    }
  }
}

const onPlay = () => {
  isPlaying.value = true
  isLoading.value = false
  // Stop all other playing voice notes
  if (window.__activeVoiceNoteId && window.__activeVoiceNoteId.value !== instanceId) {
    window.__activeVoiceNoteId.value = instanceId
  }
}

const onPause = () => {
  isPlaying.value = false
}

const onEnded = () => {
  isPlaying.value = false
  currentTime.value = 0
  if (audioRef.value) {
    audioRef.value.currentTime = 0
  }
}

const onError = () => {
  isLoading.value = false
  isPlaying.value = false
}

// Watch global active voice note state so only 1 plays at a time
watch(() => window.__activeVoiceNoteId.value, (newActiveId) => {
  if (newActiveId !== instanceId && isPlaying.value && audioRef.value) {
    audioRef.value.pause()
  }
})

const togglePlay = () => {
  if (!audioRef.value) return

  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    window.__activeVoiceNoteId.value = instanceId
    audioRef.value.play().catch(err => {
      console.warn('Audio play error:', err)
      isPlaying.value = false
    })
  }
}

const toggleSpeed = () => {
  const rates = [1, 1.5, 2]
  const idx = rates.indexOf(playbackRate.value)
  const nextRate = rates[(idx + 1) % rates.length]
  playbackRate.value = nextRate
  if (audioRef.value) {
    audioRef.value.playbackRate = nextRate
  }
}

// Waveform seeking logic
const progressPercent = computed(() => {
  if (!totalDuration.value || totalDuration.value <= 0) return 0
  return Math.min(100, Math.max(0, (currentTime.value / totalDuration.value) * 100))
})

const getBarColor = (idx) => {
  const barPct = ((idx + 1) / waveformBars.length) * 100
  const isPassed = barPct <= progressPercent.value

  if (props.isMe) {
    return isPassed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)'
  } else {
    return isPassed ? '#10B981' : 'rgba(156, 163, 175, 0.4)'
  }
}

const seekToPosition = (e) => {
  if (!waveformRef.value || !audioRef.value || !totalDuration.value) return
  const rect = waveformRef.value.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const pct = Math.min(1, Math.max(0, clickX / rect.width))
  const newTime = pct * totalDuration.value

  currentTime.value = newTime
  audioRef.value.currentTime = newTime
}

const onWaveformClick = (e) => {
  seekToPosition(e)
}

const startDragging = (e) => {
  isDragging.value = true
  seekToPosition(e)

  const onMouseMove = (moveEvent) => {
    if (isDragging.value) {
      seekToPosition(moveEvent)
    }
  }

  const onMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

// Time formatting helpers
const formatSec = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const formattedCurrentTime = computed(() => formatSec(currentTime.value))
const formattedTotalDuration = computed(() => formatSec(totalDuration.value))

onMounted(() => {
  if (typeof props.duration === 'number' && props.duration > 0) {
    totalDuration.value = props.duration
  }
})

onBeforeUnmount(() => {
  if (audioRef.value) {
    audioRef.value.pause()
  }
})
</script>

<style scoped>
.waveform-container {
  touch-action: none;
}

.waveform-bar {
  width: 3px;
  border-radius: 9999px;
}

.me-theme {
  background: transparent;
}

.peer-theme {
  background: transparent;
}
</style>
