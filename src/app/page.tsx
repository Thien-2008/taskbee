'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Types ───────────────────────────────────
type Tab = 'dashboard' | 'tasks' | 'withdraw' | 'profile'

interface TaskItem {
  id: number
  title: string
  type: 'tag' | 'input'
  reward: string
  unit: string
  time: string
  difficulty: string
  approvalRate: number
  slotsLeft: number
  totalSlots: number
  escrow: boolean
  peopleDone: number
}

// ─── Main App ────────────────────────────────
export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('✅ Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.')
        setIsLogin(true)
        setPassword('')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut() }

  // ── Auth Form ──────────────────────────────
  if (!user) {
    if (showAuth) {
      return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
          <div style={{ width: '100%', maxWidth: 380, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '32px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>🐝 TaskBee</h1>
              <button onClick={() => { setShowAuth(false); setIsLogin(true); setPassword('') }} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
              {isLogin ? 'Đăng nhập' : 'Tạo tài khoản mới'}
            </h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Mật khẩu</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••"
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {loading ? '⏳ Đang xử lý...' : isLogin ? '🔐 Đăng nhập' : '📝 Tạo tài khoản'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>
              {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
              <button onClick={() => { setIsLogin(!isLogin); setPassword('') }}
                style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      )
    }
    // Landing page
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', overflowX: 'hidden', userSelect: 'none' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
          :root { --amber: #F5A623; --bg: #0a0a0b; --card: #161618; --fg: #EDEBE7; --muted: #8A857D; --border: #1C1C1E; }
          .btn-primary { background: var(--amber); color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
          .btn-ghost { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        `}</style>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={() => { setIsLogin(true); setShowAuth(true) }}>Đăng nhập</button>
            <button className="btn-primary" onClick={() => { setIsLogin(false); setShowAuth(true) }}>Đăng ký</button>
          </div>
        </nav>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 60px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>
              🐝 Nền tảng việc làm vi mô
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05 }}>
              Điện thoại của bạn<br /> là <span style={{ color: '#F5A623' }}>công cụ kiếm tiền</span>
            </h1>
            <p style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, margin: '20px auto 0' }}>
              Làm những công việc nhỏ thực sự — gắn thẻ ảnh, nhập liệu — ngay trên điện thoại. Được trả tiền thật, minh bạch, trong 24 giờ.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
              <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => { setIsLogin(false); setShowAuth(true) }}>Bắt đầu kiếm tiền</button>
              <button className="btn-ghost" style={{ fontSize: 16, padding: '16px 36px' }}>Tôi là doanh nghiệp →</button>
            </div>
          </div>
        </section>
        <footer style={{ borderTop: '1px solid #1C1C1E', padding: 24, textAlign: 'center', fontSize: 13, color: '#8A857D' }}>
          🐝 TaskBee · © 2025 TaskBee. Nền tảng việc làm vi mô Việt Nam.
        </footer>
      </div>
    )
  }

  // ── Dashboard + Bottom Nav ──────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      
      {/* Header */}
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer', position: 'relative' }}>
            🔔<span style={{ position: 'absolute', top: -4, right: -6, background: '#F5A623', color: '#000', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {activeTab === 'dashboard' && <DashboardTab user={user} />}
        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'withdraw' && <WithdrawTab />}
        {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
      </div>

      {/* Bottom Navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {([
          { key: 'dashboard' as Tab, icon: '🏠', label: 'Tổng quan' },
          { key: 'tasks' as Tab, icon: '📋', label: 'Làm task' },
          { key: 'withdraw' as Tab, icon: '💰', label: 'Rút tiền' },
          { key: 'profile' as Tab, icon: '👤', label: 'Hồ sơ' },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none',
              color: activeTab === tab.key ? '#F5A623' : '#8A857D', cursor: 'pointer', padding: '4px 12px',
              fontSize: 12, fontWeight: activeTab === tab.key ? 600 : 400, transition: 'all 0.2s',
            }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ─── Dashboard Tab ────────────────────────────
function DashboardTab({ user }: { user: any }) {
  const [balance, setBalance] = useState(0)
  const [pendingBalance, setPendingBalance] = useState(0)
  const [tasksDone, setTasksDone] = useState(0)

  useEffect(() => {
    supabase.from('users').select('balance').eq('id', user.id).single().then(({ data }) => {
      if (data) setBalance(data.balance || 0)
    })
    supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('reward_paid', true).then(({ count }) => {
      if (count) setTasksDone(count)
    })
    // Mock pending balance cho demo
    setPendingBalance(13500)
  }, [user.id])

  const isNewUser = balance === 0 && tasksDone === 0
  const canWithdraw = balance >= 50000

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      {/* Welcome */}
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 4 }}>
        Xin chào, {user.email?.split('@')[0] || 'bạn'} 👋
      </h2>
      <div style={{ fontSize: 13, color: '#8A857D', marginBottom: 20 }}>
        Cấp độ: {tasksDone >= 50 ? 'Ong chúa 🐝' : tasksDone >= 20 ? 'Ong thợ' : 'Tân binh'}
        <div style={{ width: '100%', height: 4, background: '#1C1C1E', borderRadius: 2, marginTop: 6 }}>
          <div style={{ width: `${Math.min(tasksDone / 50 * 100, 100)}%`, height: '100%', background: '#F5A623', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
      </div>

      {/* Banner rút tiền (Trạng thái C) */}
      {canWithdraw && (
        <div style={{ background: 'linear-gradient(135deg, #1a1508, #2a1f0a)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#F5A623' }}>💰 Bạn có {balance.toLocaleString()}đ sẵn sàng rút!</div>
            <div style={{ fontSize: 12, color: '#8A857D' }}>Phí: 0đ · Nhận trong 24h</div>
          </div>
          <button style={{ background: '#F5A623', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Rút ngay</button>
        </div>
      )}

      {/* Onboarding checklist (Trạng thái A) */}
      {isNewUser && (
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>✨ Bắt đầu hành trình TaskBee</div>
          {[
            { done: true, text: 'Đăng ký tài khoản' },
            { done: false, text: 'Làm task đầu tiên', action: 'Làm ngay' },
            { done: false, text: 'Rút tiền đầu tiên', action: 'Xem hướng dẫn' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #1C1C1E' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: step.done ? '#34D399' : '#8A857D' }}>{step.done ? '✅' : '○'}</span>
                <span style={{ color: step.done ? '#8A857D' : '#EDEBE7', fontSize: 14 }}>{step.text}</span>
              </div>
              {!step.done && step.action && (
                <button style={{ background: '#F5A623', color: '#000', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{step.action}</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>💰 Số dư khả dụng</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</div>
          {pendingBalance > 0 && <div style={{ fontSize: 12, color: '#8A857D', marginTop: 4 }}>⏳ Đang chờ: {pendingBalance.toLocaleString()}đ</div>}
        </div>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>🐝 Task đã làm</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24 }}>{tasksDone}</div>
        </div>
      </div>

      {/* Task gợi ý */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>📋 Task gợi ý cho bạn</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Gắn thẻ ảnh Shopee Fashion', reward: '400đ/ảnh', time: '~35 phút', difficulty: 'Dễ', approvalRate: 94, slotsLeft: 38, totalSlots: 50, type: 'tag' },
            { title: 'Nhập liệu hóa đơn ABC', reward: '1.500đ/file', time: '~60 phút', difficulty: 'Trung bình', approvalRate: 88, slotsLeft: 5, totalSlots: 30, type: 'input' },
          ].map((task, i) => (
            <div key={i} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: '#8A857D', marginTop: 4 }}>
                    {task.reward} · {task.time} · ⭐ {task.difficulty}
                  </div>
                  <div style={{ fontSize: 11, color: '#8A857D', marginTop: 4 }}>
                    ✅ {task.approvalRate}% duyệt · 👥 {task.totalSlots - task.slotsLeft} người đã làm
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 6 }}>
                  <div style={{ fontSize: 11, color: '#8A857D' }}>Còn {task.slotsLeft}/{task.totalSlots} slot</div>
                  <div style={{ background: '#F5A623', color: '#000', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>Nhận</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#34D399', marginTop: 8 }}>🔒 Tiền đã được bảo vệ</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>📜 Hoạt động gần đây</div>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 16 }}>
          {tasksDone > 0 ? (
            <div style={{ fontSize: 14, color: '#8A857D' }}>Lịch sử task sẽ hiển thị ở đây</div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#8A857D' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🐝</div>
              <div style={{ fontSize: 14 }}>Chưa có hoạt động. Hãy làm task đầu tiên!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tasks Tab ─────────────────────────────────
function TasksTab() {
  const [filter, setFilter] = useState('all')
  const tasks: TaskItem[] = [
    { id: 1, title: 'Gắn thẻ ảnh Shopee Fashion', type: 'tag', reward: '400đ', unit: '/ảnh', time: '~35 phút', difficulty: 'Dễ', approvalRate: 94, slotsLeft: 38, totalSlots: 50, escrow: true, peopleDone: 23 },
    { id: 2, title: 'Nhập liệu hóa đơn ABC', type: 'input', reward: '1.500đ', unit: '/file', time: '~60 phút', difficulty: 'Trung bình', approvalRate: 88, slotsLeft: 5, totalSlots: 30, escrow: true, peopleDone: 42 },
    { id: 3, title: 'Chụp ảnh mặt tiền Circle K', type: 'tag', reward: '35.000đ', unit: '/task', time: '~10 phút', difficulty: 'Dễ', approvalRate: 96, slotsLeft: 12, totalSlots: 20, escrow: true, peopleDone: 156 },
  ]

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input type="text" placeholder="🔍 Tìm task..."
          style={{ width: '100%', padding: '10px 14px', background: '#161618', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
        {[
          { key: 'all', label: 'Tất cả' },
          { key: 'tag', label: '🏷 Gắn thẻ' },
          { key: 'input', label: '📄 Nhập liệu' },
          { key: 'easy', label: '⭐ Dễ' },
          { key: 'high', label: '💰 Cao tiền' },
          { key: 'new', label: '🆕 Mới' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid #1C1C1E',
              background: filter === f.key ? '#F5A623' : 'transparent',
              color: filter === f.key ? '#000' : '#8A857D',
              fontWeight: 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tasks.map(task => (
          <div key={task.id} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{task.title}</div>
                <div style={{ fontSize: 12, color: '#8A857D', marginTop: 6 }}>
                  {task.reward}{task.unit} · {task.time} · ⭐ {task.difficulty}
                </div>
                <div style={{ fontSize: 11, color: '#8A857D', marginTop: 4 }}>
                  ✅ {task.approvalRate}% duyệt · 👥 {task.peopleDone} người · Còn {task.slotsLeft}/{task.totalSlots} slot
                </div>
                <div style={{ fontSize: 10, color: '#34D399', marginTop: 6 }}>🔒 Tiền đã được bảo vệ</div>
              </div>
              <button style={{ background: '#F5A623', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 12 }}>
                Nhận
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Withdraw Tab ─────────────────────────────
function WithdrawTab() {
  const [amount, setAmount] = useState('')
  const balance = 120000
  const pendingBalance = 13500

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>💰 Rút tiền</h2>

      {/* Số dư */}
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#8A857D', fontSize: 14 }}>Số dư khả dụng</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#8A857D', fontSize: 14 }}>Đang chờ duyệt</span>
          <span style={{ fontSize: 14, color: '#F5A623' }}>{pendingBalance.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Form rút tiền */}
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Phương thức</label>
          <select style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }}>
            <option value="momo">📱 Ví MoMo</option>
            <option value="bank">🏦 Tài khoản ngân hàng</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tài khoản / SĐT</label>
          <input type="text" placeholder="Nhập số tài khoản hoặc SĐT MoMo"
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tiền muốn rút</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Tối đa ${balance.toLocaleString()}đ`}
              style={{ flex: 1, padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
            <button onClick={() => setAmount(balance.toString())} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#8A857D', padding: '10px 14px', borderRadius: 8, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>Tối đa</button>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 16 }}>
          ⏱ Thời gian xử lý: 24h · 💸 Phí: 0đ · 📌 Tối thiểu: 50.000đ
        </div>
        <button style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          Xác nhận rút tiền
        </button>
      </div>

      {/* Lịch sử giao dịch */}
      <div>
        <div style={{ fontWeight: 600, marginBottom: 12 }}>📜 Lịch sử giao dịch</div>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
          {[
            { date: '25/04', amount: '+45.000đ', type: 'Task #1042 duyệt', status: 'success' },
            { date: '20/04', amount: '-80.000đ', type: 'Rút về MoMo', status: 'success' },
            { date: '15/04', amount: '+12.000đ', type: 'Task #891 duyệt', status: 'pending' },
            { date: '10/04', amount: '-30.000đ', type: 'Rút về Bank', status: 'failed', reason: 'Số TK không đúng' },
          ].map((tx, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #1C1C1E' : 'none' }}>
              <div>
                <div style={{ fontSize: 14 }}>{tx.type}</div>
                <div style={{ fontSize: 12, color: '#8A857D' }}>{tx.date} · {tx.status === 'success' ? '✅' : tx.status === 'pending' ? '⏳' : '❌'} {tx.status === 'success' ? 'Hoàn thành' : tx.status === 'pending' ? 'Đang xử lý' : 'Từ chối'}</div>
                {tx.reason && <div style={{ fontSize: 11, color: '#F97373', marginTop: 2 }}>Lý do: {tx.reason}</div>}
              </div>
              <span style={{ fontWeight: 600, color: tx.amount.startsWith('+') ? '#34D399' : '#F97373' }}>{tx.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────
function ProfileTab({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>👤 Hồ sơ</h2>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🐝</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{user.email}</div>
        <div style={{ fontSize: 13, color: '#8A857D', marginTop: 4 }}>Thành viên từ: Tháng 4/2025</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          <span style={{ color: '#F5A623' }}>⭐⭐⭐⭐</span><span style={{ fontSize: 13, color: '#8A857D' }}>4.5/5</span>
        </div>
      </div>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, overflow: 'hidden' }}>
        {[
          { icon: '📋', label: 'Lịch sử làm task' },
          { icon: '💳', label: 'Lịch sử giao dịch' },
          { icon: '🔔', label: 'Cài đặt thông báo' },
          { icon: '❓', label: 'Hướng dẫn sử dụng' },
          { icon: '📞', label: 'Liên hệ hỗ trợ' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < 4 ? '1px solid #1C1C1E' : 'none', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14 }}>{item.label}</span>
            </div>
            <span style={{ color: '#8A857D' }}>→</span>
          </div>
        ))}
      </div>

      <button onClick={onLogout} style={{ width: '100%', marginTop: 20, padding: '12px 0', background: 'transparent', border: '1px solid #F97373', color: '#F97373', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
        🚪 Đăng xuất
      </button>
    </div>
  )
}
