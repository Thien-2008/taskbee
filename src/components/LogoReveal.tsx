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
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            background: '#0a0a0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Logo SVG */}
          <motion.svg
            width="120"
            height="120"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Lục giác */}
            <motion.path
              d="M16 2L27.5 9V23L16 30L4.5 23V9L16 2Z"
              stroke="#F5A623"
              strokeWidth="1.8"
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
              transition={{ opacity: { delay: 0.8, duration: 0.3 }, rotate: { delay: 1.0, duration: 0.5, repeat: 2, repeatType: 'mirror' } }}
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
              transition={{ opacity: { delay: 0.8, duration: 0.3 }, rotate: { delay: 1.0, duration: 0.5, repeat: 2, repeatType: 'mirror' } }}
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
              cy="14"
              r="20"
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
