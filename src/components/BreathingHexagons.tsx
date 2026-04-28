'use client'

import { useEffect, useRef } from 'react'

interface HexCell {
  x: number
  y: number
  opacity: number
  targetOpacity: number
  radius: number
}

export default function BreathingHexagons() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = canvas.width
    let height = canvas.height
    let animationId: number
    let hexagons: HexCell[] = []

    // Hàm vẽ lục giác
    function drawHexagon(x: number, y: number, radius: number, opacity: number) {
      if (!ctx) return
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const px = x + radius * Math.cos(angle)
        const py = y + radius * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(245, 166, 35, ${opacity * 0.15})`
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Khởi tạo lưới lục giác
    function initGrid() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height

      const hexRadius = 30
      const rowHeight = hexRadius * 1.5
      const colWidth = hexRadius * Math.sqrt(3)
      const cols = Math.ceil(width / colWidth) + 2
      const rows = Math.ceil(height / rowHeight) + 2

      hexagons = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * colWidth + (row % 2) * colWidth / 2
          const y = row * rowHeight
          hexagons.push({
            x,
            y,
            opacity: 0.02,
            targetOpacity: 0.02,
            radius: hexRadius,
          })
        }
      }
    }

    // Hiệu ứng "thở": chọn ngẫu nhiên một ô để sáng lên
    function triggerBreath() {
      if (hexagons.length === 0) return
      const idx = Math.floor(Math.random() * hexagons.length)
      hexagons[idx].targetOpacity = 0.4 + Math.random() * 0.3
      setTimeout(() => {
        hexagons[idx].targetOpacity = 0.02
      }, 600 + Math.random() * 400)
    }

    // Vòng lặp animation
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)

      // Cập nhật opacity
      for (const hex of hexagons) {
        hex.opacity += (hex.targetOpacity - hex.opacity) * 0.08
      }

      // Vẽ các ô
      for (const hex of hexagons) {
        if (hex.opacity > 0.01) {
          drawHexagon(hex.x, hex.y, hex.radius, hex.opacity)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    initGrid()
    animate()

    // Kích hoạt "thở" mỗi 800ms
    const breathInterval = setInterval(triggerBreath, 800)

    // Resize handler
    const handleResize = () => {
      initGrid()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      clearInterval(breathInterval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
