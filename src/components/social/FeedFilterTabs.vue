<template>
  <div class="bg-white px-4 py-1 flex items-center justify-between">
    <nav class="flex space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="selectTab(tab.value)"
        :class="[
          'relative py-3 text-sm font-semibold tracking-wide transition-all duration-300 border-b-2 outline-none focus:outline-none flex items-center space-x-1.5 whitespace-nowrap',
          activeTab === tab.value
            ? 'border-[#6C5CE7] text-[#6C5CE7] font-bold border-b-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg p-2'
            : 'border-transparent text-[#6C5CE7] hover:text-[#4a3aa0]'
        ]"
      >
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:activeTab'])

const selectTab = (tabValue) => {
  emit('update:activeTab', tabValue)
}


const tabs = [
  { value: 'global', label: 'Global Feed' },
  { value: 'state', label: 'State Feed' },
  { value: 'platoon', label: 'Platoon Feed' },
  { value: 'batch', label: 'Batch Feed' }
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
