'use client'

import { useState, Suspense, ComponentType } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, ArrowLeft, Shield, Check, X, Mail, Lock, User, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'
import SignatureMoment from '@/components/SignatureMoment'
import HexPasswordStrength from '@/components/HexPasswordStrength'
import BeeMascot from '@/components/BeeMascot'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [showSignature, setShowSignature] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email hoặc mật khẩu không đúng')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, full_name: fullName },
      },
    })
    if (error) {
      setError(error.message || 'Đăng ký thất bại')
      setLoading(false)
    } else {
      setSuccess('Vui lòng kiểm tra email để xác minh tài khoản.')
      setMode('login')
      setLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setSuccess('Email reset mật khẩu đã được gửi.')
    setLoading(false)
  }

  const handleHoldStart = () => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / 1500, 1)
      setHoldProgress(progress)
      if (progress >= 1) {
        clearInterval(interval)
        handleLogin(new Event('submit') as any)
      }
    }, 16)
    return () => clearInterval(interval)
  }

  const handleHoldEnd = () => {
    setHoldProgress(0)
  }

  const inputClass = "w-full px-4 py-3 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl text-[#EDEBE7] focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] outline-none transition-all font-dm-sans"

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 font-dm-sans">
      {showSignature && <SignatureMoment onComplete={() => setShowSignature(false)} />}

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F5A62322,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="w-full max-w-md bg-[#161618] border border-[#1C1C1E] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {/* LOGIN */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-8">
                <Logo size={48} variant="icon" />
                <h2 className="text-2xl font-space-grotesk font-bold text-white mt-4">Đăng nhập</h2>
                <p className="text-gray-400 text-sm mt-2">Chào mừng trở lại</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <InputField icon={Mail} type="email" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email của bạn" className={`${inputClass} pl-10`} />
                <div className="relative">
                  <InputField icon={Lock} type={showPass ? 'text' : 'password'} required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Mật khẩu" className={`${inputClass} pl-10 pr-12`} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  <BeeMascot isFocused={passwordFocused} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="accent-[#F5A623] w-4 h-4" required />
                    <span>Đồng ý với điều khoản</span>
                  </label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[#F5A623] hover:underline">Quên mật khẩu?</button>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"><Check size={16} /> {success}</div>}
                <button
                  disabled={loading}
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className="w-full bg-[#F5A623] text-black font-bold py-3 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                >
                  <span className="relative z-10">{loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng nhập'}</span>
                  <div className="absolute inset-0 bg-black/20 rounded-xl" style={{ transform: `scaleX(${holdProgress})`, transformOrigin: 'left', transition: 'transform 0.1s' }}></div>
                </button>
              </form>
              <p className="text-center mt-6 text-gray-400 text-sm">
                Chưa có tài khoản? <button onClick={() => setMode('register')} className="text-[#F5A623] font-bold hover:underline">Đăng ký ngay</button>
              </p>
            </motion.div>
          )}

          {/* REGISTER */}
          {mode === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <button onClick={() => setMode('login')} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition-colors">
                <ArrowLeft size={18} /> <span>Trở về</span>
              </button>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-6">Tạo tài khoản mới</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <InputField icon={User} type="text" value={fullName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)} placeholder="Họ và tên" required />
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email" required />
                <InputField icon={User} type="text" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} placeholder="Tên đăng nhập (tùy chọn)" />
                <div className="relative">
                  <InputField icon={Lock} type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Mật khẩu" required onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} />
                  <BeeMascot isFocused={passwordFocused} />
                </div>
                <HexPasswordStrength password={password} />
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="accent-[#F5A623] mt-1" required />
                  <span>Tôi đồng ý với <a href="/terms" target="_blank" className="text-[#F5A623] underline">điều khoản</a> và <a href="/privacy" target="_blank" className="text-[#F5A623] underline">chính sách bảo mật</a></span>
                </div>
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                <button disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng ký'}
                </button>
              </form>
            </motion.div>
          )}

          {/* FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-2">Quên mật khẩu</h2>
              <p className="text-gray-400 text-sm mb-6">Nhập Email đã đăng ký để nhận hướng dẫn khôi phục.</p>
              <form onSubmit={handleForgot} className="space-y-6">
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email của bạn" required />
                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2"><X size={16} /> {error}</div>}
                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-sm flex items-center gap-2"><Check size={16} /> {success}</div>}
                <button disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Gửi yêu cầu'}
                </button>
                <button type="button" onClick={() => setMode('login')} className="w-full text-center text-sm text-gray-400">← Trở về đăng nhập</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ size?: number | string }>
}

function InputField({ icon: Icon, ...props }: InputFieldProps) {
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F5A623] transition-colors">
        <Icon size={18} />
      </div>
      <input {...props} className={`w-full bg-[#0a0a0b] border border-[#1C1C1E] text-white pl-10 pr-4 py-3 rounded-xl focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] outline-none transition-all font-dm-sans ${props.className ?? ''}`} />
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
