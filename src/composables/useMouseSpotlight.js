import { ref, onMounted, onUnmounted } from 'vue'

export function useMouseSpotlight() {
  const mousePos = ref({ x: 0, y: 0 })

  const handleGlobalMouseMove = (e) => {
    mousePos.value = {
      x: e.clientX,
      y: e.clientY
    }
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleGlobalMouseMove)
  })

  // Function to attach 3D tilt & dynamic spotlight to individual card elements
  const handleCardMouseMove = (event, maxTilt = 10) => {
    const card = event.currentTarget
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Percentages for CSS background radial gradient
    const mouseXPercent = (x / rect.width) * 100
    const mouseYPercent = (y / rect.height) * 100

    card.style.setProperty('--mouse-x', `${mouseXPercent}%`)
    card.style.setProperty('--mouse-y', `${mouseYPercent}%`)

    // 3D Tilt rotation angles
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const tiltX = ((y - centerY) / centerY) * -maxTilt
    const tiltY = ((x - centerX) / centerX) * maxTilt

    card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    card.style.transition = 'transform 0.1s ease-out'
  }

  const handleCardMouseLeave = (event) => {
    const card = event.currentTarget
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }

  return {
    mousePos,
    handleCardMouseMove,
    handleCardMouseLeave
  }
}
