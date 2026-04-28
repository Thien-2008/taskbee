'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LogoReveal() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200)
    return () => clearTimeout(timer)
  }, [])

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
          }}
        >
          <motion.svg
            width="140"
            height="140"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ overflow: 'visible' }}
          >
            {/* Lục giác ngoài */}
            <motion.path
              d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
              stroke="#F5A623"
              strokeWidth="1.8"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
            />

            {/* Cánh trái */}
            <motion.path
              d="M22 20C19 18 15 19.5 15.5 23C16 26.5 20 26 22 24.5"
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
              d="M26 20C29 18 33 19.5 32.5 23C32 26.5 28 26 26 24.5"
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
              cx="24"
              cy="22.5"
              r="1.8"
              fill="#F5A623"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 1.1, duration: 0.3, ease: 'easeOut' }}
            />

            {/* Tia sáng quét */}
            <motion.circle
              cx="24"
              cy="22"
              r="22"
              fill="none"
              stroke="#F5A623"
              strokeWidth="0.5"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: [0, 0.6, 0], pathLength: 1 }}
              transition={{ delay: 1.3, duration: 0.7, ease: 'easeInOut' }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
