import Link from 'next/link'
import Logo from '@/components/Logo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 font-dm-sans">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <Logo size={64} variant="icon" />
        </div>
        <h1 className="text-6xl font-space-grotesk font-bold text-[#F5A623] mb-4">404</h1>
        <p className="text-xl text-[#EDEBE7] mb-2 font-space-grotesk">Trang không tồn tại</p>
        <p className="text-sm text-[#9A9AA6] mb-8">Có vẻ bạn đã lạc đường. Đừng lo, hãy quay lại trang chủ.</p>
        <Link href="/" className="inline-block bg-[#F5A623] text-black font-bold py-3 px-8 rounded-xl hover:bg-[#FFC04D] transition-all">
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
