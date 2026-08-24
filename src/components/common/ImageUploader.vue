<template>
  <div class="space-y-4">
    <!-- Drag and drop zone -->
    <div
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      :class="[
        'border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[140px]',
        isDragging
          ? 'border-teal-500 bg-teal-500/5 scale-[0.99]'
          : 'border-navy-100 hover:border-teal-400 bg-gray-50/50 hover:bg-white'
      ]"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        @change="onFileSelect"
        :multiple="multiple"
        :accept="accept"
        class="hidden"
      />
      
      <div class="p-3 bg-white rounded-xl shadow-sm border border-navy-50 text-navy-500 mb-3 group-hover:text-teal-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <p class="text-sm font-semibold text-navy-900">
        Drag & drop your files here or <span class="text-indigo-600 hover:underline">browse</span>
      </p>
      <p class="text-xs text-gray-400 mt-1">
        Supports JPG, PNG, WEBP, GIF, MP4, PDF up to 50MB
      </p>
    </div>

    <!-- Preview items grid -->
    <div v-if="previews.length > 0" class="grid grid-cols-3 gap-3">
      <div
        v-for="(preview, index) in previews"
        :key="index"
        class="relative aspect-square rounded-xl overflow-hidden border border-navy-100/30 group shadow-sm bg-navy-950"
      >
        <img
          v-if="preview.type.startsWith('image/')"
          :src="preview.url"
          class="w-full h-full object-cover"
        />
        <video
          v-else-if="preview.type.startsWith('video/')"
          :src="preview.url"
          class="w-full h-full object-cover"
          muted
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center p-2 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gold-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs text-gray-300 truncate w-full font-medium">{{ preview.name }}</span>
        </div>

        <!-- Remove button -->
        <button
          @click.stop="removeFile(index)"
          class="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*,video/*'
  }
})

const emit = defineEmits(['change'])

const isDragging = ref(false)
const fileInput = ref(null)
const files = ref([])
const previews = ref([])

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFiles = (selectedFiles) => {
  const newFiles = Array.from(selectedFiles)
  
  if (props.multiple) {
    files.value = [...files.value, ...newFiles]
  } else {
    // Revoke old object URLs to avoid memory leaks
    previews.value.forEach(p => URL.revokeObjectURL(p.url))
    files.value = newFiles.slice(0, 1)
  }

  // Create preview object URLs
  const newPreviews = newFiles.map(file => ({
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file)
  }))

  if (props.multiple) {
    previews.value = [...previews.value, ...newPreviews]
  } else {
    previews.value = newPreviews.slice(0, 1)
  }

  emit('change', props.multiple ? files.value : files.value[0])
}

const onFileSelect = (event) => {
  if (event.target.files.length > 0) {
    handleFiles(event.target.files)
  }
}

const onDrop = (event) => {
  isDragging.value = false
  if (event.dataTransfer.files.length > 0) {
    handleFiles(event.dataTransfer.files)
  }
}

const removeFile = (index) => {
  URL.revokeObjectURL(previews.value[index].url)
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
  emit('change', props.multiple ? files.value : (files.value[0] || null))
}

const clear = () => {
  previews.value.forEach(p => URL.revokeObjectURL(p.url))
  previews.value = []
  files.value = []
  emit('change', props.multiple ? [] : null) // ✅ sync parent state
}

defineExpose({
  clear
})
</script>
