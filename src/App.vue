<template>
  <router-view />
  <AppInstallPrompt app-name="KorpaBee" icon="/icon/ios/apple-touch-icon-180.png" />
</template>

<script setup>
import AppInstallPrompt from '@/components/common/AppInstallPrompt.vue'
</script>
