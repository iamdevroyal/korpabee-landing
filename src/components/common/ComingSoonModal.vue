<template>
  <transition name="modal-fade">
    <div v-if="store.comingSoonModalOpen" class="coming-soon-backdrop" @click="close">
      <div class="coming-soon-card" @click.stop>
        <!-- Illustration / Icon badge -->
        <div class="icon-badge">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>

        <!-- Content -->
        <h3 class="card-title">{{ store.disabledModuleName }} Coming Soon</h3>
        <p class="card-desc">
          This feature is currently not available or under maintenance. Please check back later!
        </p>

        <!-- Actions -->
        <div class="card-actions">
          <button @click="closeAndHome" class="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFeatureFlagsStore } from '@/stores/featureFlags'

const router = useRouter()
const store = useFeatureFlagsStore()

function close() {
  store.hideComingSoon()
}

function closeAndHome() {
  store.hideComingSoon()
  router.push('/feed')
}
</script>

<style scoped>
.coming-soon-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 12, 35, 0.75);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.coming-soon-card {
  background: #FFFFFF;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.icon-badge {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: #EDE9FF;
  color: #6C5CE7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.card-title {
  font-size: 20px;
  font-weight: 800;
  color: #1A1535;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: #6E6A8A;
  line-height: 1.5;
  margin-bottom: 24px;
}

.card-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #6C5CE7, #8B7CF8);
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  width: 100%;
  transition: opacity 0.2s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

@keyframes popIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to       { opacity: 0; }
</style>
