<template>
  <Transition name="modal-fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      :aria-label="parsedError?.title"
    >
      <!-- Backdrop -->
      <div
        @click="closeOnBackdrop"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <!-- Modal Card -->
      <Transition name="modal-scale">
        <div
          v-if="modelValue"
          class="modal-card relative w-full sm:max-w-sm mx-0 sm:mx-4 flex flex-col overflow-hidden"
        >
          <!-- Gradient top accent -->
          <div class="modal-accent" :class="accentClass"></div>

          <!-- Drag handle (mobile) -->
          <div class="modal-handle sm:hidden"></div>

          <!-- Icon halo -->
          <div class="icon-halo" :class="haloClass">
            <div class="icon-inner" :class="iconInnerClass">
              <!-- Network icon -->
              <svg v-if="parsedError?.type === 'network'" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
              </svg>
              <!-- File/Upload icon for 422 media errors -->
              <svg v-else-if="parsedError?.isMediaError" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <!-- Warning triangle icon -->
              <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <h3 class="modal-title">{{ parsedError?.title }}</h3>
            <p class="modal-message">{{ parsedError?.message }}</p>

            <!-- Media-size hint (shown when a media upload fails) -->
            <div v-if="parsedError?.isMediaError" class="media-hint">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5 text-violet-400">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>This usually means the file exceeds the size limit. <strong>Images must be under 20 MB</strong> and <strong>videos under 100 MB</strong>. Try compressing the file and uploading again.</span>
            </div>

            <!-- Validation error list -->
            <div v-if="parsedError?.validationErrors?.length > 0" class="error-list">
              <span class="error-list-label">Specific errors</span>
              <ul>
                <li v-for="(error, idx) in parsedError.validationErrors" :key="idx" class="error-list-item">
                  <span class="error-dot">●</span>
                  <span>{{ error }}</span>
                </li>
              </ul>
            </div>

            <!-- Error code badge -->
            <div v-if="parsedError?.code" class="error-code">
              <span class="error-code-badge">{{ parsedError.code }}</span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="modal-actions">
            <button
              v-if="showRetry && (parsedError?.type === 'network' || parsedError?.type === 'validation')"
              @click="$emit('retry')"
              class="btn-retry"
              id="error-modal-retry-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Try Again
            </button>
            <button
              @click="close"
              class="btn-dismiss"
              id="error-modal-dismiss-btn"
            >
              Got it
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  error: { type: [Object, String, Error], default: null },
  showRetry: { type: Boolean, default: false },
  closeOnBackdropClick: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'close', 'retry'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const closeOnBackdrop = () => {
  if (props.closeOnBackdropClick) close()
}

// ── Error Parser ─────────────────────────────────────────────────────────────
const parsedError = computed(() => {
  const err = props.error
  if (!err) return null

  let title            = 'Something Went Wrong'
  let message          = 'An unexpected error occurred. Please try again.'
  let type             = 'error'   // error | warning | network | validation
  let validationErrors = []
  let isMediaError     = false
  let code             = null

  if (typeof err === 'string') {
    return { title, message: err, type, validationErrors, isMediaError, code }
  }

  // Axios / HTTP errors
  if (err.isAxiosError || err.response || err.request) {
    if (err.response) {
      const status = err.response.status
      const data   = err.response.data

      code = status

      if (data?.message) message = data.message

      switch (status) {
        case 400:
          title   = 'Invalid Request'
          message = message || 'The server could not understand your request.'
          break
        case 401:
          title   = 'Session Expired'
          message = 'Your session has expired. Please log in again.'
          break
        case 403:
          title   = 'Access Denied'
          message = message || "You don't have permission to perform this action."
          break
        case 404:
          title   = 'Not Found'
          message = message || 'The requested resource was not found.'
          break
        case 422:
          title = 'Validation Failed'
          type  = 'validation'
          message = message || 'Some fields did not pass validation.'
          if (data?.errors && typeof data.errors === 'object') {
            validationErrors = Object.values(data.errors).flat()
          }
          // Detect media upload failures
          isMediaError = validationErrors.some(
            (e) => /media|file|upload/i.test(e)
          ) || /media|file|upload/i.test(message)
          break
        case 413:
          title        = 'File Too Large'
          type         = 'validation'
          isMediaError = true
          message      = 'The file you tried to upload is too large for the server to accept.'
          break
        case 429:
          title   = 'Slow Down ✋'
          message = 'You are performing actions too quickly. Please wait a moment before trying again.'
          type    = 'warning'
          break
        case 500:
          title   = 'Server Error'
          message = 'A server error occurred. Our technical team has been notified.'
          break
        case 503:
          title   = 'Service Unavailable'
          message = 'KorpaBee is temporarily unavailable. Please try again in a few minutes.'
          type    = 'warning'
          break
        default:
          title = `Error ${status}`
      }
    } else if (err.request) {
      title   = 'No Internet Connection'
      message = 'We couldn\'t reach the server. Check your connection and try again.'
      type    = 'network'
    } else {
      message = err.message || message
    }
  } else if (err instanceof Error) {
    message = err.message
  } else if (typeof err === 'object') {
    message = err.message || JSON.stringify(err)
  }

  return { title, message, type, validationErrors, isMediaError, code }
})

// ── Dynamic styling based on error type ──────────────────────────────────────
const accentClass = computed(() => {
  const t = parsedError.value?.type
  if (t === 'network')    return 'accent-blue'
  if (t === 'warning')    return 'accent-amber'
  if (t === 'validation') return 'accent-violet'
  return 'accent-red'
})

const haloClass = computed(() => {
  const t = parsedError.value?.type
  if (t === 'network')    return 'halo-blue'
  if (t === 'warning')    return 'halo-amber'
  if (t === 'validation') return 'halo-violet'
  return 'halo-red'
})

const iconInnerClass = computed(() => {
  const t = parsedError.value?.type
  if (t === 'network')    return 'icon-blue'
  if (t === 'warning')    return 'icon-amber'
  if (t === 'validation') return 'icon-violet'
  return 'icon-red'
})
</script>

<style scoped>
/* ── Modal Card ──────────────────────────────────────────────────────────── */
.modal-card {
  background: #FFFFFF;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 -8px 60px rgba(108, 58, 255, 0.15), 0 4px 32px rgba(0,0,0,0.18);
}
@media (min-width: 640px) {
  .modal-card {
    border-radius: 20px;
    box-shadow: 0 20px 80px rgba(108, 58, 255, 0.20), 0 4px 32px rgba(0,0,0,0.16);
  }
}

/* ── Handle & Accent ─────────────────────────────────────────────────────── */
.modal-handle {
  width: 36px;
  height: 4px;
  border-radius: 99px;
  background: #E5E7EB;
  margin: 10px auto 0;
}

.modal-accent {
  height: 3px;
  width: 100%;
}
.accent-violet { background: linear-gradient(90deg, #6C3AFF 0%, #A855F7 50%, #7C3AED 100%); }
.accent-red    { background: linear-gradient(90deg, #EF4444 0%, #F97316 100%); }
.accent-blue   { background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%); }
.accent-amber  { background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%); }

/* ── Icon Halo ───────────────────────────────────────────────────────────── */
.icon-halo {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto 0;
  animation: haloBreath 3s ease-in-out infinite;
}
.halo-violet { background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(108, 58, 255, 0.06) 70%); }
.halo-red    { background: radial-gradient(circle, rgba(239, 68, 68,  0.18) 0%, rgba(239, 68, 68, 0.06) 70%); }
.halo-blue   { background: radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.06) 70%); }
.halo-amber  { background: radial-gradient(circle, rgba(245,158, 11, 0.18) 0%, rgba(245,158, 11, 0.06) 70%); }

.icon-inner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-violet { background: linear-gradient(135deg, #7C3AED, #A855F7); color: #fff; box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35); }
.icon-red    { background: linear-gradient(135deg, #DC2626, #F87171); color: #fff; box-shadow: 0 4px 16px rgba(220,  38,  38, 0.30); }
.icon-blue   { background: linear-gradient(135deg, #2563EB, #60A5FA); color: #fff; box-shadow: 0 4px 16px rgba( 37,  99, 235, 0.30); }
.icon-amber  { background: linear-gradient(135deg, #D97706, #FBBF24); color: #fff; box-shadow: 0 4px 16px rgba(217, 119,   6, 0.30); }

@keyframes haloBreath {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

/* ── Body ────────────────────────────────────────────────────────────────── */
.modal-body {
  padding: 16px 24px 4px;
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.3px;
  margin: 0 0 8px;
}

.modal-message {
  font-size: 13.5px;
  color: #6B7280;
  line-height: 1.6;
  margin: 0 0 12px;
}

/* ── Media size hint ─────────────────────────────────────────────────────── */
.media-hint {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%);
  border: 1px solid #DDD6FE;
  border-left: 3px solid #7C3AED;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  margin-bottom: 12px;
}
.media-hint span {
  font-size: 12px;
  color: #5B21B6;
  line-height: 1.5;
}
.media-hint strong { font-weight: 700; }

/* ── Validation error list ───────────────────────────────────────────────── */
.error-list {
  background: #FFF7F7;
  border: 1px solid #FECACA;
  border-radius: 10px;
  padding: 10px 12px;
  text-align: left;
  margin-bottom: 12px;
  max-height: 140px;
  overflow-y: auto;
}
.error-list-label {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #DC2626;
  display: block;
  margin-bottom: 6px;
}
.error-list-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #B91C1C;
  line-height: 1.4;
  margin-bottom: 3px;
}
.error-dot { color: #F87171; margin-top: 1px; font-size: 8px; }

/* ── Error code badge ────────────────────────────────────────────────────── */
.error-code { margin-bottom: 8px; }
.error-code-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #9CA3AF;
  background: #F3F4F6;
  border-radius: 6px;
  padding: 2px 7px;
}

/* ── Action Buttons ──────────────────────────────────────────────────────── */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 24px 28px;
}

.btn-dismiss {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6C3AFF 0%, #8B5CF6 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(108, 58, 255, 0.30);
  letter-spacing: 0.01em;
}
.btn-dismiss:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(108, 58, 255, 0.40);
}
.btn-dismiss:active { transform: translateY(0); }

.btn-retry {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  background: #F5F3FF;
  color: #6C3AFF;
  font-size: 13.5px;
  font-weight: 700;
  border: 1.5px solid #DDD6FE;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-retry:hover { background: #EDE9FE; border-color: #C4B5FD; }

/* ── Transitions ─────────────────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.28s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to     { opacity: 0; }

/* Bottom-sheet slide on mobile, scale on desktop */
.modal-scale-enter-active { transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: all 0.22s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
.modal-scale-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.modal-scale-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
@media (min-width: 640px) {
  .modal-scale-enter-from { transform: scale(0.92) translateY(12px); }
  .modal-scale-leave-to   { transform: scale(0.95); }
}

/* Scrollbar */
.error-list::-webkit-scrollbar { width: 4px; }
.error-list::-webkit-scrollbar-track { background: transparent; }
.error-list::-webkit-scrollbar-thumb { background: #FECACA; border-radius: 4px; }
</style>
