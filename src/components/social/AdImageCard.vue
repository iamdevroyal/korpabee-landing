<template>
  <div class="ad-image-card" @click="handleClick">
    <!-- Media -->
    <div class="ad-image-card__media-wrap">
      <img
        v-if="ad.media_url"
        :src="ad.media_url"
        :alt="ad.headline || 'Sponsored'"
        class="ad-image-card__media"
        loading="lazy"
      />
    </div>

    <!-- Body -->
    <div class="ad-image-card__body">
      <p v-if="ad.headline" class="ad-image-card__headline">{{ ad.headline }}</p>
      <p v-if="ad.body" class="ad-image-card__subtext">{{ ad.body }}</p>
      <a
        v-if="ad.cta_url"
        href="#"
        class="ad-image-card__cta"
        @click.stop.prevent="handleClick"
      >
        {{ ad.cta_text || 'Learn More' }}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as adsApi from '@/api/ads'

const props = defineProps({
  ad:             { type: Object, required: true },
  trackingToken:  { type: String, default: null },
  tokenTimestamp: { type: Number, default: null },
  context:        { type: String, default: 'feed' },
})

const emit = defineEmits(['impression'])

function handleClick() {
  // Record the click before navigating — fire-and-forget
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

onMounted(() => emit('impression'))
</script>

<style scoped>
.ad-image-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ad-image-card__media-wrap {
  width: 100%;
  overflow: hidden;
  height: 200px;
  background: #f3f4f6;
}

.ad-image-card__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.ad-image-card:hover .ad-image-card__media {
  transform: scale(1.02);
}

.ad-image-card__body {
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ad-image-card__headline {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  line-height: 1.35;
  margin: 0;
}

.ad-image-card__subtext {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ad-image-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  padding: 7px 14px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  text-decoration: none;
  align-self: flex-start;
  transition: opacity 0.2s, transform 0.15s;
}
.ad-image-card__cta:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
