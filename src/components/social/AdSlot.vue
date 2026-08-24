<template>
  <!-- AdSlot: the unified in-feed ad slot.
       Routes to the correct card component based on ad.format.
       Emits 'impression' once after mount and 'skip'/'complete' for video. -->
  <div v-if="ad" class="ad-slot" :class="`ad-slot--${ad.format}`">
    <!-- Sponsored label -->
    <div class="ad-slot__sponsored-row">
      <span class="ad-slot__sponsored-badge">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>
        Sponsored
      </span>
      <button class="ad-slot__close-btn" @click="$emit('dismiss')" aria-label="Dismiss ad">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- Route to correct card component -->
    <AdCarousel v-if="ad.format === 'carousel'" :ad="ad" @impression="onImpression" @click-item="onCarouselClick" />
    <AdVideoCard
      v-else-if="ad.format === 'video'"
      :ad="ad"
      :tracking-token="trackingToken"
      :token-timestamp="tokenTimestamp"
      context="feed"
      @impression="onImpression"
      @complete="$emit('complete')"
      @skip="$emit('skip')"
    />
    <AdImageCard
      v-else
      :ad="ad"
      :tracking-token="trackingToken"
      :token-timestamp="tokenTimestamp"
      context="feed"
      @impression="onImpression"
    />
  </div>

  <!-- Skeleton while ad is loading -->
  <div v-else-if="loading" class="ad-slot ad-slot--skeleton">
    <div class="ad-slot__skeleton-inner">
      <div class="ad-skeleton-media"></div>
      <div class="ad-skeleton-lines">
        <div class="ad-skeleton-line ad-skeleton-line--wide"></div>
        <div class="ad-skeleton-line ad-skeleton-line--short"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdImageCard from './AdImageCard.vue'
import AdVideoCard from './AdVideoCard.vue'
import AdCarousel from './AdCarousel.vue'
import * as adsApi from '@/api/ads'

const props = defineProps({
  ad:               { type: Object, default: null },
  trackingToken:    { type: String, default: null },
  tokenTimestamp:   { type: Number, default: null },
  loading:          { type: Boolean, default: false },
})

const emit = defineEmits(['impression', 'complete', 'skip', 'dismiss', 'carousel-click'])

function onImpression(extras = {}) {
  if (!props.ad || !props.trackingToken) return
  adsApi.recordImpression({
    ad_uuid:         props.ad.uuid,
    tracking_token:  props.trackingToken,
    token_timestamp: props.tokenTimestamp,
    context:         'feed',
    ...extras,
  }).catch(() => {})
  emit('impression', props.ad)
}

function onCarouselClick(itemId) {
  if (!props.ad || !props.trackingToken) return
  adsApi.recordCarouselClick(props.ad.uuid, {
    carousel_item_id: itemId,
    tracking_token:   props.trackingToken,
    token_timestamp:  props.tokenTimestamp,
  }).catch(() => {})
  emit('carousel-click', { adUuid: props.ad.uuid, itemId })
}

// Report impression immediately on mount
onMounted(() => onImpression())
</script>

<style scoped>
.ad-slot {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0,0,0,0.07);
  margin-bottom: 12px;
  animation: ad-fadein 0.35s ease;
}

@keyframes ad-fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ad-slot__sponsored-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px 4px;
}

.ad-slot__sponsored-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ad-slot__close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: background 0.15s;
}
.ad-slot__close-btn:hover { background: #f3f4f6; color: #6b7280; }

/* Skeleton */
.ad-slot--skeleton { min-height: 200px; }
.ad-slot__skeleton-inner { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.ad-skeleton-media { height: 160px; border-radius: 12px; background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.ad-skeleton-lines { display: flex; flex-direction: column; gap: 6px; }
.ad-skeleton-line { height: 12px; border-radius: 6px; background: #f3f4f6; }
.ad-skeleton-line--wide { width: 70%; }
.ad-skeleton-line--short { width: 40%; }

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
