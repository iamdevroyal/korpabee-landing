<template>
  <!-- SidebarAd: Desktop right-rail ad unit.
       Independently fetches a sidebar ad every `refreshMin` minutes.
       Not shown for Pro (ad-free) users. -->
  <div v-if="!isAdFree && currentAd" class="sidebar-ad" :key="refreshCount">
    <!-- Sponsored label -->
    <div class="sidebar-ad__top-row">
      <span class="sidebar-ad__sponsored-badge">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>
        Sponsored
      </span>
      <button class="sidebar-ad__close-btn" @click="dismiss" aria-label="Close ad">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Media -->
    <a href="#" class="sidebar-ad__media-link" @click.prevent="handleClick">
      <img
        v-if="currentAd.media_url"
        :src="currentAd.media_url"
        :alt="currentAd.headline || 'Sponsored'"
        class="sidebar-ad__media"
        loading="lazy"
      />
    </a>

    <!-- Body -->
    <div class="sidebar-ad__body">
      <p v-if="currentAd.headline" class="sidebar-ad__headline">{{ currentAd.headline }}</p>
      <p v-if="currentAd.body" class="sidebar-ad__subtext">{{ currentAd.body }}</p>
      <a
        href="#"
        class="sidebar-ad__cta"
        @click.prevent="handleClick"
      >
        {{ currentAd.cta_text || 'Learn More' }}
      </a>
    </div>
  </div>

  <!-- Skeleton shown while first ad is loading -->
  <div v-else-if="!isAdFree && loading" class="sidebar-ad sidebar-ad--skeleton">
    <div class="sidebar-ad__skeleton-media"></div>
    <div class="sidebar-ad__skeleton-body">
      <div class="sidebar-ad__skeleton-line sidebar-ad__skeleton-line--wide"></div>
      <div class="sidebar-ad__skeleton-line sidebar-ad__skeleton-line--short"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFeedStore } from '@/stores/feed'
import * as adsApi from '@/api/ads'

const feedStore   = useFeedStore()
const isAdFree    = computed(() => feedStore.isAdFree)
const refreshMin  = computed(() => feedStore.adConfig?.sidebar_refresh_min ?? 5)

const currentAd   = ref(null)
const currentToken= ref(null)
const currentTs   = ref(null)
const loading     = ref(false)
const refreshCount= ref(0)
let intervalId    = null

async function fetchAd() {
  if (isAdFree.value) return
  loading.value = true
  try {
    const res = await adsApi.getSidebarAd()
    if (!res || !res.data?.ad) {
      currentAd.value = null
      return
    }
    currentAd.value    = res.data.ad
    currentToken.value = res.data.tracking_token
    currentTs.value    = res.data.token_timestamp
    refreshCount.value++
    reportImpression()
  } catch {
    currentAd.value = null
  } finally {
    loading.value = false
  }
}

function reportImpression() {
  if (!currentAd.value || !currentToken.value) return
  adsApi.recordImpression({
    ad_uuid:         currentAd.value.uuid,
    tracking_token:  currentToken.value,
    token_timestamp: currentTs.value,
    context:         'sidebar',
  }).catch(() => {})
}

function handleClick() {
  // Record the click — fire-and-forget before navigating
  if (currentAd.value?.uuid && currentToken.value) {
    adsApi.recordClick(currentAd.value.uuid, {
      tracking_token:  currentToken.value,
      token_timestamp: currentTs.value,
      context:         'sidebar',
    }).catch(() => {})
  }
  if (currentAd.value?.cta_url) {
    window.open(currentAd.value.cta_url, '_blank', 'noopener,noreferrer')
  }
}

function dismiss() {
  currentAd.value = null
}

onMounted(() => {
  if (!isAdFree.value) {
    fetchAd()
    intervalId = setInterval(fetchAd, refreshMin.value * 60 * 1000)
  }
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.sidebar-ad {
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  animation: sidebar-fadein 0.4s ease;
}

@keyframes sidebar-fadein {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.sidebar-ad__top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 4px;
}

.sidebar-ad__sponsored-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 9px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.sidebar-ad__close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 3px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.sidebar-ad__close-btn:hover { background: #f3f4f6; }

.sidebar-ad__media-link { display: block; }
.sidebar-ad__media {
  width: 100%;
  height: 130px;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;
}
.sidebar-ad__media:hover { opacity: 0.92; }

.sidebar-ad__body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar-ad__headline {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.sidebar-ad__subtext {
  font-size: 10px;
  color: #6b7280;
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sidebar-ad__cta {
  display: inline-block;
  padding: 5px 12px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  align-self: flex-start;
  transition: opacity 0.2s;
  margin-top: 2px;
}
.sidebar-ad__cta:hover { opacity: 0.88; }

/* Skeleton */
.sidebar-ad--skeleton { min-height: 230px; }
.sidebar-ad__skeleton-media {
  height: 130px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sidebar-ad__skeleton-body { padding: 10px; display: flex; flex-direction: column; gap: 6px; }
.sidebar-ad__skeleton-line { height: 10px; border-radius: 5px; background: #f3f4f6; }
.sidebar-ad__skeleton-line--wide  { width: 70%; }
.sidebar-ad__skeleton-line--short { width: 45%; }

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
