<template>
  <div class="min-h-screen bg-[#f8f7fd] text-[#1f1635] font-sans selection:bg-[#3c0ca0]/10 selection:text-[#3c0ca0] pb-24">
    <!-- Navbar / Header -->
    <header class="bg-white/70 backdrop-blur-xl border-b border-[#e9e5f5] sticky top-0 z-40 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 group shrink-0">
          <div class="relative w-20 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
            <img src="@/assets/logo.png" alt="KorpaBee Logo" class="w-full h-full object-contain" />
          </div>
        </router-link>
        <router-link to="/" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#3c0ca0] hover:text-[#2d0979] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </router-link>
      </div>
    </header>

    <!-- Content Layout -->
    <main class="max-w-7xl mx-auto px-6 pt-12">
      <!-- Top banner -->
      <div class="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
        <div class="inline-flex items-center gap-2 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 text-[#3c0ca0] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
          Last Updated: June 11, 2026
        </div>
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-[#1f1635] leading-tight">
          Privacy <span class="text-[#3c0ca0]">Policy</span>
        </h1>
        <p class="text-sm sm:text-base text-navy-800 leading-relaxed">
          At KorpaBee, we value your privacy. This policy explains how we collect, use, protect, and handle your personal data across the KorpaBee Social and Business platforms.
        </p>
      </div>

      <!-- Main Body -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- Sidebar Navigation (TOC) -->
        <aside class="lg:col-span-4 sticky top-28 bg-white border border-[#e9e5f5] rounded-3xl p-6 shadow-xl shadow-purple-950/5 hidden lg:block">
          <h3 class="text-xs font-black uppercase tracking-widest text-[#1f1635] mb-4 border-b border-[#f3f1fa] pb-2">Table of Contents</h3>
          <nav class="space-y-1">
            <a v-for="section in sections" :key="section.id" :href="'#' + section.id"
               @click.prevent="scrollToSection(section.id)"
               class="block text-xs font-bold py-2 px-3 rounded-xl transition-all duration-200"
               :class="activeSection === section.id 
                 ? 'bg-[#3c0ca0] text-white shadow-md shadow-[#3c0ca0]/15' 
                 : 'text-navy-700 hover:bg-[#3c0ca0]/5 hover:text-[#3c0ca0]'"
            >
              {{ section.title }}
            </a>
          </nav>
        </aside>

        <!-- Document Content -->
        <article class="lg:col-span-8 bg-white border border-[#e9e5f5] rounded-3xl p-8 sm:p-10 shadow-xl shadow-purple-950/5 space-y-12 text-left leading-relaxed">
          <!-- Section 1 -->
          <section id="introduction" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">1. Introduction & Overview</h2>
            <p class="text-sm text-navy-800">
              Welcome to KorpaBee ("we", "our", or "us"). This Privacy Policy applies to the KorpaBee platform, including the 
              <strong>KorpaBee Social</strong> web/mobile application designed for NYSC corps members, and the 
              <strong>KorpaBee Business</strong> dashboard for partners, employers, and landlords. 
            </p>
            <p class="text-sm text-navy-800">
              By using our platform, you consent to the data collection and practices described in this document. If you do not agree with any terms in this policy, please discontinue the use of our services immediately.
            </p>
          </section>

          <!-- Section 2 -->
          <section id="data-collection" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">2. Personal Data We Collect</h2>
            <p class="text-sm text-navy-800">
              We collect information you directly provide to us, details from automated background services, and telemetry logs. This includes:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Account Credentials:</strong> Full name, phone number (primary verification credential), email address, profile description (bio), gender, date of birth, and password hashes.
              </li>
              <li>
                <strong>NYSC Verification Data:</strong> To verify your status as an active corps member or verified alumnus, we require you to upload a selfie image and your official Call-up letter or NYSC ID card document. The details collected include call-up numbers, state code, deployed state, batch year, stream, orientation camp, and platoon details.
              </li>
              <li>
                <strong>Social & Communications:</strong> Posts (text, images, video), comments, likes, shares, direct message content (text, voice notes, documents), group chat messages, and typing activities.
              </li>
              <li>
                <strong>PPA & Reviews:</strong> PPA reviews, ratings, relocation requests, salary figures, and workload experiences.
              </li>
              <li>
                <strong>Employment & Jobs Data:</strong> CV files uploaded by users, details populated using our in-app CV builder, application history, and skills list.
              </li>
              <li>
                <strong>Housing & Roommate Match:</strong> Property listings (including high-resolution photos, coordinates, and prices) and roommate compatibility surveys (lifestyle preferences, sleeping schedule, cleanliness ratings).
              </li>
              <li>
                <strong>Financial Information:</strong> Wallet balances, deposit/withdrawal history, savings goals, loan applications, and Clearance/Allawee trackers.
              </li>
              <li>
                <strong>Technical Details:</strong> Device IDs, FCM push tokens, IP address, geographical coordinates (when using Leaflet.js property/roommate searches), browser type, and navigation histories.
              </li>
            </ul>
          </section>

          <!-- Section 3 -->
          <section id="processing" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">3. How We Process & Use Your Data</h2>
            <p class="text-sm text-navy-800">
              Your data is processed to ensure security, enhance utility, and power our platform features:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Identity Verification:</strong> Selfie images and NYSC documents are matched using artificial intelligence/manual reviews to prevent impersonation and verify active status. Success results in a `corper_verified` badge.
              </li>
              <li>
                <strong>Core Features Coordination:</strong> Connecting you with your exact batch, state, and platoon groups, filtering jobs matching your skills, sorting housing search results using Haversine proximity formulas, and evaluating roommate compatibilities.
              </li>
              <li>
                <strong>Financial Orchestrations:</strong> Internal wallets, escrow payments for gig orders, Ajo micro-savings contributions, and allowance clearance alerts.
              </li>
              <li>
                <strong>Targeted Ads & Analytics:</strong> Serving business ads targeted by state, batch, platoon, or interests (e.g. tech, education, finance) without exposing your identity or direct contact details to advertisers.
              </li>
              <li>
                <strong>Security Monitoring:</strong> Combating fraud, toxic behavior, spam, and enforcing Spatie role-based access controls.
              </li>
            </ul>
          </section>

          <!-- Section 4 -->
          <section id="data-storage" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">4. Storage, Encryption & Security</h2>
            <p class="text-sm text-navy-800">
              We employ strict industry-standard security measures to guard your information:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Media Encryption:</strong> Sensitive files, such as uploaded NYSC documents, are stored using AES-256 encryption in restricted, private buckets on our secure Bunny.net CDN network.
              </li>
              <li>
                <strong>Obfuscation:</strong> We never expose internal database integer IDs in API endpoints, URLs, or JSON responses. All resources are public-facing under unique, random UUIDs.
              </li>
              <li>
                <strong>Secure Authentication:</strong> User sessions use Laravel Sanctum tokens with a sliding 30-day expiry period, combined with SMS or Email 2FA OTPs powered by Sendchamp.
              </li>
              <li>
                <strong>Database Security:</strong> All query logs are prepared to prevent SQL injection. We run a secure PostgreSQL 16 server with regular backup policies.
              </li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section id="third-party" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">5. Third-Party Integrations</h2>
            <p class="text-sm text-navy-800">
              To provide advanced digital features, we integrate with secure external processors. These partners process specific parts of your details:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Sendchamp:</strong> Delivers registration, verification, and 2FA OTP codes via SMS.
              </li>
              <li>
                <strong>Paystack & Flutterwave:</strong> Direct payment processing for wallets, gig orders, and subscriptions. Card numbers and bank detail inputs go directly to their PCI-DSS compliant interfaces; we do not store raw card credentials.
              </li>
              <li>
                <strong>Firebase Cloud Messaging (FCM):</strong> Sends real-time push alerts to your mobile and web devices.
              </li>
              <li>
                <strong>Bunny.net:</strong> Manages profile avatars, post media files, job CV documents, and verification uploads.
              </li>
              <li>
                <strong>Meilisearch:</strong> Handles full-text index synchronization for rapid discover search results (PPA ratings, roommate matches, job opportunities).
              </li>
            </ul>
          </section>

          <!-- Section 6 -->
          <section id="user-rights" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">6. Your Rights & Choice</h2>
            <p class="text-sm text-navy-800">
              As a KorpaBee user, you have complete control over your data:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Access & Edit:</strong> You can view and edit your profile bio, skills, profile picture, and notification settings directly inside the application settings.
              </li>
              <li>
                <strong>Data Deletion:</strong> You can request the deletion of your account. Upon account closure, your records are marked as soft-deleted (`deleted_at` timestamp), restricting access. Complete purging occurs in accordance with our data archiving guidelines.
              </li>
              <li>
                <strong>Opt-Out:</strong> You can opt-out of marketing communications or targeted advertisements. However, essential notification alerts (OTP, billing invoices, critical moderation updates) cannot be disabled.
              </li>
            </ul>
          </section>

          <!-- Section 7 -->
          <section id="contact-info" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">7. Contact & Support</h2>
            <p class="text-sm text-navy-800">
              If you have any questions about this Privacy Policy, your account data, or face difficulty with NYSC verification or wallet services, contact our support team:
            </p>
            <div class="p-4 bg-[#f8f7fd] border border-[#e9e5f5] rounded-2xl inline-block text-xs font-bold text-[#3c0ca0]">
              Email: support@korpabee.com
            </div>
          </section>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('introduction')

const sections = [
  { id: 'introduction', title: '1. Introduction & Overview' },
  { id: 'data-collection', title: '2. Personal Data We Collect' },
  { id: 'processing', title: '3. How We Process Data' },
  { id: 'data-storage', title: '4. Storage & Security' },
  { id: 'third-party', title: '5. Third-Party Integrations' },
  { id: 'user-rights', title: '6. Your Rights & Choice' },
  { id: 'contact-info', title: '7. Contact & Support' }
]

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = id
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY + 120
  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el) {
      const top = el.offsetTop
      const height = el.offsetHeight
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSection.value = section.id
        break
      }
    }
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
