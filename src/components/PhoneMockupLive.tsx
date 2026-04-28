'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PhoneMockup from './PhoneMockup'

export default function PhoneMockupLive() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.6, filter: 'brightness(0.4) saturate(0.5)' }}
      animate={
        isInView
          ? { opacity: 1, filter: 'brightness(1) saturate(1)' }
          : {}
      }
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{ position: 'relative' }}
    >
      {/* Lớp phủ tối – sáng dần rồi biến mất hoàn toàn */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 32,
        }}
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.3 }}
      />

      {/* Vòng sáng amber pulse nhẹ khi sáng lên */}
      {isInView && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(ellipse, rgba(245,166,35,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.1, 0.9] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      )}

      <PhoneMockup />
    </motion.div>
  )
}
