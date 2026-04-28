import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function BeeMascot({ isFocused }: { isFocused: boolean }) {
  const [isWatching, setIsWatching] = useState(false)

  useEffect(() => {
    if (isFocused) {
      setIsWatching(true)
      const timer = setTimeout(() => setIsWatching(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isFocused])

  return (
    <motion.div
      className="absolute right-3 top-3 w-10 h-10"
      animate={{
        rotate: isWatching ? [0, -15, 15, 0] : 0,
        scale: isWatching ? 1.2 : 1,
      }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="12" ry="15" fill="#F5A623" opacity="0.8" />
        <ellipse cx="14" cy="12" rx="6" ry="4" fill="#F5A623" opacity="0.6" />
        <ellipse cx="26" cy="12" rx="6" ry="4" fill="#F5A623" opacity="0.6" />
      </svg>
    </motion.div>
  )
}
