'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@supabase/ssr'
import { Eye, EyeOff, Check, X, Mail, User, Lock, Loader2, LogIn, Shield, AlertCircle, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'

/* ───── Hàm tính độ mạnh mật khẩu ───── */
function getPasswordStrength(password: string): { label: string; percent: number; color: string } {
  if (!password) return { label: '', percent: 0, color: '#2A2A2E' }
  let score = 0
  if (password.length >= 8) score += 2
  if (password.length >= 12) score += 2
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 2
  const lower = password.toLowerCase()
  const common = ['password', '123456', '12345678', 'qwerty', 'abc123', '111111', 'admin', 'taskbee']
  if (common.some(w => lower.includes(w))) score = Math.max(0, score - 5)

  const clamped = Math.min(10, Math.max(0, score))
  const percent = clamped * 10

  // Màu theo yêu cầu: Yếu -> đỏ, Trung bình -> vàng, Khá -> cam, Mạnh -> xanh nhạt, Rất mạnh -> xanh đậm
  let label = 'Yếu', color = '#F87171'                   // đỏ
  if (clamped >= 3) { label = 'Trung bình'; color = '#F5A623' } // vàng
  if (clamped >= 5) { label = 'Khá'; color = '#D97706' }        // cam
  if (clamped >= 7) { label = 'Mạnh'; color = '#4ADE80' }       // xanh nhạt
  if (clamped >= 9) { label = 'Rất mạnh'; color = '#22C55E' }   // xanh đậm
  return { label, percent, color }
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
  const [shake, setShake] = useState(false)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmRef = useRef<HTMLInputElement>(null)

  const strength = getPasswordStrength(password)
  const showConfirm = password.length >= 8
  const passMatch = confirmPass.length > 0 && password === confirmPass
  const passMismatch = confirmPass.length > 0 && password !== confirmPass

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email hoặc mật khẩu không đúng'); setShake(true); setTimeout(() => setShake(false), 600) }
    else router.push('/dashboard')
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!agreeTerms) { setError('Vui lòng đồng ý điều khoản'); return }
    if (password.length < 8) { setError('Mật khẩu tối thiểu 8 ký tự'); return }
    if (password !== confirmPass) { setError('Mật khẩu không khớp'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } })
    if (error) { setError(error.message || 'Đăng ký thất bại'); setShake(true); setTimeout(() => setShake(false), 600) }
    else { setSuccess('Đăng ký thành công! Kiểm tra email để xác minh tài khoản.'); setMode('login') }
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message || 'Gửi yêu cầu thất bại')
    else setSuccess('Email reset mật khẩu đã được gửi.')
    setLoading(false)
  }

  const resetForm = () => { setError(''); setSuccess(''); setEmail(''); setPassword(''); setUsername(''); setConfirmPass(''); setAgreeTerms(false) }

  const inputClass = "w-full px-0 py-3.5 bg-transparent border-0 text-[#EDEBE7] placeholder-gray-500 focus:outline-none font-dm-sans text-base caret-[#F5A623]"
  const fieldBorder = "border-b border-[#2A2A2E] focus-within:border-[#F5A623] transition-colors duration-300"

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0b] flex items-center justify-center p-6 font-dm-sans overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,166,35,0.06),transparent_70%)]" />
      </div>

      {/* Amber Sweep */}
      <motion.div
        initial={{ left: '-100%' }}
        animate={{ left: '100%' }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
        style={{
          position: 'fixed',
          top: 0,
          width: 2,
          height: '100%',
          background: 'linear-gradient(180deg, transparent, #F5A623, transparent)',
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Logo size={36} variant="icon" />
        </div>

        <AnimatePresence mode="wait">
          {/* ───── LOGIN ───── */}
          {mode === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-8">Đăng nhập vào tài khoản</h1>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} /></div>
                <div className={fieldBorder}>
                  <div className="flex items-center">
                    <input ref={passwordRef} type={showPass ? 'text' : 'password'} required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className={`${inputClass} flex-1`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <button type="button" onClick={() => { setMode('forgot'); resetForm() }} className="text-[#F5A623] hover:underline">Quên mật khẩu?</button>
                </div>
                {error && <div className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={18} /> Đăng nhập</>}
                </motion.button>
              </form>
              <p className="text-center mt-8 text-gray-400 text-sm">
                Chưa có tài khoản? <button onClick={() => { setMode('register'); resetForm() }} className="text-[#F5A623] font-bold hover:underline">Đăng ký</button>
              </p>
            </motion.div>
          )}

          {/* ───── REGISTER ───── */}
          {mode === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-8">Tạo tài khoản mới</h1>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} /></div>
                <div className={fieldBorder}><input type="text" required maxLength={24} value={username} onChange={e => setUsername(e.target.value)} placeholder="Tên đăng nhập" className={inputClass} /></div>
                <div>
                  <div className={fieldBorder}>
                    <div className="flex items-center">
                      <input ref={passwordRef} type={showPass ? 'text' : 'password'} required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mật khẩu" className={`${inputClass} flex-1`} />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-500 hover:text-gray-300 transition-colors ml-2">{showPass ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                    </div>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-1.5">
                      <div className="h-[1.5px] w-full bg-[#2A2A2E] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ width: `${strength.percent}%`, backgroundColor: strength.color, boxShadow: strength.percent >= 90 ? `0 0 6px ${strength.color}` : 'none' }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${strength.percent}%` }}
                          transition={{ duration: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-[11px] text-right mt-0.5" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {showConfirm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className={fieldBorder}>
                        <div className="flex items-center">
                          <input ref={confirmRef} type="password" required maxLength={128} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Xác nhận mật khẩu" className={`${inputClass} flex-1`} />
                          {passMatch && <Check size={16} className="text-[#4ADE80] ml-2" />}
                          {passMismatch && <X size={16} className="text-[#F87171] ml-2" />}
                        </div>
                      </div>
                      {passMismatch && <p className="text-[#F87171] text-[11px] mt-1">Mật khẩu không khớp</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
                <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
                  <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} className="accent-[#F5A623] mt-0.5 w-4 h-4" />
                  <span>Tôi đồng ý với <a href="/terms" target="_blank" className="text-[#F5A623] hover:underline">điều khoản</a> và <a href="/privacy" target="_blank" className="text-[#F5A623] hover:underline">chính sách bảo mật</a></span>
                </label>
                {error && <div className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Đăng ký'}
                </motion.button>
              </form>
              <p className="text-center mt-8 text-gray-400 text-sm">
                Đã có tài khoản? <button onClick={() => { setMode('login'); resetForm() }} className="text-[#F5A623] font-bold hover:underline">Đăng nhập</button>
              </p>
            </motion.div>
          )}

          {/* ───── FORGOT PASSWORD ───── */}
          {mode === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <h1 className="text-2xl font-space-grotesk font-bold text-white text-center mb-4">Lấy lại mật khẩu</h1>
              <p className="text-gray-400 text-sm text-center mb-8">Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.</p>
              <form onSubmit={handleForgot} className="space-y-6">
                <div className={fieldBorder}><input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className={inputClass} /></div>
                {error && <div className="flex items-center gap-2 text-[#F87171] text-sm"><AlertCircle size={16} /> {error}</div>}
                {success && <div className="flex items-center gap-2 text-[#4ADE80] text-sm"><Check size={16} /> {success}</div>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="w-full bg-[#F5A623] hover:bg-[#FFC04D] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Gửi link'}
                </motion.button>
                <button type="button" onClick={() => { setMode('login'); resetForm() }} className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors">← Trở về đăng nhập</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust line */}
        <p className="text-center text-[11px] text-[#4A4A50] mt-10 flex items-center justify-center gap-1.5">
          <Shield size={12} /> Kết nối an toàn · Mã hóa dữ liệu
        </p>
      </motion.div>
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
