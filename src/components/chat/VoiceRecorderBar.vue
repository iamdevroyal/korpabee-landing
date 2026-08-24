<template>
  <div class="voice-recorder-bar">
    <!-- Cancel recording -->
    <button
      type="button"
      class="voice-cancel-btn"
      @click="$emit('cancel')"
      title="Cancel recording"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    </button>

    <!-- Recording status indicator -->
    <div :class="['voice-recording-indicator', { 'is-paused': isPaused }]">
      <span :class="['voice-dot', { 'voice-dot--paused': isPaused }]"></span>
      <span class="voice-duration">{{ duration }}</span>
      <span class="voice-hint">{{ isPaused ? 'Recording paused' : 'Recording voice note…' }}</span>
    </div>

    <!-- Pause / Resume toggle button -->
    <button
      type="button"
      class="voice-pause-btn"
      @click="togglePauseResume"
      :title="isPaused ? 'Resume recording' : 'Pause recording'"
    >
      <!-- Pause icon -->
      <svg v-if="!isPaused" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <!-- Resume icon (Play/Mic) -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Send voice note -->
    <button
      type="button"
      class="voice-send-btn"
      @click="$emit('stop')"
      title="Send voice note"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  duration: { type: String, required: true },
  isPaused: { type: Boolean, default: false }
})

const emit = defineEmits(['cancel', 'pause', 'resume', 'stop'])

const togglePauseResume = () => {
  if (props.isPaused) {
    emit('resume')
  } else {
    emit('pause')
  }
}
</script>

<style scoped>
.voice-recorder-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.voice-cancel-btn,
.voice-pause-btn,
.voice-send-btn {
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, background 0.2s, color 0.2s;
}

.voice-cancel-btn {
  background: #F0EEFF;
  color: #A8A4C4;
}
.voice-cancel-btn:hover {
  color: #f43f5e;
  background: #FFE8EC;
}

.voice-pause-btn {
  background: #EEF2FF;
  color: #4F46E5;
}
.voice-pause-btn:hover {
  background: #E0E7FF;
  color: #4338CA;
  transform: scale(1.05);
}

.voice-send-btn {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #fff;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
}
.voice-send-btn:hover {
  transform: scale(1.08);
}

.voice-recording-indicator {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F8F7FF;
  border: 1.5px solid #E8E4FF;
  border-radius: 20px;
  padding: 9px 16px;
  transition: background 0.3s, border-color 0.3s;
}

.voice-recording-indicator.is-paused {
  background: #FFFBEB;
  border-color: #FDE68A;
}

.voice-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #f43f5e;
  flex-shrink: 0;
  animation: voice-pulse 1.1s ease-in-out infinite;
}

.voice-dot--paused {
  background: #f59e0b;
  animation: none;
}

.voice-duration {
  font-size: 13px;
  font-weight: 600;
  color: #1A1535;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.voice-hint {
  font-size: 13px;
  color: #A8A4C4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.is-paused .voice-hint {
  color: #d97706;
}

@keyframes voice-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(0.8); }
}
</style>
