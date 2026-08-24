<template>
  <div ref="cardEl" class="ad-video-card">
    <!-- Video player -->
    <div class="ad-video-card__player-wrap" @click="togglePlay">
      <video
        ref="videoEl"
        :src="ad.media_url"
        class="ad-video-card__video"
        playsinline
        preload="metadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @loadedmetadata="onMeta"
      />

      <!-- Play / pause overlay icon -->
      <transition name="fade-icon">
        <div v-if="!playing" class="ad-video-card__play-overlay">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </transition>

      <!-- Skip button — shown after min_watch_seconds -->
      <transition name="fade-in">
        <button
          v-if="skippable && canSkip"
          class="ad-video-card__skip-btn"
          @click.stop="onSkip"
        >
          Skip Ad
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <div v-else-if="skippable && !canSkip" class="ad-video-card__skip-countdown">
          Skip in {{ skipCountdown }}s
        </div>
      </transition>

      <!-- Progress bar -->
      <div class="ad-video-card__progress-wrap">
        <div class="ad-video-card__progress-bar" :style="{ width: `${progressPct}%` }"></div>
      </div>
    </div>

    <!-- Body -->
    <div class="ad-video-card__body">
      <p v-if="ad.headline" class="ad-video-card__headline">{{ ad.headline }}</p>
      <a
        v-if="ad.cta_url"
        href="#"
        class="ad-video-card__cta"
        @click.stop.prevent="onCtaClick"
      >
        {{ ad.cta_text || 'Learn More' }}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as adsApi from '@/api/ads'

const props = defineProps({
  ad:             { type: Object, required: true },
  trackingToken:  { type: String, default: null },
  tokenTimestamp: { type: Number, default: null },
  context:        { type: String, default: 'feed' },
})

const emit = defineEmits(['impression', 'complete', 'skip'])

const videoEl    = ref(null)
const cardEl     = ref(null)   // outer wrapper — observed for viewport entry
const playing    = ref(false)
const currentTime= ref(0)
const duration   = ref(0)
const canSkip    = ref(false)
const inView     = ref(false)   // true once card enters the viewport

const minWatch   = computed(() => props.ad.min_watch_seconds ?? 5)
const skippable  = computed(() => props.ad.skippable !== false)
const progressPct= computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)
const skipCountdown = computed(() => Math.max(0, Math.ceil(minWatch.value - currentTime.value)))

function togglePlay() {
  if (!videoEl.value) return
  if (playing.value) {
    videoEl.value.pause()
    playing.value = false
  } else {
    videoEl.value.play()
    playing.value = true
  }
}

function onTimeUpdate() {
  currentTime.value = videoEl.value?.currentTime ?? 0
  if (!canSkip.value && currentTime.value >= minWatch.value) {
    canSkip.value = true
  }
}

function onMeta() {
  duration.value = videoEl.value?.duration ?? 0
}

function onEnded() {
  playing.value = false
  emit('complete')
}

function onSkip() {
  videoEl.value?.pause()
  emit('skip')
}

function onCtaClick() {
  // Record the click — fire-and-forget before navigating
  if (props.ad?.uuid && props.trackingToken) {
    adsApi.recordClick(props.ad.uuid, {
      tracking_token:  props.trackingToken,
      token_timestamp: props.tokenTimestamp,
      context:         props.context,
    }).catch(() => {})
  }
  if (props.ad?.cta_url) {
    window.open(props.ad.cta_url, '_blank', 'noopener,noreferrer')
  }
}

let observer = null

// Only auto-play when the card scrolls into the viewport.
// Keeps audio off until the user can actually see the ad.
onMounted(() => {
  if (!videoEl.value) return

  // Start muted so the browser doesn't block autoplay
  videoEl.value.muted = true

  const target = cardEl.value || videoEl.value
  observer = new IntersectionObserver(
    ([entry]) => {
      inView.value = entry.isIntersecting
      if (entry.isIntersecting) {
        // Card visible — play and unmute
        videoEl.value.play()
          .then(() => {
            playing.value = true
            videoEl.value.muted = false   // unmute only once visible
          })
          .catch(() => {})
      } else {
        // Card scrolled out — pause and re-mute (ready for next time)
        videoEl.value.pause()
        videoEl.value.muted = true
        playing.value = false
      }
    },
    { threshold: 0.5 }  // at least 50% of the card must be visible
  )

  observer.observe(target)
})

onUnmounted(() => {
  observer?.disconnect()
  videoEl.value?.pause()
})
</script>

<style scoped>
.ad-video-card { display: flex; flex-direction: column; }

.ad-video-card__player-wrap {
  position: relative;
  background: #000;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
  max-height: 300px;
}

.ad-video-card__video {
  width: 100%;
  display: block;
  max-height: 300px;
  object-fit: cover;
}

.ad-video-card__play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.25);
}

.ad-video-card__skip-btn {
  position: absolute;
  bottom: 32px;
  right: 12px;
  background: rgba(255,255,255,0.92);
  border: none;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #111;
  transition: background 0.15s;
}
.ad-video-card__skip-btn:hover { background: #fff; }

.ad-video-card__skip-countdown {
  position: absolute;
  bottom: 32px;
  right: 12px;
  background: rgba(0,0,0,0.55);
  color: #fff;
  border-radius: 20px;
  padding: 4px 11px;
  font-size: 11px;
  font-weight: 600;
}

.ad-video-card__progress-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255,255,255,0.2);
}
.ad-video-card__progress-bar {
  height: 100%;
  background: #6C5CE7;
  transition: width 0.25s linear;
}

.ad-video-card__body {
  padding: 10px 14px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ad-video-card__headline {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.ad-video-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s;
}
.ad-video-card__cta:hover { opacity: 0.9; }

.fade-icon-enter-active, .fade-icon-leave-active { transition: opacity 0.2s; }
.fade-icon-enter-from, .fade-icon-leave-to { opacity: 0; }
.fade-in-enter-active { transition: opacity 0.3s; }
.fade-in-enter-from { opacity: 0; }
</style>
