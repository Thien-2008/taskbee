'use client'

import { Shield, AlertTriangle } from 'lucide-react'

interface Props {
  countdown: number
  onExtend: () => void
  onLogout: () => void
}

export default function IdleWarningModal({ countdown, onExtend, onLogout }: Props) {
  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#161618', border: '1px solid #2A2A2E',
        borderRadius: 20, padding: '32px 24px', maxWidth: 380, width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 16 }}>
          <AlertTriangle size={40} color="#F5A623" />
        </div>
        <div style={{ fontSize: 13, color: '#9A9AA6', marginBottom: 8, fontFamily: 'DM Sans' }}>
          Phiên đăng nhập sắp hết hạn
        </div>
        <div style={{
          fontSize: 48, fontFamily: 'Space Grotesk', fontWeight: 700,
          color: '#F5A623', marginBottom: 8,
        }}>
          {minutes}:{String(seconds).padStart(2, '0')}
        </div>
        <p style={{ fontSize: 14, color: '#6B6B70', marginBottom: 24, lineHeight: 1.6, fontFamily: 'DM Sans' }}>
          Để bảo vệ tài khoản, bạn sẽ tự động đăng xuất sau khoảng thời gian không hoạt động.
        </p>
        <button onClick={onExtend} style={{
          width: '100%', padding: '14px', background: '#F5A623',
          border: 'none', borderRadius: 12, fontWeight: 700,
          fontSize: 15, cursor: 'pointer', marginBottom: 10,
          fontFamily: 'DM Sans', color: '#000',
        }}>
          Tiếp tục phiên
        </button>
        <button onClick={onLogout} style={{
          width: '100%', padding: '14px', background: 'transparent',
          border: '1px solid #2A2A2E', borderRadius: 12,
          color: '#9A9AA6', fontSize: 14, cursor: 'pointer',
          fontFamily: 'DM Sans',
        }}>
          Đăng xuất ngay
        </button>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, color: '#4A4A50' }}>
          <Shield size={12} /> Bảo vệ tài khoản của bạn
        </div>
      </div>
    </div>
  )
}
