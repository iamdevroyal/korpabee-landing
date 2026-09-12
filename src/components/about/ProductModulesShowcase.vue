<template>
  <section id="modules" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
            Core Product Modules
          </h2>
          <p class="text-xs sm:text-sm text-navy-600 mt-0.5">
            Explore the 8 integrated modules powering the KorpaBee web and mobile ecosystem.
          </p>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="activeCategory = cat.id"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer"
            :class="activeCategory === cat.id ? 'bg-[#3c0ca0] text-white' : 'bg-white hover:bg-purple-50 text-navy-700 border border-[#e9e5f5]'"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="mod in filteredModules"
          :key="mod.id"
          class="bg-white border border-[#e9e5f5] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#3c0ca0]/40 transition-colors"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-[#3c0ca0] bg-purple-50 px-2.5 py-1 rounded-md">
                {{ mod.badge }}
              </span>
              <span class="text-[11px] text-navy-500 font-semibold">
                {{ mod.viewRoute }}
              </span>
            </div>

            <h3 class="text-lg font-black text-[#1f1635]">
              {{ mod.title }}
            </h3>

            <p class="text-xs text-navy-700 leading-relaxed">
              {{ mod.description }}
            </p>

            <!-- Feature Bullet List -->
            <div class="pt-2 space-y-1.5">
              <div
                v-for="(feature, idx) in mod.keyFeatures"
                :key="idx"
                class="flex items-start gap-2 text-xs text-navy-800"
              >
                <span class="text-emerald-600 font-black text-[11px] shrink-0">✓</span>
                <span class="leading-tight">{{ feature }}</span>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-3 border-t border-[#e9e5f5] flex items-center justify-between text-[11px] text-navy-500">
            <span>Module Category:</span>
            <span class="font-bold text-[#3c0ca0] capitalize">{{ mod.category }}</span>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeCategory = ref('all')

const categories = [
  { id: 'all', label: 'All Modules (8)' },
  { id: 'community', label: 'Community & Chat' },
  { id: 'ppa-housing', label: 'PPA & Housing' },
  { id: 'career', label: 'Jobs & AI Career' },
  { id: 'finance', label: 'Fintech & Gigs' },
  { id: 'cds', label: 'CDS & Discovery' }
]

const modules = [
  {
    id: 'feeds-buzz',
    category: 'community',
    badge: 'Social & Reels',
    viewRoute: '/feed • /buzzhives',
    title: '4-Tier Feeds & BuzzHives Reels',
    description: 'A multi-tiered social stream structured around real NYSC identity levels, plus vertical video reels for camp moments.',
    keyFeatures: [
      'Global, State, Platoon, and Batch feeds (e.g. Batch B Stream 1)',
      'BuzzHives vertical media reels with audio/music & video sharing',
      'Media uploads, reactions, corper comments, and trending discussions'
    ]
  },
  {
    id: 'chat-messaging',
    category: 'community',
    badge: 'Real-Time Chat',
    viewRoute: '/chat • /chat/join',
    title: 'Messaging & Geolocation Sharing',
    description: 'Instant private and group communications powered by WebSockets, with built-in location pin drops.',
    keyFeatures: [
      'P2P direct chats, Platoon groups, and State chapter channels',
      'Live geolocation map drops directly inside conversation threads',
      'Shareable invite codes for seamless group joining'
    ]
  },
  {
    id: 'ppa-board',
    category: 'ppa-housing',
    badge: 'PPA Intelligence',
    viewRoute: '/ppa • /ppa/need-ppa',
    title: 'PPA Ratings & Need-PPA Board',
    description: 'The national directory of Places of Primary Assignment with authentic corps member ratings.',
    keyFeatures: [
      'Stipend amount & payment promptness reviews',
      'Workload ratings and accommodation availability ratings',
      'Need-PPA placement board for corpers seeking immediate postings'
    ]
  },
  {
    id: 'housing-roommates',
    category: 'ppa-housing',
    badge: 'Living & Proximity',
    viewRoute: '/housing • /roommates',
    title: 'GPS Lodge Search & Roommate Match',
    description: 'Map-based housing directory near your PPA and smart corper roommate matchmaking.',
    keyFeatures: [
      'GPS "Near Me" radius filter to locate verified corper lodges',
      'Roommate Matchmaker to find verified peers by budget and habits',
      'Transparent lodge pricing with zero predatory agent fees'
    ]
  },
  {
    id: 'jobs-ai-career',
    category: 'career',
    badge: 'AI Career Suite',
    viewRoute: '/jobs • /me/cv • /me/cover-letter',
    title: 'Job Board & AI Career Wizard',
    description: 'Career development tools engineered to translate corps service into high-impact corporate resumes.',
    keyFeatures: [
      'Corper job board featuring remote gigs and entry-level tracks',
      'Multi-step AI CV Builder highlighting NYSC PPA & CDS leadership',
      'AI Cover Letter Generator configured to target job posts in seconds'
    ]
  },
  {
    id: 'fintech-allawee',
    category: 'finance',
    badge: 'Stipend & Savings',
    viewRoute: '/wallet • /allawee • /savings',
    title: 'Wallet, Allawee Manager & Save-and-Win',
    description: 'Comprehensive financial suite featuring stipend tracking, gamified savings, and Trust Score micro-loans.',
    keyFeatures: [
      'Monthly Allawee Manager tracking 12-month stipend clearance',
      '"Save & Win" gamified savings challenges with streak ranks',
      'Emergency micro-loans unlocked by 1,000+ Trust Score points'
    ]
  },
  {
    id: 'gigs-marketplace',
    category: 'finance',
    badge: 'Marketplace',
    viewRoute: '/gigs • /submissions',
    title: 'Freelance Gigs & Task Market',
    description: 'Skill marketplace where corps members offer services, complete client tasks, and receive protected payments.',
    keyFeatures: [
      'Post freelance services across tutoring, design, tailoring, tech',
      'Deliverables submission tracking with client review milestones',
      'Integrated escrow protecting buyer payments and corper payouts'
    ]
  },
  {
    id: 'cds-discovery',
    category: 'cds',
    badge: 'CDS & Affinity',
    viewRoute: '/cds • /discover • /events',
    title: 'CDS Manager & Affinity Discovery',
    description: 'Digital tools for mandatory Community Development Service and smart affinity matching.',
    keyFeatures: [
      'Monday-to-Friday CDS group management & digital attendance check-ins',
      'CDS project impact leaderboard recognizing top corper leaders',
      'Smart Discovery matching peers by Same Platoon, PPA, or Alma Mater'
    ]
  }
]

const filteredModules = computed(() => {
  if (activeCategory.value === 'all') return modules
  return modules.filter(m => m.category === activeCategory.value)
})
</script>
