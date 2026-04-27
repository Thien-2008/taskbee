'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Types ───────────────────────────────────
type Tab = 'dashboard' | 'tasks' | 'withdraw' | 'profile'
type View = 'main' | 'taskDetail'

interface TaskItem {
  id: number
  batch_id: number
  content_url: string
  status: string
  batch_title?: string
  batch_type?: string
  reward_per_item?: number
  instructions?: string
}

interface DbTaskBatch {
  id: number
  task_type: string
  total_items: number
  completed_items: number
  budget_total: number
  instructions: string
  status: string
}

interface WithdrawalRecord {
  id: number
  amount: number
  method: string
  account_info: string
  status: string
  requested_at: string
  completed_at: string | null
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
  const [currentView, setCurrentView] = useState<View>('main')
  const [selectedBatch, setSelectedBatch] = useState<DbTaskBatch | null>(null)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [notification, setNotification] = useState('')
  const [balance, setBalance] = useState(0)
  const [tasksDone, setTasksDone] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load balance và tasksDone mỗi khi refreshTrigger thay đổi
  useEffect(() => {
    if (!user) return
    loadUserStats()
  }, [user, refreshTrigger])

  const loadUserStats = async () => {
    if (!user) return
    const { data: userData } = await supabase.from('users').select('balance').eq('id', user.id).single()
    if (userData) setBalance(userData.balance || 0)
    
    const { count } = await supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('reward_paid', true)
    if (count) setTasksDone(count)
  }

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

  const startTask = (batch: DbTaskBatch) => {
    setSelectedBatch(batch)
    setCurrentTaskIndex(0)
    setSelectedAnswer('')
    setCurrentView('taskDetail')
  }

  const submitTaskAnswer = async () => {
    if (!selectedAnswer || !selectedBatch || !user) {
      alert('Vui lòng chọn đáp án')
      return
    }
    setSubmitting(true)
    try {
      // Lấy task item đầu tiên còn pending trong batch
      const { data: items } = await supabase
        .from('task_items')
        .select('id')
        .eq('batch_id', selectedBatch.id)
        .eq('status', 'pending')
        .limit(1)

      if (!items || items.length === 0) {
        alert('Không còn task nào trong batch này!')
        setCurrentView('main')
        setSubmitting(false)
        return
      }

      const taskItemId = items[0].id

      // Lưu assignment
      const { error: assignError } = await supabase
        .from('assignments')
        .insert({
          task_item_id: taskItemId,
          user_id: user.id,
          answer: selectedAnswer,
          submitted_at: new Date().toISOString(),
          reward_paid: false
        })

      if (assignError) throw assignError

      // Cập nhật trạng thái task item
      const { error: updateError } = await supabase
        .from('task_items')
        .update({ status: 'completed' })
        .eq('id', taskItemId)

      if (updateError) throw updateError

      // Cập nhật completed_items
      const { error: batchError } = await supabase
        .from('task_batches')
        .update({ 
          completed_items: (selectedBatch.completed_items || 0) + 1,
          budget_spent: ((selectedBatch.completed_items || 0) + 1) * (selectedBatch.budget_total / selectedBatch.total_items)
        })
        .eq('id', selectedBatch.id)

      if (batchError) throw batchError

      // Cộng tiền cho user qua RPC
      const reward = Math.round(selectedBatch.budget_total / selectedBatch.total_items)
      const { error: rpcError } = await supabase.rpc('update_user_balance', { 
        user_id: user.id, 
        amount: reward 
      })

      if (rpcError) {
        console.log('RPC error (non-critical):', rpcError.message)
      }

      // Đánh dấu assignment đã trả thưởng
      await supabase.from('assignments').update({ reward_paid: true }).eq('task_item_id', taskItemId).eq('user_id', user.id)

      setNotification(`✅ Hoàn thành! +${reward.toLocaleString()}đ`)
      setTimeout(() => setNotification(''), 3000)

      // Refresh số liệu
      setRefreshTrigger(prev => prev + 1)

      const nextIndex = currentTaskIndex + 1
      if (nextIndex < selectedBatch.total_items) {
        setCurrentTaskIndex(nextIndex)
        setSelectedAnswer('')
      } else {
        setCurrentView('main')
        setSelectedBatch(null)
        setCurrentTaskIndex(0)
      }
    } catch (error: any) {
      alert('Lỗi: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

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
          :root { --amber: #F5A623; }
          .btn-primary { background: var(--amber); color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
          .btn-ghost { background: transparent; color: #EDEBE7; border: 1px solid #1C1C1E; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>🐝 Nền tảng việc làm vi mô</div>
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

  // ── Màn hình làm task ──────────────────────
  if (currentView === 'taskDetail' && selectedBatch) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
        
        <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setCurrentView('main')} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 18, cursor: 'pointer' }}>← Quay lại</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14 }}>{selectedBatch.task_type}</div>
            <div style={{ fontSize: 11, color: '#8A857D' }}>Task {currentTaskIndex + 1}/{selectedBatch.total_items}</div>
          </div>
        </header>

        <div style={{ width: '100%', height: 4, background: '#1C1C1E' }}>
          <div style={{ width: `${((currentTaskIndex + 1) / selectedBatch.total_items) * 100}%`, height: '100%', background: '#F5A623', transition: 'width 0.3s' }} />
        </div>

        <div style={{ flex: 1, padding: 20, maxWidth: 600, margin: '0 auto', width: '100%' }}>
          <div style={{ background: '#161618', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
            <img 
              src={`https://picsum.photos/seed/task${selectedBatch.id}_${currentTaskIndex}/400/${selectedBatch.task_type.includes('Nhập') ? '600' : '400'}`}
              alt="Task"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/400/400' }}
            />
          </div>

          <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>📋 Hướng dẫn</div>
            <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.6 }}>{selectedBatch.instructions}</div>
          </div>

          <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>
              {selectedBatch.task_type.includes('Nhập') ? 'Nhập thông tin từ ảnh:' : 'Chọn đáp án phù hợp:'}
            </div>
            
            {selectedBatch.task_type.includes('Nhập') ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="text" placeholder="Tên cửa hàng..."
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
                <input type="text" placeholder="Tổng tiền..."
                  style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
                <button onClick={() => setSelectedAnswer('done')} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '10px 0', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Xác nhận đã nhập
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Đỏ/Xanh dương', 'Trắng/Đen', 'Vàng/Cam', 'Xanh lá/Tím', 'Khác'].map((opt, i) => (
                  <button key={i} onClick={() => setSelectedAnswer(opt)}
                    style={{
                      width: '100%', padding: '12px 16px', textAlign: 'left',
                      background: selectedAnswer === opt ? 'rgba(245,166,35,0.15)' : '#0a0a0b',
                      border: selectedAnswer === opt ? '1px solid #F5A623' : '1px solid #1C1C1E',
                      borderRadius: 8, color: '#EDEBE7', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedAnswer && (
            <button onClick={submitTaskAnswer} disabled={submitting}
              style={{ width: '100%', marginTop: 16, padding: '14px 0', background: submitting ? '#8A857D' : '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              {submitting ? '⏳ Đang gửi...' : '✅ Nộp task'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Dashboard + Bottom Nav ──────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer', position: 'relative' }}>🔔</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
        </div>
      </header>

      {notification && (
        <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: '#34D399', color: '#000', padding: '10px 24px', borderRadius: 20, fontWeight: 600, fontSize: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          {notification}
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {activeTab === 'dashboard' && <DashboardTab user={user} balance={balance} tasksDone={tasksDone} onNavigate={(tab: Tab) => setActiveTab(tab)} />}
        {activeTab === 'tasks' && <TasksTab user={user} onStartTask={startTask} />}
        {activeTab === 'withdraw' && <WithdrawTab user={user} balance={balance} onRefresh={() => setRefreshTrigger(prev => prev + 1)} />}
        {activeTab === 'profile' && <ProfileTab user={user} balance={balance} tasksDone={tasksDone} onLogout={handleLogout} />}
      </div>

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {([
          { key: 'dashboard' as Tab, icon: '🏠', label: 'Tổng quan' },
          { key: 'tasks' as Tab, icon: '📋', label: 'Làm task' },
          { key: 'withdraw' as Tab, icon: '💰', label: 'Rút tiền' },
          { key: 'profile' as Tab, icon: '👤', label: 'Hồ sơ' },
        ]).map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentView('main'); setSelectedBatch(null) }}
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
function DashboardTab({ user, balance, tasksDone, onNavigate }: { user: any; balance: number; tasksDone: number; onNavigate: (tab: Tab) => void }) {
  const isNewUser = balance === 0 && tasksDone === 0

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 4 }}>
        Xin chào, {user.email?.split('@')[0] || 'bạn'} 👋
      </h2>
      <div style={{ fontSize: 13, color: '#8A857D', marginBottom: 20 }}>
        Cấp độ: {tasksDone >= 50 ? 'Ong chúa 🐝' : tasksDone >= 20 ? 'Ong thợ' : 'Tân binh'}
        <div style={{ width: '100%', height: 4, background: '#1C1C1E', borderRadius: 2, marginTop: 6 }}>
          <div style={{ width: `${Math.min(tasksDone / 50 * 100, 100)}%`, height: '100%', background: '#F5A623', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
      </div>

      {isNewUser && (
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>✨ Bắt đầu hành trình TaskBee</div>
          {[
            { done: true, text: 'Đăng ký tài khoản' },
            { done: false, text: 'Làm task đầu tiên', action: 'Làm ngay', tab: 'tasks' as Tab },
            { done: false, text: 'Rút tiền đầu tiên', action: 'Xem hướng dẫn', tab: 'withdraw' as Tab },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #1C1C1E' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: step.done ? '#34D399' : '#8A857D' }}>{step.done ? '✅' : '○'}</span>
                <span style={{ color: step.done ? '#8A857D' : '#EDEBE7', fontSize: 14 }}>{step.text}</span>
              </div>
              {!step.done && step.tab && (
                <button onClick={() => onNavigate(step.tab)} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '6px 14px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{step.action}</button>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>💰 Số dư</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</div>
        </div>
        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 4 }}>🐝 Task đã làm</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24 }}>{tasksDone}</div>
        </div>
      </div>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>📢 Hướng dẫn</div>
        <p style={{ fontSize: 14, color: '#8A857D' }}>Vào tab <strong style={{ color: '#F5A623' }}>Làm task</strong> để tìm việc ngay! Mỗi task hoàn thành bạn sẽ được cộng tiền vào số dư.</p>
      </div>
    </div>
  )
}

// ─── Tasks Tab ─────────────────────────────────
function TasksTab({ user, onStartTask }: { user: any; onStartTask: (batch: DbTaskBatch) => void }) {
  const [batches, setBatches] = useState<DbTaskBatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBatches()
  }, [])

  const loadBatches = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('task_batches')
      .select('*')
      .eq('status', 'active')
      .order('id', { ascending: false })

    if (!error && data) setBatches(data)
    setLoading(false)
  }

  const getRewardPerItem = (batch: DbTaskBatch) => Math.round(batch.budget_total / batch.total_items)

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>📋 Danh sách task</h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#8A857D' }}>⏳ Đang tải task...</div>
      ) : batches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, background: '#161618', borderRadius: 12 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ color: '#8A857D' }}>Hiện chưa có task nào. Quay lại sau nhé!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {batches.map(batch => (
            <div key={batch.id} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{batch.task_type}</div>
                  <div style={{ fontSize: 12, color: '#8A857D', marginTop: 6 }}>
                    {getRewardPerItem(batch).toLocaleString()}đ/task · Tổng {batch.total_items} task · {batch.total_items - batch.completed_items} còn lại
                  </div>
                  <div style={{ fontSize: 12, color: '#8A857D', marginTop: 4 }}>📋 {batch.instructions?.slice(0, 80)}...</div>
                  <div style={{ fontSize: 10, color: '#34D399', marginTop: 6 }}>🔒 Tiền đã được bảo vệ</div>
                </div>
                <button onClick={() => onStartTask(batch)}
                  style={{ background: '#F5A623', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 12 }}>
                  Làm ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Withdraw Tab ─────────────────────────────
function WithdrawTab({ user, balance, onRefresh }: { user: any; balance: number; onRefresh: () => void }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('momo')
  const [accountInfo, setAccountInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [history, setHistory] = useState<WithdrawalRecord[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('withdrawals').select('*').eq('user_id', user.id).order('requested_at', { ascending: false }).then(({ data }) => {
      if (data) setHistory(data)
    })
  }, [user])

  const handleWithdraw = async () => {
    const amt = parseInt(amount)
    if (!amt || amt < 50000) {
      alert('Số tiền tối thiểu là 50.000đ')
      return
    }
    if (amt > balance) {
      alert('Số dư không đủ')
      return
    }
    if (!accountInfo.trim()) {
      alert('Vui lòng nhập số tài khoản/SĐT')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('withdrawals').insert({
        user_id: user.id,
        amount: amt,
        method,
        account_info: accountInfo,
        status: 'pending',
        requested_at: new Date().toISOString()
      })

      if (error) throw error

      alert('✅ Yêu cầu rút tiền đã được ghi nhận! Chúng tôi sẽ xử lý trong 24h.')
      setAmount('')
      onRefresh()
    } catch (error: any) {
      alert('Lỗi: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Đang xử lý'
      case 'processing': return '🔄 Đang chuyển'
      case 'completed': return '✅ Đã nhận'
      case 'failed': return '❌ Từ chối'
      default: return status
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>💰 Rút tiền</h2>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#8A857D', fontSize: 14 }}>Số dư khả dụng</span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</span>
        </div>
      </div>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Phương thức</label>
          <select value={method} onChange={e => setMethod(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }}>
            <option value="momo">📱 Ví MoMo</option>
            <option value="bank">🏦 Tài khoản ngân hàng</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tài khoản / SĐT</label>
          <input type="text" value={accountInfo} onChange={e => setAccountInfo(e.target.value)} placeholder="Nhập số tài khoản hoặc SĐT MoMo"
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tiền muốn rút</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Tối đa ${balance.toLocaleString()}đ`}
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} />
        </div>
        <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 16 }}>
          ⏱ Thời gian xử lý: 24h · 💸 Phí: 0đ · 📌 Tối thiểu: 50.000đ
        </div>
        <button onClick={handleWithdraw} disabled={submitting}
          style={{ width: '100%', padding: '12px 0', background: submitting ? '#8A857D' : '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          {submitting ? '⏳ Đang xử lý...' : 'Xác nhận rút tiền'}
        </button>
      </div>

      {history.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 12 }}>📜 Lịch sử rút tiền</div>
          <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>
            {history.map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid #1C1C1E' : 'none' }}>
                <div>
                  <div style={{ fontSize: 14 }}>{tx.amount.toLocaleString()}đ</div>
                  <div style={{ fontSize: 12, color: '#8A857D' }}>
                    {new Date(tx.requested_at).toLocaleDateString('vi-VN')} · {getStatusText(tx.status)}
                  </div>
                </div>
                <span style={{ color: tx.status === 'completed' ? '#34D399' : tx.status === 'failed' ? '#F97373' : '#F5A623' }}>
                  {getStatusText(tx.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────
function ProfileTab({ user, balance, tasksDone, onLogout }: { user: any; balance: number; tasksDone: number; onLogout: () => void }) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>👤 Hồ sơ</h2>

      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(245,166,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>🐝</div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>{user.email}</div>
        <div style={{ fontSize: 13, color: '#8A857D', marginTop: 4 }}>Thành viên từ: Tháng 4/2025</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>{balance.toLocaleString()}đ</div>
            <div style={{ fontSize: 11, color: '#8A857D' }}>Số dư</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18 }}>{tasksDone}</div>
            <div style={{ fontSize: 11, color: '#8A857D' }}>Task đã làm</div>
          </div>
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
