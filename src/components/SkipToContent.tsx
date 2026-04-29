'use client'

import { useState } from 'react'

export default function SkipToContent() {
  const [top, setTop] = useState(-40)

  return (
    <a
      href="#main-content"
      onFocus={() => setTop(0)}
      onBlur={() => setTop(-40)}
      style={{
        position: 'absolute',
        top,
        left: 0,
        background: '#F5A623',
        color: '#000',
        padding: '8px 16px',
        zIndex: 9999,
        fontWeight: 700,
        transition: 'top 0.2s',
      }}
    >
      Bỏ qua điều hướng
    </a>
  )
}
