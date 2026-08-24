import { ref } from 'vue'

/**
 * useGeolocation — wraps the browser Geolocation API reactively.
 */
export function useGeolocation() {
  const latitude = ref(null)
  const longitude = ref(null)
  const accuracy = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const supported = 'geolocation' in navigator

  function getCurrentPosition(options = {}) {
    if (!supported) {
      error.value = 'Geolocation is not supported by your browser'
      return Promise.reject(new Error(error.value))
    }

    loading.value = true
    error.value = null

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          latitude.value = pos.coords.latitude
          longitude.value = pos.coords.longitude
          accuracy.value = pos.coords.accuracy
          loading.value = false
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        (err) => {
          loading.value = false
          error.value = err.message ?? 'Location access denied'
          reject(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
          ...options,
        }
      )
    })
  }

  /**
   * Return lat/lng suitable for API proximity search.
   */
  function toQueryParams(radiusKm = 10) {
    if (latitude.value === null || longitude.value === null) return {}
    return { lat: latitude.value, lng: longitude.value, radius: radiusKm }
  }

  return {
    latitude, longitude, accuracy, loading, error, supported,
    getCurrentPosition, toQueryParams,
  }
}
