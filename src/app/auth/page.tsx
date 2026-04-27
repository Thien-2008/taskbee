'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

function AuthForm() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = params.get('mode') || 'login'
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const { loading, register, login } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  async function handleRegister() {
    setError('')
    if (!regFullName.trim()) return setError('Vui lòng nhập họ và tên')
    if (!regEmail.trim()) return setError('Vui lòng nhập email')
    if (regPassword.length < 6) return setError('Mật khẩu tối thiểu 6 ký tự')
    if (regPassword !== regConfirm) return setError('Mật khẩu không khớp')

    const result = await register({ email: regEmail, password: regPassword, fullName: regFullName })
    if (!result.success) { setError(result.error!); return }

    setSuccess('✅ Đăng ký thành công! Vui lòng đăng nhập.')
    setLoginEmail(regEmail)
    setIsLogin(true)
    setRegFullName(''); setRegEmail(''); setRegPassword(''); setRegConfirm('')
  }

  async function handleLogin() {
    setError(''); setSuccess('')
    if (!loginEmail || !loginPassword) return setError('Vui lòng nhập đầy đủ')
    const result = await login(loginEmail, loginPassword)
    if (!result.success) { setError(result.error!); return }
    router.push('/dashboard')
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
        {success && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', color: '#34D399', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{success}</div>}
        {error && <div style={{ background: 'rgba(249,115,115,0.1)', border: '1px solid #F97373', color: '#F97373', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{error}</div>}

        {isLogin ? (
          <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={labelStyle}>Email</label><input type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} /></div>
            <div style={{ position: 'relative' }}><label style={labelStyle}>Mật khẩu</label><input type={showLoginPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••" style={inputStyle} /><button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showLoginPassword ? '🙈' : '👁'}</button></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{loading ? '⏳...' : '🔐 Đăng nhập'}</button>
          </form>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><label style={labelStyle}>Họ và tên</label><input type="text" required value={regFullName} onChange={e => setRegFullName(e.target.value)} placeholder="Nguyễn Văn A" style={inputStyle} /></div>
            <div><label style={labelStyle}>Email</label><input type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="example@gmail.com" style={inputStyle} /></div>
            <div style={{ position: 'relative' }}><label style={labelStyle}>Mật khẩu</label><input type={showRegPassword ? 'text' : 'password'} required value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••" style={inputStyle} /><button type="button" onClick={() => setShowRegPassword(!showRegPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showRegPassword ? '🙈' : '👁'}</button></div>
            <div><label style={labelStyle}>Xác nhận mật khẩu</label><input type="password" required value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="••••••" style={inputStyle} /></div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{loading ? '⏳...' : '📝 Tạo tài khoản'}</button>
          </form>
        )}
        <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
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
