'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SignatureMoment({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 500)
    const timer2 = setTimeout(() => setPhase(2), 1500)
    const timer3 = setTimeout(() => {
      setPhase(3)
      onComplete()
    }, 2200)
    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-32 h-32">
            {/* 6 mảnh lục giác */}
            {[...Array(6)].map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180
              const x = Math.cos(angle) * 60
              const y = Math.sin(angle) * 60
              return (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 border-2 border-[#F5A623] bg-[#F5A623]/20"
                  style={{
                    borderRadius: '4px',
                    left: '50%',
                    top: '50%',
                    marginLeft: -16,
                    marginTop: -16,
                  }}
                  animate={{
                    x: phase >= 1 ? x : 0,
                    y: phase >= 1 ? y : 0,
                    rotate: phase >= 1 ? 360 : 0,
                    opacity: phase >= 2 ? 0 : 1,
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                />
              )
            })}
            {/* Logo trung tâm */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: phase >= 1 ? 1.5 : 0.8,
                opacity: phase >= 2 ? 0 : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z" stroke="#F5A623" strokeWidth="2" fill="none" />
                <circle cx="24" cy="22" r="3" fill="#F5A623" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
