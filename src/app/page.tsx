'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { formatPhoneDisplay } from '@/utils/phone'
import { validateEmail, validatePhone, validatePassword, validatePasswordMatch, validateFullName, checkPasswordStrength } from '@/utils/validation'

type Tab = 'dashboard' | 'tasks' | 'withdraw' | 'profile'
type View = 'main' | 'taskDetail' | 'taskHistory' | 'txHistory' | 'settings' | 'help'

interface DbTaskBatch {
  id: number; task_type: string; total_items: number; completed_items: number
  budget_total: number; instructions: string; status: string
}

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [regErrors, setRegErrors] = useState<Record<string, string>>({})
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const isRegistering = useRef(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [currentView, setCurrentView] = useState<View>('main')
  const [selectedBatch, setSelectedBatch] = useState<DbTaskBatch | null>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState('')
  const [balance, setBalance] = useState(0)
  const [tasksDone, setTasksDone] = useState(0)
  const [userRole, setUserRole] = useState<string>('user')

  const { loading: authLoading, register, login, logout } = useAuth()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isRegistering.current) return
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      if (isRegistering.current) return
      setUser(s?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) { loadUserStats(); loadUserRole() } }, [user])

  const loadUserStats = async () => {
    if (!user) return
    const { data: ud } = await supabase.from('users').select('balance, role, phone, full_name, email').eq('id', user.id).single()
    if (ud) {
      setBalance(ud.balance || 0); setUserRole(ud.role || 'user')
      if (ud.full_name) setDisplayName(ud.full_name)
      else if (ud.phone) setDisplayName(formatPhoneDisplay(ud.phone))
      else if (ud.email) setDisplayName(ud.email)
      else setDisplayName('Người dùng')
    }
    const { count } = await supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('reward_paid', true)
    if (count) setTasksDone(count)
  }

  const loadUserRole = async () => {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (data) setUserRole(data.role || 'user')
  }

  const handleRegister = async () => {
    const newErrors = {
      fullName: validateFullName(regFullName) ?? '',
      email: validateEmail(regEmail) ?? '',
      phone: validatePhone(regPhone) ?? '',
      password: validatePassword(regPassword) ?? '',
      confirmPassword: validatePasswordMatch(regPassword, regConfirmPassword) ?? '',
    }
    setRegErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return
    if (!termsAccepted) { setRegErrors(p => ({ ...p, terms: 'Vui lòng đồng ý điều khoản' })); return }

    isRegistering.current = true
    const result = await register({ email: regEmail, phone: regPhone, password: regPassword, fullName: regFullName })
    await supabase.auth.signOut()
    isRegistering.current = false

    if (!result.success) {
      if (result.error?.includes('Email')) setRegErrors(p => ({ ...p, email: result.error! }))
      else if (result.error?.includes('điện thoại') || result.error?.includes('SĐT')) setRegErrors(p => ({ ...p, phone: result.error! }))
      else alert(result.error)
      return
    }

    setLoginEmail(regEmail)
    setSuccessMessage('✅ Đăng ký thành công! Vui lòng đăng nhập.')
    setIsLogin(true)
    setRegFullName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegConfirmPassword('')
    setTermsAccepted(false); setRegErrors({})
  }

  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) { setLoginError('Vui lòng nhập đầy đủ thông tin'); return }
    const result = await login(loginIdentifier, loginPassword)
    if (!result.success) {
      setLoginError(result.error === 'EMAIL_NOT_CONFIRMED' ? 'Email chưa xác nhận. Kiểm tra hộp thư.' : result.error ?? 'Đăng nhập thất bại')
      return
    }
    setShowAuth(false)
  }

  const handleLogout = async () => { await logout() }

  const startTask = (batch: DbTaskBatch) => { setSelectedBatch(batch); setCurrentTaskIndex(0); setSelectedAnswer(''); setCurrentView('taskDetail') }

  const submitTaskAnswer = async () => {
    if (!selectedAnswer || !selectedBatch || !user) { alert('Vui lòng chọn đáp án'); return }
    setSubmitting(true)
    try {
      const { data: items } = await supabase.from('task_items').select('id').eq('batch_id', selectedBatch.id).eq('status', 'pending').limit(1)
      if (!items || items.length === 0) { alert('Không còn task!'); setCurrentView('main'); setSubmitting(false); return }
      const taskItemId = items[0].id
      await supabase.from('assignments').insert({ task_item_id: taskItemId, user_id: user.id, answer: selectedAnswer, submitted_at: new Date().toISOString(), reward_paid: false })
      await supabase.from('task_items').update({ status: 'completed' }).eq('id', taskItemId)
      await supabase.from('task_batches').update({ completed_items: (selectedBatch.completed_items || 0) + 1, budget_spent: ((selectedBatch.completed_items || 0) + 1) * (selectedBatch.budget_total / selectedBatch.total_items) }).eq('id', selectedBatch.id)
      const reward = Math.round(selectedBatch.budget_total / selectedBatch.total_items)
      await supabase.rpc('update_user_balance', { p_user_id: user.id, p_amount: reward })
      await supabase.from('assignments').update({ reward_paid: true }).eq('task_item_id', taskItemId).eq('user_id', user.id)
      setNotification(`✅ +${reward.toLocaleString()}đ`); setTimeout(() => setNotification(''), 3000)
      const next = currentTaskIndex + 1
      if (next < selectedBatch.total_items) { setCurrentTaskIndex(next); setSelectedAnswer('') }
      else { setCurrentView('main'); setSelectedBatch(null); setCurrentTaskIndex(0) }
    } catch (error: any) { alert('Lỗi: ' + error.message) } finally { setSubmitting(false) }
  }

  if (!user) {
    if (showAuth) {
      const strength = checkPasswordStrength(regPassword)
      return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
          <div style={{ width: '100%', maxWidth: 380, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '32px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>🐝 TaskBee</h1>
              <button onClick={() => { setShowAuth(false); setIsLogin(true); setLoginError('') }} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}</h2>
            {successMessage && <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid #34D399', color: '#34D399', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 }}>{successMessage}</div>}
            {isLogin ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email hoặc SĐT</label><input type="text" required value={loginIdentifier} onChange={e => { setLoginIdentifier(e.target.value); setLoginError('') }} placeholder="example@mail.com hoặc 0912 345 678" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /></div>
                <div style={{ position: 'relative' }}><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Mật khẩu</label><input type={showLoginPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError('') }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /><button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showLoginPassword ? '🙈' : '👁'}</button></div>
                {loginError && <div style={{ color: '#F97373', fontSize: 14, textAlign: 'center' }}>{loginError}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '🔐 Đăng nhập'}</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Họ và tên</label><input type="text" required value={regFullName} onChange={e => { setRegFullName(e.target.value); setRegErrors(p => ({...p, fullName:''})) }} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.fullName && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.fullName}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email</label><input type="email" required value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({...p, email:''})) }} placeholder="example@gmail.com" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.email && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.email}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Số điện thoại</label><input type="tel" required value={regPhone} onChange={e => { setRegPhone(e.target.value); setRegErrors(p => ({...p, phone:''})) }} placeholder="0912 345 678" maxLength={15} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.phone && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.phone}</div>}</div>
                <div style={{ position: 'relative' }}><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Mật khẩu</label><input type={showRegPassword ? 'text' : 'password'} required value={regPassword} onChange={e => { setRegPassword(e.target.value); setRegErrors(p => ({...p, password:''})) }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /><button type="button" onClick={() => setShowRegPassword(!showRegPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showRegPassword ? '🙈' : '👁'}</button></div>
                {regPassword && (<div><div style={{ height: 4, background: '#1C1C1E', borderRadius: 2 }}><div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, borderRadius: 2 }} /></div><p style={{ color: strength.color, fontSize: 12, marginTop: 4 }}>{strength.label}</p>{regErrors.password && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.password}</div>}</div>)}
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Xác nhận mật khẩu</label><input type="password" required value={regConfirmPassword} onChange={e => { setRegConfirmPassword(e.target.value); setRegErrors(p => ({...p, confirmPassword:''})) }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.confirmPassword && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.confirmPassword}</div>}</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A857D', cursor: 'pointer' }}><input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); setRegErrors(p => ({...p, terms:''})) }} />Tôi đồng ý với Điều khoản và Chính sách bảo mật</label>
                {regErrors.terms && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.terms}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '📝 Tạo tài khoản'}</button>
              </form>
            )}
            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>{isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}<button onClick={() => { setIsLogin(!isLogin); setLoginError(''); setSuccessMessage('') }} style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</button></p>
          </div>
        </div>
      )
    }
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', overflowX: 'hidden', userSelect: 'none' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
        </nav>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 60px' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05 }}>Điện thoại của bạn<br /> là <span style={{ color: '#F5A623' }}>công cụ kiếm tiền</span></h1>
            <p style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, margin: '20px auto 0' }}>Làm những công việc nhỏ thực sự — gắn thẻ ảnh, nhập liệu — trên điện thoại.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
              <button onClick={() => { setIsLogin(true); setShowAuth(true) }} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Đăng nhập</button>
              <button onClick={() => { setIsLogin(false); setShowAuth(true) }} style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Đăng ký</button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ── Dashboard ──
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
      </header>
      {notification && <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: '#34D399', color: '#000', padding: '10px 24px', borderRadius: 20, fontWeight: 600, fontSize: 14 }}>{notification}</div>}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {activeTab === 'dashboard' && (
          <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Xin chào, {displayName} 👋</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}><div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>💰 Số dư</div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</div></div>
              <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}><div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>🐝 Task đã làm</div><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24 }}>{tasksDone}</div></div>
            </div>
          </div>
        )}
        {activeTab === 'tasks' && <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>📋 Danh sách task sẽ hiển thị ở đây</div>}
        {activeTab === 'withdraw' && <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>💰 Rút tiền sẽ hiển thị ở đây</div>}
        {activeTab === 'profile' && <ProfileTab user={user} displayName={displayName} balance={balance} tasksDone={tasksDone} userRole={userRole} onLogout={handleLogout} onNavigate={(v: View) => setCurrentView(v)} />}
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {[
          { key: 'dashboard' as Tab, icon: '🏠', label: 'Tổng quan' },
          { key: 'tasks' as Tab, icon: '📋', label: 'Làm task' },
          { key: 'withdraw' as Tab, icon: '💰', label: 'Rút tiền' },
          { key: 'profile' as Tab, icon: '👤', label: 'Hồ sơ' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: activeTab === tab.key ? '#F5A623' : '#8A857D', fontSize: 11, fontWeight: activeTab === tab.key ? 600 : 400 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── Profile Tab ──
function ProfileTab({ user, displayName, balance, tasksDone, userRole, onLogout, onNavigate }: { user: any; displayName: string; balance: number; tasksDone: number; userRole: string; onLogout: () => void; onNavigate: (v: View) => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>👤 Hồ sơ</h2>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🐝</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{displayName}</div>
        <div style={{ fontSize: 13, color: '#8A857D', marginTop: 4 }}>Thành viên từ: Tháng 4/2025{userRole === 'admin' ? ' · 👑 Admin' : ''}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>{balance.toLocaleString()}đ</div><div style={{ fontSize: 11, color: '#8A857D' }}>Số dư</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>{tasksDone}</div><div style={{ fontSize: 11, color: '#8A857D' }}>Task đã làm</div></div>
        </div>
      </div>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, overflow: 'hidden' }}>
        {[
          { icon: '📋', label: 'Lịch sử làm task', view: 'taskHistory' as View },
          { icon: '💳', label: 'Lịch sử giao dịch', view: 'txHistory' as View },
          { icon: '🔔', label: 'Cài đặt thông báo', view: 'settings' as View },
          { icon: '❓', label: 'Hướng dẫn sử dụng', view: 'help' as View },
        ].map((item, i, arr) => (
          <div key={i} onClick={() => onNavigate(item.view)} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #1C1C1E' : 'none', cursor: 'pointer' }}>
            <span>{item.icon} {item.label}</span><span style={{ color: '#8A857D' }}>→</span>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{ width: '100%', marginTop: 20, padding: '12px 0', background: 'transparent', border: '1px solid #F97373', color: '#F97373', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>🚪 Đăng xuất</button>
    </div>
  )
}
