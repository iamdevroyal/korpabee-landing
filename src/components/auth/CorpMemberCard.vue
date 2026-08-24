<template>
  <div class="w-full max-w-sm bg-white border border-[#e9e5f5] rounded-3xl overflow-hidden shadow-xl relative transition-all duration-300">
    <!-- Top banner with state code/nysc logo theme color -->
    <div class="h-2.5 bg-gradient-to-r from-[#3c0ca0] via-[#5925a2] to-[#aca064] w-full"></div>

    <div class="p-5 relative z-10">
      <!-- Watermark/pattern in background -->
      <div class="absolute inset-0 bg-[radial-gradient(#3c0ca0_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.03] pointer-events-none rounded-3xl"></div>

      <!-- Header with status badge -->
      <div class="flex items-center justify-between mb-4 border-b border-[#e9e5f5] pb-3">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-[#3c0ca0]/5 border border-[#3c0ca0]/10 rounded-lg flex items-center justify-center text-[#3c0ca0]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div>
            <h4 class="text-[9px] font-black text-[#1f1635]/65 uppercase tracking-wider leading-none">NYSC Verification</h4>
            <span class="text-[9px] text-[#3c0ca0] font-black tracking-widest uppercase">Verified Corper</span>
          </div>
        </div>

        <span class="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Active
        </span>
      </div>

      <!-- Main Profile Section -->
      <div class="flex gap-4 items-center sm:items-start mb-4">
        <!-- Photo/Avatar -->
        <div class="relative shrink-0">
          <div class="w-20 h-20 rounded-xl overflow-hidden border border-[#3c0ca0]/20 shadow-md bg-[#f8f7fd] flex items-center justify-center">
            <img 
              v-if="member.photo" 
              :src="member.photo" 
              alt="Passport Photo" 
              class="w-full h-full object-cover"
            />
            <div v-else class="text-navy-400 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </div>
          <div class="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border border-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-2.5 h-2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        <!-- Identity Details -->
        <div class="flex-1 space-y-1 w-full text-left">
          <h3 class="text-base font-black text-[#1f1635] leading-tight">{{ member.name }}</h3>
          
          <div class="flex flex-col gap-0.5 text-[10px] text-navy-600">
            <div class="flex items-center gap-1">
              <span>Call-up No:</span>
              <span class="font-mono font-bold text-[#1f1635]">{{ member.nysc_id || member.call_up_number }}</span>
            </div>
            <div class="flex items-center gap-1">
              <span>State Code:</span>
              <span class="font-mono font-bold text-[#3c0ca0]">{{ member.state_code }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Details Grid -->
      <div class="grid grid-cols-2 gap-x-4 gap-y-2 bg-[#f8f7fd] border border-[#e9e5f5] rounded-xl p-3 text-[10px] text-[#1f1635]">
        <div>
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">Date of Birth</span>
          <span class="font-bold">{{ member.date_of_birth }}</span>
        </div>
        <div>
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">Gender</span>
          <span class="font-bold capitalize">{{ member.gender }}</span>
        </div>
        <div>
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">Blood Group</span>
          <span class="font-bold">{{ member.blood_group || 'Not Specified' }}</span>
        </div>
        <div>
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">State of Origin</span>
          <span class="font-bold">{{ member.state_of_origin }}</span>
        </div>
        <div class="col-span-2 border-t border-[#e9e5f5] pt-1.5 mt-0.5">
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">State of Deployment</span>
          <span class="font-extrabold text-[#3c0ca0]">{{ member.deployment_state }}</span>
        </div>
        <div class="col-span-2">
          <span class="block text-navy-400 text-[8px] uppercase tracking-wider font-bold">Valid Till</span>
          <span class="font-bold text-navy-700">{{ member.valid_till }}</span>
        </div>
      </div>
      
      <!-- Footer verification note -->
      <p class="text-[9px] text-center text-navy-400 mt-3.5 italic">
        "This is a valid ID Card belonging to a serving Corps Member"
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  member: {
    type: Object,
    required: true
  }
})
</script>
