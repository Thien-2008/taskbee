'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LogoReveal() {
  const [visible, setVisible] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Ép SVG overflow visible bằng JS thuần để chắc chắn không bị cắt
    if (svgRef.current) {
      svgRef.current.setAttribute('overflow', 'visible')
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0a0a0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            overflow: 'visible', // Cho phép phần thừa của SVG lòi ra ngoài
          }}
        >
          {/* Container có kích thước lớn hơn SVG, không cắt bất cứ gì */}
          <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
            <motion.svg
              ref={svgRef}
              width="120"
              height="120"
              viewBox="-4 -4 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ overflow: 'visible' }}
            >
              {/* Lục giác */}
              <motion.path
                d="M16 2L27.5 9V23L16 30L4.5 23V9L16 2Z"
                stroke="#F5A623"
                strokeWidth="1.8"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
              />

              {/* Cánh trái */}
              <motion.path
                d="M14 12C11 10 7 11.5 7.5 15C8 18.5 12 18 14 16.5"
                stroke="#F5A623"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: [0, -3, 0, 3, 0] }}
                transition={{
                  opacity: { delay: 0.8, duration: 0.3 },
                  rotate: { delay: 1.0, duration: 0.5, repeat: 2, repeatType: 'mirror' },
                }}
                style={{ transformOrigin: 'right center' }}
              />

              {/* Cánh phải */}
              <motion.path
                d="M18 12C21 10 25 11.5 24.5 15C24 18.5 20 18 18 16.5"
                stroke="#F5A623"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: [0, 3, 0, -3, 0] }}
                transition={{
                  opacity: { delay: 0.8, duration: 0.3 },
                  rotate: { delay: 1.0, duration: 0.5, repeat: 2, repeatType: 'mirror' },
                }}
                style={{ transformOrigin: 'left center' }}
              />

              {/* Chấm trung tâm */}
              <motion.circle
                cx="16"
                cy="14.5"
                r="1.8"
                fill="#F5A623"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 1.1, duration: 0.3, ease: 'easeOut' }}
              />

              {/* Tia sáng quét */}
              <motion.circle
                cx="16"
                cy="14.5"
                r="20"
                fill="none"
                stroke="#F5A623"
                strokeWidth="0.5"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: [0, 0.6, 0], pathLength: 1 }}
                transition={{ delay: 1.3, duration: 0.7, ease: 'easeInOut' }}
              />
            </motion.svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
