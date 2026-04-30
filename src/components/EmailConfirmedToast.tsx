'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function EmailConfirmedToast() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!show) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500/10 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg backdrop-blur-sm">
      <CheckCircle size={20} />
      <span className="font-medium">Xác nhận email thành công! Bạn có thể đăng nhập ngay.</span>
    </div>
  )
}
