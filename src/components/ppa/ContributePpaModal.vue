<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <div class="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-slate-100 max-h-[90vh] flex flex-col">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
            <div>
              <h3 class="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                <span>Add Your PPA Details</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">+15 Points</span>
              </h3>
              <p class="text-slate-400 text-xs mt-0.5">Fill out your organization details and experience to help fellow corpers.</p>
            </div>
            <button @click="close" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
              ✕
            </button>
          </div>

          <!-- Form Scroll Container -->
          <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            
            <!-- Error Alert -->
            <div v-if="formError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {{ formError }}
            </div>

            <!-- SECTION 1: PPA INFO -->
            <div class="space-y-3">
              <h4 class="text-violet-400 text-xs font-bold uppercase tracking-wider">1. Organization Details</h4>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Organization / Company Name *</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="e.g. Government Secondary School, Ikeja"
                  class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    v-model="form.category_id"
                    required
                    class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="" disabled>Select Category</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Deployment State *</label>
                  <select
                    v-model="form.state_id"
                    required
                    class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="" disabled>Select State</option>
                    <option v-for="s in states" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">LGA Location *</label>
                  <input
                    v-model="form.lga"
                    type="text"
                    required
                    placeholder="e.g. Ikeja"
                    class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label class="block text-xs font-medium text-slate-300 mb-1">Industry / Role Type</label>
                  <input
                    v-model="form.industry_type"
                    type="text"
                    placeholder="e.g. Education, IT Intern, Admin"
                    class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Full Office Address *</label>
                <input
                  v-model="form.address"
                  type="text"
                  required
                  placeholder="e.g. 12 Allen Avenue, Ikeja, Lagos"
                  class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Brief Description</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  placeholder="Tell us what this organization does..."
                  class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                ></textarea>
              </div>
            </div>

            <!-- SECTION 2: EXPERIENCE & REVIEW -->
            <div class="space-y-3 pt-3 border-t border-slate-800">
              <h4 class="text-violet-400 text-xs font-bold uppercase tracking-wider">2. Your Experience & Review</h4>

              <!-- Star Ratings -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Overall Rating *</label>
                  <div class="flex gap-1 text-amber-400">
                    <span
                      v-for="star in 5"
                      :key="star"
                      @click="form.rating = star"
                      class="cursor-pointer text-lg hover:scale-110 transition-transform"
                    >
                      {{ star <= form.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Workload Rating</label>
                  <div class="flex gap-1 text-blue-400">
                    <span
                      v-for="star in 5"
                      :key="star"
                      @click="form.workload_rating = star"
                      class="cursor-pointer text-lg hover:scale-110 transition-transform"
                    >
                      {{ star <= form.workload_rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Welfare Rating</label>
                  <div class="flex gap-1 text-emerald-400">
                    <span
                      v-for="star in 5"
                      :key="star"
                      @click="form.welfare_rating = star"
                      class="cursor-pointer text-lg hover:scale-110 transition-transform"
                    >
                      {{ star <= form.welfare_rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Monthly Stipend -->
              <div>
                <label class="block text-xs font-medium text-slate-300 mb-1">Monthly Allowance / Stipend (₦)</label>
                <input
                  v-model.number="form.salary"
                  type="number"
                  min="0"
                  placeholder="e.g. 30000"
                  class="w-full bg-slate-800 border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <!-- Pros & Cons -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-emerald-400 mb-1">👍 Pros / Good Things</label>
                  <textarea
                    v-model="form.pros"
                    rows="2"
                    placeholder="Good working environment, prompt stipend..."
                    class="w-full bg-slate-800 border border-slate-700 focus:border-emerald-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-xs font-medium text-rose-400 mb-1">👎 Cons / Challenges</label>
                  <textarea
                    v-model="form.cons"
                    rows="2"
                    placeholder="Long work hours, distance..."
                    class="w-full bg-slate-800 border border-slate-700 focus:border-rose-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <!-- Anonymous Toggle -->
              <div class="flex items-center gap-2 pt-1">
                <input
                  id="anon-check"
                  v-model="form.is_anonymous"
                  type="checkbox"
                  class="w-4 h-4 accent-violet-600 rounded cursor-pointer"
                />
                <label for="anon-check" class="text-xs text-slate-300 cursor-pointer">
                  Post review anonymously (your name won't be displayed on the review)
                </label>
              </div>

            </div>

            <!-- Submit Footer -->
            <div class="pt-3 border-t border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                @click="close"
                class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2"
              >
                <span v-if="!submitting">Submit PPA Details</span>
                <span v-else class="flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving...</span>
                </span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePPAStore } from '@/stores/ppa'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  isOpen:     { type: Boolean, default: false },
  categories: { type: Array,   default: () => [] },
  states:     { type: Array,   default: () => [] },
})

const emit = defineEmits(['close', 'submitted'])

const ppaStore   = usePPAStore()
const { user }   = useAuth()

const submitting = ref(false)
const formError  = ref(null)

const form = reactive({
  name:            '',
  description:     '',
  category_id:     '',
  state_id:        user.value?.corper_profile?.state_id || '',
  lga:             '',
  address:         '',
  industry_type:   '',
  rating:          5,
  workload_rating: 4,
  welfare_rating:  4,
  salary:          null,
  pros:            '',
  cons:            '',
  is_anonymous:    false,
})

function close() {
  emit('close')
}

async function handleSubmit() {
  if (!form.name || !form.category_id || !form.state_id || !form.lga || !form.address) {
    formError.value = 'Please complete all required fields.'
    return
  }

  submitting.value = true
  formError.value  = null

  try {
    const newPpa = await ppaStore.contributePPA({ ...form })
    if (user.value?.corper_profile) {
      user.value.corper_profile.ppa_id = newPpa.id
      user.value.corper_profile.ppa    = newPpa
    }
    emit('submitted', newPpa)
    close()
  } catch (err) {
    formError.value = err.response?.data?.message || 'Failed to submit PPA details. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
