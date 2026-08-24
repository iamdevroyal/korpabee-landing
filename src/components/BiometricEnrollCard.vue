<template>
  <Transition name="card-fade">
    <div v-if="show" class="enroll-card" role="region" aria-label="Enable biometric login">
      <div class="enroll-icon">&#x1FAA6;</div>
      <div class="enroll-body">
        <p class="enroll-title">Enable Face ID / Fingerprint login?</p>
        <p class="enroll-sub">Skip your password next time. You can turn this off in settings.</p>
      </div>
      <div class="enroll-actions">
        <button class="btn-enable" :disabled="loading" @click="enroll">
          <span v-if="loading" class="spinner" />
          <span v-else>Enable</span>
        </button>
        <button class="btn-dismiss" @click="dismiss">Not now</button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { confirmWithBiometrics } from '@/lib/nativeBridge'

const props = defineProps({
  /** Show the card when login response has biometric_available: true */
  show: { type: Boolean, default: false },
})
const emit = defineEmits(['enrolled', 'dismissed'])

const authStore = useAuthStore()
const loading   = ref(false)

async function enroll() {
  loading.value = true
  try {
    const result = await confirmWithBiometrics({
      title: 'Enable Biometric Login',
      subtitle: 'Confirm to activate Face ID / Fingerprint for sign-in',
      reason: 'Verify your identity to enable biometric login',
    })

    if (!result?.authenticated) {
      emit('dismissed')
      return
    }

    await authStore.enrollBiometrics()
    emit('enrolled')
  } catch (err) {
    console.warn('[BiometricEnrollCard] Enrollment failed:', err?.message)
    emit('dismissed')
  } finally {
    loading.value = false
  }
}

function dismiss() {
  emit('dismissed')
}
</script>

<style scoped>
.enroll-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(108,99,255,0.15), rgba(34,197,94,0.08));
  border: 1px solid rgba(108,99,255,0.3);
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
}

.enroll-icon { font-size: 1.8rem; flex-shrink: 0; }
.enroll-body { flex: 1; }

.enroll-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem;
}

.enroll-sub {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  margin: 0;
}

.enroll-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-shrink: 0;
}

.btn-enable {
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 2rem;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  min-width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.15s;
}

.btn-enable:active:not(:disabled) { transform: scale(0.95); }
.btn-enable:hover:not(:disabled)  { background: #5a52d5; }

.btn-dismiss {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
  cursor: pointer;
  text-align: center;
  padding: 0.2rem;
}

.btn-dismiss:hover { color: rgba(255,255,255,0.7); }

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.card-fade-enter-active,
.card-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.card-fade-enter-from,
.card-fade-leave-to { opacity: 0; transform: translateY(-8px); }
</style>