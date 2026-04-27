'use client'

import { useState, useEffect } from 'react'
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
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])
  useEffect(() => { if (user) { loadUserStats() } }, [user])

  const loadUserStats = async () => {
    if (!user) return
    const { data: ud } = await supabase.from('users').select('balance, role, phone, full_name').eq('id', user.id).single()
    if (ud) {
      setBalance(ud.balance || 0); setUserRole(ud.role || 'user')
      if (ud.full_name) setDisplayName(ud.full_name)
      else if (ud.phone) setDisplayName(formatPhoneDisplay(ud.phone))
      else setDisplayName('Người dùng')
    }
    const { count } = await supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('reward_paid', true)
    if (count) setTasksDone(count)
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
    if (!termsAccepted) { setRegErrors(p => ({ ...p, terms: 'Vui lòng đồng ý' })); return }
    const result = await register({ email: regEmail, phone: regPhone, password: regPassword, fullName: regFullName })
    if (!result.success) { alert(result.error); return }
    alert('✅ Đăng ký thành công! Vui lòng kiểm tra email.')
    setIsLogin(true)
  }

  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) { setLoginError('Vui lòng nhập đầy đủ'); return }
    const result = await login(loginIdentifier, loginPassword)
    if (!result.success) { setLoginError(result.error ?? 'Đăng nhập thất bại'); return }
    setShowAuth(false)
  }

  const handleLogout = async () => { await logout() }

  if (!user) {
    if (showAuth) {
      const strength = checkPasswordStrength(regPassword)
      return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 380, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>🐝 TaskBee</h1>
              <button onClick={() => { setShowAuth(false); setIsLogin(true) }} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20 }}>✕</button>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
            {isLogin ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Email hoặc SĐT</label><input type="text" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /></div>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Mật khẩu</label><input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /></div>
                {loginError && <div style={{ color: '#F97373', fontSize: 14, textAlign: 'center' }}>{loginError}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: 12, background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15 }}>{authLoading ? '⏳...' : '🔐 Đăng nhập'}</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Họ và tên</label><input type="text" value={regFullName} onChange={e => setRegFullName(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.fullName && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.fullName}</div>}</div>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Email</label><input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.email && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.email}</div>}</div>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Số điện thoại</label><input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.phone && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.phone}</div>}</div>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Mật khẩu</label><input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regPassword && <div style={{ height: 4, background: '#1C1C1E', borderRadius: 2 }}><div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, borderRadius: 2 }} /></div>}{regErrors.password && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.password}</div>}</div>
                <div><label style={{ fontSize: 13, color: '#8A857D' }}>Xác nhận mật khẩu</label><input type="password" value={regConfirmPassword} onChange={e => setRegConfirmPassword(e.target.value)} style={{ width: '100%', padding: 10, background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.confirmPassword && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.confirmPassword}</div>}</div>
                <label style={{ fontSize: 13, color: '#8A857D' }}><input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} /> Tôi đồng ý điều khoản</label>
                {regErrors.terms && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.terms}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: 12, background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15 }}>{authLoading ? '⏳...' : '📝 Tạo tài khoản'}</button>
              </form>
            )}
            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>{isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}<button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#F5A623', fontWeight: 600, fontSize: 14 }}>{isLogin ? 'Đăng ký' : 'Đăng nhập'}</button></p>
          </div>
        </div>
      )
    }
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 48 }}>🐝 TaskBee</h1>
          <p style={{ color: '#8A857D', margin: '16px 0' }}>Nền tảng việc làm vi mô</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => { setIsLogin(true); setShowAuth(true) }} style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '12px 28px', borderRadius: 8, fontWeight: 500, fontSize: 15 }}>Đăng nhập</button>
            <button onClick={() => { setIsLogin(false); setShowAuth(true) }} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15 }}>Đăng ký</button>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13 }}>Đăng xuất</button>
      </header>
      <div style={{ flex: 1, padding: 20, paddingBottom: 80 }}>
        {activeTab === 'dashboard' && (
          <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Xin chào, {displayName} 👋</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#8A857D' }}>💰 Số dư</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</div>
              </div>
              <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 12, color: '#8A857D' }}>🐝 Task đã làm</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24 }}>{tasksDone}</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tasks' && <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>📋 Danh sách task sẽ hiển thị ở đây</div>}
        {activeTab === 'withdraw' && <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>💰 Rút tiền sẽ hiển thị ở đây</div>}
        {activeTab === 'profile' && <ProfileTab user={user} displayName={displayName} balance={balance} tasksDone={tasksDone} userRole={userRole} onLogout={handleLogout} onNavigate={(v: View) => setCurrentView(v)} />}
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
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

function ProfileTab({ user, displayName, balance, tasksDone, userRole, onLogout, onNavigate }: { user: any; displayName: string; balance: number; tasksDone: number; userRole: string; onLogout: () => void; onNavigate: (v: View) => void }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>👤 Hồ sơ</h2>
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

function TasksTab({ user, onStartTask }: { user: any; onStartTask: (b: DbTaskBatch) => void }) {
  const [batches, setBatches] = useState<DbTaskBatch[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    supabase.from('task_batches').select('*').eq('status', 'active').order('id', { ascending: false })
      .then(({ data }) => { if (data) setBatches(data); setLoading(false) })
  }, [])
  
  const reward = (b: DbTaskBatch) => Math.round(b.budget_total / b.total_items)
  
  if (loading) return <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>⏳ Đang tải task...</div>
  if (batches.length === 0) return <div style={{ textAlign: 'center', padding: 40, background: '#161618', borderRadius: 12, color: '#8A857D' }}>📋 Chưa có task nào.</div>
  
  return (
    <div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>📋 Danh sách task</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {batches.map(batch => (
          <div key={batch.id} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{batch.task_type}</div>
            <div style={{ fontSize: 12, color: '#8A857D', marginTop: 6 }}>
              {reward(batch).toLocaleString()}đ/task · {batch.total_items - batch.completed_items} còn lại · {batch.instructions?.slice(0, 60)}...
            </div>
            <div style={{ fontSize: 10, color: '#34D399', marginTop: 6 }}>🔒 Tiền đã được bảo vệ</div>
            <button onClick={() => onStartTask(batch)} style={{ marginTop: 10, background: '#F5A623', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Làm ngay</button>
          </div>
        ))}
      </div>
    </div>
  )
}
