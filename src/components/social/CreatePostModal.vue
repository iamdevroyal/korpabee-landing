<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div @click="close" class="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-navy-100/50 transform transition-all flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-navy-50 flex items-center justify-between">
        <h3 class="text-lg font-bold text-navy-900 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Create Post</span>
        </h3>
        <button @click="close" class="text-gray-400 hover:text-navy-900 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="submit" class="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        <!-- User Row -->
        <div class="flex items-center space-x-3 mb-2">
          <img
            :src="user?.avatar || 'https://via.placeholder.com/150'"
            class="w-10 h-10 rounded-full border border-navy-100 object-cover"
            alt="Avatar"
          />
          <div>
            <h4 class="text-sm font-bold text-navy-900">{{ user?.name }}</h4>
            <!-- Visibility Dropdown -->
            <div class="relative inline-block mt-0.5">
              <select
                v-model="visibility"
                class="block w-full pl-2 pr-8 py-0.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200/50 rounded-full appearance-none focus:outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
              >
                <option value="public">Global Feed</option>
                <option value="state">State Feed</option>
                <option value="platoon">Platoon Feed</option>
                <option value="batch">Batch Feed</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
                <svg class="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Post Content Textarea -->
        <textarea
          v-model="content"
          placeholder="Share something with your fellow Corpers... #nysc #korpabee"
          rows="4"
          required
          class="w-full border-0 focus:ring-0 p-0 text-navy-900 placeholder-gray-400 focus:outline-none text-sm resize-none"
        ></textarea>

        <!-- Image Uploader -->
        <div class="pt-2">
          <ImageUploader ref="uploader" :multiple="true" @change="onFilesChange" />
        </div>
      </form>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-navy-50 bg-gray-50 flex justify-end space-x-3">
        <button
          @click="close"
          type="button"
          class="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-150 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          @click="submit"
          :disabled="loading || (!content.trim() && uploadedFiles.length === 0)"
          class="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all rounded-xl shadow-lg shadow-indigo-500/10 flex items-center space-x-1.5"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ loading ? 'Posting...' : 'Post' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useFeed } from '@/composables/useFeed'
import ImageUploader from '@/components/common/ImageUploader.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

const { user } = useAuth()
const { createPost } = useFeed()

const content = ref('')
const visibility = ref('public')
const uploadedFiles = ref([])
const loading = ref(false)
const uploader = ref(null)

const close = () => {
  content.value = ''
  visibility.value = 'public'
  uploadedFiles.value = []
  if (uploader.value) uploader.value.clear()
  emit('close')
}

const onFilesChange = (files) => {
  uploadedFiles.value = Array.isArray(files) ? files : (files ? [files] : [])
}

const submit = () => {
  if (!content.value.trim() && uploadedFiles.value.length === 0) return

  const formData = new FormData()
  formData.append('content', content.value)
  formData.append('visibility', visibility.value)

  uploadedFiles.value.forEach((file) => {
    formData.append('media[]', file)
  })

  let type = 'text'
  if (uploadedFiles.value.length > 0) {
    const firstFile = uploadedFiles.value[0]
    if (firstFile.type.startsWith('image/')) type = 'image'
    else if (firstFile.type.startsWith('video/')) type = 'video'
    else type = 'file'
  }
  formData.append('type', type)

  createPost(formData)  // fire and forget — no await
  close()               // modal closes instantly
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
