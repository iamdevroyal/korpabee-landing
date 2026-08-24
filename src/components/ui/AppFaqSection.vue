<template>
  <section class="max-w-7xl mx-auto py-16 px-4 border-t border-[#e9e5f5]">
    <div class="text-center max-w-3xl mx-auto mb-12 space-y-4">
      <div class="inline-flex items-center gap-2 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 text-[#3c0ca0] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
        Got Questions?
      </div>
      <h2 class="text-3xl sm:text-4xl font-black text-[#1f1635] leading-tight">
        Frequently Asked <span class="text-[#3c0ca0]">Questions</span>
      </h2>
      <p class="text-sm text-[#615629] leading-relaxed max-w-xl mx-auto">
        Learn how KorpaBee simplifies housing searches, career opportunities, PPA placements, and financial wellness during your NYSC year.
      </p>
    </div>

    <!-- Accordion Wrapper -->
    <div class="max-w-3xl mx-auto space-y-3.5 text-left">
      <div
        v-for="(faq, index) in faqs"
        :key="index"
        class="bg-white border border-[#e9e5f5] rounded-2xl overflow-hidden transition-all duration-300 shadow-md shadow-purple-950/[0.01]"
        :class="activeIndex === index ? 'border-[#3c0ca0] ring-1 ring-[#3c0ca0]/30 shadow-lg shadow-purple-950/[0.04]' : 'hover:border-[#3c0ca0]/40'"
      >
        <!-- Accordion Header -->
        <button
          @click="toggleFaq(index)"
          class="w-full px-6 py-faq-header flex items-center justify-between gap-4 text-left select-none outline-none focus:outline-none transition-colors"
          :aria-expanded="activeIndex === index"
        >
          <span class="text-sm font-black text-[#1f1635] tracking-tight pr-4">
            {{ faq.question }}
          </span>
          <span
            class="w-6 h-6 rounded-full bg-[#3c0ca0]/5 border border-[#3c0ca0]/10 flex items-center justify-center text-[#3c0ca0] shrink-0 transition-transform duration-300"
            :class="{ 'rotate-180 bg-[#3c0ca0] text-white': activeIndex === index }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>

        <!-- Accordion Content -->
        <div
          v-show="activeIndex === index"
          class="transition-all duration-300 border-t border-[#f3f1fa]"
        >
          <div class="px-6 py-4 text-xs text-[#524479] leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(null);

const faqs = [
  {
    question: 'How can I find and review my Place of Primary Assignment (PPA) on KorpaBee?',
    answer: 'KorpaBee features a comprehensive PPA directory where corps members can search and read honest ratings and reviews from alumni and peers. You can explore details regarding monthly stipends, accommodation offers, working hours, and whether the PPA supports relocation approvals. You can also anonymously post reviews to help others.'
  },
  {
    question: 'How does KorpaBee help corps members find verified accommodation and roommates?',
    answer: 'Our Housing match system maps properties near local orientation camps and PPA regions. Utilizing a roommate compatibility algorithm, you can matching based on habits, budgets, and schedules, allowing you to securely group up and divide housing expenses with other verified corps members.'
  },
  {
    question: 'Can I apply for jobs and build my CV on KorpaBee?',
    answer: 'Yes! KorpaBee features an integrated CV builder tailored specifically to help youth corpers draft a professional profile. Our opportunities board lists verified internships, corporate roles, freelance gigs, and post-service jobs. You can submit your CV with a single tap.'
  },
  {
    question: 'How do the platoon, state, and batch group chats work?',
    answer: 'Once your NYSC identity is verified, our system maps you to your official state code and automatically adds you to your respective state, batch, and platoon community group chats. You can share updates, join public forums, write buzz updates, and send private real-time direct messages securely.'
  },
  {
    question: 'What is the savings system in the KorpaBee Wallet?',
    answer: 'The Finance module offers a digital wallet interface to keep tabs on your allawee tracker, budget, and allowance approvals. It facilitates secure cooperative group savings (Ajo contributions) managed under locked escrow to ensure transparency, and offers eligibility paths for microcredit micro-loans.'
  },
  {
    question: 'How can I track CDS attendance and local community development service projects?',
    answer: 'KorpaBee features a CDS coordination dashboard where you can browse local CDS groups, view upcoming community developmental events, log weekly attendance sheets, and compete on the active CDS leaderboards.'
  },
  {
    question: 'How can businesses post listings or run ads on KorpaBee?',
    answer: 'Landlords, companies, and local recruiters can register for a Business Account on KorpaBee. From the business dashboard, they can easily create rental listings, post jobs, review applications, and publish targeted ad campaigns aimed at specific corps demographics.'
  },
  {
    question: 'How does the Gigs and Marketplace feature work?',
    answer: 'Our Gigs & Marketplace helps you monetize your skills and side hustles during your service year. You can discover and apply for short-term tasks, freelance projects, remote work, and even local services, or create listings to offer your skills to the community.'
  },
  {
    question: 'How do I report a user or flagged post on KorpaBee?',
    answer: 'To report inappropriate behavior, scams, fake PPA listings, or policy violations, use the “…” menu on any post or profile to select Report Abuse. Provide relevant details and submit the report to our moderation team for review and action.'
  },
  {
    question: 'How is my personal data protected?',
    answer: 'Your security is our priority. We use encrypted connections, secure cloud storage, and strict access controls for all sensitive data, including your verification documents and finance module records.'
  },
  {
    question: 'Who can create an account and how long does verification take?',
    answer: 'Only registered corps members with valid call-up letters and batch numbers can create accounts. Verification is typically instant for valid documents, but may take up to 24 hours for manual review.'
  },
  {
    question: 'Can I use KorpaBee if I’m not a corps member?',
    answer: 'KorpaBee is primarily designed for corps members, but alumni, post-service individuals, and those awaiting deployment can also join the platform to connect, seek jobs, and access resources.'
  },
  {
    question: 'Are the real estate listings and jobs on KorpaBee verified?',
    answer: 'Yes! Every landlord, business, and recruiter on our platform undergoes a verification process before listing. We prioritize safety, authenticity, and legitimacy to ensure you find only trusted opportunities.'
  },
  {
    question: 'Can I change my PPA after being posted?',
    answer: 'Yes, relocation and redeployment are possible under specific circumstances. Our PPA directory provides detailed guidelines on the relocation process, required documents, and procedures for seeking approval.'
  },
  {
    question: 'Does KorpaBee offer any financial support or loans?',
    answer: 'Yes! Through our Finance module, you can join savings groups, track your allawee, manage budgets, and explore eligibility for microcredit and startup micro-loans—all within a secure digital wallet.'
  },
  {
    question: 'Is KorpaBee available on mobile devices?',
    answer: 'Absolutely! KorpaBee features a responsive mobile design and a dedicated PWA (Progressive Web App) that works seamlessly across all smartphones and tablets.'
  },
  {
    question: 'What happens to my account after I complete my service year?',
    answer: 'You can continue using KorpaBee even after your service year. Your account automatically transitions to an Alumni profile, allowing you to stay connected, access job opportunities, and utilize all platform features.'
  },
  {
    question: 'Can I apply for jobs outside my state of deployment?',
    answer: 'Yes! Our job board covers opportunities across all states, allowing you to search and apply for roles nationwide regardless of your PPA location.'
  }
];

function toggleFaq(index) {
  if (activeIndex.value === index) {
    activeIndex.value = null;
  } else {
    activeIndex.value = index;
  }
}
</script>

<style scoped>
.py-faq-header {
  padding-top: 1.125rem;
  padding-bottom: 1.125rem;
}
</style>
