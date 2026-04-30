'use client'

import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

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
          <p style={{ fontSize: 13, color: '#9A9AA6', lineHeight: 1.8, margin: 0 }}>
            Nền tảng việc làm vi mô trên điện thoại. Kết nối người cần việc với người cần làm.
          </p>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Sản phẩm</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <Link href="/how-it-works" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Cách hoạt động</Link>
            <Link href="/business" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Dành cho doanh nghiệp</Link>
            <Link href="/community" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Tiêu chuẩn cộng đồng</Link>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Hỗ trợ & Pháp lý</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <Link href="/terms" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Điều khoản sử dụng</Link>
            <Link href="/privacy" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Chính sách bảo mật</Link>
            <Link href="/contact" style={{ color: '#9A9AA6', textDecoration: 'none' }}>Liên hệ hỗ trợ</Link>
            <a href="mailto:taskbee.support@gmail.com" style={{ color: '#9A9AA6', textDecoration: 'none' }}>taskbee.support@gmail.com</a>
          </div>
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        marginTop: 32,
        fontSize: 12,
        color: '#9A9AA6',
        borderTop: '1px solid #1C1C1E',
        paddingTop: 16,
      }}>
        © {currentYear} TaskBee. Tất cả các quyền được bảo lưu.
      </div>
    </footer>
  )
}
