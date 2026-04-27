'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth'
import { validateEmail, validatePhone, validatePassword, validatePasswordMatch, validateFullName, checkPasswordStrength, formatPhoneDisplay } from '../utils/validation'

type Tab = 'dashboard' | 'tasks' | 'postTask' | 'withdraw' | 'profile'
type View = 'main' | 'taskDetail' | 'taskHistory' | 'txHistory' | 'settings' | 'help' | 'admin'

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
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { loading: authLoading, register, login, logout } = useAuth()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => { if (user) { loadUserStats(); loadUserRole() } }, [user, refreshTrigger])

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
    if (!termsAccepted) { setRegErrors(p => ({ ...p, terms: 'Vui lòng đồng ý với điều khoản' })); return }
    const result = await register({ email: regEmail, phone: regPhone, password: regPassword, fullName: regFullName })
    if (!result.success) {
      if (result.error?.includes('Email')) setRegErrors(p => ({ ...p, email: result.error! }))
      else if (result.error?.includes('điện thoại') || result.error?.includes('SĐT')) setRegErrors(p => ({ ...p, phone: result.error! }))
      else alert(result.error)
      return
    }
    alert('✅ Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.')
    setIsLogin(true)
    setRegFullName(''); setRegEmail(''); setRegPhone(''); setRegPassword(''); setRegConfirmPassword(''); setTermsAccepted(false); setRegErrors({})
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
      await supabase.rpc('update_user_balance', { user_id: user.id, amount: reward })
      await supabase.from('assignments').update({ reward_paid: true }).eq('task_item_id', taskItemId).eq('user_id', user.id)
      setNotification(`✅ +${reward.toLocaleString()}đ`); setTimeout(() => setNotification(''), 3000)
      setRefreshTrigger(p => p + 1)
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
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}
            </h2>
            {isLogin ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email hoặc SĐT</label>
                  <input type="text" required value={loginIdentifier} onChange={e => { setLoginIdentifier(e.target.value); setLoginError('') }} placeholder="example@mail.com hoặc 0912 345 678" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Mật khẩu</label>
                  <input type={showLoginPassword ? 'text' : 'password'} required value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError('') }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showLoginPassword ? '🙈' : '👁'}</button>
                </div>
                {loginError && <div style={{ color: '#F97373', fontSize: 14, textAlign: 'center' }}>{loginError}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '🔐 Đăng nhập'}</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Họ và tên</label><input type="text" required value={regFullName} onChange={e => { setRegFullName(e.target.value); setRegErrors(p => ({...p, fullName:''})) }} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.fullName && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.fullName}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email</label><input type="email" required value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({...p, email:''})) }} placeholder="example@gmail.com" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.email && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.email}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Số điện thoại</label><input type="tel" required value={regPhone} onChange={e => { setRegPhone(e.target.value); setRegErrors(p => ({...p, phone:''})) }} placeholder="0912 345 678" maxLength={15} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.phone && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.phone}</div>}</div>
                <div style={{ position: 'relative' }}><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Mật khẩu</label><input type={showRegPassword ? 'text' : 'password'} required value={regPassword} onChange={e => { setRegPassword(e.target.value); setRegErrors(p => ({...p, password:''})) }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /><button type="button" onClick={() => setShowRegPassword(!showRegPassword)} style={{ position: 'absolute', right: 10, bottom: 10, background: 'none', border: 'none', color: '#8A857D', cursor: 'pointer' }}>{showRegPassword ? '🙈' : '👁'}</button></div>
                {regPassword && (<div><div style={{ height: 4, background: '#1C1C1E', borderRadius: 2 }}><div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, borderRadius: 2, transition: 'width 0.3s' }} /></div><p style={{ color: strength.color, fontSize: 12, marginTop: 4 }}>{strength.label}</p>{regErrors.password && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.password}</div>}</div>)}
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Xác nhận mật khẩu</label><input type="password" required value={regConfirmPassword} onChange={e => { setRegConfirmPassword(e.target.value); setRegErrors(p => ({...p, confirmPassword:''})) }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.confirmPassword && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.confirmPassword}</div>}</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A857D', cursor: 'pointer' }}><input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); setRegErrors(p => ({...p, terms:''})) }} />Tôi đồng ý với Điều khoản và Chính sách bảo mật</label>
                {regErrors.terms && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.terms}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '📝 Tạo tài khoản'}</button>
              </form>
            )}
            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button onClick={() => { setIsLogin(!isLogin); setLoginError('') }} style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}</button>
            </p>
          </div>
        </div>
      )
    }
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', overflowX: 'hidden', userSelect: 'none' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setIsLogin(true); setShowAuth(true) }} style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '10px 20px', borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: 'pointer' }}>Đăng nhập</button>
            <button onClick={() => { setIsLogin(false); setShowAuth(true) }} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Đăng ký</button>
          </div>
        </nav>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 60px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>🐝 Nền tảng việc làm vi mô</div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05 }}>Điện thoại của bạn<br /> là <span style={{ color: '#F5A623' }}>công cụ kiếm tiền</span></h1>
            <p style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, margin: '20px auto 0' }}>Làm những công việc nhỏ thực sự — gắn thẻ ảnh, nhập liệu — trên điện thoại. Được trả tiền thật, minh bạch, trong 24 giờ.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
              <button onClick={() => { setIsLogin(false); setShowAuth(true) }} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Bắt đầu kiếm tiền</button>
              <button style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '16px 36px', borderRadius: 8, fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Tôi là doanh nghiệp →</button>
            </div>
          </div>
        </section>
        <footer style={{ borderTop: '1px solid #1C1C1E', padding: 24, textAlign: 'center', fontSize: 13, color: '#8A857D' }}>🐝 TaskBee · © 2025 TaskBee. Nền tảng việc làm vi mô Việt Nam.</footer>
      </div>
    )
  }

  // ── Dashboard ──
  const navTabs: { key: Tab; icon: string; label: string }[] = [
    { key: 'dashboard', icon: '🏠', label: 'Tổng quan' },
    { key: 'tasks', icon: '📋', label: 'Làm task' },
    ...(userRole === 'business' || userRole === 'admin' ? [{ key: 'postTask' as Tab, icon: '📝', label: 'Đăng task' }] : []),
    { key: 'withdraw', icon: '💰', label: 'Rút tiền' },
    { key: 'profile', icon: '👤', label: 'Hồ sơ' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623', cursor: 'pointer' }} onClick={() => { setCurrentView('main'); setActiveTab('dashboard') }}>🐝 TaskBee</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer' }}>🔔</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
        </div>
      </header>
      {notification && <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: '#34D399', color: '#000', padding: '10px 24px', borderRadius: 20, fontWeight: 600, fontSize: 14 }}>{notification}</div>}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {currentView === 'taskHistory' && <TaskHistoryPage user={user} onBack={() => setCurrentView('main')} />}
        {currentView === 'txHistory' && <TxHistoryPage user={user} onBack={() => setCurrentView('main')} />}
        {currentView === 'settings' && <SettingsPage onBack={() => setCurrentView('main')} />}
        {currentView === 'help' && <HelpPage onBack={() => setCurrentView('main')} />}
        {currentView === 'admin' && <AdminPage onBack={() => setCurrentView('main')} />}
        {currentView === 'main' && (
          <>
            {activeTab === 'dashboard' && <DashboardTab user={user} displayName={displayName} balance={balance} tasksDone={tasksDone} onNavigate={(tab) => setActiveTab(tab)} />}
            {activeTab === 'tasks' && <TasksTab user={user} onStartTask={startTask} />}
            {activeTab === 'postTask' && <PostTaskTab user={user} onRefresh={() => setRefreshTrigger(p => p + 1)} />}
            {activeTab === 'withdraw' && <WithdrawTab user={user} balance={balance} onRefresh={() => setRefreshTrigger(p => p + 1)} />}
            {activeTab === 'profile' && <ProfileTab user={user} displayName={displayName} balance={balance} tasksDone={tasksDone} userRole={userRole} onLogout={handleLogout} onNavigate={(v: View) => setCurrentView(v)} />}
          </>
        )}
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {navTabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentView('main'); setSelectedBatch(null) }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: activeTab === tab.key ? '#F5A623' : '#8A857D', cursor: 'pointer', padding: '4px 8px', fontSize: 11, fontWeight: activeTab === tab.key ? 600 : 400 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ── Các component con ──
function WithdrawTab({ user, balance, onRefresh }: { user: any; balance: number; onRefresh: () => void }) {
  const [amount, setAmount] = useState(''); const [method, setMethod] = useState('momo'); const [accountInfo, setAccountInfo] = useState('')
  const [submitting, setSubmitting] = useState(false); const [history, setHistory] = useState<any[]>([])
  useEffect(() => { supabase.from('withdrawals').select('*').eq('user_id', user.id).order('requested_at', { ascending: false }).then(({ data }) => { if (data) setHistory(data) }) }, [user])
  const handleWithdraw = async () => {
    const amt = parseInt(amount); if (!amt || amt < 50000) { alert('Tối thiểu 50.000đ'); return }; if (amt > balance) { alert('Số dư không đủ'); return }; if (!accountInfo.trim()) { alert('Nhập số TK/SĐT'); return }
    setSubmitting(true)
    try { await supabase.from('withdrawals').insert({ user_id: user.id, amount: amt, method, account_info: accountInfo, status: 'pending', requested_at: new Date().toISOString() }); alert('✅ Đã ghi nhận! Xử lý trong 24h.'); setAmount(''); onRefresh() }
    catch (e: any) { alert('Lỗi: ' + e.message) } finally { setSubmitting(false) }
  }
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>💰 Rút tiền</h2>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8A857D', fontSize: 14 }}>Số dư khả dụng</span><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</span></div></div>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Phương thức</label><select value={method} onChange={e => setMethod(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }}><option value="momo">📱 Ví MoMo</option><option value="bank">🏦 Ngân hàng</option></select></div>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số TK / SĐT</label><input type="text" value={accountInfo} onChange={e => setAccountInfo(e.target.value)} placeholder="Nhập số TK hoặc SĐT MoMo" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tiền</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Tối đa ${balance.toLocaleString()}đ`} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 16 }}>⏱ 24h · 💸 Phí: 0đ · 📌 Tối thiểu: 50.000đ</div>
        <button onClick={handleWithdraw} disabled={submitting} style={{ width: '100%', padding: '12px 0', background: submitting ? '#8A857D' : '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{submitting ? '⏳...' : 'Xác nhận rút tiền'}</button>
      </div>
      {history.length > 0 && (
        <div><div style={{ fontWeight: 600, marginBottom: 12 }}>📜 Lịch sử rút tiền</div>
          <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>{history.map((tx, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid #1C1C1E' : 'none' }}><div><div style={{ fontSize: 14 }}>{tx.amount.toLocaleString()}đ</div><div style={{ fontSize: 12, color: '#8A857D' }}>{new Date(tx.requested_at).toLocaleDateString('vi-VN')} · {tx.status === 'completed' ? '✅ Đã nhận' : tx.status === 'failed' ? '❌ Từ chối' : '⏳ Đang xử lý'}</div></div></div>
          ))}</div></div>)}
    </div>
  )
}

function ProfileTab({ user, displayName, balance, tasksDone, userRole, onLogout, onNavigate }: { user: any; displayName: string; balance: number; tasksDone: number; userRole: string; onLogout: () => void; onNavigate: (v: View) => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>👤 Hồ sơ</h2>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🐝</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{displayName}</div>
        <div style={{ fontSize: 13, color: '#8A857D', marginTop: 4 }}>Thành viên từ: Tháng 4/2025{userRole === 'admin' ? ' · 👑 Admin' : userRole === 'business' ? ' · 🏢 Doanh nghiệp' : ''}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>{balance.toLocaleString()}đ</div><div style={{ fontSize: 11, color: '#8A857D' }}>Số dư</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>{tasksDone}</div><div style={{ fontSize: 11, color: '#8A857D' }}>Task đã làm</div></div>
        </div>
      </div>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, overflow: 'hidden' }}>
        {[
          { icon: '📋', label: 'Lịch sử làm task', view: 'taskHistory' as View },
          { icon: '💳', label: 'Lịch sử giao dịch', view: 'txHistory' as View },
          ...(userRole === 'admin' ? [{ icon: '⚙️', label: 'Admin (duyệt rút tiền)', view: 'admin' as View }] : []),
          { icon: '🔔', label: 'Cài đặt thông báo', view: 'settings' as View },
          { icon: '❓', label: 'Hướng dẫn sử dụng', view: 'help' as View },
        ].map((item, i, arr) => (
          <div key={i} onClick={() => onNavigate(item.view)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #1C1C1E' : 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 18 }}>{item.icon}</span><span style={{ fontSize: 14 }}>{item.label}</span></div><span style={{ color: '#8A857D' }}>→</span>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{ width: '100%', marginTop: 20, padding: '12px 0', background: 'transparent', border: '1px solid #F97373', color: '#F97373', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>🚪 Đăng xuất</button>
    </div>
  )
}

function AdminPage({ onBack }: { onBack: () => void }) {
  const [withdrawals, setWithdrawals] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { loadWithdrawals() }, [])
  const loadWithdrawals = async () => { setLoading(true); const { data } = await supabase.from('withdrawals').select('*, users(email)').order('requested_at', { ascending: false }); if (data) setWithdrawals(data); setLoading(false) }
  const handleAction = async (id: number, action: 'completed' | 'failed') => { await supabase.from('withdrawals').update({ status: action, completed_at: action === 'completed' ? new Date().toISOString() : null }).eq('id', id); loadWithdrawals() }
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>←</button><h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>⚙️ Duyệt rút tiền</h2></div>
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>⏳...</div> : withdrawals.length === 0 ? <div style={{ textAlign: 'center', padding: 40, background: '#161618', borderRadius: 12, color: '#8A857D' }}>Không có yêu cầu nào.</div> :
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{withdrawals.map(w => (
        <div key={w.id} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{w.amount?.toLocaleString()}đ</div><div style={{ fontSize: 12, color: '#8A857D' }}>{w.users?.email || 'N/A'} · {w.method} · {w.account_info}</div><div style={{ fontSize: 11, color: '#8A857D' }}>{new Date(w.requested_at).toLocaleDateString('vi-VN')} · {w.status}</div></div></div>
          {w.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleAction(w.id, 'completed')} style={{ flex: 1, padding: '8px 0', background: '#34D399', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>✅ Duyệt</button>
              <button onClick={() => handleAction(w.id, 'failed')} style={{ flex: 1, padding: '8px 0', background: '#F97373', color: '#000', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>❌ Từ chối</button>
            </div>
          )}
        </div>
      ))}</div>}
    </div>
  )
}

function TaskHistoryPage({ user, onBack }: { user: any; onBack: () => void }) {
  const [history, setHistory] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => { supabase.from('assignments').select('id, answer, submitted_at, reward_paid').eq('user_id', user.id).order('submitted_at', { ascending: false }).then(({ data }) => { if (data) setHistory(data); setLoading(false) }) }, [user])
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>←</button><h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>📋 Lịch sử làm task</h2></div>
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>⏳...</div> : history.length === 0 ? <div style={{ textAlign: 'center', padding: 40, background: '#161618', borderRadius: 12, color: '#8A857D' }}>Chưa làm task nào.</div> :
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>{history.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid #1C1C1E' : 'none' }}><div><div style={{ fontSize: 14 }}>Đáp án: {item.answer}</div><div style={{ fontSize: 12, color: '#8A857D' }}>{new Date(item.submitted_at).toLocaleString('vi-VN')}</div></div><span style={{ color: item.reward_paid ? '#34D399' : '#F5A623' }}>{item.reward_paid ? '✅' : '⏳'}</span></div>
      ))}</div>}
    </div>
  )
}

function TxHistoryPage({ user, onBack }: { user: any; onBack: () => void }) {
  const [txs, setTxs] = useState<any[]>([]); const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([
      supabase.from('assignments').select('id, answer, submitted_at, reward_paid').eq('user_id', user.id).eq('reward_paid', true).order('submitted_at', { ascending: false }),
      supabase.from('withdrawals').select('id, amount, status, requested_at').eq('user_id', user.id).order('requested_at', { ascending: false })
    ]).then(([taskRes, wdRes]) => {
      const items: any[] = []
      if (taskRes.data) taskRes.data.forEach((t: any) => items.push({ type: 'task', desc: 'Hoàn thành task', date: t.submitted_at, detail: t.answer }))
      if (wdRes.data) wdRes.data.forEach((w: any) => items.push({ type: 'withdraw', desc: 'Rút tiền', amount: -w.amount, date: w.requested_at, status: w.status }))
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setTxs(items); setLoading(false)
    })
  }, [user])
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>←</button><h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>💳 Lịch sử giao dịch</h2></div>
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>⏳...</div> : txs.length === 0 ? <div style={{ textAlign: 'center', padding: 40, background: '#161618', borderRadius: 12, color: '#8A857D' }}>Chưa có giao dịch nào.</div> :
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>{txs.map((tx, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < txs.length - 1 ? '1px solid #1C1C1E' : 'none' }}><div><div style={{ fontSize: 14 }}>{tx.type === 'task' ? '🐝 ' : '💰 '}{tx.desc}{tx.detail ? `: ${tx.detail}` : ''}</div><div style={{ fontSize: 12, color: '#8A857D' }}>{new Date(tx.date).toLocaleString('vi-VN')}</div></div><span style={{ color: tx.amount > 0 ? '#34D399' : tx.amount < 0 ? '#F97373' : '#34D399' }}>{tx.amount > 0 ? '+' : ''}{tx.amount !== 0 ? tx.amount.toLocaleString() + 'đ' : 'Đã nhận'}</span></div>
      ))}</div>}
    </div>
  )
}

function SettingsPage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>←</button><h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>🔔 Cài đặt thông báo</h2></div>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}><p style={{ color: '#8A857D', fontSize: 14 }}>Tính năng đang phát triển.</p></div>
    </div>
  )
}

function HelpPage({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><button onClick={onBack} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>←</button><h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20 }}>❓ Hướng dẫn</h2></div>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}>
        <div style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, marginBottom: 6 }}>1. Làm task</div><div style={{ fontSize: 14, color: '#8A857D' }}>Vào tab Làm task, chọn task, làm theo hướng dẫn và nộp kết quả.</div></div>
        <div style={{ marginBottom: 16 }}><div style={{ fontWeight: 600, marginBottom: 6 }}>2. Rút tiền</div><div style={{ fontSize: 14, color: '#8A857D' }}>Vào tab Rút tiền, nhập số tiền (tối thiểu 50.000đ) và thông tin tài khoản. Tiền sẽ được chuyển trong 24h.</div></div>
        <div><div style={{ fontWeight: 600, marginBottom: 6 }}>3. Hỗ trợ</div><div style={{ fontSize: 14, color: '#8A857D' }}>Email: support@taskbee.vn</div></div>
      </div>
    </div>
  )
}
