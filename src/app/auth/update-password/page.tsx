'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowLeft, Lock, Check, AlertCircle, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import AuthBackground from '@/components/AuthBackground'

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center text-[#9A9AA6]">
        <Loader2 className="animate-spin text-[#F5A623]" size={24} />
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  )
}

function UpdatePasswordForm() {
  const router = useRouter()
  const [supabase] = useState(() =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [phase, setPhase] = useState<'loading' | 'form' | 'success' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let cancelled = false
    async function init() {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken || !refreshToken) {
        if (!cancelled) {
          setErrorMsg('Liên kết không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.')
          setPhase('error')
        }
        return
      }

      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      if (cancelled) return
      if (error) {
        setErrorMsg('Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.')
        setPhase('error')
      } else {
        setPhase('form')
      }
    }
    init()
    return () => { cancelled = true }
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setErrorMsg('Mật khẩu phải có ít nhất 8 ký tự.'); return }
    if (password !== confirmPw) { setErrorMsg('Mật khẩu xác nhận không khớp.'); return }
    setSubmitting(true)
    setErrorMsg('')
    const { error } = await supabase.auth.updateUser({ password })
    setSubmitting(false)
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('expired') || msg.includes('invalid')) {
        setErrorMsg('Liên kết đã hết hạn. Vui lòng yêu cầu lại.')
        setPhase('error')
      } else if (msg.includes('same')) {
        setErrorMsg('Mật khẩu mới không được trùng mật khẩu cũ.')
      } else {
        setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại.')
      }
      return
    }
    setPhase('success')
    setTimeout(() => router.push('/dashboard?reset=success'), 2000)
  }

  const inputClass = "w-full bg-transparent border border-[#2A2A2E] rounded-xl px-4 py-3 text-sm text-[#EDEBE7] placeholder-[#4A4A50] outline-none focus:ring-1 focus:ring-[#F5A623] focus:border-[#F5A623] caret-[#F5A623] pr-11 transition-all duration-200"
  const btnClass = "w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-[#F5A623] text-black hover:bg-[#FFC04D] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"

  return (
    <div className="relative min-h-[100dvh] bg-[#0a0a0b] flex flex-col items-center justify-center p-6 overflow-hidden font-dm-sans">
      <AuthBackground />

      <div className="absolute top-6 left-6 z-20">
        <button type="button" onClick={() => router.push('/')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2A2A2E] bg-[#161618]/80 text-xs text-[#9A9AA6] hover:text-[#F5A623] hover:border-[#F5A623]/30 transition-colors">
          <ArrowLeft size={14} /> Trang chủ
        </button>
      </div>
      <div className="absolute top-6 right-6 z-20">
        <Logo variant="icon" size={32} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm z-10">
        <div className="bg-[#161618]/40 backdrop-blur-md border border-[#2A2A2E] rounded-2xl p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F5A623]/10 flex items-center justify-center">
              <Lock size={20} className="text-[#F5A623]" />
            </div>
            <h1 className="text-xl font-bold text-[#EDEBE7]">Đặt lại mật khẩu</h1>
            <p className="text-sm text-[#9A9AA6] text-center">
              {phase === 'loading' && 'Đang xác thực liên kết...'}
              {phase === 'form' && 'Nhập mật khẩu mới cho tài khoản của bạn'}
              {phase === 'success' && 'Mật khẩu đã được cập nhật!'}
              {phase === 'error' && 'Không thể xác thực'}
            </p>
          </div>

          {phase === 'loading' && <div className="flex justify-center py-4"><Loader2 size={24} className="animate-spin text-[#F5A623]" /></div>}

          {phase === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm w-full">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {errorMsg}
              </div>
              <button type="button" onClick={() => router.push('/auth?mode=forgot')} className="text-sm text-[#F5A623] hover:underline">Gửi lại email đặt lại mật khẩu</button>
            </div>
          )}

          {phase === 'success' && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm text-[#EDEBE7]">Đang chuyển về Dashboard...</p>
            </div>
          )}

          {phase === 'form' && (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9A9AA6] uppercase tracking-wide">Mật khẩu mới</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới" maxLength={72} required autoComplete="new-password" className={inputClass} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A50] hover:text-[#9A9AA6]" aria-label={showPw ? 'Ẩn' : 'Hiện'}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrengthBar password={password} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-[#9A9AA6] uppercase tracking-wide">Xác nhận mật khẩu</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Nhập lại mật khẩu" maxLength={72} required autoComplete="new-password" className={inputClass} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A4A50] hover:text-[#9A9AA6]" aria-label={showConfirm ? 'Ẩn' : 'Hiện'}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPw.length > 0 && (
                  <p className={`text-xs ${password === confirmPw ? 'text-emerald-400' : 'text-red-400'}`}>
                    {password === confirmPw ? 'Mật khẩu khớp' : 'Mật khẩu không khớp'}
                  </p>
                )}
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {errorMsg}
                </div>
              )}

              <button type="submit" disabled={submitting || password.length < 8 || password !== confirmPw} className={btnClass}>
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Đang cập nhật...</> : 'Cập nhật mật khẩu'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-[#4A4A50] mt-6 flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          Kết nối an toàn · Mã hóa dữ liệu
        </p>
      </motion.div>
    </div>
  )
}
