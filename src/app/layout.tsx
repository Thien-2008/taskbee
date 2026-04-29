import type { Metadata } from 'next'
import './globals.css'
import NoCopyScript from '@/components/NoCopyScript'

export const metadata: Metadata = {
  title: 'TaskBee — Việc nhỏ, thu nhập thật',
  description: 'Nền tảng việc làm vi mô. Làm trên điện thoại, nhận tiền minh bạch.',
  openGraph: {
    title: 'TaskBee — Việc nhỏ, thu nhập thật',
    description: 'Không cần kinh nghiệm, không cần hồ sơ.',
    siteName: 'TaskBee',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            top: -40,
            left: 0,
            background: '#F5A623',
            color: '#000',
            padding: '8px 16px',
            zIndex: 9999,
            fontWeight: 700,
            transition: 'top 0.2s',
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.top = '0' }}
          onBlur={(e) => { (e.target as HTMLElement).style.top = '-40px' }}
        >
          Bỏ qua điều hướng
        </a>
        <NoCopyScript />
        {children}
      </body>
    </html>
  )
}
