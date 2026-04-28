'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'

export default function BeeTrailScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const pathLength = useMotionValue(0)
  
  useEffect(() => {
    const unsubscribe = smoothProgress.onChange(v => {
      pathLength.set(v)
    })
    return unsubscribe
  }, [smoothProgress, pathLength])

  return (
    <div
      ref={containerRef}
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
        {/* Đường chính của ong */}
        <motion.path
          d="M 20,100 Q 40,200 20,300 T 20,500 T 20,700 T 20,900 T 20,1100 T 20,1300"
          fill="none"
          stroke="#F5A623"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          style={{ pathLength }}
        />
        {/* Đường phụ mờ ảo */}
        <motion.path
          d="M 20,100 Q 40,200 20,300 T 20,500 T 20,700 T 20,900 T 20,1100 T 20,1300"
          fill="none"
          stroke="#F5A623"
          strokeWidth="6"
          strokeLinecap="round"
          opacity={0.2}
          initial={{ pathLength: 0 }}
          style={{ pathLength }}
          
        />
      </svg>
    </div>
  )
}
