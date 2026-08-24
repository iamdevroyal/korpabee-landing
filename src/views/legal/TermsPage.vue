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
          Terms of <span class="text-[#3c0ca0]">Service</span>
        </h1>
        <p class="text-sm sm:text-base text-navy-800 leading-relaxed">
          Please read these Terms of Service carefully before accessing or using the KorpaBee platforms.
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
          <section id="agreement" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">1. Acceptance of Terms</h2>
            <p class="text-sm text-navy-800">
              By registering an account, downloading, browsing, or using any aspect of the <strong>KorpaBee Social</strong> or 
              <strong>KorpaBee Business</strong> applications, you represent that you have read, understood, and agreed to be bound by these 
              Terms of Service and our Privacy Policy. 
            </p>
            <p class="text-sm text-navy-800">
              We reserve the right to modify, suspend, or update these terms at any time. We will alert users to major revisions via application notifications or email. Your continued use of the platform following updates constitutes acceptance of the new terms.
            </p>
          </section>

          <!-- Section 2 -->
          <section id="verification" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">2. Verification & KYC Integrity</h2>
            <p class="text-sm text-navy-800">
              KorpaBee operates as a trusted network for active Nigerian NYSC corps members, verified alumni, and legitimate corporate partners. To preserve this security:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Accuracy:</strong> You agree to provide only genuine and official documents (Call-up letter or NYSC ID card) and photos. Falsification of documents, QR codes, deployment details, or selfie comparisons is strictly prohibited.
              </li>
              <li>
                <strong>Penalties:</strong> Providing forged documents or claiming a false identity will result in the immediate and permanent termination of your account, forfeiture of platform rewards/scores, and reporting of your activities to relevant administrative and security organizations.
              </li>
              <li>
                <strong>Account Credentials:</strong> You are responsible for keeping your login credentials confidential. Sharing verified credentials with unverified third parties is a breach of security and will lead to suspension.
              </li>
            </ul>
          </section>

          <!-- Section 3 -->
          <section id="user-conduct" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">3. General Conduct & Content</h2>
            <p class="text-sm text-navy-800">
              All content published on the feeds, comment spaces, or messages must comply with local regulations and community rules:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Prohibited Material:</strong> You may not upload, publish, or transmit hate speech, harassment, graphic violence, adult content, spam, schemes, or defamatory statements.
              </li>
              <li>
                <strong>PPA Insights:</strong> Reviews and ratings submitted for primary place of assignments (PPAs) must reflect true, honest personal experiences. You may not publish false reports to manipulate a PPA’s public score or damage an organization's reputation maliciously.
              </li>
              <li>
                <strong>Roommate & Housing Listings:</strong> Housing listings and roommate requests must be legitimate. Listing non-existent apartments, pricing scams, or violating co-habitation rules is ground for permanent bans.
              </li>
              <li>
                <strong>Moderation:</strong> Users can flag inappropriate content. Our moderation team reviews all reports. Accounts found in violation will face warnings, content removal, or account suspension based on the severity of the offense.
              </li>
            </ul>
          </section>

          <!-- Section 4 -->
          <section id="wallet-finance" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">4. Corper Wallet & Financial Activities</h2>
            <p class="text-sm text-navy-800">
              Our financial services (wallets, top-ups, Ajo micro-savings groups, withdrawals, micro-loans) are strictly governed by these conditions:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Wallets & Top-ups:</strong> Funds stored in your wallet represent digital currency balance. Wallet top-ups and cash outs are processed in collaboration with our licensed financial partner institutions and payment processors (Paystack/Flutterwave).
              </li>
              <li>
                <strong>Savings Groups (Ajo):</strong> By joining an Ajo group, you agree to make recurring contributions on the designated schedule. Failure to contribute on time blocks you from requesting payouts, decreases your platform Trust Score, and can lead to wallet lock holds to recover owed funds.
              </li>
              <li>
                <strong>Marketplace Escrows:</strong> Purchasing services or products on our marketplace uses an escrow mechanism. Payments are locked in the platform wallet until delivery is confirmed by the buyer or resolved by a platform administrator.
              </li>
              <li>
                <strong>Micro-Loans:</strong> Loan approvals depend on your verified Trust Score. You agree to repay all loans on or before the due date. Delinquencies will result in penalties, trust score demotion, and collection activities through external recovery agencies.
              </li>
            </ul>
          </section>

          <!-- Section 5 -->
          <section id="business-ads" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">5. Business & Advertiser Terms</h2>
            <p class="text-sm text-navy-800">
              Users operating under **Business Accounts** are subject to additional stipulations:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                <strong>Access restrictions:</strong> Business users cannot browse, comment, or interact with private social feeds, platoon chats, or peer groups of corps members.
              </li>
              <li>
                <strong>Ad Standards:</strong> Advertisements and sponsored event campaigns must meet our advertising guidelines. We reserve the right to decline, halt, or delete ad creatives deemed deceptive, offensive, or inappropriate.
              </li>
              <li>
                <strong>Job Postings:</strong> Recruiters listing jobs must represent legitimate organizations. Fake jobs, MLM recruitment, or charging applicants any fee is strictly forbidden and results in legal escalation.
              </li>
            </ul>
          </section>

          <!-- Section 6 -->
          <section id="liability" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">6. Limitation of Liability</h2>
            <p class="text-sm text-navy-800">
              To the maximum extent permitted by law, KorpaBee, its directors, employees, or partners will not be liable for any direct, indirect, incidental, or consequential damages resulting from:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-navy-800">
              <li>
                Your use or inability to use the platform services.
              </li>
              <li>
                The behavior, comments, or housing details of fellow platform users.
              </li>
              <li>
                Any disputes between roommate match participants, buyers/sellers on the marketplace, or corps members and PPAs.
              </li>
              <li>
                Technical outages, payment gateway processing failures, or SMS delivery delays.
              </li>
            </ul>
          </section>

          <!-- Section 7 -->
          <section id="governing-law" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl font-black text-[#1f1635]">7. Governing Law & Dispute Resolution</h2>
            <p class="text-sm text-navy-800">
              These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. 
            </p>
            <p class="text-sm text-navy-800">
              Any dispute arising from or related to these terms shall first be addressed through friendly negotiation. If unresolved, the dispute shall be referred to and finally resolved by a court of competent jurisdiction in Nigeria.
            </p>
          </section>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('agreement')

const sections = [
  { id: 'agreement', title: '1. Acceptance of Terms' },
  { id: 'verification', title: '2. KYC & Verification' },
  { id: 'user-conduct', title: '3. Community Conduct' },
  { id: 'wallet-finance', title: '4. Wallets & Finance' },
  { id: 'business-ads', title: '5. Business & Ads' },
  { id: 'liability', title: '6. Limitation of Liability' },
  { id: 'governing-law', title: '7. Governing Law' }
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
