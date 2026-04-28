'use client'

import { useEffect } from 'react'

export default function NoSelectWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const preventLongPress = (e: Event) => {
      const target = e.target as HTMLElement
      // Cho phép long-press trong input, textarea, contenteditable
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.getAttribute('contenteditable') === 'true'
      ) {
        return
      }
      e.preventDefault()
    }

    document.addEventListener('selectstart', preventLongPress)
    document.addEventListener('contextmenu', preventLongPress)
    document.addEventListener('touchstart', preventLongPress, { passive: false })

    return () => {
      document.removeEventListener('selectstart', preventLongPress)
      document.removeEventListener('contextmenu', preventLongPress)
      document.removeEventListener('touchstart', preventLongPress)
    }
  }, [])

  return <>{children}</>
}
