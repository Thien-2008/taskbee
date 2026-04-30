'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TorchCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [visible, setVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      setIsTouch(true)
      // Tắt hoàn toàn TorchCursor trên mobile
      return
    }

    setIsTouch(false)

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Không render gì trên mobile
  if (isTouch || !visible) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: 300,
        height: 300,
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle at center, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'lighten',
        isolation: 'isolate',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}
