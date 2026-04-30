'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

function BeeMascot({ progress }: { progress: number }) {
  const y = Math.max(5, Math.min(95, progress * 100))

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: -2,
        top: `${y}%`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
      animate={{ x: [0, 3, 0, -3, 0], y: [0, -2, 0, 2, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <ellipse cx="5" cy="4" rx="3" ry="2" fill="#F5A623" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" values="-10 5 4;10 5 4;-10 5 4" dur="0.2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="9" cy="4" rx="3" ry="2" fill="#F5A623" opacity="0.4">
          <animateTransform attributeName="transform" type="rotate" values="10 9 4;-10 9 4;10 9 4" dur="0.2s" repeatCount="indefinite"/>
        </ellipse>
        <ellipse cx="7" cy="7.5" rx="3" ry="4" fill="#F5A623" opacity="0.5"/>
      </svg>
    </motion.div>
  )
}

export default function BeeTrailScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="trailGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0" />
            <stop offset="15%" stopColor="#F5A623" stopOpacity="0.5" />
            <stop offset="85%" stopColor="#F5A623" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 4,80 Q 8,160 4,240 T 4,400 T 4,560 T 4,720 T 4,880 T 4,1040 T 4,1200"
          fill="none"
          stroke="url(#trailGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          style={{ pathLength: smoothProgress }}
        />
        <motion.path
          d="M 4,80 Q 8,160 4,240 T 4,400 T 4,560 T 4,720 T 4,880 T 4,1040 T 4,1200"
          fill="none"
          stroke="#F5A623"
          strokeWidth="6"
          strokeLinecap="round"
          opacity={0.1}
          initial={{ pathLength: 0 }}
          style={{ pathLength: smoothProgress }}
        />
      </svg>
      <BeeMascot progress={smoothProgress.get()} />
    </div>
  )
}
