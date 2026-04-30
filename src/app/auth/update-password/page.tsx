'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Lock, Check, AlertCircle, Loader2, Shield } from 'lucide-react'
import Logo from '@/components/Logo'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import AuthBackground from '@/components/AuthBackground'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [phase, setPhase] = useState<'loading' | 'form' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function init() {
      // Đọc token từ hash (cách Supabase gửi cho recovery) hoặc query string (fallback)
      let accessToken = ''
      let refreshToken = ''
      
      // Supabase gửi token qua hash fragment: #access_token=...&refresh_token=...&type=recovery
      const hash = window.location.hash.substring(1)
      if (hash) {
        const hashParams = new URLSearchParams(hash)
        accessToken = hashParams.get('access_token') || ''
        refreshToken = hashParams.get('refresh_token') || ''
      }
      
      // Nếu không có trong hash, thử query string (một số cấu hình email template có thể dùng query)
      if (!accessToken) {
        const searchParams = new URLSearchParams(window.location.search)
        accessToken = searchParams.get('access_token') || ''
        refreshToken = searchParams.get('refresh_token') || ''
      }

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setError('Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.')
          setPhase('error')
        }
        return
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (!cancelled) {
        if (error) {
          setError('Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
          setPhase('error')
        } else {
          setPhase('form')
        }
      }
    }
    init()
    return () => { cancelled = true }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Mật khẩu phải có ít nhất 8 ký tự.'); return }
    if (password !== confirmPw) { setError('Mật khẩu xác nhận không khớp.'); return }

    setSubmitting(true)
    setError('')
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      const msg = updateError.message.toLowerCase()
      if (msg.includes('expired') || msg.includes('invalid')) {
        setError('Liên kết đã hết hạn. Vui lòng yêu cầu lại.')
        setPhase('error')
      } else if (msg.includes('same') || msg.includes('different')) {
        setError('Mật khẩu mới không được trùng mật khẩu hiện tại.')
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau ít phút.')
      }
      return
    }

    setPhase('success')
    setTimeout(() => {
      router.replace('/auth?mode=login&reset=success')
    }, 2000)
  }

  const inputClass = "w-full px-0 py-3.5 bg-transparent border-0 text-[#EDEBE7] placeholder-gray-500 focus:outline-none font-dm-sans text-base caret-[#F5A623]"
  const fieldBorder = "border-b border-[#2A2A2E] focus-within:border-[#F5A623] transition-colors duration-300"

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center p-6 font-dm-sans overflow-hidden">
      <AuthBackground />
      <motion.button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#161618]/80 backdrop-blur-sm border border-[#2A2A2E] text-[#9A9AA6] hover:text-[#F5A623] hover:border-[#F5A623]/30 transition-all duration-300 group shadow-sm"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        aria-label="Quay về trang chủ"
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span className="text-xs font-medium">Trang chủ</span>
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="flex justify-end mb-8">
          <Logo size={32} variant="icon" />
        </div>
        <div className="bg-[#161618]/40 backdrop-blur-md border border-[#2A2A2E] rounded-2xl p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
              <Lock size={20} className="text-[#F5A623]" />
            </div>
            <h1 className="text-xl font-bold text-[#EDEBE7] font-space-grotesk">Đặt lại mật khẩu</h1>
            <p className="text-sm text-[#9A9AA6] text-center">
              {phase === 'loading' && 'Đang xác thực liên kết...'}
              {phase === 'form'   && 'Nhập mật khẩu mới cho tài khoản của bạn'}
              {phase === 'success'&& 'Mật khẩu đã được cập nhật!'}
              {phase === 'error'  && 'Không thể xác thực'}
            </p>
          </div>
          {phase === 'loading' && (
            <div className="flex justify-center py-4"><Loader2 size={24} className="animate-spin text-[#F5A623]" /></div>
          )}
          {phase === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm w-full">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> <span>{error}</span>
              </div>
              <button type="button" onClick={() => router.push('/auth?mode=forgot')} className="text-sm text-[#F5A623] hover:underline">Gửi lại email đặt lại mật khẩu</button>
            </div>
          )}
          {phase === 'success' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm text-[#EDEBE7]">Đổi mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.</p>
            </div>
          )}
          {phase === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className={fieldBorder}>
                <div className="flex items-center">
                  <input type={showPw ? 'text' : 'password'} required maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" className={`${inputClass} flex-1`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2" aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPw ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
              <PasswordStrengthBar password={password} />
              <div className={fieldBorder}>
                <div className="flex items-center">
                  <input type={showConfirm ? 'text' : 'password'} required maxLength={72} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Xác nhận mật khẩu mới" className={`${inputClass} flex-1`} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2" aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  {confirmPw.length > 0 && (
                    password === confirmPw ? <Check size={16} className="text-[#4ADE80] ml-2" /> : <AlertCircle size={16} className="text-[#F87171] ml-2" />
                  )}
                </div>
              </div>
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> <span>{error}</span>
                </div>
              )}
              <motion.button whileTap={{ scale: 0.98 }} disabled={submitting || password.length < 8 || password !== confirmPw} type="submit" className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                {submitting ? <><Loader2 className="animate-spin" size={20} /> Đang cập nhật...</> : 'Cập nhật mật khẩu'}
              </motion.button>
            </form>
          )}
        </div>
        <p className="text-center text-[11px] text-[#9A9AA6] mt-10 flex items-center justify-center gap-1.5">
          <Shield size={12} /> Kết nối an toàn · Mã hóa dữ liệu
        </p>
      </motion.div>
    </div>
  )
}
