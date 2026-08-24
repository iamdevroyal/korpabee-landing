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
        <div class="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
          Official Notice
        </div>
        <h1 class="text-4xl sm:text-5xl font-black tracking-tight text-[#1f1635] leading-tight">
          Legal <span class="text-rose-500">Disclaimer</span>
        </h1>
        <p class="text-sm sm:text-base text-navy-800 leading-relaxed max-w-2xl mx-auto">
          Please review our official disclaimers regarding NYSC non-affiliation, financial operations, and content representations.
        </p>
      </div>

      <!-- Main Body -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white border border-[#e9e5f5] rounded-3xl p-8 sm:p-12 shadow-xl shadow-purple-950/5 space-y-12 text-left leading-relaxed">
          
          <!-- Callout / Critical Alert -->
          <div class="p-6 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4 items-start">
            <div class="p-2 bg-rose-500 text-white rounded-xl shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h4 class="text-xs font-black uppercase tracking-wider text-rose-800 mb-1">IMPORTANT NOTICE</h4>
              <p class="text-xs text-rose-700 leading-relaxed font-semibold">
                KorpaBee is entirely independent. We have no affiliation, endorsement, or representation contract with the National Youth Service Corps (NYSC) or the Government of Nigeria.
              </p>
            </div>
          </div>

          <!-- Section 1: Non Affiliation -->
          <div class="space-y-4">
            <h3 class="text-xl font-black text-[#1f1635]">1. Non-Affiliation with NYSC & Government Organs</h3>
            <p class="text-sm text-navy-800">
              KorpaBee is a private utility platform and social network built around the daily struggles, housing logistics, and career needs of Nigerian corps members. 
            </p>
            <p class="text-sm text-navy-800">
              Any reference to the "National Youth Service Corps", "NYSC", "Orientation Camps", "PPAs", or "CDSs" is strictly for identifying locations, batches, stream divisions, and groups to facilitate peer-to-peer networking and utility. We do not issue state deployment letters, alter NYSC database records, or represent any administrative decisions of the NYSC directorate.
            </p>
          </div>

          <!-- Section 2: Banking & Financial Partners -->
          <div class="space-y-4">
            <h3 class="text-xl font-black text-[#1f1635]">2. Banking and Financial Services Partner Disclosure</h3>
            <p class="text-sm text-navy-800">
              KorpaBee is a financial technology software provider, not a licensed bank or microfinance institution. 
            </p>
            <p class="text-sm text-navy-800 font-semibold text-[#3c0ca0]">
              All deposit account creations, ledger balances, card collections, escrow holds, and cash disbursements are powered strictly in partnership with our licensed commercial banking partners and payment gateway processors (Paystack and Flutterwave).
            </p>
            <p class="text-sm text-navy-800">
              Funds in your Corper Wallet are subject to clearing policies, network uptime, and the technical protocols of our banking partners. We do not engage in deposit-taking activities independent of our banking partners.
            </p>
          </div>

          <!-- Section 3: Geolocation, Housing and roommate risks -->
          <div class="space-y-4">
            <h3 class="text-xl font-black text-[#1f1635]">3. Housing, Apartment and Roommate Listings</h3>
            <p class="text-sm text-navy-800">
              Listing search results (including nearby PPAs, distances, and map pins) use Haversine GPS calculations based on coordinates provided by landlords or agents. 
            </p>
            <p class="text-sm text-navy-800">
              While we require verified registrations for listing landlords and roommates, KorpaBee does not inspect properties physically. We strongly advise users to inspect rentals in person before executing rental contracts. Co-habitation and matching roommates carry personal risks; users must execute appropriate caution when meeting and choosing roommates.
            </p>
          </div>

          <!-- Section 4: Jobs, CV & Gigs marketplace -->
          <div class="space-y-4">
            <h3 class="text-xl font-black text-[#1f1635]">4. Jobs, CVs and Gig Deliveries</h3>
            <p class="text-sm text-navy-800">
              Employer job posts on our portal and freelance gig orders are submitted by independent businesses and individuals. 
            </p>
            <p class="text-sm text-navy-800">
              We do not guarantee interview responses, job placements, or the performance/competence of freelance gig providers. Payment escrows are subject to dispute resolution audits, and we are not liable for disagreements that fall outside the parameters of our system's resolution procedures.
            </p>
          </div>

          <!-- Section 5: PPA Reviews & Third party links -->
          <div class="space-y-4">
            <h3 class="text-xl font-black text-[#1f1635]">5. Accuracy of PPA Reviews and Ratings</h3>
            <p class="text-sm text-navy-800">
              Primary Place of Assignment (PPA) insights, salary reviews, workload ratings, and comment discussions represent the personal opinions of individual platform users. They do not reflect the views or research of KorpaBee. We do not assume responsibility for the accuracy or claims of these reviews.
            </p>
          </div>

          <!-- Back Button footer style -->
          <div class="pt-6 border-t border-[#e9e5f5] text-center">
            <router-link to="/" class="inline-flex bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs tracking-wide shadow-lg shadow-purple-500/15 transition-all">
              Go back to Landing Page
            </router-link>
          </div>

        </div>
      </div>
    </main>
<ScrollToTop />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'

onMounted(() => {
  window.scrollTo(0, 0)
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
