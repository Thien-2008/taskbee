'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import Logo from '@/components/Logo'

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const referralParam = params.get('ref') || ''

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login fields
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register fields
  const [step, setStep] = useState(1)
  const [regFullName, setRegFullName] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regReferral, setRegReferral] = useState(referralParam)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [checkingUsername, setCheckingUsername] = useState(false)

  // Kiểm tra username tồn tại
  useEffect(() => {
    if (regUsername.length < 3) {
      setUsernameAvailable(null)
      return
    }
    const timer = setTimeout(async () => {
      setCheckingUsername(true)
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', regUsername)
        .single()
      setUsernameAvailable(data ? false : true)
      setCheckingUsername(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [regUsername])

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: `${loginUsername}@taskbee.local`,
      password: loginPassword,
    })
    if (error) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regPassword.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự')
      return
    }
    if (regPassword !== regConfirm) {
      setError('Mật khẩu không khớp')
      return
    }
    if (!agreeTerms) {
      setError('Vui lòng đồng ý điều khoản sử dụng')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: `${regUsername}@taskbee.local`,
      password: regPassword,
      options: {
        data: {
          username: regUsername,
          full_name: regFullName,
          referral_code: regReferral,
        },
      },
    })
    if (error) {
      if (error.message?.includes('duplicate')) {
        setError('Tên đăng nhập đã tồn tại')
      } else {
        setError(error.message || 'Đăng ký thất bại')
      }
      setLoading(false)
    } else {
      setSuccess('Đăng ký thành công! Đang chuyển hướng...')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: '#0a0a0b',
    border: '1px solid #1C1C1E',
    borderRadius: 12,
    color: '#EDEBE7',
    fontSize: 16,
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    marginBottom: 6,
    color: '#8A857D',
    fontFamily: "'DM Sans', sans-serif",
  }

  const strengthBars = () => {
    let strength = 0
    if (regPassword.length >= 6) strength++
    if (/[A-Z]/.test(regPassword)) strength++
    if (/[0-9]/.test(regPassword)) strength++
    if (/[^A-Za-z0-9]/.test(regPassword)) strength++
    const percent = (strength / 4) * 100
    return (
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= strength ? '#F5A623' : '#1C1C1E',
              transition: 'background 0.3s',
            }}
          />
        ))}
        <span style={{ fontSize: 11, color: '#8A857D', marginLeft: 8 }}>
          {strength === 0 && regPassword.length > 0 && 'Yếu'}
          {strength === 1 && 'Trung bình'}
          {strength === 2 && 'Khá'}
          {strength === 3 && 'Mạnh'}
          {strength === 4 && 'Rất mạnh'}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: '#0a0a0b',
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      userSelect: 'none',
    }}>
      <style>{`
        .btn-primary {
          background: #F5A623;
          color: #000;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary:hover:not(:disabled) { background: #FFC04D; }
        .card-flip {
          width: 100%;
          max-width: 420px;
          transform-style: preserve-3d;
          transition: transform 0.3s;
        }
        .card-flip.register { transform: rotateY(180deg); }
        .card-face {
          backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}
      >
        <Logo size={48} variant="icon" />
      </motion.div>

      {/* Error / Success */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'rgba(249,115,115,0.1)',
              border: '1px solid #F97373',
              color: '#F97373',
              padding: '12px 16px',
              borderRadius: 12,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              width: '100%',
              maxWidth: 420,
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid #34D399',
              color: '#34D399',
              padding: '12px 16px',
              borderRadius: 12,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Card với 3D Flip */}
      <div style={{ width: '100%', maxWidth: 420, perspective: 1000 }}>
        <div className={`card-flip ${mode === 'register' ? 'register' : ''}`}>
          {/* Mặt trước: Đăng nhập */}
          <div className="card-face" style={{
            background: '#161618',
            border: '1px solid #1C1C1E',
            borderRadius: 20,
            padding: 32,
            position: mode === 'register' ? 'absolute' : 'relative',
            inset: 0,
          }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 24, textAlign: 'center' }}>
              Đăng nhập
            </h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Tên đăng nhập</label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  style={inputStyle}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={labelStyle}>Mật khẩu</label>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    bottom: 12,
                    background: 'none',
                    border: 'none',
                    color: '#8A857D',
                    cursor: 'pointer',
                    fontSize: 18,
                  }}
                >
                  {showLoginPassword ? '🙈' : '👁'}
                </button>
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#8A857D' }}>
              Chưa có tài khoản?{' '}
              <button
                onClick={() => setMode('register')}
                style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
              >
                Đăng ký ngay
              </button>
            </p>
          </div>

          {/* Mặt sau: Đăng ký */}
          <div className="card-face card-back" style={{
            background: '#161618',
            border: '1px solid #1C1C1E',
            borderRadius: 20,
            padding: 32,
            position: mode === 'login' ? 'absolute' : 'relative',
            inset: 0,
          }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 24, textAlign: 'center' }}>
              Đăng ký
            </h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {step === 1 && (
                <>
                  <div>
                    <label style={labelStyle}>Họ và tên</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={e => setRegFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      style={inputStyle}
                      autoFocus
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Tên đăng nhập</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                      placeholder="ten_dang_nhap"
                      style={inputStyle}
                    />
                    {checkingUsername && <span style={{ fontSize: 12, color: '#8A857D' }}>Đang kiểm tra...</span>}
                    {usernameAvailable === false && <span style={{ fontSize: 12, color: '#F97373' }}>Tên đăng nhập đã tồn tại</span>}
                    {usernameAvailable === true && <span style={{ fontSize: 12, color: '#34D399' }}>✓ Tên đăng nhập có thể dùng</span>}
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    disabled={!regFullName || regUsername.length < 3 || usernameAvailable === false}
                    onClick={() => setStep(2)}
                  >
                    Tiếp tục
                  </button>
                </>
              )}
              {step === 2 && (
                <>
                  <div>
                    <label style={labelStyle}>Mật khẩu</label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        bottom: 34,
                        background: 'none',
                        border: 'none',
                        color: '#8A857D',
                        cursor: 'pointer',
                        fontSize: 18,
                      }}
                    >
                      {showRegPassword ? '🙈' : '👁'}
                    </button>
                    {regPassword.length > 0 && strengthBars()}
                  </div>
                  <div>
                    <label style={labelStyle}>Nhập lại mật khẩu</label>
                    <input
                      type="password"
                      required
                      value={regConfirm}
                      onChange={e => setRegConfirm(e.target.value)}
                      placeholder="••••••"
                      style={inputStyle}
                    />
                    {regConfirm.length > 0 && regConfirm !== regPassword && (
                      <span style={{ fontSize: 12, color: '#F97373' }}>Mật khẩu không khớp</span>
                    )}
                    {regConfirm.length > 0 && regConfirm === regPassword && (
                      <span style={{ fontSize: 12, color: '#34D399' }}>✓ Khớp</span>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Mã giới thiệu (tùy chọn)</label>
                    <input
                      type="text"
                      value={regReferral}
                      onChange={e => setRegReferral(e.target.value)}
                      placeholder="ABCDEFGH"
                      style={inputStyle}
                      disabled={!!referralParam}
                    />
                    {referralParam && (
                      <span style={{ fontSize: 12, color: '#F5A623' }}>
                        Được giới thiệu từ link
                      </span>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A857D' }}>
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      style={{ accentColor: '#F5A623' }}
                    />
                    Tôi đồng ý{' '}
                    <a href="/terms" target="_blank" style={{ color: '#F5A623', textDecoration: 'none' }}>Điều khoản</a>
                    {' '}và{' '}
                    <a href="/privacy" target="_blank" style={{ color: '#F5A623', textDecoration: 'none' }}>Chính sách bảo mật</a>
                  </label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #1C1C1E',
                        color: '#EDEBE7',
                        padding: '16px 24px',
                        borderRadius: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        flex: 1,
                      }}
                    >
                      ← Quay lại
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2 }}>
                      {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                  </div>
                </>
              )}
            </form>
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: '#8A857D' }}>
              Đã có tài khoản?{' '}
              <button
                onClick={() => { setMode('login'); setStep(1); }}
                style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{
        marginTop: 24,
        fontSize: 12,
        color: '#6B6B70',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span>🔒</span>
        <span>Kết nối an toàn · Mã hóa dữ liệu · Powered by Supabase</span>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div style={{ color: '#fff', textAlign: 'center', padding: 60, background: '#0a0a0b', minHeight: '100vh' }}>
        Đang tải...
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
