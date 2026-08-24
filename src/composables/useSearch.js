import { ref, computed } from 'vue'

/**
 * useSearch — lightweight client-side search composable.
 * Uses the backend search endpoints (not Meilisearch JS client directly).
 */
export function useSearch(searchFn) {
  const query = ref('')
  const filters = ref({})
  const results = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasResults = computed(() => results.value.length > 0)

  let debounceTimer = null

  async function search(extraParams = {}) {
    loading.value = true
    error.value = null
    try {
      const params = { q: query.value, ...filters.value, ...extraParams }
      results.value = await searchFn(params)
    } catch (e) {
      error.value = e.response?.data?.message ?? 'Search failed'
      results.value = []
    } finally {
      loading.value = false
    }
  }

  function debouncedSearch(delay = 400) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => search(), delay)
  }

  function setFilter(key, value) {
    filters.value[key] = value
    search()
  }

  function clearFilters() {
    filters.value = {}
    query.value = ''
    results.value = []
  }

  return {
    query, filters, results, loading, error, hasResults,
    search, debouncedSearch, setFilter, clearFilters,
  }
}
