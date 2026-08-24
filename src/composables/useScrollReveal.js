import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal() {
  let observer = null

  const initScrollReveal = () => {
    const options = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active')
          // Optionally unobserve if animation only runs once
          // observer.unobserve(entry.target)
        }
      })
    }, options)

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))
  }

  onMounted(() => {
    // Delay slightly to ensure DOM render completion
    setTimeout(() => {
      initScrollReveal()
    }, 100)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    initScrollReveal
  }
}
