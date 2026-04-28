'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #1C1C1E',
      padding: '40px 24px',
      background: '#0a0a0b',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 32,
      }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <Logo size={24} variant="full" />
          </div>
          <p style={{ fontSize: 13, color: '#8A857D', lineHeight: 1.8, margin: 0 }}>
            Nền tảng việc làm vi mô trên điện thoại. Kết nối người cần việc với người cần làm.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Sản phẩm</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <Link href="/how-it-works" style={{ color: '#8A857D', textDecoration: 'none' }}>Cách hoạt động</Link>
            <Link href="/business" style={{ color: '#8A857D', textDecoration: 'none' }}>Dành cho doanh nghiệp</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Hỗ trợ & Pháp lý</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <Link href="/terms" style={{ color: '#8A857D', textDecoration: 'none' }}>Điều khoản sử dụng</Link>
            <Link href="/privacy" style={{ color: '#8A857D', textDecoration: 'none' }}>Chính sách bảo mật</Link>
            <Link href="/contact" style={{ color: '#8A857D', textDecoration: 'none' }}>Liên hệ hỗ trợ</Link>
            <span style={{ color: '#8A857D' }}>support@taskbee.vn</span>
          </div>
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: 32,
        fontSize: 12,
        color: '#8A857D',
        borderTop: '1px solid #1C1C1E',
        paddingTop: 16,
      }}>
        © 2025 TaskBee. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  )
}
