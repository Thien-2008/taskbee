'use client'

import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function StickyCTA() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll()

  // Chỉ hiển thị khi scroll qua 20% trang và trước 85% trang
  const opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0])
  const translateY = useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [80, 0, 0, 80])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return null

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        opacity,
        y: translateY,
        padding: '12px 20px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: 'rgba(10,10,11,0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(245,166,35,0.15)',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <motion.button
        onClick={() => router.push('/auth?mode=register')}
        style={{
          background: '#F5A623',
          color: '#000',
          border: 'none',
          padding: '14px 32px',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 16,
          fontFamily: "'DM Sans', sans-serif",
          cursor: 'pointer',
          width: '100%',
          maxWidth: 400,
          pointerEvents: 'auto',
          boxShadow: '0 4px 20px rgba(245,166,35,0.3)',
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Tạo tài khoản miễn phí
      </motion.button>
    </motion.div>
  )
}
