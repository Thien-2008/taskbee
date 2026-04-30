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
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash || window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

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
      } else if (msg.includes('same')) {
        setError('Mật khẩu mới không được trùng mật khẩu cũ.')
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau ít phút.')
      }
      return
    }

    setPhase('success')
    setTimeout(() => router.push('/dashboard?reset=success'), 2500)
  }

  const inputClass = "w-full bg-transparent border rounded-xl px-4 py-3.5 text-sm text-[#EDEBE7] placeholder-[#4A4A50] outline-none transition-all duration-300 focus:ring-1 focus:ring-[#F5A623] focus:border-[#F5A623] border-[#2A2A2E] caret-[#F5A623] pr-11"
  const btnClass = "w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-[#F5A623] text-black hover:bg-[#FFC04D] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(245,166,35,0.2)]"

  return (
    <div className="relative min-h-[100dvh] bg-[#0a0a0b] flex flex-col items-center justify-center p-6 overflow-hidden font-dm-sans">
      <AuthBackground />

      {/* Header */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2A2A2E] bg-[#161618]/80 text-xs text-[#9A9AA6] hover:text-[#F5A623] hover:border-[#F5A623]/30 transition-colors"
        >
          <ArrowLeft size={14} />
          Trang chủ
        </button>
      </div>
      <div className="absolute top-6 right-6 z-20">
        <Logo variant="icon" size={32} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm z-10"
      >
        <div className="bg-[#161618]/60 backdrop-blur-xl border border-[#2A2A2E] rounded-2xl p-8 shadow-2xl shadow-black/50">
          {/* Icon & Title */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center shadow-[0_0_30px_rgba(245,166,35,0.1)]">
              <Lock size={24} className="text-[#F5A623]" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#EDEBE7] font-space-grotesk">
                Đặt lại mật khẩu
              </h1>
              <p className="text-sm text-[#9A9AA6] mt-2">
                {phase === 'loading' && 'Đang xác thực liên kết...'}
                {phase === 'form' && 'Nhập mật khẩu mới cho tài khoản của bạn'}
                {phase === 'success' && 'Mật khẩu đã được cập nhật!'}
                {phase === 'error' && 'Không thể xác thực'}
              </p>
            </div>
          </div>

          {/* Loading */}
          {phase === 'loading' && (
            <div className="flex justify-center py-6">
              <Loader2 size={28} className="animate-spin text-[#F5A623]" />
            </div>
          )}

          {/* Error */}
          {phase === 'error' && (
            <div className="flex flex-col items-center gap-5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm w-full">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/auth?mode=forgot')}
                className="text-sm text-[#F5A623] hover:underline"
              >
                Gửi lại email đặt lại mật khẩu
              </button>
            </div>
          )}

          {/* Success */}
          {phase === 'success' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <Check size={28} className="text-emerald-400" />
              </motion.div>
              <p className="text-sm text-[#EDEBE7] text-center">
                Đang chuyển về Dashboard...
              </p>
            </div>
          )}

          {/* Form */}
          {phase === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {/* Mật khẩu mới */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#9A9AA6] uppercase tracking-wide">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    maxLength={72}
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A50] hover:text-[#9A9AA6] transition-colors"
                    aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PasswordStrengthBar password={password} />
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[#9A9AA6] uppercase tracking-wide">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPw}
                    onChange={e => setConfirmPw(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    maxLength={72}
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A50] hover:text-[#9A9AA6] transition-colors"
                    aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPw.length > 0 && (
                  <p className={`text-xs ${password === confirmPw ? 'text-emerald-400' : 'text-red-400'}`}>
                    {password === confirmPw ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </p>
                )}
              </div>

              {/* Lỗi (nếu có trong form) */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || password.length < 8 || password !== confirmPw}
                className={btnClass}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật mật khẩu'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Trust line */}
        <p className="text-center text-[11px] text-[#4A4A50] mt-6 flex items-center justify-center gap-1.5">
          <Shield size={12} />
          Kết nối an toàn · Mã hóa dữ liệu
        </p>
      </motion.div>
    </div>
  )
}
