<template>
  <div
    :class="[
      'document-card-root group relative rounded-2xl overflow-hidden transition-all duration-200 border w-full max-w-[280px] sm:max-w-[320px] select-none',
      isMe
        ? 'bg-gradient-to-br from-amber-700/85 via-amber-800/90 to-amber-900/95 text-white border-amber-500/30 shadow-md'
        : 'bg-white text-slate-800 border-slate-200/80 shadow-sm hover:border-slate-300'
    ]"
  >
    <!-- Top Preview Banner Area -->
    <div
      class="relative h-20 w-full flex items-center justify-between px-4 overflow-hidden cursor-pointer"
      :class="[
        isMe ? 'bg-black/20' : 'bg-slate-100/80'
      ]"
      @click="triggerDownload"
    >
      <!-- Background Ambient Grid / Gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-r opacity-25 pointer-events-none"
        :class="theme.gradient"
      />

      <!-- Left File Format Emblem Badge -->
      <div class="relative z-10 flex items-center gap-3">
        <div
          :class="[
            'w-12 h-12 rounded-xl flex flex-col items-center justify-center font-extrabold shadow-sm transition-transform group-hover:scale-105',
            theme.bg,
            'text-white'
          ]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="mb-0.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span class="text-[9px] uppercase tracking-wider leading-none font-black">{{ extLabel }}</span>
        </div>

        <div class="flex flex-col">
          <span
            :class="[
              'text-[11px] font-bold uppercase tracking-wider',
              isMe ? 'text-amber-200' : theme.text
            ]"
          >
            {{ theme.label }}
          </span>
          <span :class="['text-[10px] font-medium', isMe ? 'text-amber-100/70' : 'text-slate-400']">
            {{ formattedSize }}
          </span>
        </div>
      </div>

      <!-- Right Emblem Graphic -->
      <div class="relative z-10 opacity-15 text-current">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      </div>
    </div>

    <!-- Bottom File Meta Strip & Download Action -->
    <div class="p-3 flex items-center justify-between gap-3 border-t" :class="[isMe ? 'border-amber-600/30' : 'border-slate-100']">
      <div class="min-w-0 flex-1">
        <p
          :class="['text-xs font-bold truncate leading-tight', isMe ? 'text-white' : 'text-slate-800']"
          :title="fileName || 'Document'"
        >
          {{ fileName || 'Document' }}
        </p>
        <p :class="['text-[10px] font-medium mt-0.5', isMe ? 'text-amber-200/80' : 'text-slate-500']">
          <template v-if="isUploading">
            <span class="animate-pulse">Uploading file…</span>
          </template>
          <template v-else-if="isDownloading">
            <span class="animate-pulse">Downloading file…</span>
          </template>
          <template v-else-if="downloadSuccess">
            <span class="text-emerald-400 font-semibold">✓ Saved to Downloads</span>
          </template>
          <template v-else>
            Tap to download
          </template>
        </p>
      </div>

      <!-- Download Action Button -->
      <button
        type="button"
        :disabled="isUploading || isDownloading"
        @click.stop="triggerDownload"
        :class="[
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-90',
          isMe
            ? 'bg-amber-600/50 hover:bg-amber-600/80 text-white'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
        ]"
        :title="downloadSuccess ? 'Downloaded' : 'Download file'"
      >
        <!-- Loading Spinner -->
        <svg v-if="isDownloading || isUploading" class="w-4 h-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>

        <!-- Success Checkmark -->
        <svg v-else-if="downloadSuccess" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>

        <!-- Download Arrow Icon -->
        <svg v-else class="w-4 h-4 text-current transition-transform group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import client, { getApiBaseUrl } from '@/api/client'

const props = defineProps({
  url:         { type: String,  required: true },
  fileName:    { type: String,  default: 'Document' },
  fileSize:    { type: [Number, String], default: 0 },
  isMe:        { type: Boolean, default: false },
  isUploading: { type: Boolean, default: false },
})

const isDownloading = ref(false)
const downloadSuccess = ref(false)

// Extract extension (e.g., pdf, docx, txt)
const ext = computed(() => {
  const name = props.fileName || props.url || ''
  const parts = name.split('.')
  if (parts.length > 1) {
    return parts.pop().toLowerCase().trim()
  }
  return 'doc'
})

const extLabel = computed(() => {
  const e = ext.value
  if (e.length <= 4) return e.toUpperCase()
  return e.slice(0, 4).toUpperCase()
})

const THEMES = {
  pdf: {
    bg: 'bg-rose-500',
    text: 'text-rose-600',
    gradient: 'from-rose-500/30 to-rose-600/5',
    label: 'PDF Document'
  },
  doc: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    gradient: 'from-blue-600/30 to-blue-700/5',
    label: 'Word Document'
  },
  docx: {
    bg: 'bg-blue-600',
    text: 'text-blue-600',
    gradient: 'from-blue-600/30 to-blue-700/5',
    label: 'Word Document'
  },
  xls: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    gradient: 'from-emerald-600/30 to-emerald-700/5',
    label: 'Spreadsheet'
  },
  xlsx: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    gradient: 'from-emerald-600/30 to-emerald-700/5',
    label: 'Spreadsheet'
  },
  csv: {
    bg: 'bg-emerald-600',
    text: 'text-emerald-600',
    gradient: 'from-emerald-600/30 to-emerald-700/5',
    label: 'CSV Data'
  },
  ppt: {
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    gradient: 'from-orange-500/30 to-orange-600/5',
    label: 'Presentation'
  },
  pptx: {
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    gradient: 'from-orange-500/30 to-orange-600/5',
    label: 'Presentation'
  },
  zip: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    gradient: 'from-purple-600/30 to-purple-700/5',
    label: 'Archive File'
  },
  rar: {
    bg: 'bg-purple-600',
    text: 'text-purple-600',
    gradient: 'from-purple-600/30 to-purple-700/5',
    label: 'Archive File'
  },
  txt: {
    bg: 'bg-slate-600',
    text: 'text-slate-600',
    gradient: 'from-slate-600/30 to-slate-700/5',
    label: 'Text Document'
  },
}

const theme = computed(() => {
  return THEMES[ext.value] || {
    bg: 'bg-amber-600',
    text: 'text-amber-600',
    gradient: 'from-amber-600/30 to-amber-700/5',
    label: 'Document'
  }
})

const formattedSize = computed(() => {
  const bytes = Number(props.fileSize) || 0
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
})

async function triggerDownload() {
  if (props.isUploading || isDownloading.value || !props.url) return
  isDownloading.value = true

  try {
    let blob
    // 1. Primary: Backend API proxy endpoint /messages/download?url=...&filename=...
    // The Axios interceptor returns response.data directly (which is a Blob when responseType is 'blob')
    try {
      const resData = await client.get('/messages/download', {
        params: { url: props.url, filename: props.fileName },
        responseType: 'blob'
      })
      if (resData instanceof Blob) {
        blob = resData
      } else {
        blob = new Blob([resData], { type: 'application/octet-stream' })
      }
    } catch (apiErr) {
      console.warn('[DocumentMessageCard] API download proxy failed, trying direct blob fetch:', apiErr)
      // 2. Direct fetch fallback (for same-origin or CORS-enabled URLs)
      const response = await fetch(props.url, { mode: 'cors' })
      if (!response.ok) throw new Error('Fetch failed with status ' + response.status)
      blob = await response.blob()
    }

    // 3. Create local blob URL (same-origin with app domain)
    // Same-origin blob URLs ALWAYS enforce silent file download without opening browser tabs
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = blobUrl
    link.download = props.fileName || 'document'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 3000)

    downloadSuccess.value = true
    setTimeout(() => { downloadSuccess.value = false }, 3000)
  } catch (err) {
    console.warn('[DocumentMessageCard] All blob download attempts failed, using backend proxy download link:', err)
    // 4. Fallback: Absolute URL to backend download proxy endpoint
    try {
      const apiBase = getApiBaseUrl()
      const token = localStorage.getItem('kb_token') || ''
      const proxyUrl = `${apiBase}/messages/download?url=${encodeURIComponent(props.url)}&filename=${encodeURIComponent(props.fileName || 'document')}${token ? '&token=' + encodeURIComponent(token) : ''}`
      
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = proxyUrl
      document.body.appendChild(iframe)
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe)
        }
      }, 10000)
      downloadSuccess.value = true
      setTimeout(() => { downloadSuccess.value = false }, 3000)
    } catch (fallbackErr) {
      console.error('[DocumentMessageCard] Download fallback failed:', fallbackErr)
    }
  } finally {
    isDownloading.value = false
  }
}
</script>
