<template>
  <div class="ad-carousel">
    <!-- Slide track -->
    <div class="ad-carousel__track-wrap" @touchstart="touchStart" @touchend="touchEnd">
      <div
        class="ad-carousel__track"
        :style="{ transform: `translateX(-${activeIndex * 100}%)` }"
      >
        <div
          v-for="(item, i) in ad.items"
          :key="item.id"
          class="ad-carousel__slide"
          @click="handleSlideClick(item)"
        >
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.headline || 'Ad'"
            class="ad-carousel__media"
            loading="lazy"
          />
          <div class="ad-carousel__slide-body">
            <p v-if="item.headline" class="ad-carousel__slide-headline">{{ item.headline }}</p>
            <a :href="item.cta_url" target="_blank" rel="noopener noreferrer" class="ad-carousel__slide-cta" @click.stop>
              Visit
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav arrows -->
    <button v-if="activeIndex > 0" class="ad-carousel__arrow ad-carousel__arrow--left" @click="prev" aria-label="Previous">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <button v-if="activeIndex < ad.items.length - 1" class="ad-carousel__arrow ad-carousel__arrow--right" @click="next" aria-label="Next">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>

    <!-- Dots -->
    <div class="ad-carousel__dots">
      <button
        v-for="(_, i) in ad.items"
        :key="i"
        class="ad-carousel__dot"
        :class="{ 'ad-carousel__dot--active': i === activeIndex }"
        @click="goTo(i)"
        :aria-label="`Slide ${i + 1}`"
      />
    </div>

    <!-- Brand / CTA footer -->
    <div class="ad-carousel__footer">
      <span class="ad-carousel__footer-name">{{ ad.headline }}</span>
      <a :href="ad.items[activeIndex]?.cta_url" target="_blank" rel="noopener noreferrer" class="ad-carousel__footer-cta" @click.stop>
        {{ ad.cta_text || 'Shop Now' }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  ad: { type: Object, required: true },
})

const emit = defineEmits(['impression', 'click-item'])

const activeIndex = ref(0)
let touchStartX = 0

function prev() {
  if (activeIndex.value > 0) activeIndex.value--
}
function next() {
  if (activeIndex.value < props.ad.items.length - 1) activeIndex.value++
}
function goTo(i) {
  activeIndex.value = i
}

function handleSlideClick(item) {
  emit('click-item', item.id)
  if (item.cta_url) window.open(item.cta_url, '_blank', 'noopener,noreferrer')
}

function touchStart(e) {
  touchStartX = e.touches[0].clientX
}
function touchEnd(e) {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (diff > 40) next()
  else if (diff < -40) prev()
}
</script>

<style scoped>
.ad-carousel { position: relative; overflow: hidden; }

.ad-carousel__track-wrap {
  overflow: hidden;
}

.ad-carousel__track {
  display: flex;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.ad-carousel__slide {
  flex: 0 0 100%;
  cursor: pointer;
}

.ad-carousel__media {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.ad-carousel__slide-body {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
}

.ad-carousel__slide-headline {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.ad-carousel__slide-cta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #6C5CE7;
  text-decoration: none;
}

/* Arrow buttons */
.ad-carousel__arrow {
  position: absolute;
  top: calc(110px - 18px);
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: background 0.15s, transform 0.15s;
  z-index: 2;
}
.ad-carousel__arrow:hover { background: #fff; transform: scale(1.08); }
.ad-carousel__arrow--left  { left: 10px; }
.ad-carousel__arrow--right { right: 10px; }

/* Dots */
.ad-carousel__dots {
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 8px 0 4px;
}
.ad-carousel__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: #d1d5db;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  padding: 0;
}
.ad-carousel__dot--active { background: #6C5CE7; transform: scale(1.3); }

/* Footer */
.ad-carousel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px 14px;
}
.ad-carousel__footer-name {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}
.ad-carousel__footer-cta {
  padding: 6px 14px;
  background: linear-gradient(135deg, #6C5CE7, #a29bfe);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 20px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.ad-carousel__footer-cta:hover { opacity: 0.9; }
</style>
