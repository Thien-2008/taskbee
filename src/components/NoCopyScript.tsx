'use client'

import { useEffect } from 'react'

export default function NoCopyScript() {
  useEffect(() => {
    const prevent = (e: Event) => {
      const target = e.target as HTMLElement
      // Cho phép chọn trong input/textarea
      if (['INPUT','TEXTAREA'].includes(target.tagName) || target.isContentEditable) return
      e.preventDefault()
    }

    document.addEventListener('selectstart', prevent)
    document.addEventListener('contextmenu', prevent)

    return () => {
      document.removeEventListener('selectstart', prevent)
      document.removeEventListener('contextmenu', prevent)
    }
  }, [])

  return null // không render gì cả
}
