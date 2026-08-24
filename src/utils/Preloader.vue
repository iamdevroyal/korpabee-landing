<template>
  <div class="fixed inset-0 z-[100] grid place-items-center bg-bg transition-opacity duration-500" :class="{ 'opacity-0 pointer-events-none': !loading }">
    <div class="relative flex flex-col items-center justify-center">
      <!-- Glow Effect emanating from center -->
      <div class="absolute inset-0 flex items-center justify-center">
        <!-- Contrasting accent glow (Cyan/Green) -->
        <div class="w-32 h-32 bg-[#00e69d]/40 blur-[40px] rounded-full animate-pulse-glow"></div>
        <div class="absolute w-48 h-48 bg-[#6ea8ff]/20 blur-[60px] rounded-full animate-ripple" style="animation-delay: 0.2s"></div>
      </div>
      
      <!-- Logo Container -->
      <div class="relative z-10 w-24 h-24 sm:w-32 sm:h-32">
        <!-- Logo Image: Spin + Pulse + Drop Shadow Glow -->
        <img 
          src="/logo-icon.png" 
          alt="KorpaBee Loading" 
          class="w-full h-full object-contain animate-spin-pulse drop-shadow-glow"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  loading: boolean
}>()
</script>

<style scoped>
.animate-spin-pulse {
  animation: spin-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-ripple {
  animation: ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.drop-shadow-glow {
  filter: drop-shadow(0 0 15px rgba(0, 230, 157, 0.6));
}

@keyframes spin-pulse {
  0% { 
    transform: rotate(0deg) scale(0.9); 
  }
  50% { 
    transform: rotate(180deg) scale(1.2); 
  }
  100% { 
    transform: rotate(360deg) scale(0.9); 
  }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 0.8; transform: scale(1.3); }
}

@keyframes ripple {
  0% { 
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% { 
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
