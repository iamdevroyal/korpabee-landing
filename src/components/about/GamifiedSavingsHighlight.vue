<template>
  <section id="savings" class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Section Header -->
      <div class="mb-8">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#1f1635]">
          Fintech Reimagined: Gamified Savings & Allawee Management
        </h2>
        <p class="text-xs sm:text-sm text-navy-600 mt-1 max-w-3xl">
          We replaced confusing financial models with interactive, gamified utilities tailored to the realities of the monthly NYSC stipend cycle.
        </p>
      </div>

      <!-- 3 Feature Pillars Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Pillar 1: Save & Win (Gamified Savings) -->
        <div class="bg-white border-2 border-[#3c0ca0]/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-[#3c0ca0] px-2.5 py-1 rounded">
                Gamified Savings
              </span>
              <span class="text-xl">🏆</span>
            </div>

            <h3 class="text-xl font-black text-[#1f1635]">
              Save &amp; Win
            </h3>

            <p class="text-xs text-navy-700 leading-relaxed font-medium">
              "Save daily. Climb the ranks. Win rewards."
            </p>

            <p class="text-xs text-navy-600 leading-relaxed">
              KorpaBee turns disciplined savings into an engaging challenge. Join state or platoon savings groups, maintain daily savings streaks, rank on leaderboards, and unlock milestone rewards.
            </p>

            <div class="pt-2 space-y-1.5 text-xs text-navy-800">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Daily savings streaks and milestone multipliers</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Group savings challenges with platoon leaderboards</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Automated wallet payouts directly to bank accounts</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[#e9e5f5] text-xs font-bold text-[#3c0ca0]">
            Route: /savings
          </div>
        </div>

        <!-- Pillar 2: Allawee Manager & Budget Planner -->
        <div class="bg-white border border-[#e9e5f5] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded">
                Stipend Intelligence
              </span>
              <span class="text-xl">📊</span>
            </div>

            <h3 class="text-xl font-black text-[#1f1635]">
              Allawee Manager
            </h3>

            <p class="text-xs text-navy-700 leading-relaxed font-medium">
              Track 12 months of federal allowance clearance.
            </p>

            <p class="text-xs text-navy-600 leading-relaxed">
              Visualizes your service year finances from Month 1 to Month 12. Monitor monthly clearance status, track total stipend received, calculate remaining allowances, and budget living expenses.
            </p>

            <div class="pt-2 space-y-1.5 text-xs text-navy-800">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Monthly clearance status and biometric tracking</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>12-month progress bar with paid vs remaining allawee</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Integrated monthly budget planner for lodge & food costs</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[#e9e5f5] text-xs font-bold text-emerald-700">
            Route: /allawee • /budget
          </div>
        </div>

        <!-- Pillar 3: Trust Score Loans -->
        <div class="bg-white border border-[#e9e5f5] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-1 rounded">
                Credit & Trust
              </span>
              <span class="text-xl">⚡</span>
            </div>

            <h3 class="text-xl font-black text-[#1f1635]">
              Trust-Score Loans
            </h3>

            <p class="text-xs text-navy-700 leading-relaxed font-medium">
              Emergency micro-credit unlocked by your reputation.
            </p>

            <p class="text-xs text-navy-600 leading-relaxed">
              When stipend payments are delayed, corps members can access low-interest short-term emergency loans backed by licensed microfinance partners — automatically qualified by reaching 1,000+ Trust Score points.
            </p>

            <div class="pt-2 space-y-1.5 text-xs text-navy-800">
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Trust Score gauge built on verified platform activity</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Low-interest short-term emergency advances</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-emerald-600 font-bold">✓</span>
                <span>Partnered with licensed Nigerian microfinance institutions</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-[#e9e5f5] text-xs font-bold text-amber-700">
            Route: /loans
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
