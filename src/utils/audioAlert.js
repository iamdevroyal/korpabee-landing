import whistleSound from '@/assets/whistle.wav'

let alertAudio = null
let isAudioUnlocked = false

/**
 * Initializes and pre-warms the audio instance.
 * Attaches one-time user interaction listeners to unlock browser audio autoplay policies.
 */
export function initAudioUnlock() {
  if (isAudioUnlocked || typeof window === 'undefined') return

  if (!alertAudio) {
    alertAudio = new Audio(whistleSound)
    alertAudio.preload = 'auto'
  }

  const unlock = () => {
    if (isAudioUnlocked) return

    // Play briefly muted to gain autoplay permission from browser
    alertAudio.volume = 0
    const playPromise = alertAudio.play()

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          alertAudio.pause()
          alertAudio.currentTime = 0
          alertAudio.volume = 1
          isAudioUnlocked = true
        })
        .catch(() => {
          // Will retry on next interaction if blocked
          alertAudio.volume = 1
        })
    }

    window.removeEventListener('click', unlock, true)
    window.removeEventListener('touchstart', unlock, true)
    window.removeEventListener('keydown', unlock, true)
  }

  window.addEventListener('click', unlock, { capture: true, once: true })
  window.addEventListener('touchstart', unlock, { capture: true, once: true })
  window.addEventListener('keydown', unlock, { capture: true, once: true })
}

/**
 * Plays the notification whistle alert sound safely across all browsers.
 */
export function playAlertSound() {
  try {
    if (!alertAudio) {
      alertAudio = new Audio(whistleSound)
      alertAudio.preload = 'auto'
    }

    alertAudio.currentTime = 0
    alertAudio.volume = 1
    const playPromise = alertAudio.play()

    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[AudioAlert] Autoplay blocked or failed:', err)
      })
    }
  } catch (err) {
    console.warn('[AudioAlert] Audio play exception:', err)
  }
}
