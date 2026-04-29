'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Check, X, Mail, User, Lock, Loader2, LogIn, Shield, AlertCircle, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import PasswordStrengthBar from '@/components/PasswordStrengthBar'
import AuthBackground from '@/components/AuthBackground'
import { validateUsername } from '@/lib/usernameValidation'

function translateError(errorMessage: string): string {
  if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
    return 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.'
  }
  if (errorMessage.includes('Invalid login')) {
    return 'Email hoặc mật khẩu không đúng.'
  }
  if (errorMessage.includes('Email not confirmed')) {
    return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư.'
  }
  return errorMessage || 'Đăng ký thất bại. Vui lòng thử lại.'
}

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const modeParam = searchParams.get('mode') || 'login'
  const reasonParam = searchParams.get('reason')
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!))

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(modeParam as 'login' | 'register' | 'forgot')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [shake, setShake] = useState(false)
  const [rememberEmail, setRememberEmail] = useState(false)
  const [resetCooldown, setResetCooldown] = useState(0)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('taskbee_email')
    if (saved) { setEmail(saved); setRememberEmail(true) }
  }, [])

  useEffect(() => {
    if (resetCooldown > 0) {
      const timer = setTimeout(() => setResetCooldown(resetCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resetCooldown])

  const passMatch = confirmPass.length > 0 && password === confirmPass
  const passMismatch = confirmPass.length > 0 && password !== confirmPass

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const cleanEmail = email.trim().toLowerCase()
    setEmail(cleanEmail)
    const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
    if (error) { setError(translateError(error.message)); setShake(true); setTimeout(() => setShake(false), 600) }
    else {
      if (rememberEmail) { localStorage.setItem('taskbee_email', cleanEmail) }
      else { localStorage.removeItem('taskbee_email') }
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!agreeTerms) { setError('Vui lòng đồng ý điều khoản'); return }
    const usernameError = validateUsername(username)
    if (usernameError) { setError(usernameError); return }
    if (password.length < 8) { setError('Mật khẩu tối thiểu 8 ký tự'); return }
    if (password !== confirmPass) { setError('Mật khẩu không khớp'); return }
    setLoading(true)
    const cleanEmail = email.trim().toLowerCase()
    setEmail(cleanEmail)
    const cleanUsername = username.trim()
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { username: cleanUsername, full_name: cleanUsername },
      },
    })
    if (error) {
      setError(translateError(error.message))
      setShake(true)
      setTimeout(() => setShake(false), 600)
    } else {
      setError('')
      setSuccess('Đăng ký thành công! Kiểm tra email để xác minh tài khoản.')
      setMode('login')
    }
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const cleanEmail = email.trim().toLowerCase()
    setEmail(cleanEmail)
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail)
    if (error) setError(translateError(error.message))
    else { setSuccess('Email reset đã được gửi. Nếu không thấy, hãy kiểm tra mục Spam / Quảng cáo.'); setResetCooldown(60) }
    setLoading(false)
  }

  const resetForm = () => { setError(''); setSuccess(''); setEmail(''); setPassword(''); setUsername(''); setConfirmPass(''); setAgreeTerms(false) }

  const inputClass = "w-full px-0 py-3.5 bg-transparent border-0 text-[#EDEBE7] placeholder-gray-500 focus:outline-none font-dm-sans text-base caret-[#F5A623]"
  const fieldBorder = "border-b border-[#2A2A2E] focus-within:border-[#F5A623] transition-colors duration-300"

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center p-6 font-dm-sans overflow-hidden">
      <AuthBackground />
      <motion.div
        initial={{ left: '-100%' }}
        animate={{ left: '100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
        style={{ position: 'fixed', top: 0, width: 2, height: '100%', background: 'linear-gradient(180deg, transparent, #F5A623, transparent)', zIndex: 50, pointerEvents: 'none' }}
      />
      <motion.button
        onClick={() => router.push('/')}
        className="fixed top-6 left-6 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#161618]/80 backdrop-blur-sm border border-[#2A2A2E] text-[#9A9AA6] hover:text-[#F5A623] hover:border-[#F5A623]/30 transition-all duration-300 group shadow-sm"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
      >
        <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
        <span className="text-xs font-medium">Trang chủ</span>
      </motion.button>
      <motion.div
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="flex justify-end mb-8">
          <Logo size={32} variant="icon" />
        </div>
        {reasonParam === 'idle' && (
          <div className="text-center mb-4 text-[#F5A623] text-sm">
            Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
          </div>
        )}
        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-8">Đăng nhập vào tài khoản</h1>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} aria-describedby={error ? "auth-error" : undefined} /></div>
                <div className={fieldBorder}><div className="flex items-center"><input ref={passwordRef} type={showPass ? 'text' : 'password'} required maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className={`${inputClass} flex-1`} /><button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer"><input type="checkbox" checked={rememberEmail} onChange={e => setRememberEmail(e.target.checked)} className="accent-[#F5A623] w-4 h-4" /><span>Ghi nhớ email</span></label>
                  <button type="button" onClick={() => { setMode('forgot'); resetForm() }} className="text-[#F5A623] hover:underline">Quên mật khẩu?</button>
                </div>
                {error && <div id="auth-error" role="alert" aria-live="assertive" className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} type="submit" className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">{loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={18} /> Đăng nhập</>}</motion.button>
              </form>
              <p className="text-center mt-8 text-gray-400 text-sm">Chưa có tài khoản? <button onClick={() => { setMode('register'); resetForm() }} className="text-[#F5A623] font-bold hover:underline">Đăng ký</button></p>
            </motion.div>
          )}
          {mode === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-8">Tạo tài khoản mới</h1>
              <form onSubmit={handleRegister} className="space-y-6">
                <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true"><input type="text" name="phone_number" tabIndex={-1} autoComplete="off" /></div>
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} /></div>
                <div className={fieldBorder}><input type="text" required maxLength={24} value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên đăng nhập" className={inputClass} /></div>
                <div><div className={fieldBorder}><div className="flex items-center"><input ref={passwordRef} type={showPass ? 'text' : 'password'} required maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className={`${inputClass} flex-1`} /><button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></div><PasswordStrengthBar password={password} /></div>
                <div className={fieldBorder}><div className="flex items-center"><input type={showConfirm ? 'text' : 'password'} required maxLength={72} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Xác nhận mật khẩu" className={`${inputClass} flex-1`} /><button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2">{showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}</button>{passMatch && <Check size={16} className="text-[#4ADE80] ml-2" />}{passMismatch && <X size={16} className="text-[#F87171] ml-2" />}</div></div>
                {passMismatch && <p className="text-[#F87171] text-[11px] mt-1">Mật khẩu không khớp</p>}
                <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer"><input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="accent-[#F5A623] mt-0.5 w-4 h-4" /><span>Tôi đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#F5A623] hover:underline">điều khoản</a> và <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#F5A623] hover:underline">chính sách bảo mật</a></span></label>
                {error && <div id="auth-error" role="alert" aria-live="assertive" className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} type="submit" className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">{loading ? <Loader2 className="animate-spin" size={20} /> : 'Tạo tài khoản'}</motion.button>
              </form>
              <p className="text-center mt-8 text-gray-400 text-sm">Đã có tài khoản? <button onClick={() => { setMode('login'); resetForm() }} className="text-[#F5A623] font-bold hover:underline">Đăng nhập</button></p>
            </motion.div>
          )}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-4">Lấy lại mật khẩu</h1>
              <p className="text-gray-400 text-sm text-center mb-8">Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
              <form onSubmit={handleForgot} className="space-y-6">
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} /></div>
                {error && <div id="auth-error" role="alert" aria-live="assertive" className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading || resetCooldown > 0} type="submit" className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : resetCooldown > 0 ? `Gửi lại sau ${resetCooldown}s` : 'Gửi link'}
                </motion.button>
                <button type="button" onClick={() => { setMode('login'); resetForm() }} className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">← Trở về đăng nhập</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="text-center text-[11px] text-[#4A4A50] mt-10 flex items-center justify-center gap-1.5">
          <Shield size={12} /> Kết nối an toàn · Mã hóa dữ liệu
        </p>
      </motion.div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center text-white">Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  )
}
