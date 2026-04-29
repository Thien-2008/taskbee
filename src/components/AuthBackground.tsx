'use client'

import { useEffect, useState } from 'react'

export default function AuthBackground() {
  const [lowEnd, setLowEnd] = useState(false)

  useEffect(() => {
    // @ts-ignore
    const cores = navigator.hardwareConcurrency || 4
    // @ts-ignore
    const memory = navigator.deviceMemory || 4
    if (cores <= 2 || memory <= 2) setLowEnd(true)
  }, [])

  if (lowEnd) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,166,35,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.02) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(245,166,35,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      <div
        className="absolute w-[500px] h-[500px] rounded-full top-[-100px] left-[-100px] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'drift-1 25s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bottom-[-80px] right-[-80px] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'drift-2 30s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full top-[50%] left-[50%] block"
        style={{
          background: 'radial-gradient(circle, rgba(180,83,9,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
          animation: 'drift-3 20s ease-in-out infinite alternate',
        }}
      />

      <style>{`
        @keyframes drift-1 {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(60px, 40px) scale(1.15); }
        }
        @keyframes drift-2 {
          from { transform: translate(0, 0) scale(1.1); }
          to { transform: translate(-50px, -60px) scale(1); }
        }
        @keyframes drift-3 {
          from { transform: translate(-50%, -50%) scale(0.9); }
          to { transform: translate(-45%, -55%) scale(1.1); }
        }
        @media (max-width: 768px) {
          .md\\:block { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .md\\:block, .block { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
