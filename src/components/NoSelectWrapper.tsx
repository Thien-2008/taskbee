'use client'

import { useEffect } from 'react'

export default function NoSelectWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const block = (e: Event) => {
      const t = e.target as HTMLElement
      if (['INPUT','TEXTAREA'].includes(t.tagName) || t.isContentEditable) return
      e.preventDefault()
    }

    const blockTouch = (e: TouchEvent) => {
      const t = e.target as HTMLElement
      if (['INPUT','TEXTAREA'].includes(t.tagName) || t.isContentEditable) return
      if (e.touches.length > 1) return
      e.preventDefault()
    }

    document.addEventListener('selectstart', block)
    document.addEventListener('contextmenu', block)
    document.addEventListener('touchstart', blockTouch, { passive: false })
    document.addEventListener('touchend', blockTouch, { passive: false })
    document.addEventListener('pointerdown', block)

    return () => {
      document.removeEventListener('selectstart', block)
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('touchstart', blockTouch)
      document.removeEventListener('touchend', blockTouch)
      document.removeEventListener('pointerdown', block)
    }
  }, [])

  return (
    <div style={{
      WebkitUserSelect: 'none',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitTapHighlightColor: 'transparent',
    }}>
      {children}
    </div>
  )
}
