import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingPage.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/legal/PrivacyPage.vue')
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/legal/TermsPage.vue')
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: () => import('@/views/legal/DisclaimerPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
