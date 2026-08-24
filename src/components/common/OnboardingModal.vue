<template>
  <Teleport to="body">
    <Transition
      enter-active-class="onb-fade-enter-active"
      enter-from-class="onb-fade-enter-from"
      leave-active-class="onb-fade-leave-active"
      leave-to-class="onb-fade-leave-to"
    >
      <div v-if="visible" class="onb-overlay" aria-modal="true" role="dialog" aria-labelledby="onb-title">

        <!-- Card -->
        <Transition
          :name="`slide-${slideDir}`"
          mode="out-in"
        >
          <div class="onb-card" :key="step">

            <!-- ── Header ── -->
            <div class="onb-header">
              <div class="onb-header-glow" />
              <div class="onb-logo">
                <div class="logo-icon-wrap">
                  <img src="@/assets/logo.png" alt="KorpaBee" class="logo-img" />
                </div>
              </div>

              <div class="onb-header-text">
                <h2 id="onb-title" class="onb-title">{{ STEPS[step].title }}</h2>
                <p class="onb-subtitle">{{ STEPS[step].subtitle }}</p>
              </div>

              <!-- Step dots -->
              <div class="onb-dots">
                <button
                  v-for="(s, i) in STEPS" :key="i"
                  class="onb-dot"
                  :class="{ 'onb-dot-active': i === step, 'onb-dot-done': i < step }"
                  :aria-label="`Step ${i + 1}`"
                  @click="i < step ? goTo(i) : null"
                />
              </div>
            </div>

            <!-- ── Step 1: Interests ── -->
            <div v-if="step === 0" class="onb-body">
              <div class="onb-required-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Required to provide you with personalised contents
              </div>

              <div class="onb-interests-grid">
                <button
                  v-for="cat in INTEREST_CATEGORIES"
                  :key="cat"
                  type="button"
                  class="onb-chip"
                  :class="{ 'onb-chip-active': form.interests.includes(cat), 'onb-chip-maxed': !form.interests.includes(cat) && form.interests.length >= 10 }"
                  @click="toggleInterest(cat)"
                >
                  <span class="onb-chip-icon">{{ INTEREST_ICONS[cat] || '🎯' }}</span>
                  <span>{{ cat }}</span>
                  <span v-if="form.interests.includes(cat)" class="onb-chip-check">✓</span>
                </button>
              </div>

              <p class="onb-chip-count" :class="{ 'onb-chip-count-ok': form.interests.length > 0 }">
                <span v-if="form.interests.length === 0">Select at least 1 interest to continue</span>
                <span v-else>{{ form.interests.length }}/10 selected</span>
              </p>
            </div>

            <!-- ── Step 2: Professional Details ── -->
            <div v-else-if="step === 1" class="onb-body">
              <div class="onb-field-group">
                <label class="onb-label">Skills <span class="onb-label-hint">(comma separated)</span></label>
                <input
                  v-model="skillsInput"
                  type="text"
                  placeholder="e.g. Photography, Web Development, Finance"
                  class="onb-input"
                />
              </div>

              <div class="onb-field-group">
                <label class="onb-label">Current Role</label>
                <input
                  v-model="form.currentRole"
                  type="text"
                  placeholder="e.g. Frontend Developer Intern"
                  class="onb-input"
                />
              </div>

              <div class="onb-grid-2">
                <div class="onb-field-group">
                  <label class="onb-label">Institution</label>
                  <input
                    v-model="form.institution"
                    type="text"
                    placeholder="e.g. University of Lagos"
                    class="onb-input"
                  />
                </div>
                <div class="onb-field-group">
                  <label class="onb-label">Discipline</label>
                  <input
                    v-model="form.discipline"
                    type="text"
                    placeholder="e.g. Computer Science"
                    class="onb-input"
                  />
                </div>
              </div>

              <div class="onb-field-group">
                <label class="onb-label">Qualification</label>
                <input
                  v-model="form.qualification"
                  type="text"
                  placeholder="e.g. BSc, HND, OND"
                  class="onb-input"
                />
              </div>
            </div>

            <!-- ── Step 3: Social Links ── -->
            <div v-else-if="step === 2" class="onb-body">
              <p class="onb-social-intro">Connect your online presence so other corpers can find you.</p>

              <div class="onb-social-list">
                <div
                  v-for="(link, index) in form.socialLinks"
                  :key="index"
                  class="onb-social-row"
                >
                  <div class="onb-platform-icon">{{ PLATFORM_ICONS[link.platform] || '🔗' }}</div>
                  <select v-model="link.platform" class="onb-select">
                    <option v-for="opt in availablePlatforms(link.platform)" :key="opt" :value="opt">
                      {{ PLATFORM_LABELS[opt] }}
                    </option>
                  </select>
                  <input
                    v-model="link.url"
                    type="url"
                    placeholder="https://..."
                    class="onb-input onb-input-flex"
                  />
                  <button type="button" @click="removeSocialLink(index)" class="onb-remove-btn" aria-label="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              <button
                v-if="form.socialLinks.length < 6"
                type="button"
                @click="addSocialLink"
                class="onb-add-link-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Add Social Link
              </button>
            </div>

            <!-- ── Footer ── -->
            <div class="onb-footer">
              <!-- Error -->
              <p v-if="saveError" class="onb-error">{{ saveError }}</p>

              <div class="onb-footer-actions">
                <!-- Back (steps 2, 3) -->
                <button
                  v-if="step > 0"
                  type="button"
                  class="onb-btn-ghost"
                  @click="prevStep"
                >
                  ← Back
                </button>

                <!-- Spacer when no back button -->
                <div v-else />

                <div class="onb-footer-right">
                  <!-- Skip (optional steps) -->
                  <button
                    v-if="step > 0"
                    type="button"
                    class="onb-btn-skip"
                    :disabled="saving"
                    @click="skipStep"
                  >
                    Skip
                  </button>

                  <!-- Continue / Finish -->
                  <button
                    type="button"
                    class="onb-btn-primary"
                    :disabled="(step === 0 && form.interests.length === 0) || saving"
                    @click="nextStep"
                  >
                    <svg v-if="saving" class="onb-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    <span v-if="step < STEPS.length - 1">Continue →</span>
                    <span v-else>{{ saving ? 'Saving...' : '🎉 All done!' }}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </Transition>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { updateMe } from '@/api/user'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['complete'])

const authStore = useAuthStore()

// ── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: 'Welcome to KorpaBee! 👋',
    subtitle: 'Pick your interests so we can personalise your feed and show you relevant opportunities.',
  },
  {
    title: 'Your Professional Story',
    subtitle: 'Help employers and other corpers understand what you bring to the table.',
  },
  {
    title: 'Connect Online',
    subtitle: 'Add your social links — optional but great for networking!',
  },
]

const INTEREST_CATEGORIES = [
  'Tech', 'Finance', 'Agriculture', 'Health', 'Media',
  'Education', 'Fashion', 'Sports', 'Entertainment', 'Law',
  'Real Estate', 'Business', 'Food & Hospitality', 'Engineering', 'Art & Design',
]

const INTEREST_ICONS = {
  'Tech': '💻', 'Finance': '💰', 'Agriculture': '🌾', 'Health': '🏥', 'Media': '📺',
  'Education': '📚', 'Fashion': '👗', 'Sports': '⚽', 'Entertainment': '🎬', 'Law': '⚖️',
  'Real Estate': '🏠', 'Business': '💼', 'Food & Hospitality': '🍽️', 'Engineering': '🔧', 'Art & Design': '🎨',
}

const ALL_PLATFORMS = ['linkedin', 'twitter', 'instagram', 'github', 'portfolio', 'facebook']
const PLATFORM_LABELS = {
  linkedin: 'LinkedIn', twitter: 'X (Twitter)', instagram: 'Instagram',
  github: 'GitHub', portfolio: 'Portfolio', facebook: 'Facebook',
}
const PLATFORM_ICONS = {
  linkedin: '💼', twitter: '🐦', instagram: '📸',
  github: '💻', portfolio: '🌐', facebook: '📘',
}

// ── State ────────────────────────────────────────────────────────────────────

const visible = ref(true)
const step = ref(0)
const slideDir = ref('forward')
const saving = ref(false)
const saveError = ref('')

const form = ref({
  interests: [],
  currentRole: '',
  institution: '',
  discipline: '',
  qualification: '',
  socialLinks: [],
})
const skillsInput = ref('')

// ── Helpers ──────────────────────────────────────────────────────────────────

const availablePlatforms = (currentValue) => {
  const used = form.value.socialLinks.map(l => l.platform).filter(p => p && p !== currentValue)
  return ALL_PLATFORMS.filter(p => !used.includes(p))
}

const addSocialLink = () => {
  if (form.value.socialLinks.length >= 6) return
  const used = form.value.socialLinks.map(l => l.platform)
  const next = ALL_PLATFORMS.find(p => !used.includes(p))
  form.value.socialLinks.push({ platform: next || ALL_PLATFORMS[0], url: '' })
}

const removeSocialLink = (index) => {
  form.value.socialLinks.splice(index, 1)
}

const toggleInterest = (cat) => {
  const idx = form.value.interests.indexOf(cat)
  if (idx !== -1) {
    form.value.interests.splice(idx, 1)
  } else if (form.value.interests.length < 10) {
    form.value.interests.push(cat)
  }
}

// ── Navigation ───────────────────────────────────────────────────────────────

const goTo = (target) => {
  slideDir.value = target < step.value ? 'back' : 'forward'
  step.value = target
}

const prevStep = () => goTo(step.value - 1)

const nextStep = async () => {
  saveError.value = ''

  if (step.value < STEPS.length - 1) {
    goTo(step.value + 1)
    return
  }

  // Final step — save everything
  await saveAndFinish()
}

const skipStep = async () => {
  saveError.value = ''

  if (step.value < STEPS.length - 1) {
    goTo(step.value + 1)
    return
  }

  // Skip on final step = save what we have (interests + possibly step 2 data)
  await saveAndFinish()
}

// ── Persistence ──────────────────────────────────────────────────────────────

async function saveAndFinish() {
  saving.value = true
  saveError.value = ''
  try {
    const skillsArray = skillsInput.value
      ? skillsInput.value.split(',').map(s => s.trim()).filter(Boolean)
      : []

    const socialLinksPayload = form.value.socialLinks
      .filter(l => l.platform && l.url)
      .map(l => ({ platform: l.platform, url: l.url }))

    await updateMe({
      interests: form.value.interests,
      skills: skillsArray,
      current_role: form.value.currentRole || undefined,
      institution: form.value.institution || undefined,
      discipline: form.value.discipline || undefined,
      qualification: form.value.qualification || undefined,
      social_links: socialLinksPayload,
    })

    // Refresh auth store user so interests are reflected immediately
    try { await authStore.fetchMe() } catch (_) { /* non-fatal */ }

    // Mark onboarding as done — never show again for this browser session
    sessionStorage.removeItem('kb_onboarding_needed')
    localStorage.setItem('kb_onboarding_done', '1')

    visible.value = false
    emit('complete')
  } catch (err) {
    saveError.value = err.response?.data?.message || 'Could not save your profile. Please try again.'
  } finally {
    saving.value = false
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/** Called from the parent to pre-populate any existing profile data */
function prefill({ interests, currentRole, institution, discipline, qualification, skills, socialLinks }) {
  if (Array.isArray(interests)) form.value.interests = [...interests]
  form.value.currentRole = currentRole || ''
  form.value.institution = institution || ''
  form.value.discipline = discipline || ''
  form.value.qualification = qualification || ''
  if (Array.isArray(skills)) skillsInput.value = skills.join(', ')
  if (Array.isArray(socialLinks)) {
    form.value.socialLinks = socialLinks.map(l => ({ platform: l.platform, url: l.url }))
  }
}

defineExpose({ prefill })
</script>

<style scoped>
/* ── Overlay ── */
.onb-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 5, 35, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* ── Card ── */
.onb-card {
  background: #ffffff;
  border-radius: 24px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(60, 12, 160, 0.08),
    0 32px 80px rgba(10, 5, 35, 0.35),
    0 8px 24px rgba(60, 12, 160, 0.15);
}

/* ── Header ── */
.onb-header {
  position: relative;
  background: linear-gradient(135deg, #3c0ca0 0%, #5a1fd8 50%, #7c3aed 100%);
  padding: 28px 28px 24px;
  overflow: hidden;
  flex-shrink: 0;
}

.onb-header-glow {
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.logo-img { width: 60%; height: 40%; object-fit: contain; background-color: #ffffff; padding: 5%; border-radius: 30%;}

.onb-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  opacity: 0.9;
}

.onb-logo span {
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}

.onb-header-text {
  margin-bottom: 20px;
}

.onb-title {
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.25;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.onb-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  margin: 0;
}

/* Step dots */
.onb-dots {
  display: flex;
  gap: 6px;
}

.onb-dot {
  width: 28px;
  height: 4px;
  border-radius: 99px;
  border: none;
  cursor: default;
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.3s ease;
  padding: 0;
}

.onb-dot-active {
  background: rgba(255, 255, 255, 0.95);
  width: 40px;
}

.onb-dot-done {
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

/* ── Body ── */
.onb-body {
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e8e4ff transparent;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.onb-body::-webkit-scrollbar { width: 4px; }
.onb-body::-webkit-scrollbar-track { background: transparent; }
.onb-body::-webkit-scrollbar-thumb { background: #e8e4ff; border-radius: 99px; }

/* Required badge */
.onb-required-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid #fbbf24;
  width: fit-content;
}

/* Interest chips */
.onb-interests-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.onb-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: 99px;
  border: 1.5px solid #e8e4ff;
  background: #faf9ff;
  color: #4a4075;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.onb-chip:hover:not(.onb-chip-maxed) {
  border-color: #7c3aed;
  color: #7c3aed;
  background: #f0ebff;
  transform: translateY(-1px);
}

.onb-chip-active {
  background: linear-gradient(135deg, #3c0ca0, #7c3aed) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(60, 12, 160, 0.3);
  transform: translateY(-1px);
}

.onb-chip-maxed {
  opacity: 0.4;
  cursor: not-allowed;
}

.onb-chip-icon {
  font-size: 14px;
  line-height: 1;
}

.onb-chip-check {
  font-size: 11px;
  font-weight: 900;
}

.onb-chip-count {
  font-size: 12px;
  color: #a8a4c4;
  font-weight: 600;
  margin: 0;
  padding: 4px 0;
}

.onb-chip-count-ok {
  color: #7c3aed;
}

/* ── Form fields ── */
.onb-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.onb-label {
  font-size: 11px;
  font-weight: 800;
  color: #1a1535;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.onb-label-hint {
  font-weight: 500;
  text-transform: none;
  color: #a8a4c4;
  letter-spacing: 0;
}

.onb-input {
  width: 100%;
  padding: 10px 14px;
  background: #faf9ff;
  border: 1.5px solid #e8e4ff;
  border-radius: 12px;
  font-size: 13.5px;
  color: #1a1535;
  transition: border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

.onb-input:focus {
  border-color: #7c3aed;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.onb-input::placeholder {
  color: #c4beff;
}

.onb-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Social links */
.onb-social-intro {
  font-size: 13px;
  color: #6e6a8a;
  margin: 0;
  line-height: 1.5;
}

.onb-social-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.onb-social-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.onb-platform-icon {
  font-size: 18px;
  flex-shrink: 0;
  width: 28px;
  text-align: center;
}

.onb-select {
  padding: 10px 10px;
  background: #faf9ff;
  border: 1.5px solid #e8e4ff;
  border-radius: 12px;
  font-size: 12.5px;
  color: #1a1535;
  outline: none;
  transition: border-color 0.18s ease;
  font-family: inherit;
  flex-shrink: 0;
  width: 120px;
}

.onb-select:focus {
  border-color: #7c3aed;
}

.onb-input-flex {
  flex: 1;
  width: auto;
}

.onb-remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #c4beff;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}

.onb-remove-btn:hover {
  color: #ef4444;
  background: #fee2e2;
}

.onb-add-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1.5px dashed #c4beff;
  color: #7c3aed;
  font-size: 12.5px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.18s ease;
  width: 100%;
  justify-content: center;
}

.onb-add-link-btn:hover {
  background: #f0ebff;
  border-color: #7c3aed;
}

/* ── Footer ── */
.onb-footer {
  border-top: 1px solid #f0ebff;
  padding: 16px 28px 20px;
  flex-shrink: 0;
  background: #faf9ff;
}

.onb-error {
  font-size: 12px;
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-weight: 600;
}

.onb-footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.onb-footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.onb-btn-ghost {
  background: none;
  border: none;
  color: #a8a4c4;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 8px 4px;
  transition: color 0.15s;
}

.onb-btn-ghost:hover { color: #4a4075; }

.onb-btn-skip {
  background: none;
  border: 1.5px solid #e8e4ff;
  color: #6e6a8a;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  padding: 9px 18px;
  border-radius: 12px;
  transition: all 0.18s ease;
}

.onb-btn-skip:hover:not(:disabled) {
  background: #f0ebff;
  border-color: #c4beff;
  color: #4a4075;
}

.onb-btn-skip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.onb-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #3c0ca0, #7c3aed);
  color: #ffffff;
  border: none;
  font-size: 13.5px;
  font-weight: 800;
  padding: 10px 22px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(60, 12, 160, 0.3);
  letter-spacing: 0.01em;
}

.onb-btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2d0979, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(60, 12, 160, 0.4);
}

.onb-btn-primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Spinner */
.onb-spin {
  animation: onb-rotate 0.8s linear infinite;
}

@keyframes onb-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ── Overlay transition ── */
.onb-fade-enter-active { transition: opacity 0.35s ease; }
.onb-fade-enter-from   { opacity: 0; }
.onb-fade-leave-active { transition: opacity 0.25s ease; }
.onb-fade-leave-to     { opacity: 0; }

/* ── Step slide transitions ── */
.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-forward-enter-from { opacity: 0; transform: translateX(40px); }
.slide-forward-leave-to   { opacity: 0; transform: translateX(-40px); }

.slide-back-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-back-leave-to   { opacity: 0; transform: translateX(40px); }

/* ── Responsive ── */
@media (max-width: 560px) {
  .onb-card {
    border-radius: 20px 20px 0 0;
    max-height: 92vh;
    margin-top: auto;
  }

  .onb-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .onb-header {
    padding: 22px 20px 20px;
  }

  .onb-body {
    padding: 20px;
  }

  .onb-footer {
    padding: 14px 20px 28px;
  }

  .onb-grid-2 {
    grid-template-columns: 1fr;
  }

  .onb-title {
    font-size: 18px;
  }
}
</style>
