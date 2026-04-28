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
        viewBox="-4 -4 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <path
          d="M16 2L27.5 9V23L16 30L4.5 23V9L16 2Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M14 12C11 10 7 11.5 7.5 15C8 18.5 12 18 14 16.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 12C21 10 25 11.5 24.5 15C24 18.5 20 18 18 16.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="14.5" r="1.8" fill="#F5A623" />
      </svg>
    )
  }

  if (variant === 'mono') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-4 -4 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
        style={{ overflow: 'visible', display: 'block' }}
      >
        <path
          d="M16 2L27.5 9V23L16 30L4.5 23V9L16 2Z"
          stroke="#EDEBE7"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="rgba(245,166,35,0.08)"
        />
        <path
          d="M14 12C11 10 7 11.5 7.5 15C8 18.5 12 18 14 16.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 12C21 10 25 11.5 24.5 15C24 18.5 20 18 18 16.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="14.5" r="1.8" fill="#EDEBE7" />
      </svg>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="-4 -4 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', display: 'block', flexShrink: 0 }}
      >
        <path
          d="M16 2L27.5 9V23L16 30L4.5 23V9L16 2Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M14 12C11 10 7 11.5 7.5 15C8 18.5 12 18 14 16.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 12C21 10 25 11.5 24.5 15C24 18.5 20 18 18 16.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="16" cy="14.5" r="1.8" fill="#F5A623" />
      </svg>
      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 400,
        fontSize: 18,
        color: '#EDEBE7',
        letterSpacing: -0.5,
      }}>
        Task
        <span style={{ fontWeight: 700, color: '#F5A623' }}>Bee</span>
      </span>
    </div>
  )
}
