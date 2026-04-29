import type { Metadata } from 'next'
import './globals.css'
import NoCopyScript from '@/components/NoCopyScript'
import SkipToContent from '@/components/SkipToContent'
import JsonLd from '@/components/JsonLd'

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
    <html lang="vi" style={{ backgroundColor: '#0a0a0b', color: '#EDEBE7' }}>
      <body>
        <SkipToContent />
        <JsonLd />
        <NoCopyScript />
        {children}
      </body>
    </html>
  )
}
