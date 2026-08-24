import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/LandingPage.vue'),
    meta: {
      title: 'KorpaBee - The All-in-One NYSC Social, Opportunity & Lifestyle Platform',
      description: 'KorpaBee helps Nigerian NYSC corps members connect with platoon & state groups, discover verified PPA reviews, find housing & roommates, access job opportunities, and save with Ajo wallet escrow.',
      keywords: 'NYSC, Corps Members Nigeria, NYSC Community, NYSC Jobs, NYSC Opportunities, Korpabee, Corpers Nigeria, NYSC Accommodation, PPA Jobs, Service Year, NYSC Camp, POP',
      canonical: 'https://korpabee.com/'
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/legal/PrivacyPage.vue'),
    meta: {
      title: 'Privacy Policy | KorpaBee',
      description: 'Learn how KorpaBee collects, uses, protects, and handles your personal data across the KorpaBee platform and services.',
      keywords: 'KorpaBee Privacy Policy, Data Protection, NYSC App Privacy, Corper Safety',
      canonical: 'https://korpabee.com/privacy'
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/legal/TermsPage.vue'),
    meta: {
      title: 'Terms of Service | KorpaBee',
      description: 'Review the terms, guidelines, user agreements, and service policies for using the KorpaBee platform and services.',
      keywords: 'KorpaBee Terms of Service, User Agreement, NYSC Platform Rules',
      canonical: 'https://korpabee.com/terms'
    }
  },
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component: () => import('@/views/legal/DisclaimerPage.vue'),
    meta: {
      title: 'Legal Disclaimer | KorpaBee',
      description: 'Read the official financial, utility, and user-generated content disclaimer for KorpaBee platform.',
      keywords: 'KorpaBee Disclaimer, Financial Disclaimer, PPA Review Disclaimer',
      canonical: 'https://korpabee.com/disclaimer'
    }
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

// Navigation guard to update head metadata dynamically on route transitions
router.afterEach((to) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // Helper function to update or create meta tags
  const setMetaTag = (selector, attribute, value) => {
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      if (selector.includes('name=')) {
        const nameVal = selector.match(/name="([^"]+)"/)[1]
        el.setAttribute('name', nameVal)
      } else if (selector.includes('property=')) {
        const propVal = selector.match(/property="([^"]+)"/)[1]
        el.setAttribute('property', propVal)
      }
      document.head.appendChild(el)
    }
    el.setAttribute(attribute, value)
  }

  if (to.meta.description) {
    setMetaTag('meta[name="description"]', 'content', to.meta.description)
    setMetaTag('meta[property="og:description"]', 'content', to.meta.description)
    setMetaTag('meta[name="twitter:description"]', 'content', to.meta.description)
  }

  if (to.meta.title) {
    setMetaTag('meta[property="og:title"]', 'content', to.meta.title)
    setMetaTag('meta[name="twitter:title"]', 'content', to.meta.title)
  }

  if (to.meta.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', to.meta.canonical)
    setMetaTag('meta[property="og:url"]', 'content', to.meta.canonical)
  }
})

export default router
