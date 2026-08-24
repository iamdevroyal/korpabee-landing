<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 text-slate-100">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col">
      <!-- Modal Header -->
      <div class="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-purple-400" />
            <span>KorpaVerified Identity KYC</span>
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">Complete verification to unlock KorpaVerified privileges.</p>
        </div>
        <button @click="close" class="text-slate-400 hover:text-white transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Stepper Progress Bar -->
      <div class="px-6 pt-4 pb-2 border-b border-slate-800/50 bg-slate-950/40">
        <div class="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span :class="{ 'text-purple-400 font-bold': currentStep === 1 }">1. ID Details</span>
          <span :class="{ 'text-purple-400 font-bold': currentStep === 2 }">2. Document</span>
          <span :class="{ 'text-purple-400 font-bold': currentStep === 3 }">3. Live Selfie</span>
          <span :class="{ 'text-purple-400 font-bold': currentStep === 4 }">4. Complete</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300" :style="{ width: `${(currentStep / 4) * 100}%` }"></div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 flex-1 overflow-y-auto space-y-5">
        <!-- STEP 1: ID Details -->
        <div v-if="currentStep === 1" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Select Means of Identification</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                type="button"
                v-for="type in idTypes"
                :key="type.value"
                @click="form.id_type = type.value"
                class="p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all"
                :class="form.id_type === type.value ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'"
              >
                <component :is="type.icon" class="w-5 h-5" />
                <span>{{ type.label }}</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">ID Document Number</label>
            <input
              type="text"
              v-model="form.id_number"
              placeholder="e.g. 12345678901"
              required
              class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <!-- STEP 2: Document Upload -->
        <div v-if="currentStep === 2" class="space-y-4">
          <label class="block text-xs font-semibold text-slate-300">Upload Front Photo of Your ID Card</label>
          <div
            @click="$refs.docInput.click()"
            class="border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-800/40 hover:bg-slate-800/70 transition-all"
          >
            <input ref="docInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleDocSelect" />
            <div v-if="!docPreview" class="space-y-2 text-slate-400">
              <UploadCloud class="w-10 h-10 text-purple-400 mx-auto" />
              <p class="text-sm font-semibold text-white">Click or drag file to upload ID Document</p>
              <p class="text-xs">Supports JPG, PNG, WEBP or PDF (max 10MB)</p>
            </div>
            <div v-else class="space-y-2">
              <img :src="docPreview" class="max-h-40 mx-auto rounded-xl border border-slate-700 object-contain" />
              <p class="text-xs text-purple-300 font-semibold">{{ docFile?.name }}</p>
              <span class="text-[10px] text-slate-400 underline">Click to change photo</span>
            </div>
          </div>
        </div>

        <!-- STEP 3: Live Selfie Capture -->
        <div v-if="currentStep === 3" class="space-y-4">
          <label class="block text-xs font-semibold text-slate-300">Take a Live Selfie Photo</label>
          
          <div class="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
            <video v-show="!selfiePreview" ref="videoRef" autoplay playsinline class="w-full h-full object-cover transform -scale-x-100"></video>
            <canvas ref="canvasRef" class="hidden"></canvas>

            <img v-if="selfiePreview" :src="selfiePreview" class="w-full h-full object-cover" />

            <div v-if="cameraError" class="p-4 text-center text-red-400 text-xs bg-red-500/10">
              {{ cameraError }}
            </div>
          </div>

          <div class="flex items-center justify-center gap-3">
            <button
              v-if="!selfiePreview"
              type="button"
              @click="captureSelfie"
              class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Camera class="w-4 h-4" />
              <span>Capture Selfie Photo</span>
            </button>

            <button
              v-else
              type="button"
              @click="retakeSelfie"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-2"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>
          </div>
        </div>

        <!-- STEP 4: Complete / Pending Review -->
        <div v-if="currentStep === 4" class="text-center py-6 space-y-4">
          <div class="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-10 h-10" />
          </div>
          <h4 class="text-white font-bold text-lg">KYC Submission Received!</h4>
          <p class="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
            Your identification documents and selfie have been uploaded and submitted for Admin verification. Your KorpaVerified status will activate immediately upon approval.
          </p>
        </div>

        <div v-if="errorMessage" class="p-3 rounded-xl text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          {{ errorMessage }}
        </div>
      </div>

      <!-- Modal Footer Controls -->
      <div v-if="currentStep < 4" class="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
        <button
          type="button"
          @click="prevStep"
          :disabled="currentStep === 1"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40"
        >
          Back
        </button>

        <button
          v-if="currentStep < 3"
          type="button"
          @click="nextStep"
          :disabled="!canProceed"
          class="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-md"
        >
          Continue
        </button>

        <button
          v-else-if="currentStep === 3"
          type="button"
          @click="submitForm"
          :disabled="!selfieFile || submitting"
          class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-purple-600/30"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
          <span>{{ submitting ? 'Uploading & Submitting…' : 'Submit Verification' }}</span>
        </button>
      </div>

      <div v-else class="px-6 py-4 border-t border-slate-800 text-right">
        <button @click="close" class="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted, nextTick } from 'vue'
import {
  ShieldCheck, X, CreditCard, FileText, UserCheck,
  UploadCloud, Camera, RefreshCw, CheckCircle2, Loader2
} from 'lucide-vue-next'
import { submitKyc } from '@/api/kyc'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submitted'])

const currentStep   = ref(1)
const docFile       = ref(null)
const docPreview    = ref(null)
const selfieFile    = ref(null)
const selfiePreview = ref(null)
const videoRef      = ref(null)
const canvasRef     = ref(null)
const cameraStream  = ref(null)
const cameraError   = ref('')
const submitting    = ref(false)
const errorMessage  = ref('')

const idTypes = [
  { value: 'nin',             label: 'NIN Slip',        icon: FileText },
  { value: 'voters_card',     label: "Voter's Card",    icon: CreditCard },
  { value: 'drivers_license', label: "Driver's License",icon: UserCheck },
]

const form = reactive({
  entity_type: 'corper',
  id_type: 'nin',
  id_number: '',
})

const canProceed = computed(() => {
  if (currentStep.value === 1) return form.id_number.trim().length > 3
  if (currentStep.value === 2) return !!docFile.value
  return true
})

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
    if (currentStep.value === 3) {
      nextTick(() => startCamera())
    }
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    if (currentStep.value === 3) stopCamera()
    currentStep.value--
  }
}

function handleDocSelect(e) {
  const file = e.target.files?.[0]
  if (file) {
    docFile.value = file
    if (file.type.startsWith('image/')) {
      docPreview.value = URL.createObjectURL(file)
    } else {
      docPreview.value = null
    }
  }
}

async function startCamera() {
  cameraError.value = ''
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    cameraStream.value = stream
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (err) {
    cameraError.value = 'Camera permission denied or camera unavailable.'
  }
}

function stopCamera() {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
}

function captureSelfie() {
  if (!videoRef.value || !canvasRef.value) return
  const video = videoRef.value
  const canvas = canvasRef.value
  canvas.width = video.videoWidth || 640
  canvas.height = video.videoHeight || 480
  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    if (blob) {
      selfieFile.value = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
      selfiePreview.value = URL.createObjectURL(blob)
      stopCamera()
    }
  }, 'image/jpeg', 0.9)
}

function retakeSelfie() {
  selfiePreview.value = null
  selfieFile.value = null
  startCamera()
}

async function submitForm() {
  if (!docFile.value || !selfieFile.value) return

  submitting.value   = true
  errorMessage.value = ''

  const formData = new FormData()
  formData.append('entity_type', 'corper')
  formData.append('id_type', form.id_type)
  formData.append('id_number', form.id_number)
  formData.append('id_document', docFile.value)
  formData.append('selfie', selfieFile.value)

  try {
    await submitKyc(formData)
    currentStep.value = 4
    emit('submitted')
  } catch (err) {
    errorMessage.value = err?.response?.data?.message ?? 'Failed to submit KYC documents.'
  } finally {
    submitting.value = false
  }
}

function close() {
  stopCamera()
  emit('close')
}

onUnmounted(() => {
  stopCamera()
})
</script>
