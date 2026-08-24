<template>
  <Teleport to="body">
    <div class="toast-stack">
      <TransitionGroup name="toast">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          @click="ui.removeToast(toast.id)"
        >
          <span class="toast-icon">
            <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
</script>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 80px; /* above mobile bottom nav */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 999999; /* must always sit above every modal/overlay in the app */
  pointer-events: none;
  width: min(90vw, 360px);
}

.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  backdrop-filter: blur(12px);
  width: 100%;
}

.toast--success {
  background: rgba(0, 184, 148, 0.95);
  color: #fff;
}

.toast--error {
  background: rgba(214, 48, 49, 0.95);
  color: #fff;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.toast-message { flex: 1; line-height: 1.4; }

/* Transitions */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.92);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}

@media (min-width: 1024px) {
  .toast-stack {
    bottom: 32px;
  }
}
</style>