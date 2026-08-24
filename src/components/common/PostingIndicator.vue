<template>
  <Transition name="posting-bar">
    <div v-if="ui.posting" class="posting-bar">
      <div class="posting-bar-track">
        <div class="posting-bar-fill"></div>
      </div>
      <span class="posting-bar-label">{{ ui.postingLabel || 'Publishing your post…' }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>

<style scoped>
.posting-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.posting-bar-track {
  width: 100%;
  height: 3px;
  background: rgba(108, 92, 231, 0.15);
  overflow: hidden;
}

.posting-bar-fill {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #6C5CE7, #00CEC9);
  border-radius: 0 2px 2px 0;
  animation: posting-slide 1.4s ease-in-out infinite;
}

.posting-bar-label {
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #6C5CE7, #00CEC9);
  padding: 3px 12px 4px;
  border-radius: 0 0 8px 8px;
  letter-spacing: 0.2px;
  box-shadow: 0 2px 8px rgba(108,92,231,0.25);
}

@keyframes posting-slide {
  0%   { transform: translateX(-150%); }
  50%  { transform: translateX(160%); }
  100% { transform: translateX(400%); }
}

.posting-bar-enter-active, .posting-bar-leave-active {
  transition: opacity 0.3s ease;
}
.posting-bar-enter-from, .posting-bar-leave-to {
  opacity: 0;
}
</style>