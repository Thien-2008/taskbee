'use client'

import React from 'react'

interface LogoProps {
  size?: number
  variant?: 'full' | 'icon' | 'mono'
}

export default function Logo({ size = 28, variant = 'full' }: LogoProps) {
  const iconSize = size

  if (variant === 'icon') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-4 -4 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 21 C13 20, 11 22, 13 24 C11 26, 13 28, 16 27"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 21 C35 20, 37 22, 35 24 C37 26, 35 28, 32 27"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="24" r="2" fill="#F5A623" />
      </svg>
    )
  }

  if (variant === 'mono') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-4 -4 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#6B6B70"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 21 C13 20, 11 22, 13 24 C11 26, 13 28, 16 27"
          stroke="#6B6B70"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 21 C35 20, 37 22, 35 24 C37 26, 35 28, 32 27"
          stroke="#6B6B70"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="24" r="2" fill="#6B6B70" />
      </svg>
    )
  }

  // Full logo: icon + text
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-4 -4 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
      >
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M16 21 C13 20, 11 22, 13 24 C11 26, 13 28, 16 27"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 21 C35 20, 37 22, 35 24 C37 26, 35 28, 32 27"
          stroke="#F5A623"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="24" r="2" fill="#F5A623" />
      </svg>

      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: size * 0.75,
        color: '#EDEBE7',
        letterSpacing: '-0.3px',
      }}>
        Task<span style={{ color: '#F5A623' }}>Bee</span>
      </span>
    </div>
  )
}
