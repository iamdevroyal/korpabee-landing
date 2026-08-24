import { ref } from 'vue'

/**
 * One-shot geolocation lookup for "Share Location".
 *
 * @returns {{
 *   isSupported: boolean,
 *   isLocating: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<null|'unsupported'|'denied'|'error'>,
 *   getLocation: () => Promise<null|{ latitude:number, longitude:number, accuracy:number, mapsUrl:string }>
 * }}
 */
export function useGeolocation() {
  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator
  const isLocating = ref(false)
  const error = ref(null)

  const getLocation = () => {
    return new Promise((resolve) => {
      error.value = null

      if (!isSupported) {
        error.value = 'unsupported'
        resolve(null)
        return
      }

      isLocating.value = true
      navigator.geolocation.getCurrentPosition(
        (position) => {
          isLocating.value = false
          const { latitude, longitude, accuracy } = position.coords
          resolve({
            latitude,
            longitude,
            accuracy,
            mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
          })
        },
        (err) => {
          isLocating.value = false
          error.value = err.code === err.PERMISSION_DENIED ? 'denied' : 'error'
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  return { isSupported, isLocating, error, getLocation }
}
