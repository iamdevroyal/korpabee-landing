<template>
  <!-- StoryAdSlot: full-screen buzz-style ad overlay.
       Shown in the BuzzViewModal tray after every buzzNextGap organic buzzes.

       Features:
       - CSS progress bar (not setInterval) tied to buzz_duration_seconds
       - Reuses <AdCountdownSkip> for skip button (same as AdBreakOverlay)
       - Tap-right / tap-left / swipe-down gestures matching BuzzViewModal
       - Records impression with context='buzz' on mount
       - Emits @next (advance), @prev (go back), @dismiss (close tray)
  -->
  <Teleport to="body">
    <Transition name="story-ad-fade">
      <div
        v-if="ad"
        class="story-ad-overlay"
        id="story-ad-slot"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
        @click="onTap"
      >
        <!-- ── Progress bar ── -->
        <div class="story-ad__progress-wrap">
          <div
            class="story-ad__progress-bar"
            :style="{ animationDuration: `${ad.buzz_duration_seconds ?? 8}s` }"
          />
        </div>

        <!-- ── Sponsored badge ── -->
        <div class="story-ad__sponsored">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
          </svg>
          Sponsored
        </div>

        <!-- ── Close / dismiss button ── -->
        <button class="story-ad__close" @click.stop="$emit('dismiss')" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- ── Media ── -->
        <div class="story-ad__media">
          <video
            v-if="ad.format === 'video' && ad.media_url"
            ref="videoEl"
            :src="ad.media_url"
            :muted="isMuted"
            class="story-ad__video"
            playsinline
            preload="auto"
            @ended="onEnded"
          />
          <img
            v-else-if="ad.media_url"
            :src="ad.media_url"
            :alt="ad.headline || 'Sponsored'"
            class="story-ad__image"
          />
          <div v-else class="story-ad__fallback" :style="{ background: 'linear-gradient(135deg,#6C5CE7,#a29bfe)' }">
            <p>{{ ad.headline }}</p>
          </div>
        </div>

        <!-- ── Footer: headline + CTA ── -->
        <div class="story-ad__footer">
          <p v-if="ad.headline" class="story-ad__headline">{{ ad.headline }}</p>
          <p v-if="ad.body" class="story-ad__body">{{ ad.body }}</p>
          <a
            v-if="ad.cta_url"
            :href="ad.cta_url"
            target="_blank"
            rel="noopener noreferrer"
            class="story-ad__cta"
            @click.stop
          >
            {{ ad.cta_text || 'Learn More' }}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <!-- ── Skip / countdown ── -->
        <AdCountdownSkip
          :seconds="ad.min_watch_seconds ?? 5"
          :skippable="ad.skippable !== false"
          @skip="onSkip"
        />

        <!-- ── Mute toggle (video ads only) ── -->
        <button
          v-if="ad.format === 'video'"
          class="story-ad__mute"
          @click.stop="toggleMute"
          :aria-label="isMuted ? 'Unmute' : 'Mute'"
        >
          <svg v-if="isMuted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
        </button>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as adsApi from '@/api/ads'
import AdCountdownSkip from './AdCountdownSkip.vue'

const props = defineProps({
  /** The ad object from getNextAd('buzz') */
  ad:             { type: Object, default: null },
  /** HMAC tracking token */
  trackingToken:  { type: String, default: null },
  /** Token timestamp */
  tokenTimestamp: { type: Number, default: null },
  /** Inherit mute state from the buzz viewer */
  muted:          { type: Boolean, default: false },
})

const emit = defineEmits(['next', 'prev', 'dismiss'])

const videoEl = ref(null)
const isMuted = ref(props.muted)

// ─── Touch gesture tracking (tap-left/right, swipe-down) ─────────────────────

const touchStart = ref({ x: 0, y: 0 })

function onTouchStart(e) {
  const t = e.touches[0]
  touchStart.value = { x: t.clientX, y: t.clientY }
}

function onTouchEnd(e) {
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStart.value.x
  const dy = t.clientY - touchStart.value.y

  // Swipe down — dismiss tray
  if (dy > 60 && Math.abs(dx) < Math.abs(dy)) {
    emit('dismiss')
    return
  }
}

// Click-based tap navigation (tap right half → next, tap left half → prev)
function onTap(e) {
  const half = window.innerWidth / 2
  if (e.clientX >= half) {
    emit('next')
  } else {
    emit('prev')
  }
}

// ─── Auto-advance when video ends ────────────────────────────────────────────

function onEnded() {
  fireImpression({ completedAt: new Date().toISOString() })
  emit('next')
}

// ─── Skip ────────────────────────────────────────────────────────────────────

function onSkip() {
  videoEl.value?.pause()
  fireImpression({ skippedAt: new Date().toISOString() })
  emit('next')
}

// ─── Mute toggle ─────────────────────────────────────────────────────────────

function toggleMute() {
  isMuted.value = !isMuted.value
  if (videoEl.value) videoEl.value.muted = isMuted.value
}

// ─── Impression ───────────────────────────────────────────────────────────────

function fireImpression({ completedAt = null, skippedAt = null } = {}) {
  if (!props.ad || !props.trackingToken) return
  adsApi.recordImpression({
    ad_uuid:         props.ad.uuid,
    tracking_token:  props.trackingToken,
    token_timestamp: props.tokenTimestamp,
    context:         'buzz',
    completed_at:    completedAt,
    skipped_at:      skippedAt,
  }).catch(err => console.error('[StoryAdSlot] impression error', err))
}

// ─── Auto-play video, record impression on mount ─────────────────────────────

onMounted(() => {
  // Record impression on mount (buzz unit = 1 impression)
  fireImpression()

  if (props.ad?.format === 'video' && videoEl.value) {
    videoEl.value.muted = true
    videoEl.value.play()
      .then(() => { videoEl.value.muted = isMuted.value })
      .catch(() => {})
  }
})

onUnmounted(() => {
  videoEl.value?.pause()
})
</script>

<style scoped>
.story-ad-overlay {
  position: fixed;
  inset: 0;
  z-index: 10500;
  background: #0d0d0d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  cursor: pointer;
  touch-action: pan-down;
}

/* ── Progress bar ── */
.story-ad__progress-wrap {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  height: 3px;
  background: rgba(255,255,255,0.25);
  border-radius: 2px;
  z-index: 10;
}

.story-ad__progress-bar {
  height: 100%;
  background: #fff;
  border-radius: 2px;
  width: 0%;
  animation: story-progress linear forwards;
  animation-play-state: running;
}

@keyframes story-progress {
  from { width: 0%; }
  to   { width: 100%; }
}

/* ── Sponsored ── */
.story-ad__sponsored {
  position: absolute;
  top: 24px;
  left: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  z-index: 10;
}

/* ── Close ── */
.story-ad__close {
  position: absolute;
  top: 16px;
  right: 14px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  backdrop-filter: blur(4px);
  transition: background 0.15s;
}
.story-ad__close:hover { background: rgba(255,255,255,0.28); }

/* ── Media ── */
.story-ad__media {
  position: absolute;
  inset: 0;
}
.story-ad__video,
.story-ad__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.story-ad__fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* ── Footer ── */
.story-ad__footer {
  position: relative;
  z-index: 10;
  width: 100%;
  padding: 12px 16px 48px;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%);
}
.story-ad__headline {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 4px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.story-ad__body {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  margin: 0 0 10px;
}
.story-ad__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 18px;
  background: rgba(255,255,255,0.95);
  color: #1a1a2e;
  font-size: 13px;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  transition: background 0.15s;
}
.story-ad__cta:hover { background: #fff; }

/* ── Mute ── */
.story-ad__mute {
  position: absolute;
  bottom: 58px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0,0,0,0.45);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  backdrop-filter: blur(4px);
}

/* ── Transition ── */
.story-ad-fade-enter-active,
.story-ad-fade-leave-active {
  transition: opacity 0.2s ease;
}
.story-ad-fade-enter-from,
.story-ad-fade-leave-to {
  opacity: 0;
}
</style>
