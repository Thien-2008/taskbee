'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { normalizePhone, isPhoneNumber } from '@/utils/phone'

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin'); return
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự'); return
    }
    if (regPassword !== regConfirm) {
      setError('Mật khẩu không khớp'); return
    }
    if (!termsAccepted) {
      setError('Vui lòng đồng ý điều khoản'); return
    }

    setLoading(true)
    const normalizedPhone = normalizePhone(regPhone)
    try {
      const { data: existing } = await supabase.from('users').select('id').eq('phone', normalizedPhone).maybeSingle()
      if (existing) { setError('Số điện thoại đã được đăng ký'); return }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword,
        options: { data: { full_name: regFullName.trim() } }
      })
      if (signUpError) {
        setError(signUpError.message.includes('already registered') ? 'Email đã được đăng ký' : 'Đăng ký thất bại')
        return
      }
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: regEmail.trim(),
          phone: normalizedPhone,
          full_name: regFullName.trim(),
          balance: 0,
          role: 'user',
          terms_accepted_at: new Date().toISOString()
        }, { onConflict: 'id' })
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
    if (!loginIdentifier || !loginPassword) { setError('Vui lòng nhập đầy đủ'); return }
    setLoading(true)
    try {
      let email = loginIdentifier.trim()
      if (isPhoneNumber(loginIdentifier)) {
        const normalizedPhone = normalizePhone(loginIdentifier)
        const { data, error: lookupError } = await supabase.from('users').select('email').eq('phone', normalizedPhone).maybeSingle()
        if (lookupError || !data?.email) { setError('Số điện thoại chưa được đăng ký'); return }
        email = data.email
      }
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password: loginPassword })
      if (loginError) {
        setError(loginError.message.includes('Email not confirmed') ? 'Email chưa xác nhận' : 'Thông tin đăng nhập không đúng')
        return
      }
      router.push('/dashboard')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <nav style={{ padding: '14px 24px', background: 'rgba(10,10,11,0.85)', borderBottom: '1px solid #1C1C1E' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
      </nav>
      <div style={{ maxWidth: 400, margin: '60px auto 0', padding: '0 24px' }}>
        {successMessage && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', color: '#34D399', padding: 12, borderRadius: 8, marginBottom: 16 }}>{successMessage}</div>}
        {error && <div style={{ background: 'rgba(249,115,115,0.1)', border: '1px solid #F97373', color: '#F97373', padding: 12, borderRadius: 8, marginBottom: 16 }}>{error}</div>}
        {isLogin ? (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20 }}>Đăng nhập</h2>
            <input placeholder="Email hoặc SĐT" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)}
              style={{ width: '100%', padding: 12, marginBottom: 12, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
            <input type="password" placeholder="Mật khẩu" value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
              style={{ width: '100%', padding: 12, marginBottom: 16, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
            <button onClick={handleLogin} disabled={loading}
              style={{ width: '100%', padding: 12, background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? '⏳...' : 'Đăng nhập'}
            </button>
            <button onClick={() => { setIsLogin(false); setError(''); setSuccessMessage('') }}
              style={{ marginTop: 12, background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600 }}>
              Chưa có tài khoản? Đăng ký
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20 }}>Tạo tài khoản</h2>
            {[
              { placeholder: 'Họ và tên', value: regFullName, onChange: setRegFullName },
              { placeholder: 'Email', value: regEmail, onChange: setRegEmail, type: 'email' },
              { placeholder: 'Số điện thoại', value: regPhone, onChange: setRegPhone, type: 'tel' },
              { placeholder: 'Mật khẩu', value: regPassword, onChange: setRegPassword, type: 'password' },
              { placeholder: 'Xác nhận mật khẩu', value: regConfirm, onChange: setRegConfirm, type: 'password' },
            ].map((f, i) => (
              <input key={i} placeholder={f.placeholder} type={f.type || 'text'} value={f.value} onChange={e => f.onChange(e.target.value)}
                style={{ width: '100%', padding: 12, marginBottom: 12, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
            ))}
            <label style={{ display: 'flex', gap: 8, fontSize: 13, color: '#8A857D', marginBottom: 16 }}>
              <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
              Tôi đồng ý với Điều khoản sử dụng
            </label>
            <button onClick={handleRegister} disabled={loading}
              style={{ width: '100%', padding: 12, background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? '⏳...' : 'Tạo tài khoản'}
            </button>
            <button onClick={() => { setIsLogin(true); setError(''); setSuccessMessage('') }}
              style={{ marginTop: 12, background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600 }}>
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
