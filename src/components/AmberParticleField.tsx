'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; baseX: number; baseY: number
  vx: number; vy: number; opacity: number; size: number
}

export default function AmberParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = canvas.width, h = canvas.height, id: number
    let particles: Particle[] = []
    let touchX: number | null = null, touchY: number | null = null
    let mouseX: number | null = null, mouseY: number | null = null
    let mounted = true
    let active = true

    const onVisibility = () => { active = !document.hidden }
    document.addEventListener('visibilitychange', onVisibility)

    function init() {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
      const count = w < 768 ? 60 : 120
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        baseX: Math.random() * w, baseY: Math.random() * h,
        vx: 0, vy: 0,
        opacity: Math.random() * 0.12 + 0.03,
        size: Math.random() * 2 + 1,
      }))
    }

    function animate() {
      if (!mounted || !active || !ctx || !canvas) { id = requestAnimationFrame(animate); return }
      ctx.clearRect(0, 0, w, h)
      const ix = touchX ?? mouseX, iy = touchY ?? mouseY

      for (const p of particles) {
        if (ix !== null && iy !== null) {
          const dx = p.x - ix, dy = p.y - iy, dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 100) {
            const f = (100 - dist) / 100, a = Math.atan2(dy, dx)
            p.vx += Math.cos(a) * f * 2
            p.vy += Math.sin(a) * f * 2
          }
        }
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.9; p.vy *= 0.9
        p.x += (p.baseX - p.x) * 0.01
        p.y += (p.baseY - p.y) * 0.01

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2)
        ctx.fillStyle = `rgba(245,166,35,${p.opacity})`
        ctx.fill()
      }
      id = requestAnimationFrame(animate)
    }

    init(); animate()
    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length) { touchX = e.touches[0].clientX; touchY = e.touches[0].clientY }
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchstart', onTouch)
    window.addEventListener('touchmove', onTouch)
    window.addEventListener('touchend', () => { touchX = null; touchY = null })
    window.addEventListener('mouseleave', () => { mouseX = null; mouseY = null })
    window.addEventListener('resize', init)

    return () => {
      mounted = false
      cancelAnimationFrame(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      tabIndex={-1}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        touchAction: 'pan-y',
      }}
    />
  )
}
