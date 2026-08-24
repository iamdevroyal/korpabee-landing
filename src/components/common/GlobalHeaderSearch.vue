<template>
  <div ref="containerRef" class="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
    <!-- Search Input Bar -->
    <div class="relative flex items-center w-full">
      <div class="absolute left-3 text-slate-400 pointer-events-none flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>

      <input
        v-model="query"
        @input="onInput"
        @focus="isFocused = true"
        @keydown.enter="submitSearch"
        type="text"
        placeholder="Search posts, corpers, buzz, PPAs..."
        class="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-medium pl-9 pr-8 py-2 rounded-full border border-slate-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all shadow-inner"
      />

      <!-- Clear Button -->
      <button
        v-if="query"
        @click="clear"
        class="absolute right-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Live Preview Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="showDropdown"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 text-slate-900 max-h-[80vh] overflow-y-auto"
      >
        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span class="w-3.5 h-3.5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></span>
          <span>Searching...</span>
        </div>

        <div v-else-if="hasResults" class="divide-y divide-slate-100 text-xs">
          
          <!-- People Section -->
          <div v-if="results.users?.length" class="p-2">
            <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">People / Corpers</div>
            <div
              v-for="u in results.users.slice(0, 3)"
              :key="u.uuid"
              @click="goToProfile(u.uuid)"
              class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors"
            >
              <img :src="u.avatar || `https://www.gravatar.com/avatar/${u.uuid}?d=identicon`" class="w-7 h-7 rounded-full object-cover border border-slate-200" />
              <div class="min-w-0 flex-1">
                <div class="font-bold text-slate-900 truncate">{{ u.name }}</div>
                <div class="text-[10px] text-slate-500 truncate">{{ u.state_code || u.institution || 'Corper' }}</div>
              </div>
            </div>
          </div>

          <!-- Posts Section -->
          <div v-if="results.posts?.length" class="p-2">
            <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Posts</div>
            <div
              v-for="p in results.posts.slice(0, 3)"
              :key="p.uuid"
              @click="submitSearch"
              class="p-2 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors"
            >
              <div class="font-medium text-slate-800 line-clamp-1">{{ p.content }}</div>
              <div class="text-[10px] text-violet-600 mt-0.5">by {{ p.user?.name }}</div>
            </div>
          </div>

          <!-- Buzz Section -->
          <div v-if="results.buzz?.length" class="p-2">
            <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Buzz Stories</div>
            <div
              v-for="b in results.buzz.slice(0, 3)"
              :key="b.uuid"
              @click="openBuzz(b)"
              class="flex items-center gap-2 p-2 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors"
            >
              <span class="text-sm">🐝</span>
              <div class="font-medium text-slate-800 line-clamp-1 flex-1">{{ b.content }}</div>
            </div>
          </div>

          <!-- PPAs Section -->
          <div v-if="results.ppas?.length" class="p-2">
            <div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">PPAs</div>
            <div
              v-for="ppa in results.ppas.slice(0, 3)"
              :key="ppa.uuid"
              @click="goToPpa(ppa.uuid)"
              class="flex items-center justify-between p-2 rounded-xl hover:bg-violet-50 cursor-pointer transition-colors"
            >
              <div class="min-w-0 flex-1">
                <div class="font-bold text-slate-900 truncate">{{ ppa.name }}</div>
                <div class="text-[10px] text-slate-500 truncate">{{ ppa.lga || ppa.address }}</div>
              </div>
              <span class="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">PPA</span>
            </div>
          </div>

          <!-- See All Button -->
          <div @click="submitSearch" class="p-2.5 bg-slate-50 hover:bg-violet-600 hover:text-white text-violet-700 text-center font-bold cursor-pointer transition-all flex items-center justify-center gap-1">
            <span>See all results for "{{ query }}"</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

        </div>

        <!-- No Results -->
        <div v-else-if="query.trim()" class="p-4 text-center text-xs text-slate-400">
          No matches found for "{{ query }}"
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import searchApi from '@/api/search'

const router = useRouter()
const containerRef = ref(null)
const query = ref('')
const isFocused = ref(false)
const loading = ref(false)
const results = ref({})
let debounceTimer = null

const hasResults = computed(() => {
  return (results.value.users?.length || 0) > 0 ||
         (results.value.posts?.length || 0) > 0 ||
         (results.value.buzz?.length || 0) > 0 ||
         (results.value.ppas?.length || 0) > 0
})

const showDropdown = computed(() => {
  return isFocused.value && query.value.trim().length > 1
})

function onInput() {
  clearTimeout(debounceTimer)
  if (!query.value.trim() || query.value.trim().length <= 1) {
    results.value = {}
    return
  }

  loading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const res = await searchApi.globalSearch({ q: query.value, limit: 5 })
      results.value = res.data?.posts ? res.data : (res.data?.data || {})
    } catch (e) {
      console.error('Search preview error:', e)
    } finally {
      loading.value = false
    }
  }, 250)
}

function submitSearch() {
  if (!query.value.trim()) return
  isFocused.value = false
  router.push({ path: '/search', query: { q: query.value } })
}

function clear() {
  query.value = ''
  results.value = {}
}

function goToProfile(uuid) {
  isFocused.value = false
  router.push(`/user/${uuid}`)
}

function goToPpa(uuid) {
  isFocused.value = false
  router.push(`/ppa/${uuid}`)
}

function openBuzz(buzz) {
  isFocused.value = false
  if (!buzz) return
  if (buzz.type === 'video') {
    router.push({ path: '/buzzhives', query: { buzz: buzz.uuid } })
  } else {
    router.push({ path: '/feed', query: { buzz: buzz.uuid } })
  }
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    isFocused.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
