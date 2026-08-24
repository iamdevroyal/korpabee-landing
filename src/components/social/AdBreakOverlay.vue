<template>
  <!-- AdBreakOverlay: full-screen overlay that appears mid-playback.
       Props:
         ad             - preloaded ad object (from getNextAd('video_break'))
         trackingToken  - HMAC token for secure impression recording
         tokenTimestamp - token creation timestamp
         muted          - inherits mute state from the parent post video

       Emits:
         @complete  - user watched through or ad ended; parent resumes post video
  -->
  <Teleport to="body">
    <Transition name="overlay-fade">
      <div
        v-if="ad"
        class="ad-break-overlay"
        id="ad-break-overlay"
      >
        <!-- Ad content area -->
        <div class="ad-break-overlay__content">

          <!-- ── Sponsored label ── -->
          <div class="ad-break-overlay__sponsored">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
            </svg>
            Sponsored · Ad Break
          </div>

          <!-- ── Video ad ── -->
          <template v-if="ad.format === 'video' && ad.media_url">
            <div class="ad-break-overlay__video-wrap">
              <video
                ref="videoEl"
                :src="ad.media_url"
                :muted="isMuted"
                class="ad-break-overlay__video"
                playsinline
                preload="auto"
                @ended="onEnded"
                @loadedmetadata="onMeta"
                @timeupdate="onTimeUpdate"
              />

              <!-- Mute toggle -->
              <button
                class="ad-break-overlay__mute-btn"
                @click="toggleMute"
                :aria-label="isMuted ? 'Unmute' : 'Mute'"
              >
                <svg v-if="isMuted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
              </button>

              <!-- Progress bar -->
              <div class="ad-break-overlay__progress-wrap">
                <div class="ad-break-overlay__progress-bar" :style="{ width: `${progressPct}%` }"/>
              </div>

              <!-- Countdown / skip button -->
              <AdCountdownSkip
                :seconds="ad.min_watch_seconds ?? 5"
                :skippable="ad.skippable !== false"
                @skip="onSkip"
              />
            </div>
          </template>

          <!-- ── Image ad ── -->
          <template v-else-if="ad.format === 'image' && ad.media_url">
            <div class="ad-break-overlay__image-wrap">
              <img :src="ad.media_url" :alt="ad.headline || 'Sponsored'" class="ad-break-overlay__image" />

              <!-- Countdown / skip for image ads (auto-dismiss after ~8s) -->
              <AdCountdownSkip
                :seconds="ad.min_watch_seconds ?? 5"
                :skippable="ad.skippable !== false"
                @skip="onSkip"
                @skip-ready="onSkipReady"
              />
            </div>
          </template>

          <!-- ── Ad body (headline + CTA) ── -->
          <div class="ad-break-overlay__body">
            <p v-if="ad.headline" class="ad-break-overlay__headline">{{ ad.headline }}</p>
            <a
              v-if="ad.cta_url"
              :href="ad.cta_url"
              target="_blank"
              rel="noopener noreferrer"
              class="ad-break-overlay__cta"
              @click.stop
            >
              {{ ad.cta_text || 'Learn More' }}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as adsApi from '@/api/ads'
import AdCountdownSkip from './AdCountdownSkip.vue'

const props = defineProps({
  /** Preloaded ad object from getNextAd('video_break') */
  ad:             { type: Object, default: null },
  /** HMAC tracking token */
  trackingToken:  { type: String, default: null },
  /** Token timestamp */
  tokenTimestamp: { type: Number, default: null },
  /** Inherit mute state from parent post video */
  muted:          { type: Boolean, default: false },
})

const emit = defineEmits(['complete'])

// ─── State ───────────────────────────────────────────────────────────────────

const videoEl    = ref(null)
const isMuted    = ref(props.muted)
const currentTime= ref(0)
const duration   = ref(0)
const skippedAt  = ref(null)

const progressPct = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)

// ─── Video handlers ───────────────────────────────────────────────────────────

function onMeta() {
  duration.value = videoEl.value?.duration ?? 0
}

function onTimeUpdate() {
  currentTime.value = videoEl.value?.currentTime ?? 0
}

function onEnded() {
  // Ad played through — record completed_at and tell parent to resume
  fireImpression({ completedAt: new Date().toISOString() })
  emit('complete')
}

function toggleMute() {
  isMuted.value = !isMuted.value
  if (videoEl.value) videoEl.value.muted = isMuted.value
}

// ─── Skip handling ────────────────────────────────────────────────────────────

function onSkip() {
  const now = new Date().toISOString()
  skippedAt.value = now
  videoEl.value?.pause()
  fireImpression({ skippedAt: now })
  emit('complete')
}

// For image ads: skip-ready fires when countdown is done (auto-dismiss optional)
function onSkipReady() {
  // For image ads we just enable the skip button — no auto dismiss.
  // The user must click skip.
}

// ─── Impression recording ─────────────────────────────────────────────────────

function fireImpression({ completedAt = null, skippedAt = null } = {}) {
  if (!props.ad || !props.trackingToken) return
  adsApi.recordImpression({
    ad_uuid:         props.ad.uuid,
    tracking_token:  props.trackingToken,
    token_timestamp: props.tokenTimestamp,
    context:         'video_break',
    completed_at:    completedAt,
    skipped_at:      skippedAt,
  }).catch(err => console.error('[AdBreakOverlay] impression error', err))
}

// ─── Auto-play video ad ───────────────────────────────────────────────────────

onMounted(() => {
  if (props.ad?.format === 'video' && videoEl.value) {
    videoEl.value.muted = true          // start muted to respect autoplay policy
    videoEl.value.play()
      .then(() => {
        // After play begins, inherit mute from parent
        videoEl.value.muted = isMuted.value
      })
      .catch(() => {
        // Autoplay blocked — user sees play button via ended/mute state
      })
  }
})

onUnmounted(() => {
  videoEl.value?.pause()
})

// Keep isMuted in sync if parent prop changes
watch(() => props.muted, (val) => {
  isMuted.value = val
  if (videoEl.value) videoEl.value.muted = val
})
</script>

<style scoped>
/* ── Overlay backdrop ── */
.ad-break-overlay {
  position: fixed;
  inset: 0;
  z-index: 9990;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.ad-break-overlay__content {
  position: relative;
  width: 100%;
  max-width: 560px;
  background: #0d0d0d;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
}

/* ── Sponsored label ── */
.ad-break-overlay__sponsored {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 14px 6px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Video ── */
.ad-break-overlay__video-wrap {
  position: relative;
  background: #000;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}
.ad-break-overlay__video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Image ── */
.ad-break-overlay__image-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  max-height: 320px;
}
.ad-break-overlay__image {
  width: 100%;
  object-fit: cover;
  display: block;
  max-height: 320px;
}

/* ── Progress bar ── */
.ad-break-overlay__progress-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.15);
}
.ad-break-overlay__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #6C5CE7, #a29bfe);
  transition: width 0.25s linear;
}

/* ── Mute button ── */
.ad-break-overlay__mute-btn {
  position: absolute;
  bottom: 16px;
  left: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  backdrop-filter: blur(4px);
  z-index: 20;
}
.ad-break-overlay__mute-btn:hover { background: rgba(0,0,0,0.75); }

/* ── Body ── */
.ad-break-overlay__body {
  padding: 12px 16px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ad-break-overlay__headline {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ad-break-overlay__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 16px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
.ad-break-overlay__cta:hover { opacity: 0.9; }

/* ── Transition ── */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
</style>
