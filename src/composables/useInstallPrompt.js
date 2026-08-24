/**
 * useInstallPrompt.js
 * Module-level (singleton) reactive state, so the Register button (wherever it lives)
 * and the <InstallPrompt /> modal (mounted once in App.vue) share the same source of truth
 * without prop-drilling or a Vuex/Pinia store.
 */
import { ref, computed } from 'vue';
import { getInstallPlatform, isStandalone } from '../utils/platform';

const deferredEvent = ref(null);      // the captured BeforeInstallPromptEvent
const isModalOpen = ref(false);
const platform = ref('unsupported');  // 'ios' | 'android' | 'desktop' | 'unsupported' | 'installed'
const installResult = ref(null);      // 'accepted' | 'dismissed' | null
let resolveFlow = null;               // resolves the Promise returned by promptInstall()

const isInstalled = computed(() => isStandalone());

function attachListeners() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // stop the browser's own mini-infobar; we show our own UI instead
    deferredEvent.value = e;
  });

  window.addEventListener('appinstalled', () => {
    deferredEvent.value = null;
    installResult.value = 'accepted';
    // We don't auto-close the modal here so the UI can finish showing custom progress
  });
}
attachListeners();

export function useInstallPrompt() {
  /**
   * Call this from the Register/Get Started button.
   * Resolves once the user has finished the install step (installed, dismissed,
   * acknowledged the iOS instructions, or the browser can't install at all) —
   * resolve, then continue with your normal registration navigation.
   */
  function promptInstall() {
    if (isInstalled.value) return Promise.resolve('already-installed');

    platform.value = getInstallPlatform({ hasDeferredPrompt: !!deferredEvent.value });

    if (platform.value === 'unsupported') {
      return Promise.resolve('unsupported');
    }

    isModalOpen.value = true;
    return new Promise((resolve) => {
      resolveFlow = resolve;
    });
  }

  /** Called by the modal's primary button on Android/Desktop (native prompt path). */
  async function confirmNativeInstall() {
    if (!deferredEvent.value) {
      isModalOpen.value = false;
      resolveFlow?.('unsupported');
      return;
    }
    deferredEvent.value.prompt();
    const choice = await deferredEvent.value.userChoice;
    installResult.value = choice.outcome; // 'accepted' | 'dismissed'
    deferredEvent.value = null;
    isModalOpen.value = false;
    resolveFlow?.(choice.outcome);
  }

  /** Called by the modal's "Got it" button on iOS, or any "Maybe later" dismissal. */
  function dismissModal(result = 'dismissed') {
    isModalOpen.value = false;
    installResult.value = result;
    resolveFlow?.(result);
  }

  function completeInstall() {
    isModalOpen.value = false;
    installResult.value = 'accepted';
    resolveFlow?.('accepted');
  }

  return {
    isModalOpen,
    platform,
    installResult,
    isInstalled,
    promptInstall,
    confirmNativeInstall,
    dismissModal,
    completeInstall,
    deferredEvent,
  };
}
