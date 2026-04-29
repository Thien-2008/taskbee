'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, ArrowLeft, Check, X, Mail, Lock, User, Loader2, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/Logo'

/* ───── Password Strength ───── */
function getStrength(pw: string): { label: string; percent: number; color: string } {
  if (!pw) return { label: '', percent: 0, color: '#1C1C1E' }
  let score = 0
  if (pw.length >= 8) score += 2
  if (pw.length >= 12) score += 2
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1
  if (/\d/.test(pw)) score += 1
  if (/[^a-zA-Z0-9]/.test(pw)) score += 2
  const common = ['password','12345678','qwerty123','taskbee']
  if (common.some(w => pw.toLowerCase().includes(w))) score -= 5

  const final = Math.max(0, Math.min(10, score))
  if (final <= 3) return { label: 'Yếu', percent: final / 10, color: '#991B1B' }
  if (final <= 5) return { label: 'Trung bình', percent: final / 10, color: '#B8651A' }
  if (final <= 7) return { label: 'Khá', percent: final / 10, color: '#D4851F' }
  if (final <= 9) return { label: 'Mạnh', percent: final / 10, color: '#F5A623' }
  return { label: 'Rất mạnh', percent: 1, color: '#FFC04D' }
}

/* ───── Auth Form ───── */
function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [supabase] = useState(() =>
    createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  )

  const [mode, setMode] = useState<'login'|'register'|'forgot'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const strength = getStrength(password)

  /* ── Handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email hoặc mật khẩu không đúng'); setLoading(false) }
    else router.push('/dashboard')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Mật khẩu tối thiểu 8 ký tự'); return }
    if (password !== confirmPass) { setError('Mật khẩu không khớp'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
    if (error) { setError(error.message || 'Đăng ký thất bại'); setLoading(false) }
    else {
      setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.')
      setLoading(false)
      setTimeout(() => { setMode('login'); setSuccess('') }, 3000)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setSuccess('Link khôi phục mật khẩu đã được gửi.')
    setLoading(false)
  }

  const inputClass = "w-full px-4 py-3.5 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl text-[#EDEBE7] placeholder-gray-500 focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623] outline-none transition-all font-dm-sans text-base caret-[#F5A623]"

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center p-4 font-dm-sans overflow-hidden">
      {/* Background particles mờ */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F5A62322,transparent_80%)]" />
      </div>

      {/* Signature moment: tia sáng amber quét ngang */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1, times: [0, 0.5, 1] }}
      >
        <motion.div
          className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F5A623] to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-[#161618] border border-[#1C1C1E] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Logo size={36} variant="icon" />
        </div>

        <AnimatePresence mode="wait">
          {/* ── LOGIN ── */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-space-grotesk font-bold text-white text-center mb-2">Đăng nhập vào tài khoản</h2>
              <p className="text-gray-400 text-sm text-center mb-8">Chào mừng trở lại</p>
              <form onSubmit={handleLogin} className="space-y-5">
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email" required />
                <InputField icon={Lock} type={showPass ? 'text' : 'password'} value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Mật khẩu" required rightIcon={<button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>} />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="accent-[#F5A623] w-4 h-4" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button type="button" onClick={() => setMode('forgot')} className="text-[#F5A623] hover:underline font-medium">Quên mật khẩu?</button>
                </div>
                {error && <ErrorMsg text={error} />}
                {success && <SuccessMsg text={success} />}
                <button type="submit" disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : <><LogIn size={18} /> Đăng nhập</>}
                </button>
              </form>
              <p className="text-center mt-6 text-gray-400 text-sm">
                Chưa có tài khoản? <button type="button" onClick={() => { setMode('register'); setError(''); setSuccess('') }} className="text-[#F5A623] font-bold hover:underline">Đăng ký ngay</button>
              </p>
            </motion.div>
          )}

          {/* ── REGISTER ── */}
          {mode === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition-colors">
                <ArrowLeft size={18} /> <span>Trở về</span>
              </button>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-6">Tạo tài khoản mới</h2>
              <form onSubmit={handleRegister} className="space-y-5">
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email" required />
                <InputField icon={User} type="text" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} placeholder="Tên đăng nhập" required />
                <InputField icon={Lock} type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Mật khẩu" required />
                {/* Password Strength Line */}
                {password.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mt-2 mb-1">
                    <div className="h-[2px] bg-[#1C1C1E] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: strength.color }}
                        animate={{ width: `${strength.percent * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 text-right">{strength.label}</p>
                  </motion.div>
                )}
                {/* Xác nhận mật khẩu – chỉ hiện khi mật khẩu >= 8 ký tự */}
                <AnimatePresence>
                  {password.length >= 8 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                      <InputField
                        icon={Lock}
                        type="password"
                        value={confirmPass}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                        required
                        rightIcon={confirmPass.length > 0 && confirmPass === password ? <CheckCircle2 size={18} className="text-[#4ADE80]" /> : confirmPass.length > 0 ? <X size={18} className="text-[#F87171]" /> : null}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-start gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="accent-[#F5A623] mt-1" required />
                  <span>Tôi đồng ý với <a href="/terms" target="_blank" className="text-[#F5A623] underline">điều khoản</a> và <a href="/privacy" target="_blank" className="text-[#F5A623] underline">chính sách bảo mật</a></span>
                </div>
                {error && <ErrorMsg text={error} />}
                {success && <SuccessMsg text={success} />}
                <button type="submit" disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : 'Đăng ký'}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── FORGOT ── */}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-space-grotesk font-bold text-white mb-2">Quên mật khẩu</h2>
              <p className="text-gray-400 text-sm mb-6">Nhập Email để nhận link khôi phục.</p>
              <form onSubmit={handleForgot} className="space-y-6">
                <InputField icon={Mail} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email của bạn" required />
                {error && <ErrorMsg text={error} />}
                {success && <SuccessMsg text={success} />}
                <button type="submit" disabled={loading} className="w-full bg-[#F5A623] text-black font-bold py-3.5 rounded-xl hover:bg-[#FFC04D] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60">
                  {loading ? <><Loader2 className="animate-spin" size={20} /> Đang xử lý...</> : 'Gửi yêu cầu'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">← Trở về đăng nhập</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Trust bar */}
      <div className="absolute bottom-6 text-center text-[11px] text-[#4A4A50] flex items-center gap-1.5 z-10">
        <span>🔒</span> Kết nối được mã hóa · Mật khẩu an toàn
      </div>
    </div>
  )
}

/* ───── Reusable Components ───── */
function InputField({ icon: Icon, rightIcon, ...props }: {
  icon: any
  rightIcon?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F5A623] transition-colors">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className={`w-full bg-[#0a0a0b] border border-[#1C1C1E] text-white pl-10 pr-4 py-3.5 rounded-xl focus:border-[rgba(245,166,35,0.5)] focus:ring-1 focus:ring-[rgba(245,166,35,0.2)] outline-none transition-all font-dm-sans text-base caret-[#F5A623] ${props.className ?? ''}`}
      />
      {rightIcon && <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  )
}

function ErrorMsg({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-[#F87171]">
      <AlertCircle size={14} />
      <span>{text}</span>
    </motion.div>
  )
}

function SuccessMsg({ text }: { text: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-sm text-[#4ADE80]">
      <CheckCircle2 size={14} />
      <span>{text}</span>
    </motion.div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  )
}
