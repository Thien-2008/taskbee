'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { normalizePhone, isPhoneNumber } from '@/utils/phone'

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = params.get('mode') || 'login'
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    if (regPassword.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
    if (regPassword !== regConfirm) { setError('Mật khẩu không khớp'); return }
    if (!termsAccepted) { setError('Vui lòng đồng ý điều khoản'); return }

    setLoading(true)
    const normalizedPhone = normalizePhone(regPhone)
    try {
      const { data: existing } = await supabase.from('users').select('id').eq('phone', normalizedPhone).maybeSingle()
      if (existing) { setError('Số điện thoại đã đăng ký'); return }
      const { data, error: signUpError } = await supabase.auth.signUp({ email: regEmail.trim(), password: regPassword, options: { data: { full_name: regFullName.trim() } } })
      if (signUpError) { setError(signUpError.message.includes('already registered') ? 'Email đã đăng ký' : 'Đăng ký thất bại'); return }
      if (data.user) {
        await supabase.from('users').upsert({ id: data.user.id, email: regEmail.trim(), phone: normalizedPhone, full_name: regFullName.trim(), balance: 0, role: 'user', terms_accepted_at: new Date().toISOString() }, { onConflict: 'id' })
      }
      await supabase.auth.signOut()
      setSuccessMessage('✅ Đăng ký thành công! Vui lòng đăng nhập.')
      setLoginIdentifier(regEmail.trim())
      setIsLogin(true)
      setRegFullName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegConfirm(''); setTermsAccepted(false)
    } finally { setLoading(false) }
  }

  const handleLogin = async () => {
    setError(''); setSuccessMessage('')
    if (!loginIdentifier || !loginPassword) { setError('Vui lòng nhập đầy đủ thông tin'); return }
    setLoading(true)
    try {
      let email = loginIdentifier.trim()
      if (isPhoneNumber(loginIdentifier)) {
        const normalizedPhone = normalizePhone(loginIdentifier)
        const { data, error: lookupError } = await supabase.from('users').select('email').eq('phone', normalizedPhone).maybeSingle()
        if (lookupError || !data?.email) { setError('Số điện thoại chưa đăng ký'); return }
        email = data.email
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: loginPassword })
      if (loginError) { setError(loginError.message.includes('Email not confirmed') ? 'Email chưa xác nhận' : 'Thông tin đăng nhập không đúng'); return }
      router.push('/dashboard')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }
  const labelStyle = { display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={{ width: '100%', maxWidth: 380, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '32px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623', cursor: 'pointer' }} onClick={() => router.push('/')}>🐝 TaskBee</h1>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}</h2>
        {successMessage && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', color: '#34D399', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{successMessage}</div>}
        {error && <div style={{ background: 'rgba(249,115,115,0.1)', border: '1px solid #F97373', color: '#F97373', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

        {isLogin ? (
          <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelStyle}>Email hoặc SĐT</label><input type="text" required value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} placeholder="example@mail.com hoặc 0912 345 678" style={inputStyle} /></div>
            <div style={{ position: 'relative' }}><label style={labelStyle}>Mật khẩu</label><input type={showLoginPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••" style={inputStyle} /><button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showLoginPassword ? '🙈' : '👁'}</button></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{loading ? '⏳...' : '🔐 Đăng nhập'}</button>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={labelStyle}>Họ và tên</label><input type="text" required value={regFullName} onChange={e => setRegFullName(e.target.value)} placeholder="Nguyễn Văn A" style={inputStyle} /></div>
            <div><label style={labelStyle}>Email</label><input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} /></div>
            <div><label style={labelStyle}>Số điện thoại</label><input type="tel" required value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="0912 345 678" maxLength={15} style={inputStyle} /></div>
            <div style={{ position: 'relative' }}><label style={labelStyle}>Mật khẩu</label><input type={showRegPassword ? 'text' : 'password'} required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••" style={inputStyle} /><button type="button" onClick={() => setShowRegPassword(!showRegPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showRegPassword ? '🙈' : '👁'}</button></div>
            <div><label style={labelStyle}>Xác nhận mật khẩu</label><input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="••••••" style={inputStyle} /></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A857D', cursor: 'pointer' }}><input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />Tôi đồng ý với Điều khoản và Chính sách bảo mật</label>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{loading ? '⏳...' : '📝 Tạo tài khoản'}</button>
          </form>
        )}
        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage('') }} style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', textAlign: 'center', padding: 60 }}>⏳ Đang tải...</div>}>
      <AuthForm />
    </Suspense>
  )
}
