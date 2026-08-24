<!--
  InstallPrompt.vue
  Mount this ONCE, globally, e.g. in App.vue:
    <InstallPrompt app-name="KorpaBee" icon="/icons/apple-touch-icon-180.png" />
  It renders nothing until useInstallPrompt().promptInstall() is called from elsewhere
  (e.g. the Register/Get Started button).
-->
<template>
  <Teleport to="body">
    <Transition name="ip-fade">
      <div
        v-if="isModalOpen"
        class="ip-overlay"
        @click.self="onBackdrop"
      >
        <Transition name="ip-rise" appear>
          <!-- iOS: instructional card (no native prompt exists on iOS) -->
          <div v-if="platform === 'ios'" class="ip-card ip-card--ios" role="dialog" aria-modal="true">
            <header class="ip-card__head">
              <img :src="icon" :alt="appName" class="ip-card__icon" />
              <div class="ip-card__heading">
                <h2>{{ appName }}</h2>
                <p>Install App</p>
              </div>
            </header>

            <ol class="ip-steps">
              <li>
                <span class="ip-steps__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v12M8 7l4-4 4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>Tap the <strong>Share</strong> icon in Safari's toolbar</span>
              </li>
              <li>
                <span class="ip-steps__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="4" y="4" width="16" height="16" rx="4" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 9v6M9 12h6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong></span>
              </li>
              <li>
                <span class="ip-steps__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span>Tap <strong>Add</strong> in the top corner</span>
              </li>
            </ol>

            <button class="ip-btn ip-btn--ios" @click="dismissModal('acknowledged')">
              Got it
            </button>
          </div>

          <!-- Android / Desktop: native install prompt, store-card styling -->
          <div v-else-if="platform === 'android' || platform === 'desktop'" class="ip-card ip-card--android">
            <!-- 1. Initial Prompt State -->
            <div v-if="!isInstalling && !isComplete">
              <header class="ip-card__head">
                <img :src="icon" :alt="appName" class="ip-card__icon" />
                <div class="ip-card__heading">
                  <h2>{{ appName }}</h2>
                  <p>{{ platform === 'desktop' ? 'Install app on this device' : 'Install app on your Android phone' }}</p>
                </div>
              </header>

              <ul class="ip-perks">
                <li>Install once and get access to all features</li>
              </ul>

              <div class="ip-actions">
                <button class="ip-btn ip-btn--ghost" @click="dismissModal('dismissed')">
                  Not now
                </button>
                <button class="ip-btn ip-btn--android" @click="handleInstallClick">
                  Install
                </button>
              </div>
            </div>

            <!-- 2. Installing/Progress State -->
            <div v-else-if="isInstalling" class="ip-installing">
              <header class="ip-card__head">
                <img :src="icon" :alt="appName" class="ip-card__icon" />
                <div class="ip-card__heading">
                  <h2>{{ appName }}</h2>
                  <p>Installing...</p>
                </div>
              </header>

              <!-- Progress bar wrapper -->
              <div class="ip-progress-container">
                <div class="ip-progress-bar" :style="{ width: progress + '%' }"></div>
              </div>
              <div class="ip-progress-text">
                <span>Downloading assets...</span>
                <span>{{ progress }}%</span>
              </div>
              <p class="ip-install-subtext">
                Please keep this window open while we set up KorpaBee on your device.
              </p>
            </div>

            <!-- 3. Complete State -->
            <div v-else-if="isComplete" class="ip-complete">
              <div v-if="!showLaunchInstructions" class="space-y-4">
                <div class="ip-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 class="ip-complete-title">Installation Complete!</h3>
                <p class="ip-complete-desc">
                  KorpaBee has been successfully installed on your device.
                </p>
                <button class="ip-btn ip-btn--android" @click="handleContinueClick">
                  Continue
                </button>
              </div>
              <div v-else class="space-y-4">
                <div class="ip-success-icon" style="background: rgba(60, 12, 160, 0.1); border-color: rgba(60, 12, 160, 0.2); color: #3c0ca0;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                </div>
                <h3 class="ip-complete-title">Launch KorpaBee</h3>
                <p class="ip-complete-desc">
                  Please find the KorpaBee app icon on your device's home screen or app drawer and launch it to continue registration.
                </p>
                <button class="ip-btn ip-btn--android" @click="handleDoneClick">
                  Got it
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useInstallPrompt } from '../../composables/useInstallPrompt';

defineProps({
  appName: { type: String, default: 'KorpaBee' },
  icon: { type: String, default: '/icons/apple-touch-icon-180.png' },
});

const { isModalOpen, platform, dismissModal, completeInstall, deferredEvent } = useInstallPrompt();

const isInstalling = ref(false);
const progress = ref(0);
const isComplete = ref(false);
const showLaunchInstructions = ref(false);

async function handleInstallClick() {
  if (!deferredEvent.value) {
    dismissModal('unsupported');
    return;
  }
  
  // Prompt the user with browser's native popup first
  deferredEvent.value.prompt();
  
  // Await user choice on the native popup before triggering the progress bar
  const choice = await deferredEvent.value.userChoice;
  
  if (choice.outcome === 'accepted') {
    isInstalling.value = true;
    progress.value = 0;
    
    // Progress for 45 seconds (45000ms)
    // Increment by 1 every 450ms
    const interval = setInterval(() => {
      progress.value += 1;
      if (progress.value >= 100) {
        clearInterval(interval);
        isInstalling.value = false;
        isComplete.value = true;
      }
    }, 450);
  } else {
    // If user canceled the native prompt, dismiss modal
    dismissModal('dismissed');
  }
}

function handleContinueClick() {
  showLaunchInstructions.value = true;
}

function handleDoneClick() {
  completeInstall();
}

function onBackdrop() {
  if (isInstalling.value) return;
  dismissModal('dismissed');
}
</script>

<style scoped>
.ip-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 5, 43, 0.45); /* Sleek translucent dark brand bg */
  backdrop-filter: blur(8px); /* Premium blur effect */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  padding: 0;
}
@media (min-width: 640px) {
  .ip-overlay {
    align-items: center;
    padding: 24px;
  }
}

.ip-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 24px 24px 0 0;
  padding: 28px 24px calc(24px + env(safe-area-inset-bottom));
  box-shadow: 0 -10px 40px rgba(60, 12, 160, 0.15);
  border: 1px solid rgba(233, 229, 245, 0.8);
}
@media (min-width: 640px) {
  .ip-card {
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 15px 50px rgba(60, 12, 160, 0.18);
  }
}

.ip-card__head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.ip-card__icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(60, 12, 160, 0.1);
  border: 1px solid rgba(233, 229, 245, 0.6);
  object-fit: cover;
}
.ip-card__heading h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1c0d45; /* navy-800 */
}
.ip-card__heading p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #615629; /* teal-800/muted */
  font-weight: 500;
}

/* iOS styling */
.ip-card--ios {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
}
.ip-steps {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ip-steps li {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  color: #1c0d45; /* navy-800 */
  line-height: 1.4;
}
.ip-steps__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(60, 12, 160, 0.08); /* navy-500 tint */
  color: #3c0ca0; /* navy-500 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ip-steps__icon svg { width: 18px; height: 18px; }

.ip-btn {
  width: 100%;
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s ease;
}
.ip-btn--ios {
  background: #3c0ca0; /* navy-500 */
  color: #ffffff;
  border-radius: 14px;
  padding: 14px 0;
  font-size: 16px;
  box-shadow: 0 4px 14px rgba(60, 12, 160, 0.2);
}
.ip-btn--ios:hover, .ip-btn--ios:active {
  background: #2b1461; /* navy-700 */
  transform: translateY(-1px);
}

/* Android / Desktop styling */
.ip-card--android {
  font-family: Roboto, "Segoe UI", system-ui, sans-serif;
}
.ip-perks {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ip-perks li {
  font-size: 14px;
  color: #1c0d45; /* navy-800 */
  padding-left: 24px;
  position: relative;
  line-height: 1.4;
}
.ip-perks li::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #aca064; /* gold-500 */
}
.ip-actions { display: flex; gap: 12px; }
.ip-actions .ip-btn {
  flex: 1;
  border-radius: 14px;
  padding: 13px 0;
  font-size: 15px;
}
.ip-btn--ghost {
  background: transparent;
  color: #615629;
  border: 1px solid rgba(172, 160, 100, 0.3);
}
.ip-btn--ghost:hover {
  background: rgba(172, 160, 100, 0.05);
}
.ip-btn--android {
  background: #3c0ca0; /* navy-500 */
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(60, 12, 160, 0.2);
}
.ip-btn--android:hover {
  background: #2b1461;
  transform: translateY(-1px);
}

/* Progress Bar styling */
.ip-progress-container {
  width: 100%;
  height: 8px;
  background: rgba(60, 12, 160, 0.08); /* navy-500 tint */
  border-radius: 99px;
  overflow: hidden;
  margin: 20px 0 10px;
}
.ip-progress-bar {
  height: 100%;
  background: #3c0ca0; /* navy-500 */
  border-radius: 99px;
  transition: width 0.3s ease;
}
.ip-progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  color: #1c0d45; /* navy-800 */
  margin-bottom: 12px;
}
.ip-install-subtext {
  font-size: 12px;
  color: #615629; /* teal-800/muted */
  line-height: 1.4;
  margin: 0;
}

/* Success styling */
.ip-complete {
  text-align: center;
  padding: 10px 0 5px;
}
.ip-success-icon {
  width: 64px;
  height: 64px;
  background: rgba(16, 185, 129, 0.1); /* emerald-500 tint */
  border: 2px solid rgba(16, 185, 129, 0.2);
  color: #10b981; /* emerald-500 */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ip-complete-title {
  font-size: 18px;
  font-weight: 800;
  color: #1c0d45; /* navy-800 */
  margin: 0 0 8px;
}
.ip-complete-desc {
  font-size: 13px;
  color: #615629;
  line-height: 1.4;
  margin: 0 0 24px;
}

@keyframes scaleUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* transitions */
.ip-fade-enter-active, .ip-fade-leave-active { transition: opacity 0.25s ease; }
.ip-fade-enter-from, .ip-fade-leave-to { opacity: 0; }
.ip-rise-enter-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease; }
.ip-rise-enter-from { transform: translateY(32px); opacity: 0; }
</style>
