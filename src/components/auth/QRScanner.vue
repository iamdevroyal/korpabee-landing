<template>
  <div class="flex flex-col items-center w-full">
    <!-- Scanner Card -->
    <div class="w-full bg-white/80 backdrop-blur-xl border border-[#e9e5f5] rounded-3xl overflow-hidden shadow-xl shadow-[#3c0ca0]/8 relative">

      <!-- Top gradient strip -->
      <div class="h-1 w-full bg-gradient-to-r from-[#3c0ca0] via-[#5925a2] to-[#aca064]"></div>

      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 bg-[#3c0ca0]/8 border border-[#3c0ca0]/15 rounded-xl flex items-center justify-center text-[#3c0ca0] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-black text-[#1f1635]">Scan NYSC ID QR Code</h3>
            <p class="text-[10px] text-[#1f1635]/50 font-medium">Point camera at the QR on the back of your ID card</p>
          </div>
        </div>

        <!-- Camera Error Alert -->
        <div v-if="error" class="mb-4 p-3.5 bg-rose-500/8 border border-rose-500/20 text-rose-600 text-xs rounded-xl flex items-start gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 shrink-0 mt-0.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p class="font-bold">Camera Error</p>
            <p class="opacity-90 mt-0.5">{{ error }}</p>
          </div>
        </div>

        <!-- Service Stream Selector -->
        <div class="mb-4">
          <label for="stream-select" class="block text-xs font-bold text-[#1f1635] uppercase tracking-wider mb-2">Select Service Stream</label>
          <select
            id="stream-select"
            v-model="serviceStream"
            class="w-full bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] text-xs font-medium px-4 py-3 rounded-xl focus:outline-none focus:border-[#3c0ca0] focus:bg-white transition-all"
          >
            <option value="1">Stream 1</option>
            <option value="2">Stream 2</option>
          </select>
        </div>


        <!-- Scanner Viewport -->
        <div class="relative mx-auto w-full aspect-square max-w-[280px] bg-[#1f1635] rounded-2xl overflow-hidden shadow-inner border border-[#3c0ca0]/20">

          <!-- Active QR Stream -->
          <qrcode-stream
            v-if="active"
            @detect="onDetect"
            @error="onError"
            @camera-on="onCameraOn"
            class="w-full h-full object-cover"
          />

          <!-- Overlay frame with brackets -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
            <!-- Dark vignette border -->
            <div class="absolute inset-0 border-[28px] border-[#1f1635]/70"></div>

            <!-- Target reticle -->
            <div class="relative w-[160px] h-[160px]">
              <!-- Corner brackets -->
              <div class="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-[#3c0ca0] rounded-tl-lg"></div>
              <div class="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-[#3c0ca0] rounded-tr-lg"></div>
              <div class="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-[#3c0ca0] rounded-bl-lg"></div>
              <div class="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-[#3c0ca0] rounded-br-lg"></div>

              <!-- Scan laser line -->
              <div v-if="active && !loading" class="scanner-laser absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#3c0ca0] to-transparent rounded-full shadow-[0_0_10px_2px_rgba(60,12,160,0.6)]"></div>
            </div>
          </div>

          <!-- Initializing overlay -->
          <div v-if="loading && active" class="absolute inset-0 bg-[#1f1635]/90 flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-2 border-[#3c0ca0]/30 border-t-[#3c0ca0] rounded-full animate-spin"></div>
            <span class="text-[11px] text-white/60 font-medium">Starting camera...</span>
          </div>

          <!-- Camera Off state -->
          <div v-if="!active" class="absolute inset-0 flex flex-col items-center justify-center p-6 gap-3 bg-[#1f1635]">
            <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-white/40">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <p class="text-white/50 text-xs font-medium text-center">Camera is off</p>
            <button
              @click="active = true; loading = true"
              class="bg-[#3c0ca0] hover:bg-[#2d0979] text-white text-xs font-bold px-5 py-2 rounded-xl transition-all active:scale-95"
            >
              Start Camera
            </button>
          </div>
        </div>

        <!-- Controls Row -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-[#e9e5f5]">
          <button
            v-if="active"
            @click="active = false"
            class="text-[11px] font-bold text-[#1f1635]/40 hover:text-rose-500 transition-colors flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Stop Camera
          </button>
          <span v-else class="text-[11px] text-[#1f1635]/30 font-medium">Camera stopped</span>

          <button
            @click="toggleMode"
            class="text-[11px] font-extrabold text-[#3c0ca0] hover:text-[#2d0979] transition-colors flex items-center gap-1.5 uppercase tracking-wider"
          >
            <svg v-if="!manualMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            {{ manualMode ? 'Use Scanner' : 'Paste URL' }}
          </button>
        </div>

        <!-- Manual URL input -->
        <!-- <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="manualMode" class="mt-4 space-y-2">
            <label class="block text-[10px] font-black text-[#1f1635] uppercase tracking-wider">NYSC Verification URL</label>
            <div class="flex gap-2">
              <input
                type="text"
                v-model="manualUrl"
                placeholder="https://mgt.nysc.org.ng/..."
                class="flex-1 bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] placeholder-[#1f1635]/25 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#3c0ca0] focus:bg-white transition-all"
              />
              <button
                @click="handleManualSubmit"
                :disabled="!manualUrl"
                class="bg-[#3c0ca0] disabled:opacity-40 hover:bg-[#2d0979] text-white font-bold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 shrink-0"
              >
                Verify
              </button>
            </div>
            <p class="text-[10px] text-[#1f1635]/40">Paste the URL encoded in the QR code of your NYSC ID card</p>
          </div>
        </Transition> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'

const emit = defineEmits(['scan'])

const active = ref(true)
const loading = ref(true)
const error = ref('')
const manualMode = ref(false)
const manualUrl = ref('')
const serviceStream = ref('1')

const toggleMode = () => {
  manualMode.value = !manualMode.value
  if (manualMode.value) {
    active.value = false
  } else {
    active.value = true
    loading.value = true
  }
}

const onCameraOn = () => {
  loading.value = false
  error.value = ''
}

const onDetect = (detectedCodes) => {
  let url = ''
  if (Array.isArray(detectedCodes)) {
    url = detectedCodes[0]?.rawValue || ''
  } else if (detectedCodes && typeof detectedCodes === 'object') {
    url = detectedCodes.rawValue || detectedCodes.content || ''
  } else {
    url = detectedCodes || ''
  }
  if (url) {
    active.value = false
    emit('scan', { url, stream: serviceStream.value })
  }
}

const onError = (err) => {
  loading.value = false
  if (err.name === 'NotAllowedError') {
    error.value = 'Camera access denied. Allow camera permission in your browser settings.'
  } else if (err.name === 'NotFoundError') {
    error.value = 'No camera detected on this device.'
  } else if (err.name === 'NotSupportedError') {
    error.value = 'HTTPS is required to access the camera.'
  } else if (err.name === 'NotReadableError') {
    error.value = 'Camera is in use by another application.'
  } else {
    error.value = err.message || 'Unable to access device camera.'
  }
}

const handleManualSubmit = () => {
  if (manualUrl.value) emit('scan', { url: manualUrl.value.trim(), stream: serviceStream.value })
}
</script>

<style scoped>
.scanner-laser {
  animation: scanLaser 2s ease-in-out infinite;
  top: 10%;
}

@keyframes scanLaser {
  0%, 100% { top: 10%; opacity: 0.8; }
  50% { top: 85%; opacity: 1; }
}
</style>
