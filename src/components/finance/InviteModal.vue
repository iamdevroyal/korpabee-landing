<template>
  <Teleport to="body" v-if="modelValue">
    <div class="flutter-sheet-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="flutter-sheet-card">
        <!-- iOS/Android bottom sheet drag handle -->
        <div class="flutter-sheet-handle"></div>

        <!-- Header -->
        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon primary-gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="flutter-sheet-title-group">
            <h3 class="flutter-sheet-title text-gold">Invite &amp; Earn</h3>
            <p class="flutter-sheet-subtitle">Get trust score bonuses for verified signups</p>
          </div>
          <button class="flutter-sheet-close" @click="$emit('update:modelValue', false)" aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flutter-sheet-body text-center">
          <div class="invite-intro-card">
            <div class="invite-points-badge">+10 Points</div>
            <p class="invite-description">
              Share your referral link or QR code. When a corps member signs up and gets verified, you earn <strong>+10 Trust Points</strong> (max +100) and they get <strong>+5 baseline points</strong>!
            </p>
          </div>

          <!-- QR Code Container -->
          <div class="qr-container-box">
            <div v-if="qrLoading" class="qr-shimmer flutter-shimmer"></div>
            <img v-else-if="qrCodeUrl" :src="qrCodeUrl" class="qr-image" alt="Referral QR Code" />
            <div v-else class="qr-error">
              <span>Could not generate QR Code</span>
            </div>
            <p class="qr-caption">Scan to Register</p>
          </div>

          <!-- Referral Link Input -->
          <div class="flutter-text-field">
            <span class="flutter-text-field-label text-left">Your Referral Link</span>
            <div class="flutter-text-field-input-wrap link-input-wrap">
              <input
                ref="linkInput"
                :value="referralLink"
                type="text"
                readonly
                class="flutter-text-field-input link-text-field"
                @click="copyLink"
              />
              <button class="btn-copy-link" @click="copyLink">
                <span v-if="copied">Copied!</span>
                <span v-else>Copy</span>
              </button>
          </div>

          <!-- View Referrals Button -->
          <div class="view-referrals-btn-container">
            <button class="btn-view-referrals" @click="openRefereesModal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mr-2 inline-block">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              My Referred Friends
            </button>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-primary full-width" @click="$emit('update:modelValue', false)">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- ── Sub-Modal: Referees Details List Table ── -->
    <div v-if="showRefereesModal" class="flutter-sheet-overlay referees-overlay" @click.self="showRefereesModal = false">
      <div class="flutter-sheet-card referees-card animate-slide-up">
        <div class="flutter-sheet-handle"></div>

        <div class="flutter-sheet-header">
          <div class="flutter-sheet-header-icon primary-gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="flutter-sheet-title-group text-left">
            <h3 class="flutter-sheet-title text-gold">My Referrals</h3>
            <p class="flutter-sheet-subtitle">Corps members referred by you</p>
          </div>
          <button class="flutter-sheet-close" @click="showRefereesModal = false" aria-label="Close referrals list">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="flutter-sheet-body referees-list-body">
          <!-- Loading State -->
          <div v-if="refereesLoading" class="referees-loader-container">
            <div class="referee-row-shimmer flutter-shimmer" v-for="i in 3" :key="i"></div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!referees.length" class="referees-empty-state">
            <div class="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h4 class="empty-state-title">No referrals found</h4>
            <p class="empty-state-desc">Share your link and earn +10 Trust Points for every verified friend who signs up!</p>
          </div>

          <!-- Scrollable Table -->
          <div v-else class="table-outer-wrapper">
            <table class="referees-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>NYSC Batch</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="referee in referees" :key="referee.uuid">
                  <td class="td-user">
                    <div class="td-user-flex">
                      <div v-if="referee.avatar" class="referee-avatar-wrap">
                        <img :src="referee.avatar" class="referee-avatar-img" alt="Avatar" />
                      </div>
                      <div v-else class="referee-avatar-initials">
                        {{ referee.name ? referee.name.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div class="referee-meta">
                        <span class="referee-name-span">{{ referee.name }}</span>
                        <span class="referee-tag-span">{{ referee.phone ? referee.phone.substring(0, 4) + '***' + referee.phone.substring(7) : '' }}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="referee-deploy">
                      <span class="referee-state">{{ referee.state || 'N/A' }}</span>
                      <span class="referee-batch">{{ referee.batch || '' }}</span>
                    </div>
                  </td>
                  <td>
                    <span :class="['badge-status', referee.verified ? 'status-verified' : 'status-pending']">
                      {{ referee.verified ? 'Verified' : 'Pending' }}
                    </span>
                  </td>
                  <td class="td-date">{{ formatDate(referee.joined_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flutter-sheet-footer">
          <button class="flutter-btn flutter-btn-outline full-width" @click="showRefereesModal = false">
            Back to Invite
          </button>
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { getReferrals } from '@/api/auth'
import QRCode from 'qrcode'
import { isNative, nativeShare } from '@/lib/nativeBridge.js'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()
const { showToast } = useToast()

const copied = ref(false)
const qrLoading = ref(true)
const qrCodeUrl = ref('')
const isNativeShareSupported = ref(false)

// Referees Modal state
const showRefereesModal = ref(false)
const referees = ref([])
const refereesLoading = ref(false)

const referralLink = computed(() => {
  const tag = authStore.user?.corper_profile?.korpatag
  if (!tag) return ''
  return `${window.location.origin}/?ref=${encodeURIComponent(tag)}`
})

const generateQRCode = async () => {
  if (!referralLink.value) return
  qrLoading.value = true
  try {
    // Attempt local qrcode generation
    const url = await QRCode.toDataURL(referralLink.value, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1e1b4b', // Deep indigo/sapphire dark color matching dark M3 surfaces
        light: '#ffffff'
      }
    })
    qrCodeUrl.value = url
  } catch (err) {
    console.warn('[QR] Local generator failed, falling back to public API:', err)
    // Fallback: public QR Code API (Do both but use the frontend/local generator as primary, api.qrserver.com as fallback)
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1e1b4b&data=${encodeURIComponent(referralLink.value)}`
  } finally {
    qrLoading.value = false
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    generateQRCode()
  }
})

onMounted(() => {
  // True in the native app (real share sheet) or in browsers that support
  // the Web Share API — nativeShare() picks the right one automatically.
  isNativeShareSupported.value = isNative() || !!navigator.share
  if (props.modelValue) {
    generateQRCode()
  }
})

const copyLink = () => {
  if (!referralLink.value) return
  navigator.clipboard.writeText(referralLink.value).then(() => {
    copied.value = true
    showToast({
      title: 'Link Copied',
      message: 'Referral link copied to clipboard successfully!',
      type: 'success',
      duration: 3000
    })
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

// Fetch referrals from API
const openRefereesModal = async () => {
  showRefereesModal.value = true
  refereesLoading.value = true
  try {
    const res = await getReferrals()
    if (res && res.data) {
      referees.value = res.data
    }
  } catch (err) {
    console.error('Failed to load referees list:', err)
    showToast({
      title: 'Error',
      message: 'Failed to load referees details. Please try again.',
      type: 'error',
      duration: 3000
    })
  } finally {
    refereesLoading.value = false
  }
}

const formatDate = (isoString) => {
  if (!isoString) return 'N/A'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Social Share Triggers
const shareText = computed(() => {
  return `Join me on KorpaBee, the ultimate community & finance hub for NYSC Corpers! Setup your profile and claim your baseline trust score points: ${referralLink.value}`
})

const shareWhatsApp = () => {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText.value)}`, '_blank')
}

const shareTwitter = () => {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}`, '_blank')
}

const shareTelegram = () => {
  window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink.value)}&text=${encodeURIComponent('Join me on KorpaBee!')}`, '_blank')
}

const shareNative = async () => {
  // Uses the real native share sheet inside the mobile app, or the Web
  // Share API in supporting browsers — see src/lib/nativeBridge.js.
  await nativeShare({
    title: 'Join KorpaBee',
    text: 'Join me on KorpaBee, the community and finance hub for NYSC Corpers.',
    url: referralLink.value
  })
  // Failures/dismissals are handled silently inside nativeShare().
}
</script>

<style scoped>
.primary-gold {
  background-color: rgba(212, 175, 55, 0.15);
  color: #d4af37;
}

.text-gold {
  color: #e5c158;
}

/* Intro Card */
.invite-intro-card {
  background: var(--m3-surface-container-low);
  border: 1px solid var(--m3-outline);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  position: relative;
  overflow: hidden;
  margin-bottom: var(--spacing-lg);
}

.invite-points-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #d4af37;
  color: #0f111a;
  font: var(--type-label-sm);
  font-weight: 800;
  padding: 4px 10px;
  border-bottom-left-radius: var(--radius-md);
  text-transform: uppercase;
}

.invite-description {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  line-height: 1.5;
  text-align: left;
  margin: 4px 0 0 0;
}

/* QR Code */
.qr-container-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.qr-shimmer {
  width: 170px;
  height: 170px;
  border-radius: var(--radius-md);
  background-color: var(--m3-surface-container-low);
}

.qr-image {
  width: 170px;
  height: 170px;
  border-radius: var(--radius-md);
  border: 4px solid #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
}

.qr-error {
  width: 170px;
  height: 170px;
  border-radius: var(--radius-md);
  background-color: rgba(244, 63, 94, 0.05);
  border: 1.5px dashed var(--m3-error);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--m3-error);
  font: var(--type-label-md);
}

.qr-caption {
  font: var(--type-label-md);
  color: var(--m3-on-surface-variant);
  margin-top: var(--spacing-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Link input overrides */
.link-input-wrap {
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  background-color: var(--m3-surface-container-low) !important;
}

.link-text-field {
  color: var(--m3-on-surface);
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-copy-link {
  background-color: var(--m3-primary);
  border: none;
  color: var(--m3-on-primary);
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-sm);
  font: var(--type-label-md);
  font-weight: 800;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
  flex-shrink: 0;
}
.btn-copy-link:hover {
  background-color: var(--m3-primary-hover, #4f46e5);
}
.btn-copy-link:active {
  transform: var(--interactive-scale);
}

/* Share Grid */
.share-grid-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: flex-start;
  margin-top: var(--spacing-md);
}

.share-label {
  font: var(--type-label-lg);
  font-weight: 700;
  color: var(--m3-on-surface);
}

.share-chips-row {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
  width: 100%;
}

.share-chip {
  flex: 1;
  min-width: 90px;
  padding: 10px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--m3-outline);
  color: var(--m3-on-surface);
  font: var(--type-label-md);
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: all var(--duration-short) var(--ease-out);
}
.share-chip:active {
  transform: var(--interactive-scale);
}

.share-chip.whatsapp {
  background-color: rgba(37, 211, 102, 0.05);
  border-color: rgba(37, 211, 102, 0.3);
  color: #25d366;
}
.share-chip.whatsapp:hover {
  background-color: rgba(37, 211, 102, 0.12);
}

.share-chip.twitter {
  background-color: rgba(29, 161, 242, 0.05);
  border-color: rgba(29, 161, 242, 0.3);
  color: #1da1f2;
}
.share-chip.twitter:hover {
  background-color: rgba(29, 161, 242, 0.12);
}

.share-chip.telegram {
  background-color: rgba(0, 136, 204, 0.05);
  border-color: rgba(0, 136, 204, 0.3);
  color: #0088cc;
}
.share-chip.telegram:hover {
  background-color: rgba(0, 136, 204, 0.12);
}

.share-chip.more {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: var(--m3-outline);
  color: var(--m3-on-surface);
}
.share-chip.more:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

/* View Referrals button */
.view-referrals-btn-container {
  margin-top: var(--spacing-lg);
  width: 100%;
}
.btn-view-referrals {
  background-color: transparent;
  color: #d4af37;
  border: 1.5px solid rgba(212, 175, 55, 0.4);
  border-radius: var(--radius-lg);
  padding: 12px;
  font: var(--type-label-lg);
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  transition: all var(--duration-short) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-view-referrals:hover {
  background-color: rgba(212, 175, 55, 0.08);
  border-color: #d4af37;
}
.btn-view-referrals:active {
  transform: var(--interactive-scale);
}

/* ── Referees Modal Style (Cupertino Sheet Style Overlay) ── */
.referees-overlay {
  z-index: 1000;
}
.referees-card {
  max-width: 520px !important;
  height: 80vh !important; /* taller height to comfortably hold scrollable table */
}

.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.referees-list-body {
  padding: var(--spacing-md) var(--spacing-lg) !important;
  overflow-y: hidden !important;
  display: flex;
  flex-direction: column;
}

/* Loading & Empty states */
.referees-loader-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) 0;
}
.referee-row-shimmer {
  height: 56px;
  border-radius: var(--radius-md);
  background-color: var(--m3-surface-container-low);
}

.referees-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px var(--spacing-lg);
  text-align: center;
}
.empty-state-icon {
  color: var(--m3-on-surface-variant);
  opacity: 0.7;
  margin-bottom: var(--spacing-md);
}
.empty-state-title {
  font: var(--type-title-md);
  color: var(--m3-on-surface);
  margin: 0 0 6px 0;
}
.empty-state-desc {
  font: var(--type-body-md);
  color: var(--m3-on-surface-variant);
  max-width: 250px;
  line-height: 1.45;
  margin: 0;
}

/* Scroller and Table styling */
.table-outer-wrapper {
  flex: 1;
  overflow-y: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--m3-outline);
  background-color: var(--m3-surface-container-low);
  scrollbar-width: thin;
  margin-bottom: var(--spacing-md);
}

.referees-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.referees-table th {
  background-color: var(--m3-surface-container);
  color: var(--m3-on-surface);
  font: var(--type-label-md);
  font-weight: 700;
  padding: 12px 14px;
  border-bottom: 1.5px solid var(--m3-outline);
  position: sticky;
  top: 0;
  z-index: 10;
}

.referees-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--m3-outline);
  font: var(--type-body-md);
  color: var(--m3-on-surface);
  vertical-align: middle;
}

.referees-table tr:last-child td {
  border-bottom: none;
}

.td-user {
  max-width: 180px;
}
.td-user-flex {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.referee-avatar-wrap {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  overflow: hidden;
  background-color: var(--m3-surface-container);
  flex-shrink: 0;
}
.referee-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.referee-avatar-initials {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--m3-primary-container);
  color: var(--m3-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font: var(--type-label-lg);
  font-weight: 700;
  flex-shrink: 0;
}

.referee-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.referee-name-span {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--m3-on-surface);
}
.referee-tag-span {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
}

.referee-deploy {
  display: flex;
  flex-direction: column;
}
.referee-state {
  font-weight: 600;
  color: var(--m3-on-surface);
}
.referee-batch {
  font: var(--type-label-sm);
  color: var(--m3-on-surface-variant);
}

/* Badges */
.badge-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font: var(--type-label-sm);
  font-weight: 700;
  text-transform: uppercase;
}
.badge-status.status-verified {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.badge-status.status-pending {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.td-date {
  font-size: 11px !important;
  color: var(--m3-on-surface-variant);
  white-space: nowrap;
}

.full-width {
  width: 100%;
}
</style>

