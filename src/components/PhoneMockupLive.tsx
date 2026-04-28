'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Logo from '@/components/Logo'

function PhoneStatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 16px 4px',
      fontSize: 11,
      fontWeight: 600,
      color: '#EDEBE7',
    }}>
      <span>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Sóng */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <rect x="0" y="7" width="2" height="3" rx="0.5" fill="#EDEBE7"/>
          <rect x="3" y="4" width="2" height="6" rx="0.5" fill="#EDEBE7"/>
          <rect x="6" y="1" width="2" height="9" rx="0.5" fill="#EDEBE7"/>
          <rect x="9" y="0" width="2" height="10" rx="0.5" fill="#EDEBE7" opacity="0.4"/>
        </svg>
        {/* Pin */}
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <rect x="0" y="0" width="18" height="10" rx="2" stroke="#EDEBE7" strokeWidth="1" fill="none"/>
          <rect x="2" y="2" width="12" height="6" rx="1" fill="#EDEBE7"/>
          <rect x="18" y="3" width="3" height="4" rx="1" fill="#EDEBE7"/>
        </svg>
      </div>
    </div>
  )
}

export default function PhoneMockupLive() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0.6, filter: 'brightness(0.3) saturate(0.4)' }}
      animate={isInView ? { opacity: 1, filter: 'brightness(1) saturate(1)' } : {}}
      transition={{ duration: 1, ease: 'easeOut' }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 0',
        position: 'relative',
      }}
    >
      {/* Lớp phủ tối biến mất dần */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,10,11,0.85) 0%, rgba(10,10,11,0.3) 80%)',
          pointerEvents: 'none',
          zIndex: 10,
          borderRadius: 40,
        }}
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 0 } : {}}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Vòng sáng amber pulse */}
      {isInView && (
        <motion.div
          style={{
            position: 'absolute',
            inset: -30,
            background: 'radial-gradient(ellipse, rgba(245,166,35,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 5,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.1, 0.9] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      )}

      {/* Khung điện thoại */}
      <div style={{
        width: 280,
        height: 570,
        background: '#0a0a0b',
        border: '2px solid #1C1C1E',
        borderRadius: 36,
        padding: '12px 8px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,166,35,0.1)',
      }}>
        {/* Màn hình */}
        <div style={{
          background: '#0a0a0b',
          borderRadius: 24,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <PhoneStatusBar />

          {/* App header */}
          <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Logo size={22} variant="icon" />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#F5A623' }}>TaskBee</span>
          </div>

          {/* Số dư */}
          <div style={{ margin: '8px 16px', padding: '14px 16px', background: '#161618', borderRadius: 16, border: '1px solid #1C1C1E' }}>
            <div style={{ fontSize: 11, color: '#8A857D', marginBottom: 4 }}>Số dư khả dụng</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#EDEBE7' }}>245.000đ</div>
            <button style={{
              marginTop: 8,
              background: '#F5A623',
              color: '#000',
              border: 'none',
              padding: '6px 20px',
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'default',
            }}>Rút</button>
          </div>

          {/* Danh sách việc */}
          <div style={{ padding: '4px 16px', fontSize: 12, color: '#8A857D', marginTop: 4 }}>Việc gần bạn</div>
          <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { title: 'Chụp ảnh cửa hàng', time: '10 phút', price: '35.000đ' },
              { title: 'Khảo sát thị trường', time: '20 phút', price: '50.000đ' },
              { title: 'So sánh giá siêu thị', time: '15 phút', price: '25.000đ' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#161618',
                border: '1px solid #1C1C1E',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#EDEBE7' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#8A857D', marginTop: 2 }}>{item.time}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#F5A623' }}>{item.price}</div>
              </div>
            ))}
          </div>

          {/* Bottom safe area */}
          <div style={{ height: 20 }} />
        </div>
      </div>
    </motion.div>
  )
}
