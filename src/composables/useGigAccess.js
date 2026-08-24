import { computed, unref } from 'vue'
import { useMarketplaceStore } from '@/stores/marketplace.js'
import { useAuthStore } from '@/stores/auth.js'

/**
 * Centralizes the "can this user submit work on this gig right now, and if not, why"
 * logic so GigDetailPage and any future entry point (e.g. a gig card quick-apply
 * button) share one source of truth instead of re-deriving the rules.
 *
 * Pass the gig as a ref, getter, or plain object.
 */
export function useGigAccess(gig) {
  const marketplaceStore = useMarketplaceStore()
  const authStore = useAuthStore()

  const resolveGig = () => (typeof gig === 'function' ? gig() : unref(gig))

  const isOwnGig = computed(() => {
    const g = resolveGig()
    return !!g && g.poster?.uuid === authStore.user?.uuid
  })

  const isRestrictedCategory = computed(() => !!resolveGig()?.category?.is_restricted)

  // Verified Lite can work standard categories; restricted categories require Pro
  // regardless of lite/pro status difference elsewhere in the app.
  const isEligibleForCategory = computed(() => {
    if (!isRestrictedCategory.value) return marketplaceStore.canWorkGigs
    return marketplaceStore.isVerifiedPro
  })

  const reason = computed(() => {
    const g = resolveGig()
    if (!g) return null
    if (isOwnGig.value) return 'own_gig'
    if ((g.remaining_slots ?? 0) <= 0) return 'slots_filled'
    if (g.is_expired) return 'expired'
    if (!marketplaceStore.canWorkGigs) return 'not_verified'
    if (isRestrictedCategory.value && !marketplaceStore.isVerifiedPro) return 'restricted_pro_only'
    if (marketplaceStore.quotaExhausted) return 'quota_exhausted'
    return null
  })

  const canSubmit = computed(() => reason.value === null)

  const buttonLabel = computed(() => {
    switch (reason.value) {
      case 'own_gig': return 'Your Gig'
      case 'slots_filled': return 'All Slots Filled'
      case 'expired': return 'Closed'
      case 'not_verified': return 'Verification Required'
      case 'restricted_pro_only': return 'Verified Pro Required'
      case 'quota_exhausted': return 'Monthly Limit Reached'
      default: return 'Submit Work'
    }
  })

  const helperMessage = computed(() => {
    switch (reason.value) {
      case 'not_verified':
        return 'Get Verified Lite or Verified Pro status to start working gigs.'
      case 'restricted_pro_only':
        return 'This category is limited to Verified Pro corps members.'
      case 'quota_exhausted':
        return `You've used all ${marketplaceStore.monthlyQuota?.limit ?? ''} tasks for this month. Upgrade to Verified Pro for unlimited tasks.`
      default:
        return null
    }
  })

  return { isOwnGig, isRestrictedCategory, isEligibleForCategory, canSubmit, buttonLabel, helperMessage, reason }
}
