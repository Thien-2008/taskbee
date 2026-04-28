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
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <rect x="0" y="7" width="2" height="3" rx="0.5" fill="#EDEBE7"/>
          <rect x="3" y="4" width="2" height="6" rx="0.5" fill="#EDEBE7"/>
          <rect x="6" y="1" width="2" height="9" rx="0.5" fill="#EDEBE7"/>
          <rect x="9" y="0" width="2" height="10" rx="0.5" fill="#EDEBE7" opacity="0.4"/>
        </svg>
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
          <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Logo size={22} variant="icon" />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: '#F5A623' }}>TaskBee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
              <span style={{ fontSize: 10, color: '#8A857D' }}>Trực tuyến</span>
            </div>
          </div>

          {/* Balance Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            style={{
              margin: '8px 16px',
              padding: '16px',
              background: 'rgba(22,22,24,0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: 16,
              border: '1px solid rgba(245,166,35,0.15)',
            }}
          >
            <div style={{ fontSize: 11, color: '#8A857D', marginBottom: 4 }}>Số dư khả dụng</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: '#EDEBE7', letterSpacing: -0.5 }}>
              248.500đ
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <div style={{ fontSize: 11, color: '#8A857D' }}>Cập nhật cách đây 2 phút</div>
              <button style={{
                background: '#F5A623',
                color: '#000',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 20,
                fontWeight: 700,
                fontSize: 12,
                cursor: 'default',
              }}>Rút tiền</button>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', gap: 8, margin: '8px 16px' }}
          >
            {[
              { label: 'Đang thực hiện', value: '2', color: '#F5A623' },
              { label: 'Chờ duyệt', value: '1', color: '#8A857D' },
              { label: 'Hoàn thành', value: '14', color: '#34D399' },
            ].map((stat, i) => (
              <div key={i} style={{
                flex: 1,
                background: '#161618',
                border: '1px solid #1C1C1E',
                borderRadius: 12,
                padding: '12px 8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: stat.color, fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: '#8A857D', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
            style={{ margin: '8px 16px', flex: 1 }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#8A857D', marginBottom: 8 }}>Hoạt động gần đây</div>
            {[
              { label: 'Nhiệm vụ được duyệt', status: '+15.000đ', time: 'Vừa xong', color: '#34D399' },
              { label: 'Nhiệm vụ đã gửi kết quả', status: 'Đang kiểm tra', time: '12 phút trước', color: '#F5A623' },
              { label: 'Yêu cầu rút tiền', status: 'Đang xử lý', time: '1 giờ trước', color: '#8A857D' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: i === 0 ? 'rgba(52,211,153,0.05)' : 'transparent',
                  borderRadius: 10,
                  marginBottom: 4,
                }}
              >
                <div style={{ fontSize: 12, color: '#EDEBE7' }}>{item.label}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.status}</div>
                  <div style={{ fontSize: 10, color: '#5C5A55' }}>{item.time}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div style={{ height: 20 }} />
        </div>
      </div>
    </motion.div>
  )
}
