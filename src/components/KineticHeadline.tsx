'use client'

import { useEffect, useRef, useState } from 'react'

interface KineticHeadlineProps {
  text: string
  amberText?: string
  style?: React.CSSProperties
}

export default function KineticHeadline({ text, amberText, style }: KineticHeadlineProps) {
  const [stretch, setStretch] = useState(1)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY
          const now = Date.now()
          const deltaY = Math.abs(currentY - lastScrollY.current)
          const deltaTime = now - lastTime.current
          
          // Tính vận tốc cuộn (px/ms)
          const velocity = deltaTime > 0 ? deltaY / deltaTime : 0
          
          // Map velocity thành scale X: velocity 0 → scale 1, velocity 2+ → scale 1.08
          const targetStretch = Math.min(1.08, 1 + velocity * 0.04)
          setStretch(targetStretch)

          lastScrollY.current = currentY
          lastTime.current = now
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Spring-back effect khi không scroll
  useEffect(() => {
    if (stretch === 1) return
    const timer = setTimeout(() => {
      setStretch(prev => {
        const newVal = prev + (1 - prev) * 0.3
        return Math.abs(newVal - 1) < 0.001 ? 1 : newVal
      })
    }, 50)
    return () => clearTimeout(timer)
  }, [stretch])

  return (
    <h1
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(40px, 7vw, 72px)',
        lineHeight: 1.05,
        letterSpacing: -1.5,
        maxWidth: 700,
        margin: '0 auto',
        transition: 'transform 100ms ease-out',
        transform: `scaleX(${stretch})`,
        display: 'inline-block',
        ...style,
      }}
    >
      {text}
      {amberText && (
        <>
          <br />
          <span style={{ color: '#F5A623' }}>{amberText}</span>
        </>
      )}
    </h1>
  )
}
