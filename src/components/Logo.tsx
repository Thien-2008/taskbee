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
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
        style={{ overflow: 'visible' }}
      >
        {/* Lục giác – dịch vào giữa 4 đơn vị */}
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          fill="none"
        />
        {/* Cánh trái */}
        <path
          d="M22 20C19 18 15 19.5 15.5 23C16 26.5 20 26 22 24.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cánh phải */}
        <path
          d="M26 20C29 18 33 19.5 32.5 23C32 26.5 28 26 26 24.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Chấm trung tâm */}
        <circle cx="24" cy="22.5" r="1.8" fill="#F5A623" />
      </svg>
    )
  }

  if (variant === 'mono') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
        style={{ overflow: 'visible' }}
      >
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#EDEBE7"
          strokeWidth="1.8"
          fill="rgba(245,166,35,0.08)"
        />
        <path
          d="M22 20C19 18 15 19.5 15.5 23C16 26.5 20 26 22 24.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M26 20C29 18 33 19.5 32.5 23C32 26.5 28 26 26 24.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="22.5" r="1.8" fill="#EDEBE7" />
      </svg>
    )
  }

  // Full logo: icon + text
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <path
          d="M24 8L35.5 15V31L24 38L12.5 31V15L24 8Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M22 20C19 18 15 19.5 15.5 23C16 26.5 20 26 22 24.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M26 20C29 18 33 19.5 32.5 23C32 26.5 28 26 26 24.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="22.5" r="1.8" fill="#F5A623" />
      </svg>
      <span
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 400,
          fontSize: 18,
          color: '#EDEBE7',
          letterSpacing: -0.5,
        }}
      >
        Task
        <span style={{ fontWeight: 700, color: '#F5A623' }}>Bee</span>
      </span>
    </div>
  )
}
