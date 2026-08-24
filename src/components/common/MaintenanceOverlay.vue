<template>
  <div v-if="isMaintenance" class="maintenance-screen">
    <div class="maintenance-content">
      <!-- Animated Icon / Illustration -->
      <div class="maintenance-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      </div>

      <h1 class="title">System Under Maintenance</h1>
      <p class="subtitle">
        KorpaBee is currently undergoing scheduled system upgrades and maintenance to improve performance and security.
      </p>

      <div class="status-badge">
        <span class="pulse-dot"></span>
        <span>Engineers are working on it. Check back shortly!</span>
      </div>

      <button @click="refreshPage" class="btn-refresh">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        Refresh Page
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useFeatureFlagsStore } from '@/stores/featureFlags'

const featureFlags = useFeatureFlagsStore()

const isMaintenance = computed(() => {
  return Boolean(featureFlags.features.maintenance_mode || featureFlags.features.maintenance_mode_user)
})

function handleSystemMaintenance() {
  featureFlags.features.maintenance_mode_user = true
}

onMounted(() => {
  window.addEventListener('system-maintenance', handleSystemMaintenance)
})

onUnmounted(() => {
  window.removeEventListener('system-maintenance', handleSystemMaintenance)
})

function refreshPage() {
  featureFlags.fetchFeatures()
  window.location.reload()
}
</script>

<style scoped>
.maintenance-screen {
  position: fixed;
  inset: 0;
  background: #0F0C23;
  color: #FFFFFF;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.maintenance-content {
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.maintenance-icon {
  width: 88px;
  height: 88px;
  border-radius: 28px;
  background: rgba(108, 92, 231, 0.15);
  border: 1px solid rgba(108, 92, 231, 0.3);
  color: #8B7CF8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  box-shadow: 0 12px 32px rgba(108, 92, 231, 0.2);
}

.title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #FFFFFF;
}

.subtitle {
  font-size: 15px;
  color: #A8A4C4;
  line-height: 1.6;
  margin-bottom: 28px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 18px;
  border-radius: 99px;
  font-size: 13px;
  color: #DDD8FF;
  margin-bottom: 32px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00E676;
  box-shadow: 0 0 12px #00E676;
  animation: pulse 1.8s infinite;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #6C5CE7, #8B7CF8);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-refresh:hover {
  opacity: 0.9;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}
</style>
