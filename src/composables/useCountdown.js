import { ref, onMounted, onUnmounted, computed, unref } from 'vue'

/**
 * Live countdown to a target ISO datetime string (or null/undefined for "no expiry").
 * Used for: gig completion_duration_at, submission review_deadline_at.
 *
 * Usage:
 *   const { label, isPast, isUrgent } = useCountdown(() => gig.value.completion_duration_at)
 *
 * Pass a ref, a getter function, or a plain value — all are normalized internally.
 */
export function useCountdown(target, { urgentThresholdMs = 2 * 60 * 60 * 1000 } = {}) {
  const now = ref(Date.now())
  let timer = null

  const resolveTarget = () => {
    const t = typeof target === 'function' ? target() : unref(target)
    return t ? new Date(t).getTime() : null
  }

  const msRemaining = computed(() => {
    const t = resolveTarget()
    if (t === null) return null
    return t - now.value
  })

  const isPast = computed(() => msRemaining.value !== null && msRemaining.value <= 0)

  // "Urgent" flags the last couple of hours before a deadline — used to switch a
  // countdown badge to a warning color (e.g. red) in submission review lists.
  const isUrgent = computed(() => msRemaining.value !== null && msRemaining.value > 0 && msRemaining.value <= urgentThresholdMs)

  const label = computed(() => {
    const ms = msRemaining.value
    if (ms === null) return 'No expiry'
    if (ms <= 0) return 'Expired'

    const totalMinutes = Math.floor(ms / 60000)
    const days = Math.floor(totalMinutes / (60 * 24))
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
    const minutes = totalMinutes % 60

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  })

  onMounted(() => {
    timer = setInterval(() => { now.value = Date.now() }, 30000) // 30s tick is enough for minute-granularity labels
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { label, isPast, isUrgent, msRemaining }
}
