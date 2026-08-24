<template>
  <Teleport to="body">
    <Transition name="perm-fade">
      <div v-if="modelValue" class="perm-overlay" @click.self="$emit('deny')">
        <Transition name="perm-slide">
          <div v-if="modelValue" class="perm-modal" role="dialog" :aria-label="`${activeConfig.title} permission request`">

            <!-- Icon badge -->
            <div class="perm-icon-ring" :style="{ background: isBlocked ? 'rgba(239, 68, 68, 0.12)' : activeConfig.iconBg }">
              <svg v-if="isBlocked" class="perm-icon" style="color: #ef4444;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <svg v-else-if="permission === 'camera'" class="perm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <circle cx="12" cy="13" r="3"/>
              </svg>
              <svg v-else-if="permission === 'microphone'" class="perm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0014 0M12 19v3M9 22h6"/>
              </svg>
              <svg v-else class="perm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <circle cx="12" cy="11" r="3"/>
              </svg>
            </div>

            <!-- Heading -->
            <h2 class="perm-title">{{ isBlocked ? `${activeConfig.shortLabel} Access Blocked` : activeConfig.title }}</h2>
            <p class="perm-subtitle">{{ isBlocked ? `Your browser settings are currently blocking ${activeConfig.shortLabel.toLowerCase()} access for this site.` : activeConfig.subtitle }}</p>

            <!-- Bullet list of what's accessed -->
            <ul class="perm-bullets">
              <li v-for="bullet in (isBlocked ? blockedBullets : activeConfig.bullets)" :key="bullet" class="perm-bullet">
                <svg v-if="!isBlocked" class="bullet-check" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="10" :fill="activeConfig.accentColor + '22'"/>
                  <path d="M6 10l3 3 5-5" :stroke="activeConfig.accentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span v-else class="blocked-icon">🔒</span>
                {{ bullet }}
              </li>
            </ul>

            <!-- Never shared note -->
            <p class="perm-note">
              <svg viewBox="0 0 20 20" fill="none" width="13" height="13">
                <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 5v4m0 2v.5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ isBlocked ? 'Once unblocked in site settings, tap Try Again.' : 'Your data is never shared and stays on your device.' }}
            </p>

            <!-- Actions -->
            <div class="perm-actions">
              <button type="button" class="perm-deny" @click="$emit('deny')">{{ isBlocked ? 'Close' : 'Not now' }}</button>
              <button type="button" class="perm-allow" :style="{ background: isBlocked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : activeConfig.gradient }" @click="$emit('allow')">
                {{ isBlocked ? 'Try Again' : `Allow ${activeConfig.shortLabel}` }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** v-model: whether the modal is visible */
  modelValue: { type: Boolean, default: false },
  /** 'camera' | 'microphone' | 'location' */
  permission: { type: String, required: true },
  /** Whether permission is currently blocked in browser site settings */
  isBlocked: { type: Boolean, default: false },
})

defineEmits(['update:modelValue', 'allow', 'deny'])

// ── Config per permission type ───────────────────────────────────────────────

const configs = {
  camera: {
    iconBg: 'rgba(244, 63, 94, 0.12)',
    accentColor: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)',
    title: 'Allow Camera Access',
    shortLabel: 'Camera',
    subtitle: 'To take photos and record video directly from your chat, KorpaBee needs access to your camera.',
    bullets: [
      'Take photos to share in conversation',
      'Record short video messages',
      'Switch between front and rear camera',
    ],
  },
  microphone: {
    iconBg: 'rgba(16, 185, 129, 0.12)',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    title: 'Allow Microphone Access',
    shortLabel: 'Microphone',
    subtitle: 'To record voice notes and send audio messages, KorpaBee needs access to your microphone.',
    bullets: [
      'Record voice notes directly in chat',
      'Send audio messages instantly',
      'Pause and resume before sending',
    ],
  },
  location: {
    iconBg: 'rgba(16, 185, 129, 0.12)',
    accentColor: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    title: 'Allow Location Access',
    shortLabel: 'Location',
    subtitle: 'To share your current location with contacts, KorpaBee needs a one-time location reading.',
    bullets: [
      'Share your current position in chat',
      'Only accessed when you tap "Location"',
      'Never tracked in the background',
    ],
  },
}

const activeConfig = computed(() => configs[props.permission] ?? configs.camera)

const blockedBullets = computed(() => [
  'Click the lock icon 🔒 next to the address bar',
  `Set ${activeConfig.value.shortLabel} permission to "Allow"`,
  'Tap "Try Again" below or refresh the page',
])
</script>

<style scoped>
.perm-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0 env(safe-area-inset-bottom, 0);
}

@media (min-width: 640px) {
  .perm-overlay {
    align-items: center;
  }
}

.perm-modal {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 28px 28px 0 0;
  padding: 32px 28px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
  box-shadow: 0 -12px 60px rgba(0, 0, 0, 0.2);
}

@media (min-width: 640px) {
  .perm-modal {
    border-radius: 24px;
    padding: 36px 32px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.25);
  }
}

/* Icon */
.perm-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.perm-icon {
  width: 34px;
  height: 34px;
}

/* Text */
.perm-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f0e17;
  margin: 0 0 10px;
  line-height: 1.25;
}

.perm-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px;
  line-height: 1.6;
  max-width: 320px;
}

/* Bullets */
.perm-bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perm-bullet {
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  font-size: 13px;
  color: #334155;
  font-weight: 500;
}

.bullet-check {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.blocked-icon {
  font-size: 15px;
  flex-shrink: 0;
}

/* Note */
.perm-note {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: #94a3b8;
  margin: 0 0 28px;
}

/* Buttons */
.perm-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.perm-deny {
  flex: 1;
  background: #f1f5f9;
  border: none;
  border-radius: 14px;
  padding: 13px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s;
}
.perm-deny:hover { background: #e2e8f0; }

.perm-allow {
  flex: 2;
  border: none;
  border-radius: 14px;
  padding: 13px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
.perm-allow:hover { opacity: 0.9; transform: scale(1.01); }
.perm-allow:active { transform: scale(0.98); }

/* Transitions */
.perm-fade-enter-active, .perm-fade-leave-active { transition: opacity 0.25s ease; }
.perm-fade-enter-from, .perm-fade-leave-to { opacity: 0; }

.perm-slide-enter-active { transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.25s ease; }
.perm-slide-leave-active { transition: transform 0.22s ease, opacity 0.2s ease; }
.perm-slide-enter-from { transform: translateY(60px); opacity: 0; }
.perm-slide-leave-to   { transform: translateY(60px); opacity: 0; }

@media (min-width: 640px) {
  .perm-slide-enter-from { transform: scale(0.92) translateY(0); opacity: 0; }
  .perm-slide-leave-to   { transform: scale(0.92) translateY(0); opacity: 0; }
}
</style>
