/**
 * platform.js
 * Lightweight OS/browser detection for PWA install flows.
 * No dependencies — just UA sniffing + feature checks, kept in one place
 * so it's easy to patch as Apple/Google tweak their UA strings over time.
 */

function getUA() {
  return typeof navigator !== 'undefined' ? navigator.userAgent : '';
}

/** True on iPhone/iPad/iPod, and on iPadOS 13+ which disguises itself as "Mac". */
export function isIOS() {
  const ua = getUA();
  const classicIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const iPadOS13Plus =
    navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return classicIOS || iPadOS13Plus;
}

/** True only for Safari on iOS — Chrome/Firefox/Edge on iOS all use WebKit
 *  but cannot trigger the native install affordance, so we treat them like Safari
 *  for instructional purposes (they all support "Add to Home Screen" via Share sheet). */
export function isIOSSafari() {
  const ua = getUA();
  const isCriOS = /CriOS/.test(ua);
  const isFxiOS = /FxiOS/.test(ua);
  return isIOS() && !isCriOS && !isFxiOS;
}

export function isAndroid() {
  return /Android/.test(getUA());
}

/** Chromium-based desktop/Android browsers that support beforeinstallprompt. */
export function isChromiumLike() {
  const ua = getUA();
  return /Chrome|Chromium|Edg\//.test(ua) && !/OPR\//.test(ua);
}

export function isDesktop() {
  return !isIOS() && !isAndroid();
}

/** Already running as an installed app (any platform). */
export function isStandalone() {
  const mq =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const iosStandalone = window.navigator.standalone === true; // iOS-specific flag
  const androidTWA = document.referrer.startsWith('android-app://');
  const isRunnerApp = typeof window !== 'undefined' && Boolean(window.KorpaBeeNative || window.MobileJumpNative || window.NativePHP || window.__NATIVEPHP_JUMP__);
  return Boolean(mq || iosStandalone || androidTWA || isRunnerApp);
}

/**
 * Resolves the high-level install flow to show.
 * 'ios'      -> manual "Add to Home Screen" instructions (no native prompt exists)
 * 'android'  -> native beforeinstallprompt flow, mobile-styled card
 * 'desktop'  -> native beforeinstallprompt flow, desktop-styled card
 * 'unsupported' -> browser can't install a PWA at all (e.g. Firefox desktop, in-app browsers)
 */
export function getInstallPlatform({ hasDeferredPrompt }) {
  if (isStandalone()) return 'installed';
  if (isIOS()) return 'ios';
  if (isAndroid()) return hasDeferredPrompt ? 'android' : 'unsupported';
  if (isDesktop()) return hasDeferredPrompt ? 'desktop' : 'unsupported';
  return 'unsupported';
}
