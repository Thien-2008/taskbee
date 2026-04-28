'use client'

import { useState, useEffect, Suspense, ComponentType } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, ArrowLeft, Shield, Check, X, Mail, Lock, User, Loader2, LogIn } from 'lucide-react'
import Logo from '@/components/Logo'

/* ───── Bee Mascot ───── */
function BeeMascot({ mood }: { mood: 'idle' | 'watching' | 'hiding' | 'flying' | 'error' | 'success' }) {
  const variants = {
    idle:      { y: 0, rotate: 0, scale: 1 },
    watching:  { y: -2, rotate: 5, scale: 1.05 },
    hiding:    { rotate: -180, scale: 0.9 },
    flying:    { y: -40, rotate: 0, scale: 1.3, opacity: [1, 1, 0] },
    error:     { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.5 } },
    success:   { y: -60, rotate: 360, scale: 1.5, opacity: [1, 1, 0] },
  }
  return (
    <motion.div
      animate={mood}
      variants={variants}
      className="absolute top-6 right-6 w-10 h-10 z-20 pointer-events-none"
    >
      <svg viewBox="0 0 32 32" fill="none">
        <ellipse cx="16" cy="18" rx="6" ry="8" fill="#F5A623" />
        <ellipse cx="11" cy="10" rx="4" ry="3" fill="#F5A623" opacity="0.6" />
        <ellipse cx="21" cy="10" rx="4" ry="3" fill="#F5A623" opacity="0.6" />
        <circle cx="13" cy="17" r="1.2" fill="#0a0a0b" />
        <circle cx="19" cy="17" r="1.2" fill="#0a0a0b" />
      </svg>
    </motion.div>
  )
}

/* ───── Hexagon Strength Meter ───── */
function HexStrength({ password }: { password: string }) {
  let strength = 0
  if (password.length >= 6) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return (
    <div className="flex gap-2 mt-2 justify-center">
      {[0, 1, 2, 3].map(i => (
        <motion.svg key={i} width="16" height="16" viewBox="0 0 16 16"
          animate={{ opacity: i < strength ? 1 : 0.2, scale: i < strength ? 1 : 0.8 }}
        >
          <polygon points="8,1 15,5 15,11 8,15 1,11 1,5" fill={i < strength ? '#F5A623' : '#1C1C1E'} stroke="#F5A623" strokeWidth="1" />
        </motion.svg>
      ))}
      <span className="text-xs text-gray-500 ml-1 self-center">
        {['Yếu', 'TB', 'Khá', 'Mạnh'][strength - 1] || ''}
      </span>
    </div>
  )
}

/* ───── Auth Form ───── */
function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!))

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [bee, setBee] = useState<'idle' | 'watching' | 'hiding' | 'flying' | 'error' | 'success'>('idle')
  const [shake, setShake] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true); setBee('hiding')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email hoặc mật khẩu không đúng'); setShake(true); setBee('error'); setTimeout(() => { setShake(false); setBee('idle') }, 600) }
    else { setBee('success'); setTimeout(() => router.push('/dashboard'), 1000) }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
    if (password !== confirmPass) { setError('Mật khẩu không khớp'); return }
    setLoading(true); setBee('flying')
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
    if (error) { setError(error.message || 'Đăng ký thất bại'); setShake(true); setBee('error'); setTimeout(() => { setShake(false); setBee('idle') }, 600) }
    else { setSuccess('Vui lòng kiểm tra email để xác minh tài khoản.'); setMode('login'); setBee('success'); setTimeout(() => setBee('idle'), 2000) }
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setSuccess('Email reset mật khẩu đã được gửi.')
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3.5 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl text-[#EDEBE7] placeholder-gray-500 focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] outline-none transition-all font-dm-sans text-base"

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 font-dm-sans overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F5A62318,transparent_80%)]" />
      </div>

      <BeeMascot mood={bee} />

      <motion.div
        animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.5 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#161618] border border-[#1C1C1E] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {/* LOGIN */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-8">
                <Logo size={48} variant="icon" />
                <h2 className="text-2xl font-space-grotesk font-bold text-white mt-4">Đăng nhập</h2>
                <p className="text-gray-400 text-sm mt-2">Chào mừng trở lại</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <InputField icon={Mail} type="email" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setBee('watching') }} placeholder="Email của bạn" />
                <InputField icon={Lock} type={showPass ? 'text' : 'password'} required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setBee('hiding') }} placeholder="Mật khẩu" rightIcon={<button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="accent-[#F5A623] w-4 h-4" required />
                    <span>Đồng ý điều khoản</span>
                  </label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[#F5A623] hover:underline">Quên mật khẩu?</button>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"><Check size={16} /> {success}</div>}
                <button disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={18} /> Đăng nhập</>}
                </button>
              </form>
              <p className="text-center mt-6 text-gray-400 text-sm">
                Chưa có tài khoản? <button onClick={() => { setMode('register'); setError(''); setSuccess('') }} className="text-[#F5A623] font-bold hover:underline">Đăng ký ngay</button>
              </p>
            </motion.div>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition-colors">
                <ArrowLeft size={18} /> <span>Trở về</span>
              </button>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-6">Tạo tài khoản mới</h2>
              <form onSubmit={handleRegister} className="space-y-5">
                <InputField icon={User} type="text" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFullName(e.target.value); setBee('watching') }} placeholder="Họ và tên" required />
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setBee('watching') }} placeholder="Email" required />
                <InputField icon={Lock} type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Mật khẩu" required />
                <HexStrength password={password} />
                <InputField icon={Lock} type="password" value={confirmPass} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)} placeholder="Nhập lại mật khẩu" required />
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="accent-[#F5A623] mt-1" required />
                  <span>Tôi đồng ý với <a href="/terms" target="_blank" className="text-[#F5A623] underline">điều khoản</a> và <a href="/privacy" target="_blank" className="text-[#F5A623] underline">chính sách bảo mật</a></span>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                <button disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng ký'}
                </button>
              </form>
            </motion.div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-2">Quên mật khẩu</h2>
              <p className="text-gray-400 text-sm mb-6">Nhập Email đã đăng ký để nhận hướng dẫn khôi phục.</p>
              <form onSubmit={handleForgot} className="space-y-6">
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email của bạn" required />
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"><Check size={16} /> {success}</div>}
                <button disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Gửi yêu cầu'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="w-full text-center text-sm text-gray-400">← Trở về đăng nhập</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ───── Reusable Input ───── */
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ size?: number | string }>
  rightIcon?: React.ReactNode
}

function InputField({ icon: Icon, rightIcon, ...props }: InputFieldProps) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F5A623] transition-colors">
        <Icon size={18} />
      </div>
      <input {...props} className={`w-full bg-[#0a0a0b] border border-[#1C1C1E] text-white pl-10 pr-4 py-3.5 rounded-xl focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] outline-none transition-all font-dm-sans text-base ${props.className ?? ''}`} />
      {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  )
}
