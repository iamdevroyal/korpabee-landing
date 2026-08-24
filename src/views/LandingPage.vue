<template>
  <div class="min-h-screen bg-[#f8f7fd] text-[#1f1635] font-sans overflow-x-hidden selection:bg-[#3c0ca0]/10 selection:text-[#3c0ca0] pb-12 relative">
    
    <!-- Ambient Glowing Background Orbs -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-[#3c0ca0]/15 via-[#ab8df0]/10 to-transparent rounded-full blur-3xl animate-pulse-glow"></div>
      <div class="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-gradient-to-bl from-[#aca064]/12 via-[#3c0ca0]/8 to-transparent rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-1/4 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-[#3c0ca0]/10 via-[#8059e0]/10 to-transparent rounded-full blur-3xl animate-pulse-glow"></div>
    </div>

    <!-- Shared App Navbar -->
    <AppNavbar @open-modal="openModal" />

    <!-- Main Container -->
    <main class="pt-12 px-4 sm:px-6 relative z-10">
      
      <!-- Hero Section -->
      <section id="home" class="max-w-7xl mx-auto py-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Column (Mockup Logo, Description, Connect Features) -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Brand Badge -->
            <div class="inline-flex items-center gap-2 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 text-[#3c0ca0] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform duration-300">
              <span class="w-2 h-2 rounded-full bg-[#3c0ca0] animate-ping"></span>
              Connect. Grow. Thrive.
            </div>

            <!-- Main Heading -->
            <h1 class="text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#1f1635]">
              Reimagine Your Service Year<br />
              <span class="shimmer-text">Connect Faster, Serve Better.</span>
            </h1>

            <!-- Subtitle -->
            <p class="text-sm sm:text-base text-navy-800 leading-relaxed max-w-sm">
              All-in-one social, opportunity, and lifestyle platform built to power your service year — from camp to POP and beyond.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4 pt-2">
              <button
                @click="openWaitlistModal"
                class="bg-gradient-to-r from-[#3c0ca0] to-[#5e32c7] hover:from-[#2d0979] hover:to-[#3c0ca0] text-white font-extrabold px-7 py-3.5 rounded-2xl text-xs sm:text-sm tracking-wide shadow-lg shadow-[#3c0ca0]/25 hover:shadow-xl hover:shadow-[#3c0ca0]/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 group"
              >
                <span>Join our Waitlist</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            <!-- Horizonal Features List -->
            <div class="space-y-3.5">
              <!-- Feature item 1 -->
              <div 
                @mousemove="handleCardMouseMove($event, 6)"
                @mouseleave="handleCardMouseLeave($event)"
                class="spotlight-card flex gap-3.5 items-start p-3.5 rounded-2xl cursor-default"
              >
                <div class="w-10 h-10 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-xl flex items-center justify-center text-[#3c0ca0] shrink-0 font-bold shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a6 6 0 00-3.44-1.06m-5.12 0A6 6 0 006 18.72M9 9a9 9 0 00-9-9m9 9a9 9 0 019-9m-9 9v11.25m0-11.25a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-[#1f1635]">CONNECT</h4>
                  <p class="text-[11px] text-navy-600 mt-0.5 leading-snug">Meet and connect with corps members in your platoon, state and beyond.</p>
                </div>
              </div>

              <!-- Feature item 2 -->
              <div 
                @mousemove="handleCardMouseMove($event, 6)"
                @mouseleave="handleCardMouseLeave($event)"
                class="spotlight-card flex gap-3.5 items-start p-3.5 rounded-2xl cursor-default"
              >
                <div class="w-10 h-10 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-xl flex items-center justify-center text-[#3c0ca0] shrink-0 font-bold shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a3 3 0 00-3-3H7.02a3 3 0 00-3 3m16.5 0h-16.5m16.5 0v-3.5a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v.85" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-[#1f1635]">OPPORTUNITIES</h4>
                  <p class="text-[11px] text-navy-600 mt-0.5 leading-snug">Discover jobs, internships, gigs and skill opportunities.</p>
                </div>
              </div>

              <!-- Feature item 3 -->
              <div 
                @mousemove="handleCardMouseMove($event, 6)"
                @mouseleave="handleCardMouseLeave($event)"
                class="spotlight-card flex gap-3.5 items-start p-3.5 rounded-2xl cursor-default"
              >
                <div class="w-10 h-10 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-xl flex items-center justify-center text-[#3c0ca0] shrink-0 font-bold shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-[#1f1635]">PPA INSIGHTS</h4>
                  <p class="text-[11px] text-navy-600 mt-0.5 leading-snug">Search, review and rate PPAs to make better choices.</p>
                </div>
              </div>

              <!-- Feature item 4 -->
              <div 
                @mousemove="handleCardMouseMove($event, 6)"
                @mouseleave="handleCardMouseLeave($event)"
                class="spotlight-card flex gap-3.5 items-start p-3.5 rounded-2xl cursor-default"
              >
                <div class="w-10 h-10 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-xl flex items-center justify-center text-[#3c0ca0] shrink-0 font-bold shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider text-[#1f1635]">HOUSING</h4>
                  <p class="text-[11px] text-navy-600 mt-0.5 leading-snug">Find verified apartments and roommates near your PPA.</p>
                </div>
              </div>
            </div>

            <!-- Security statement -->
            <div class="p-4 bg-gradient-to-r from-[#eef0ff]/80 to-[#f4f0ff]/90 border border-[#c3c8f8] rounded-2xl flex items-start gap-3 shadow-sm">
              <div class="p-1.5 bg-[#3c0ca0]/15 rounded-full text-[#3c0ca0] shrink-0 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div class="text-[11px] leading-snug">
                <span class="block font-black text-[#3c0ca0] uppercase tracking-wider">SAFE. VERIFIED. TRUSTED.</span>
                <span class="text-navy-700">Your safety and privacy are our priority. Enjoy a trusted and secure experience.</span>
              </div>
            </div>
          </div>

          <!-- Center Column (Mobile App Visual Preview with 3D Tilt) -->
          <div class="lg:col-span-4 flex justify-center py-4">
            <!-- Mobile Device Wrapper -->
            <div 
              @mousemove="handleCardMouseMove($event, 14)"
              @mouseleave="handleCardMouseLeave($event)"
              class="w-[310px] h-[620px] bg-gradient-to-tr from-[#3c0ca0]/20 via-[#ab8df0]/10 to-[#3c0ca0]/30 rounded-[48px] p-3.5 shadow-[0_25px_60px_rgba(60,12,160,0.2)] relative border-4 border-[#e9e5f5] transition-all duration-500 overflow-hidden flex flex-col items-center justify-center transform-style-3d cursor-pointer"
            >
              <div class="w-full h-full rounded-[36px] overflow-hidden border border-[#e9e5f5]/60 shadow-inner bg-white relative transform-style-3d">
                <img
                  src="@/assets/mobile1.png"
                  alt="KorpaBee Mobile App Preview"
                  class="w-full h-full object-cover object-top select-none animate-sway transform-style-3d"
                />
              </div>
            </div>
          </div>

          <!-- Right Column (Checklist and App Badges) -->
          <div class="lg:col-span-4 space-y-6 lg:pl-4">
            <h2 class="text-2xl sm:text-3xl font-black text-[#1f1635] leading-snug">Everything you need,<br /><span class="text-[#3c0ca0]">in one place.</span></h2>
            
            <!-- Checklist -->
            <ul class="space-y-3.5 text-sm">
              <li v-for="(item, idx) in ['Social Network', 'Platoon & State Groups', 'PPA Reviews & Ratings', 'Jobs & Internships', 'Housing & Roommates', 'Events & CDS Updates', 'Verified & Secure']" 
                  :key="idx"
                  class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#3c0ca0]/5 transition-colors"
              >
                <div class="w-5 h-5 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-full flex items-center justify-center text-[#3c0ca0] shrink-0 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                </div>
                <span class="font-bold text-[#1f1635]">{{ item }}</span>
              </li>
            </ul>

            <p class="text-xs text-navy-600 leading-relaxed pt-2">
              Join thousands of corps members building connections and better futures on KorpaBee.
            </p>

            <!-- App store buttons -->
            <div class="space-y-4 pt-2">
              <span class="block text-[10px] font-black tracking-widest text-[#3c0ca0] uppercase">GET THE APP</span>
              <div class="flex items-center gap-4">
                <div class="flex flex-col gap-2.5">
                  <button @click="openWaitlistModal" class="bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 flex items-center gap-2.5 w-44 hover:scale-[1.02] shadow-md transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" class="w-6 h-6"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58-33.3-60.7 60.7 60.7 60.7 58-33.3c15.2-8.7 25.3-24.8 25.3-42.4s-10.1-33.7-25.3-42.4zM385.4 337.8L104.6 499l220.7-221.2 60.1 60z"/></svg>
                    <div class="text-left leading-tight"><span class="block text-[8px] opacity-70">GET IT ON</span><span class="block text-xs font-bold font-mono">Google Play</span></div>
                  </button>
                  <button @click="openWaitlistModal" class="bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 flex items-center gap-2.5 w-44 hover:scale-[1.02] shadow-md transition-all cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" class="w-6 h-6"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.4-19.2-77.5-19.2-37.9 0-82.5 25.2-108.6 63.8-54.8 81.3-13.8 221.3 38.7 302.2 26 38.3 57.2 81.4 97.4 79.9 38.6-1.5 53.2-25.7 100.7-25.7 47 0 60.5 24.3 100.7 23.5 40.6-.8 68.2-39.1 94.2-77.2 30.1-44.1 42.4-86.8 43-88.9-1.2-.5-81.2-31.2-81.4-123.6zM224.2 92c21.2-25.7 35.5-61.4 31.6-92-25.7 1-56.9 17.1-75.4 38.6-16.1 18.7-30.1 54.9-26.3 84.8 28.7 2.2 58.7-15.7 70.1-31.4z"/></svg>
                    <div class="text-left leading-tight"><span class="block text-[8px] opacity-70">Download on the</span><span class="block text-xs font-bold font-mono">App Store</span></div>
                  </button>
                </div>
                
                <!-- Mock QR Code box -->
                <div class="w-20 h-20 bg-white border border-[#e9e5f5] rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform">
                  <div class="w-full h-full bg-[radial-gradient(#1f1635_2px,transparent_2px)] [background-size:6px_6px] rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Platform Stats Banner (Scroll Reveal) -->
      <section class="max-w-7xl mx-auto py-12 px-4 reveal-on-scroll">
        <div class="spotlight-card rounded-3xl p-8 shadow-xl shadow-purple-950/5 relative overflow-hidden"
             @mousemove="handleCardMouseMove($event, 4)"
             @mouseleave="handleCardMouseLeave($event)"
        >
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#e9e5f5]">
            <div class="space-y-1.5 py-4 md:py-0 hover:scale-105 transition-transform">
              <span class="block text-3xl sm:text-4xl font-black text-[#3c0ca0]">50K+</span>
              <span class="block text-xs font-bold uppercase tracking-wider text-navy-600">Active Corpers</span>
            </div>
            <div class="space-y-1.5 py-4 md:py-0 hover:scale-105 transition-transform">
              <span class="block text-3xl sm:text-4xl font-black text-[#3c0ca0]">2,500+</span>
              <span class="block text-xs font-bold uppercase tracking-wider text-navy-600">Verified PPAs</span>
            </div>
            <div class="space-y-1.5 py-4 md:py-0 hover:scale-105 transition-transform">
              <span class="block text-3xl sm:text-4xl font-black text-[#3c0ca0]">1,200+</span>
              <span class="block text-xs font-bold uppercase tracking-wider text-navy-600">Jobs & Gigs</span>
            </div>
            <div class="space-y-1.5 py-4 md:py-0 hover:scale-105 transition-transform">
              <span class="block text-3xl sm:text-4xl font-black text-[#3c0ca0]">₦45M+</span>
              <span class="block text-xs font-bold uppercase tracking-wider text-navy-600">Ajo Escrow Processed</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Spotlight Grid (Scroll Reveal + Spotlight 3D Tilt) -->
      <section id="features" class="max-w-7xl mx-auto py-16 border-t border-[#e9e5f5]/80">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4 reveal-on-scroll">
          <div class="inline-flex items-center gap-2 bg-[#aca064]/10 border border-[#aca064]/20 text-[#aca064] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
            Spotlight Features
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-[#1f1635] leading-tight">
            Designed to Solve the <span class="text-[#3c0ca0]">Corper's Struggles</span>
          </h2>
          <p class="text-sm text-navy-800 leading-relaxed max-w-xl mx-auto">
            From financial security and house-hunting to getting placements and social networking, KorpaBee supports your entire service year.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1: Social -->
          <div 
            @mousemove="handleCardMouseMove($event, 12)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-100 rounded-3xl p-6 shadow-xl shadow-purple-950/[0.03] flex flex-col justify-between cursor-pointer"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-2xl flex items-center justify-center text-[#3c0ca0] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a6 6 0 00-3.44-1.06m-5.12 0A6 6 0 006 18.72M9 9a9 9 0 00-9-9m9 9a9 9 0 019-9m-9 9v11.25m0-11.25a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-[#1f1635]">Corper Social & Chat</h3>
              <p class="text-xs text-navy-700 leading-relaxed">
                Connect in real-time. Join dedicated state, platoon, and batch group chats automatically. Share media and updates on Global or Scoped feeds.
              </p>
            </div>
            <div class="pt-4 border-t border-[#f3f1fa] mt-4 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#3c0ca0] tracking-wider">
              <span>Realtime Websockets</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#3c0ca0] animate-ping"></span>
            </div>
          </div>

          <!-- Card 2: Wallet & Ajo -->
          <div 
            @mousemove="handleCardMouseMove($event, 12)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-200 rounded-3xl p-6 shadow-xl shadow-purple-950/[0.03] flex flex-col justify-between cursor-pointer"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-2xl flex items-center justify-center text-[#3c0ca0] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <h3 class="text-base font-black text-[#1f1635]">Corper Wallet & Ajo</h3>
              <p class="text-xs text-navy-700 leading-relaxed">
                Save smarter. Participate in group contribution cycles (Ajo) secure in escrow. Deposit, top-up, withdraw, and track clearances easily.
              </p>
            </div>
            <div class="pt-4 border-t border-[#f3f1fa] mt-4 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#3c0ca0] tracking-wider">
              <span>Licensed Partners</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#3c0ca0]"></span>
            </div>
          </div>

          <!-- Card 3: Housing Map -->
          <div 
            @mousemove="handleCardMouseMove($event, 12)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-300 rounded-3xl p-6 shadow-xl shadow-purple-950/[0.03] flex flex-col justify-between cursor-pointer"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-2xl flex items-center justify-center text-[#3c0ca0] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25g3 3 0 1121 0z" />
                </svg>
              </div>
              <h3 class="text-base font-black text-[#1f1635]">Proximity Housing Match</h3>
              <p class="text-xs text-navy-700 leading-relaxed">
                Find verified rooms and compatible roommates using GPS and Haversine proximity calculations. Avoid listing scams and share costs safely.
              </p>
            </div>
            <div class="pt-4 border-t border-[#f3f1fa] mt-4 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#3c0ca0] tracking-wider">
              <span>GPS Proximity</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#3c0ca0]"></span>
            </div>
          </div>

          <!-- Card 4: Jobs Board -->
          <div 
            @mousemove="handleCardMouseMove($event, 12)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-400 rounded-3xl p-6 shadow-xl shadow-purple-950/[0.03] flex flex-col justify-between cursor-pointer"
          >
            <div class="space-y-4">
              <div class="w-12 h-12 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-2xl flex items-center justify-center text-[#3c0ca0] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 .414-.336.75-.75.75H4.5a.75.75 0 01-.75-.75v-4.25m16.5 0a3 3 0 00-3-3H7.02a3 3 0 00-3 3m16.5 0h-16.5m16.5 0v-3.5a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v.85" />
                </svg>
              </div>
              <h3 class="text-base font-black text-[#1f1635]">Opportunities & CVs</h3>
              <p class="text-xs text-navy-700 leading-relaxed">
                Build a professional resume inside the app with our CV builder. Apply with one click to verified internships, remote opportunities, and jobs.
              </p>
            </div>
            <div class="pt-4 border-t border-[#f3f1fa] mt-4 flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#3c0ca0] tracking-wider">
              <span>One-Click Apply</span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#3c0ca0]"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Timeline (Scroll Reveal) -->
      <section class="max-w-7xl mx-auto py-16 border-t border-[#e9e5f5]/80">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4 reveal-on-scroll">
          <div class="inline-flex items-center gap-2 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 text-[#3c0ca0] text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm">
            Onboarding Path
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-[#1f1635] leading-tight">
            Get Started in <span class="text-[#3c0ca0]">Three Steps</span>
          </h2>
          <p class="text-sm text-navy-800 leading-relaxed max-w-xl mx-auto">
            Our secure, AI-powered system verifies your identity to maintain community integrity and protect your privacy.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <!-- Step 1 -->
          <div 
            @mousemove="handleCardMouseMove($event, 10)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-100 space-y-4 p-6 rounded-3xl relative cursor-pointer"
          >
            <span class="absolute top-4 right-6 text-5xl font-black text-[#3c0ca0]/15 select-none">01</span>
            <div class="w-10 h-10 bg-[#3c0ca0] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-md shadow-[#3c0ca0]/20">
              Scan QR
            </div>
            <h4 class="text-sm font-black text-[#1f1635]">Secure KYC Scanning</h4>
            <p class="text-xs text-navy-700 leading-relaxed">
              Register and scan the QR code on your official Call-up letter. Upload a matching selfie to complete your profile verification automatically.
            </p>
          </div>

          <!-- Step 2 -->
          <div 
            @mousemove="handleCardMouseMove($event, 10)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-200 space-y-4 p-6 rounded-3xl relative cursor-pointer"
          >
            <span class="absolute top-4 right-6 text-5xl font-black text-[#3c0ca0]/15 select-none">02</span>
            <div class="w-10 h-10 bg-[#3c0ca0] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-md shadow-[#3c0ca0]/20">
              Auto-Join
            </div>
            <h4 class="text-sm font-black text-[#1f1635]">Join Peer Graph</h4>
            <p class="text-xs text-navy-700 leading-relaxed">
              Once verified, our service auto-discovers your state, platoon, and batch. You are instantly enrolled in official community channels and feeds.
            </p>
          </div>

          <!-- Step 3 -->
          <div 
            @mousemove="handleCardMouseMove($event, 10)"
            @mouseleave="handleCardMouseLeave($event)"
            class="spotlight-card reveal-on-scroll delay-300 space-y-4 p-6 rounded-3xl relative cursor-pointer"
          >
            <span class="absolute top-4 right-6 text-5xl font-black text-[#3c0ca0]/15 select-none">03</span>
            <div class="w-10 h-10 bg-[#3c0ca0] text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-md shadow-[#3c0ca0]/20">
              Explore
            </div>
            <h4 class="text-sm font-black text-[#1f1635]">Connect & Earn</h4>
            <p class="text-xs text-navy-700 leading-relaxed">
              Start looking up PPA ratings, matching roommates safely, tracking allowances in your digital wallet, or applying for jobs and internships.
            </p>
          </div>
        </div>
      </section>

      <!-- Business Dashboard Section (Scroll Reveal & Spotlight) -->
      <section id="about" class="max-w-7xl mx-auto py-12 border-t border-[#e9e5f5]/80 reveal-on-scroll">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Left info -->
          <div class="lg:col-span-4 space-y-6">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-[#3c0ca0] rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-md">K</div>
              <span class="font-extrabold text-lg tracking-tight">Korpa<span class="text-[#3c0ca0]">Bee</span> Business</span>
            </div>
            <h2 class="text-3xl sm:text-4xl font-black text-[#1f1635] leading-tight">
              Grow your business.<br />
              <span class="text-[#3c0ca0]">Reach thousands of corps members.</span>
            </h2>
            <p class="text-sm text-navy-800 leading-relaxed">
              Post jobs, run ads, promote events, list properties and more. Target verified members by state, platoon, or interests.
            </p>
            <button @click="openWaitlistModal" class="inline-flex bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm tracking-wide shadow-lg shadow-[#3c0ca0]/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer">
              Go to My Dashboard &rarr;
            </button>
          </div>

          <!-- Right Mockup Dashboard Visual with Spotlight 3D Tilt -->
          <div 
            @mousemove="handleCardMouseMove($event, 8)"
            @mouseleave="handleCardMouseLeave($event)"
            class="lg:col-span-8 spotlight-card rounded-3xl p-6 shadow-2xl relative overflow-hidden cursor-pointer"
          >
            <!-- Simulated Business Dashboard Layout -->
            <div class="flex gap-4">
              <!-- Left Sidebar Mock -->
              <div class="w-40 shrink-0 border-r border-[#e9e5f5] pr-4 space-y-3 hidden sm:block">
                <div class="flex items-center gap-1.5 pb-3 border-b border-[#e9e5f5]">
                  <div class="w-5 h-5 rounded bg-[#3c0ca0]/10 flex items-center justify-center text-[#3c0ca0] font-black text-[10px]">KB</div>
                  <span class="text-[9px] font-black text-[#1f1635]">KorpaBee Biz</span>
                </div>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-[#3c0ca0] bg-[#3c0ca0]/5 px-2 py-1.5 rounded-lg text-[9px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-[#3c0ca0]"></span> Dashboard</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Jobs</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Applicants</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Ads Manager</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Events</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Properties</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Analytics</div>
                  <div class="flex items-center gap-2 text-navy-400 px-2 py-1 text-[9px] hover:text-[#1f1635]">Subscription</div>
                </div>
              </div>

              <!-- Dashboard main preview content -->
              <div class="flex-1 space-y-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black text-[#1f1635]">Dashboard Overview</h4>
                  <span class="text-[8px] bg-[#eef0ff] text-[#3c0ca0] px-2 py-0.5 rounded font-mono font-bold">May 1 - May 31, 2025</span>
                </div>

                <!-- 4 mini stats cards -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div class="p-2.5 bg-[#f8f7fd] border border-[#e9e5f5] rounded-xl text-left hover:border-[#3c0ca0]/30 transition-colors">
                    <span class="block text-[8px] text-navy-400 uppercase tracking-wider font-bold">Total Views</span>
                    <span class="text-xs font-black text-[#1f1635]">128,540</span>
                    <span class="block text-[7px] text-emerald-500 font-bold mt-0.5">&uarr; 18.2%</span>
                  </div>
                  <div class="p-2.5 bg-[#f8f7fd] border border-[#e9e5f5] rounded-xl text-left hover:border-[#3c0ca0]/30 transition-colors">
                    <span class="block text-[8px] text-navy-400 uppercase tracking-wider font-bold">Applications</span>
                    <span class="text-xs font-black text-[#1f1635]">1,342</span>
                    <span class="block text-[7px] text-emerald-500 font-bold mt-0.5">&uarr; 24.8%</span>
                  </div>
                  <div class="p-2.5 bg-[#f8f7fd] border border-[#e9e5f5] rounded-xl text-left hover:border-[#3c0ca0]/30 transition-colors">
                    <span class="block text-[8px] text-navy-400 uppercase tracking-wider font-bold">Ad Impressions</span>
                    <span class="text-xs font-black text-[#1f1635]">234,832</span>
                    <span class="block text-[7px] text-emerald-500 font-bold mt-0.5">&uarr; 32.5%</span>
                  </div>
                  <div class="p-2.5 bg-[#f8f7fd] border border-[#e9e5f5] rounded-xl text-left hover:border-[#3c0ca0]/30 transition-colors">
                    <span class="block text-[8px] text-navy-400 uppercase tracking-wider font-bold">Clicks</span>
                    <span class="text-xs font-black text-[#1f1635]">8,923</span>
                    <span class="block text-[7px] text-emerald-500 font-bold mt-0.5">&uarr; 21.3%</span>
                  </div>
                </div>

                <!-- Recent Activities mock and chart preview -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Donut Chart visual simulation -->
                  <div class="p-3 border border-[#e9e5f5] rounded-xl flex flex-col justify-between bg-white">
                    <h5 class="text-[9px] font-black text-[#1f1635]">Ad Campaign Performance</h5>
                    <div class="h-20 flex items-center justify-center my-1">
                      <div class="w-14 h-14 rounded-full border-8 border-t-[#3c0ca0] border-r-rose-400 border-b-yellow-400 border-l-[#aca064] flex items-center justify-center font-bold text-[8px] shadow-sm">CTR 3.8%</div>
                    </div>
                    <div class="flex justify-between text-[7px] text-navy-400 border-t border-[#f3f1fa] pt-1">
                      <span>Impressions: 234,032</span>
                      <span>Spend: N250,000</span>
                    </div>
                  </div>

                  <!-- Recent activities -->
                  <div class="p-3 border border-[#e9e5f5] rounded-xl space-y-2 text-left bg-white">
                    <h5 class="text-[9px] font-black text-[#1f1635]">Recent Activities</h5>
                    <div class="space-y-1.5 text-[8px] leading-tight">
                      <div class="flex gap-2">
                        <span class="text-emerald-500 font-bold">&bull;</span>
                        <p class="text-navy-700">New application received for UI/UX Designer <span class="text-navy-400 block">2 mins ago</span></p>
                      </div>
                      <div class="flex gap-2">
                        <span class="text-emerald-500 font-bold">&bull;</span>
                        <p class="text-navy-700">Your ad "Corpers Needed" is now active <span class="text-navy-400 block">15 mins ago</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- FAQ Section Wrapper (Scroll Reveal) -->
      <div class="reveal-on-scroll">
        <AppFaqSection />
      </div>

      <!-- Contact Section (Scroll Reveal) -->
      <section id="contact" class="max-w-7xl mx-auto py-12 border-t border-[#e9e5f5]/80 reveal-on-scroll">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-5 space-y-4">
            <h2 class="text-xs font-bold text-[#3c0ca0] uppercase tracking-widest">Get In Touch</h2>
            <h3 class="text-3xl font-black text-[#1f1635]">Have Questions? We'd Love to Hear!</h3>
            <p class="text-sm text-navy-800 leading-relaxed">
              Whether you are a corp member having verification issues, a company interested in advertising options, or a landlord listing properties, reach out and our support team will respond within 24 hours.
            </p>
            <div class="space-y-2 text-xs text-navy-700 font-bold">
              <p class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-[#3c0ca0]"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <span>support@korpabee.com</span>
              </p>
            </div>
          </div>

          <!-- Contact form -->
          <div class="lg:col-span-7">
            <form @submit.prevent="handleContactSubmit" class="spotlight-card p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl shadow-purple-950/5">
              <div v-if="contactSuccess" class="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs rounded-xl font-bold">
                Message sent successfully! Our team will contact you shortly.
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[#1f1635] text-[10px] uppercase font-black tracking-wider mb-1.5">Your Name</label>
                  <input type="text" v-model="contactForm.name" required placeholder="e.g. John Doe" class="w-full bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] placeholder-navy-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#3c0ca0] transition-colors" />
                </div>
                <div>
                  <label class="block text-[#1f1635] text-[10px] uppercase font-black tracking-wider mb-1.5">Email Address</label>
                  <input type="email" v-model="contactForm.email" required placeholder="e.g. john@example.com" class="w-full bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] placeholder-navy-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#3c0ca0] transition-colors" />
                </div>
              </div>

              <div>
                <label class="block text-[#1f1635] text-[10px] uppercase font-black tracking-wider mb-1.5">Subject</label>
                <input type="text" v-model="contactForm.subject" required placeholder="e.g. Partnership Inquiry" class="w-full bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] placeholder-navy-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#3c0ca0] transition-colors" />
              </div>

              <div>
                <label class="block text-[#1f1635] text-[10px] uppercase font-black tracking-wider mb-1.5">Your Message</label>
                <textarea v-model="contactForm.message" required rows="4" placeholder="Write your message details here..." class="w-full bg-[#f8f7fd] border border-[#e9e5f5] text-[#1f1635] placeholder-navy-400 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#3c0ca0] transition-colors resize-none"></textarea>
              </div>

              <button type="submit" :disabled="submittingContact" class="w-full bg-gradient-to-r from-[#3c0ca0] to-[#5e32c7] hover:from-[#2d0979] hover:to-[#3c0ca0] text-white font-extrabold py-3.5 rounded-xl text-xs tracking-wide shadow-md shadow-[#3c0ca0]/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
                {{ submittingContact ? 'Sending Message...' : 'Submit Message' }}
              </button>
            </form>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="max-w-7xl mx-auto border-t border-[#e9e5f5] pt-8 px-6 mt-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-navy-500">
        <div class="flex items-center gap-2">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2.5 group shrink-0">
            <div class="relative w-24 h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src="@/assets/logo.png"
                  alt="KorpaBee Logo"
                  class="w-full h-full object-contain"
                />
              </div>
          </router-link>
          <span>&copy; 2026. All rights reserved.</span>
        </div>

        <div class="flex items-center gap-6">
          <router-link to="/privacy" class="hover:text-[#3c0ca0] transition-colors cursor-pointer font-bold">Privacy Policy</router-link>
          <router-link to="/terms" class="hover:text-[#3c0ca0] transition-colors cursor-pointer font-bold">Terms & Conditions</router-link>
          <router-link to="/disclaimer" class="hover:text-[#3c0ca0] transition-colors cursor-pointer font-bold">Disclaimer</router-link>
        </div>
      </div>

      <!-- Financial Disclaimer -->
      <div class="mt-6 pt-6 border-t border-[#f3f1fa] text-[9px] text-[#524479]/80 text-center md:text-left leading-relaxed">
        Disclaimer: KorpaBee is a social utility and community network, not a commercial bank or deposit-taking institution. Integrated digital wallet features, peer-to-peer escrow services for marketplace gig orders, and cooperative group savings are powered and secured in partnership with PCI-DSS compliant, CBN-licensed payment processors. Microcredit options and deposit products are provided exclusively by our licensed partner microfinance and commercial banks in Nigeria, with eligible customer deposits insured by the Nigeria Deposit Insurance Corporation (NDIC). All other utility services—including housing lists, roommate matchmaking, PPA ratings, and job board directories—are peer-driven tools provided for informational purposes only.
      </div>
    </footer>

    <!-- Waitlist Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="waitlistModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f052b]/60 backdrop-blur-md" @click.self="closeWaitlistModal">
          <Transition name="scale" appear>
            <div class="bg-white border border-[#e9e5f5] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <!-- Close button -->
              <button @click="closeWaitlistModal" class="absolute top-4 right-4 text-navy-400 hover:text-navy-900 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Modal Content -->
              <div v-if="!waitlistSuccess" class="space-y-4 text-left">
                <div class="w-12 h-12 bg-[#3c0ca0]/10 border border-[#3c0ca0]/20 rounded-2xl flex items-center justify-center text-[#3c0ca0] mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 class="text-xl font-black text-[#1f1635]">Join the Waitlist</h3>
                <p class="text-xs text-navy-700 leading-relaxed">
                  Be the first to know when we launch new features. Enter your email address to secure your spot.
                </p>

                <div class="pt-2">
                  <iframe
                    ref="tallyIframeRef"
                    :src="tallyEmbedUrl"
                    width="100%"
                    height="200"
                    frameborder="0"
                    marginheight="0"
                    marginwidth="0"
                    title="Join the Waitlist"
                    class="tally-iframe"
                  ></iframe>
                </div>
              </div>

              <!-- Success State -->
              <div v-else class="text-center py-6 space-y-4">
                <div class="w-16 h-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 class="text-xl font-black text-emerald-600">You're on the list!</h3>
                <p class="text-xs text-navy-700 leading-relaxed max-w-xs mx-auto">
                  Thank you for joining our waitlist! We have saved your spot and will send updates to your email.
                </p>
                <button @click="closeWaitlistModal" class="inline-flex bg-[#3c0ca0] hover:bg-[#2d0979] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs tracking-wide shadow-md active:scale-[0.98] transition-all cursor-pointer">
                  Done
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
<!-- AI Chat Widget -->
<ChatWidget />
<ScrollToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInstallPrompt } from '@/composables/useInstallPrompt'
import { useMouseSpotlight } from '@/composables/useMouseSpotlight'
import { useScrollReveal } from '@/composables/useScrollReveal'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFaqSection from '@/components/ui/AppFaqSection.vue'
import ChatWidget from '@/components/ui/ChatWidget.vue'
import ScrollToTop from '@/components/ui/ScrollToTop.vue'

const openModal = () => { openWaitlistModal() }
const router = useRouter()
const route = useRoute()
const { promptInstall } = useInstallPrompt()
const { handleCardMouseMove, handleCardMouseLeave } = useMouseSpotlight()
const { initScrollReveal } = useScrollReveal()

// ── Capture referral tag from URL (?ref=@john) and persist it ──
onMounted(() => {
  const refTag = route.query.ref
  if (refTag && typeof refTag === 'string' && refTag.trim()) {
    const sanitized = refTag.trim()
    sessionStorage.setItem('referrer_tag', sanitized)
    localStorage.setItem('referrer_tag', sanitized)
  }
})

// ── Tally waitlist embed ──
const TALLY_FORM_ID = 'rjbzBX'
const tallyEmbedUrl = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`

const waitlistModalOpen = ref(false)
const waitlistSuccess = ref(false)
const tallyIframeRef = ref(null)

const openWaitlistModal = () => {
  waitlistModalOpen.value = true
  waitlistSuccess.value = false
}

const closeWaitlistModal = () => {
  waitlistModalOpen.value = false
}

// Tally posts a window message when its form is submitted inside an iframe.
// We listen for it so we can show our own branded success screen instead
// of Tally's built-in one, and confirm the message came from our embed.
const handleTallyMessage = (event) => {
  if (typeof event.origin !== 'string' || !event.origin.includes('tally.so')) return

  let payload = event.data
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload)
    } catch {
      return
    }
  }

  if (payload?.event === 'Tally.FormSubmitted') {
    waitlistSuccess.value = true
  }
}

onMounted(() => {
  window.addEventListener('message', handleTallyMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleTallyMessage)
})

const handleRegisterClick = async () => {
  const result = await promptInstall()
  if (result !== 'dismissed' && result !== 'accepted') {
    router.push('/register')
  }
}

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const submittingContact = ref(false)
const contactSuccess = ref(false)

const handleContactSubmit = () => {
  submittingContact.value = true
  setTimeout(() => {
    submittingContact.value = false
    contactSuccess.value = true
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    setTimeout(() => {
      contactSuccess.value = false
    }, 5000)
  }, 1000)
}
</script>

<style scoped>
/* Scrollbar stylings */
::-webkit-scrollbar {
  width: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #aca064/30;
  border-radius: 99px;
}

/* Tally waitlist embed */
.tally-iframe {
  border: none;
  display: block;
}

/* Fade and scale transitions for waitlist modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.scale-enter-active, .scale-leave-active {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.35s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.92);
  opacity: 0;
}
.transform-style-3d {
  transform-style: preserve-3d;
}
.rotate-y-6 {
  transform: rotateY(-6deg);
}
.rotate-x-6 {
  transform: rotateX(6deg);
}

@keyframes sway {
  0%, 100% { transform: rotateY(-5deg) rotateZ(-2deg); }
  50% { transform: rotateY(5deg) rotateZ(2deg); }
}

.animate-sway {
  animation: sway 6s ease-in-out infinite;
}

</style>