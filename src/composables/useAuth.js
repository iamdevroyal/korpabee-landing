import { ref, computed } from 'vue'

const user = ref(null)
const token = ref(null)
const loading = ref(false)
const error = ref(null)
const isAuthenticated = computed(() => !!token.value)
const isVerified = computed(() => !!user.value?.phone_verified_at)
const isCorper = computed(() => user.value?.role === 'corper')
const isBusiness = computed(() => user.value?.role === 'business')

export function useAuth() {
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isVerified,
    isCorper,
    isBusiness,
    register: async () => {},
    login: async () => {},
    logout: async () => {},
    verifyPhone: async () => {},
    joinWaitlist: async () => {},
    fetchMe: async () => {},
    clearSession: () => {},
  }
}

