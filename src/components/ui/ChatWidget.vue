<template>
  <div>
    <!-- Chat Window -->
    <transition name="slide-up">
      <div 
        v-if="isOpen" 
        class="chat-window-card flex flex-col overflow-hidden bg-[#fff] border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl"
      >
        <!-- Header -->
        <div class="px-4 py-3.5 border-b border-border/70 bg-gradient-to-r from-violet-600/15 via-[#6C5CE7]/10 to-indigo-600/15 flex items-center justify-between backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#4B3BC6] flex items-center justify-center p-0.5 shadow-md shadow-violet-500/25 ring-2 ring-violet-400/20">
              <img src="/korpa-cartoon.png" alt="Korpa" class="w-6 h-6 object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-bold text-text-heading text-sm tracking-tight">Korpa AI</h3>
                <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-[#6C5CE7]/15 text-[#6C5CE7] rounded-full border border-[#6C5CE7]/20">Assistant</span>
              </div>
              <p class="text-xs text-text-muted flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online & Ready
              </p>
            </div>
          </div>
          <button @click="isOpen = false" class="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-all">
            <XIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Messages Area -->
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          <!-- Welcome Message -->
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7]/20 to-violet-500/20 flex-shrink-0 flex items-center justify-center border border-[#6C5CE7]/30 mt-1 shadow-sm">
              <img src="/korpa-cartoon.png" alt="Korpa" class="w-5 h-5" />
            </div>
            <div class="bg-surface/90 border border-border/80 rounded-2xl rounded-tl-none p-3.5 text-sm text-text max-w-[85%] shadow-sm leading-relaxed">
              <p>Hi there! 👋 I'm <strong>Korpa</strong>, your intelligent KorpaBee assistant. Ask me anything about your PPA, allawee tracker, wallet, CDS meetings, jobs, or housing!</p>
            </div>
          </div>

          <!-- Dynamic Messages -->
          <div v-for="msg in messages" :key="msg.id" class="flex gap-3" :class="msg.sender === 'user' ? 'flex-row-reverse' : ''">
            <!-- Avatar for Bot -->
            <div v-if="msg.sender === 'bot'" class="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7]/20 to-violet-500/20 flex-shrink-0 flex items-center justify-center border border-[#6C5CE7]/30 mt-1 shadow-sm">
              <img src="/korpa-cartoon.png" alt="Korpa" class="w-5 h-5" />
            </div>
            
            <!-- Message Bubble -->
            <div :class="[
              'p-3.5 text-sm max-w-[85%] shadow-sm break-words leading-relaxed',
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-[#6C5CE7] to-[#5548D9] text-white rounded-2xl rounded-tr-none shadow-md shadow-violet-500/20 font-medium' 
                : 'bg-surface/90 border border-border/80 text-text rounded-2xl rounded-tl-none'
            ]">
              <div v-html="formatMarkdown(msg.text)"></div>
            </div>
          </div>

          <!-- Dynamic Thinking Status Ticker -->
          <div v-if="isTyping" class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5CE7]/20 to-violet-500/20 flex-shrink-0 flex items-center justify-center border border-[#6C5CE7]/30 mt-1 shadow-sm">
              <img src="/korpa-cartoon.png" alt="Korpa" class="w-5 h-5 animate-pulse" />
            </div>
            <div class="bg-surface/90 border border-border/80 rounded-2xl rounded-tl-none p-3.5 text-sm text-text max-w-[85%] shadow-sm flex items-center gap-2">
              <span class="text-xs text-text-muted font-semibold tracking-wide transition-all duration-300">{{ thinkingStatus }}</span>
              <div class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style="animation-delay: 0.15s"></div>
                <div class="w-1.5 h-1.5 bg-[#6C5CE7] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Questions (Chips) -->
        <div class="p-3.5 border-t border-border/70 bg-surface/60 backdrop-blur-md">
          <div 
            ref="questionsContainer"
            class="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar"
            @mouseenter="isPaused = true"
            @mouseleave="isPaused = false"
            @touchstart="isPaused = true"
            @touchend="isPaused = false"
          >
            <button 
              v-for="(q, idx) in displayQuestions" 
              :key="`${q.id}-${idx}`"
              @click="askQuestion(q)"
              :disabled="isTyping || isGenerating"
              class="flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full bg-surface border border-violet-500/20 hover:border-violet-500/60 text-xs text-text-muted hover:text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {{ q.text }}
            </button>
          </div>
          
          <!-- Input Area -->
          <form @submit.prevent="handleManualSubmit" class="relative">
            <input 
              v-model="inputValue" 
              type="text" 
              placeholder="Ask Korpa anything..." 
              class="w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface border border-border/80 focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20 outline-none text-sm text-text placeholder:text-text-muted/60 transition-all"
              :disabled="isTyping || isGenerating"
            />
            <button 
              type="submit" 
              :disabled="!inputValue.trim() || isTyping || isGenerating"
              class="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[#6C5CE7] hover:bg-[#6C5CE7]/10 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SendIcon class="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- Floating Trigger Button -->
    <button 
      v-if="!isOpen"
      @click="isOpen = true"
      class="chat-widget-trigger group flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#4B3BC6] p-0.5 shadow-xl shadow-violet-600/35 hover:scale-108 active:scale-95 transition-all duration-300 ring-4 ring-[#6C5CE7]/20"
      title="Ask Korpa AI"
    >
      <div class="w-full h-full rounded-full bg-surface/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
        <img src="/korpa-cartoon.png" alt="Ask Korpa" class="animate-sway-img w-8 h-8 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
      </div>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { XIcon, SendIcon } from 'lucide-vue-next'
import { site } from './siteContent'
import { useAuth } from '@/composables/useAuth.js'
import { chatWithAi } from '@/api/ai'

const { user, isAuthenticated } = useAuth()

const isOpen = ref(false)
const isTyping = ref(false)
const isGenerating = ref(false)
const inputValue = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const questionsContainer = ref<HTMLElement | null>(null)
const isPaused = ref(false)
let animationId: number

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
}

const messages = ref<Message[]>([])

const questions = site.faq.map((f, i) => ({
  id: i,
  text: f.q,
  answer: f.a
}))

// Duplicate questions for seamless scrolling loop
const displayQuestions = computed(() => [...questions, ...questions])

function formatMarkdown(text: string): string {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-mono text-xs">$1</code>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br />')
  return `<p>${html}</p>`
}

const startAutoScroll = () => {
  const scroll = () => {
    if (questionsContainer.value && !isPaused.value) {
      questionsContainer.value.scrollLeft += 0.5
      
      // Reset scroll position for seamless loop
      if (questionsContainer.value.scrollLeft >= (questionsContainer.value.scrollWidth / 2)) {
        questionsContainer.value.scrollLeft -= (questionsContainer.value.scrollWidth / 2)
      }
    }
    animationId = requestAnimationFrame(scroll)
  }
  animationId = requestAnimationFrame(scroll)
}

onMounted(() => {
  startAutoScroll()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
})

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const typeWriterEffect = async (text: string) => {
  isGenerating.value = true
  const msgId = Date.now()
  messages.value.push({ id: msgId, text: "", sender: 'bot' })
  
  for (let i = 0; i < text.length; i++) {
    const currentMsg = messages.value.find(m => m.id === msgId)
    if (currentMsg) {
      currentMsg.text += text[i]
      await scrollToBottom() // Auto scroll as we type
    }
    await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 15))
  }
  isGenerating.value = false
}

const thinkingStatus = ref('Thinking...')
let statusInterval: ReturnType<typeof setInterval> | null = null

const thinkingPhrases = [
  '.',
  '..',
  '...',
  '.',
  '..',
  '.'
]

const startThinkingCycle = () => {
  let index = 0
  thinkingStatus.value = thinkingPhrases[0]
  if (statusInterval) clearInterval(statusInterval)
  
  statusInterval = setInterval(() => {
    index = (index + 1) % thinkingPhrases.length
    thinkingStatus.value = thinkingPhrases[index]
  }, 3500)
}

const stopThinkingCycle = () => {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  stopThinkingCycle()
})

const sendToAi = async () => {
  isTyping.value = true
  startThinkingCycle()
  await scrollToBottom()

  try {
    const payload = messages.value.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }))

    const res: any = await chatWithAi(payload)
    const reply = res.data?.reply || res.reply || "I couldn't process that right now. Please try again!"

    stopThinkingCycle()
    isTyping.value = false
    await typeWriterEffect(reply)
  } catch (err: any) {
    stopThinkingCycle()
    isTyping.value = false
    const errMessage = err.response?.status === 503
      ? "Korpa AI Assistant is currently undergoing scheduled maintenance. Please check our FAQ options above! 🐝"
      : "Sorry, I had trouble processing your request. Please try again in a moment!"
    await typeWriterEffect(errMessage)
  }
}

const askQuestion = (q: typeof questions[0]) => {
  messages.value.push({ id: Date.now(), text: q.text, sender: 'user' })
  if (isAuthenticated.value) {
    sendToAi()
  } else {
    processStaticAnswer(q.answer)
  }
}

const handleManualSubmit = () => {
  if (!inputValue.value.trim()) return
  
  const text = inputValue.value.trim()
  messages.value.push({ id: Date.now(), text, sender: 'user' })
  inputValue.value = ''
  
  if (isAuthenticated.value) {
    sendToAi()
  } else {
    const guestFallback = "Hello! Please log in to your KorpaBee account to ask me anything about your wallet, PPA, CDS, allawee, jobs, or housing! 🐝"
    processStaticAnswer(guestFallback)
  }
}

const processStaticAnswer = async (answer: string) => {
  isTyping.value = true
  startThinkingCycle()
  await scrollToBottom()
  await new Promise(resolve => setTimeout(resolve, 600))
  stopThinkingCycle()
  isTyping.value = false
  await typeWriterEffect(answer)
}

watch(messages.value, () => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-widget-trigger {
  position: fixed;
  right: 16px;
  bottom: 24px;
  z-index: 199;
  box-shadow: 0 10px 25px -5px rgba(108, 92, 231, 0.45);
}

.chat-widget-trigger:hover {
  box-shadow: 0 14px 30px -4px rgba(108, 92, 231, 0.6);
}

.chat-window-card {
  position: fixed;
  right: 16px;
  left: 16px;
  bottom: 75px;
  z-index: 199;
  max-height: calc(100vh - 95px);
  height: min(500px, calc(100vh - 95px));
  max-width: calc(100vw - 32px);
  box-shadow: 0 25px 60px -15px rgba(108, 92, 231, 0.35);
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 640px) {
  .chat-window-card {
    left: auto;
    width: 380px;
    right: 24px;
    bottom: 80px;
    max-height: calc(100vh - 100px);
    height: min(520px, calc(100vh - 100px));
  }
  .chat-widget-trigger {
    right: 24px;
    bottom: 20px;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes sway {
  0%, 100% { transform: rotateY(-7deg) rotateZ(-3deg); }
  70% { transform: rotateY(7deg) rotateZ(3deg); }
}

.animate-sway-img {
  animation: sway 2s ease-in-out infinite;
}

.animate-sway-btn {
  animation: sway 4s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.0); }
}

/* Hide ChatWidget trigger & window card when modal overlay is open */
body.bvm-active .chat-widget-trigger,
body.bvm-active .chat-window-card,
body:has(.bvm-overlay) .chat-widget-trigger,
body:has(.bvm-overlay) .chat-window-card,
body:has(.bsv-overlay) .chat-widget-trigger,
body:has(.bsv-overlay) .chat-window-card,
body:has([role="dialog"]) .chat-widget-trigger,
body:has([role="dialog"]) .chat-window-card {
  display: none !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
</style>
