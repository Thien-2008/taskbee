import type { Metadata } from 'next'
import './globals.css'
import NoSelectWrapper from '@/components/NoSelectWrapper'

export const metadata: Metadata = {
  title: 'TaskBee - Nền tảng việc làm vi mô',
  description: 'Kiếm tiền thật, minh bạch, không cần hồ sơ.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <NoSelectWrapper>
          {children}
        </NoSelectWrapper>
      </body>
    </html>
  )
}
