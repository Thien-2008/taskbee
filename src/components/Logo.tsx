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
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
      >
        <path
          d="M20 4L31.5 11V27L20 34L8.5 27V11L20 4Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M18 16C15 14 11 15.5 11.5 19C12 22.5 16 22 18 20.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 16C25 14 29 15.5 28.5 19C28 22.5 24 22 22 20.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="18.5" r="1.8" fill="#F5A623" />
      </svg>
    )
  }

  if (variant === 'mono') {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="TaskBee"
      >
        <path
          d="M20 4L31.5 11V27L20 34L8.5 27V11L20 4Z"
          stroke="#EDEBE7"
          strokeWidth="1.8"
          fill="rgba(245,166,35,0.08)"
        />
        <path
          d="M18 16C15 14 11 15.5 11.5 19C12 22.5 16 22 18 20.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 16C25 14 29 15.5 28.5 19C28 22.5 24 22 22 20.5"
          stroke="#EDEBE7"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="18.5" r="1.8" fill="#EDEBE7" />
      </svg>
    )
  }

  // Full logo: icon + text
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 4L31.5 11V27L20 34L8.5 27V11L20 4Z"
          stroke="#F5A623"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M18 16C15 14 11 15.5 11.5 19C12 22.5 16 22 18 20.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M22 16C25 14 29 15.5 28.5 19C28 22.5 24 22 22 20.5"
          stroke="#F5A623"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="20" cy="18.5" r="1.8" fill="#F5A623" />
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
