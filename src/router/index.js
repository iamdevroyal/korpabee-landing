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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0, behavior: 'instant' }
  }
})

export default router
