'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import { formatPhoneDisplay } from '@/utils/phone'
import { validateEmail, validatePhone, validatePassword, validatePasswordMatch, validateFullName, checkPasswordStrength } from '@/utils/validation'

export default function Home() {
  const [showAuth, setShowAuth] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [displayName, setDisplayName] = useState('')

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
            {isLogin ? (
              <form onSubmit={e => { e.preventDefault(); handleLogin() }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email hoặc SĐT</label><input type="text" required value={loginIdentifier} onChange={e => { setLoginIdentifier(e.target.value); setLoginError('') }} placeholder="example@mail.com hoặc 0912 345 678" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} /></div>
                {loginError && <div style={{ color: '#F97373', fontSize: 14, textAlign: 'center' }}>{loginError}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '🔐 Đăng nhập'}</button>
              </form>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleRegister() }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Họ và tên</label><input type="text" required value={regFullName} onChange={e => { setRegFullName(e.target.value); setRegErrors(p => ({...p, fullName:''})) }} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.fullName && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.fullName}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Email</label><input type="email" required value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegErrors(p => ({...p, email:''})) }} placeholder="example@gmail.com" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.email && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.email}</div>}</div>
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Số điện thoại</label><input type="tel" required value={regPhone} onChange={e => { setRegPhone(e.target.value); setRegErrors(p => ({...p, phone:''})) }} placeholder="0912 345 678" maxLength={15} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.phone && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.phone}</div>}</div>
                {regPassword && (<div><div style={{ height: 4, background: '#1C1C1E', borderRadius: 2 }}><div style={{ width: `${(strength.score / 4) * 100}%`, height: '100%', background: strength.color, borderRadius: 2 }} /></div><p style={{ color: strength.color, fontSize: 12, marginTop: 4 }}>{strength.label}</p>{regErrors.password && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.password}</div>}</div>)}
                <div><label style={{ display: 'block', fontSize: 13, marginBottom: 6, color: '#8A857D' }}>Xác nhận mật khẩu</label><input type="password" required value={regConfirmPassword} onChange={e => { setRegConfirmPassword(e.target.value); setRegErrors(p => ({...p, confirmPassword:''})) }} placeholder="••••••" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 15, outline: 'none' }} />{regErrors.confirmPassword && <div style={{ color: '#F97373', fontSize: 12, marginTop: 4 }}>{regErrors.confirmPassword}</div>}</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8A857D', cursor: 'pointer' }}><input type="checkbox" checked={termsAccepted} onChange={e => { setTermsAccepted(e.target.checked); setRegErrors(p => ({...p, terms:''})) }} />Tôi đồng ý với Điều khoản và Chính sách bảo mật</label>
                {regErrors.terms && <div style={{ color: '#F97373', fontSize: 12 }}>{regErrors.terms}</div>}
                <button type="submit" disabled={authLoading} style={{ width: '100%', padding: '12px 0', background: '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{authLoading ? '⏳...' : '📝 Tạo tài khoản'}</button>
              </form>
            )}
          </div>
        </div>
      )
    }
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', overflowX: 'hidden' }}>
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
        </nav>
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 60px' }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05 }}>Điện thoại của bạn<br /> là <span style={{ color: '#F5A623' }}>công cụ kiếm tiền</span></h1>
            <p style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, margin: '20px auto 0' }}>Làm những công việc nhỏ thực sự — gắn thẻ ảnh, nhập liệu — trên điện thoại.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
              <button onClick={() => { setIsLogin(false); setShowAuth(true) }} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Bắt đầu kiếm tiền</button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const navTabs = [
    { key: 'dashboard', icon: '🏠', label: 'Tổng quan' },
    { key: 'tasks', icon: '📋', label: 'Làm task' },
    ...(userRole === 'business' || userRole === 'admin' ? [{ key: 'postTask', icon: '📝', label: 'Đăng task' }] : []),
    { key: 'withdraw', icon: '💰', label: 'Rút tiền' },
    { key: 'profile', icon: '👤', label: 'Hồ sơ' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
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
            {activeTab === 'profile' && <ProfileTab user={user} displayName={displayName} balance={balance} tasksDone={tasksDone} userRole={userRole} onLogout={handleLogout} onNavigate={(v) => setCurrentView(v)} />}
          </>
        )}
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {navTabs.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentView('main') }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: activeTab === tab.key ? '#F5A623' : '#8A857D', cursor: 'pointer', padding: '4px 8px', fontSize: 11, fontWeight: activeTab === tab.key ? 600 : 400 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function PostTaskTab({ user, onRefresh }: { user: any; onRefresh: () => void }) {
  const [taskType, setTaskType] = useState('Gắn thẻ ảnh'); const [totalItems, setTotalItems] = useState('50')
  const [budgetTotal, setBudgetTotal] = useState('25000'); const [instructions, setInstructions] = useState('')
  const [submitting, setSubmitting] = useState(false); const [myBatches, setMyBatches] = useState<any[]>([])
  useEffect(() => { supabase.from('task_batches').select('*').order('id', { ascending: false }).then(({ data }) => { if (data) setMyBatches(data) }) }, [])
  const handlePost = async () => {
    const items = parseInt(totalItems); const budget = parseInt(budgetTotal)
    if (!items || !budget || items < 1 || budget < 1000) { alert('Vui lòng nhập số hợp lệ'); return }
    setSubmitting(true)
    try {
      const { data: businesses } = await supabase.from('businesses').select('id').limit(1)
      const businessId = businesses && businesses.length > 0 ? businesses[0].id : 1
      await supabase.from('task_batches').insert({ business_id: businessId, task_type: taskType, total_items: items, budget_total: budget, completed_items: 0, status: 'active', instructions: instructions || 'Xem ảnh và chọn đáp án phù hợp' })
      const { data: newBatch } = await supabase.from('task_batches').select('id').order('id', { ascending: false }).limit(1)
      if (newBatch && newBatch.length > 0) {
        const itemsToInsert = Array.from({ length: items }, (_, i) => ({ batch_id: newBatch[0].id, content_url: `https://picsum.photos/seed/batch${newBatch[0].id}_${i}/400/400`, status: 'pending' }))
        await supabase.from('task_items').insert(itemsToInsert)
      }
      alert('✅ Đăng task thành công!'); setTotalItems('50'); setBudgetTotal('25000'); setInstructions(''); onRefresh()
    } catch (error: any) { alert('Lỗi: ' + error.message) } finally { setSubmitting(false) }
  }
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 20 }}>📝 Đăng task mới</h2>
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Loại task</label><select value={taskType} onChange={e => setTaskType(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }}><option>Gắn thẻ ảnh</option><option>Nhập liệu</option></select></div>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Tổng số task</label><input type="number" value={totalItems} onChange={e => setTotalItems(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Tổng ngân sách (đ)</label><input type="number" value={budgetTotal} onChange={e => setBudgetTotal(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Hướng dẫn</label><textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} placeholder="Hướng dẫn cho người làm..." style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none', resize: 'vertical' }} /></div>
        <button onClick={handlePost} disabled={submitting} style={{ width: '100%', padding: '12px 0', background: submitting ? '#8A857D' : '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{submitting ? '⏳...' : 'Đăng task'}</button>
      </div>
      {myBatches.length > 0 && (
        <div><div style={{ fontWeight: 600, marginBottom: 12 }}>📋 Task đã đăng</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{myBatches.map(batch => (
            <div key={batch.id} style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><div><div style={{ fontSize: 14, fontWeight: 600 }}>{batch.task_type}</div><div style={{ fontSize: 12, color: '#8A857D' }}>{batch.total_items} task · {batch.budget_total.toLocaleString()}đ</div></div><div style={{ fontSize: 12, color: '#8A857D' }}>{batch.completed_items}/{batch.total_items} hoàn thành</div></div>
            </div>
          ))}</div></div>)}
    </div>
  )
}

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
      <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20, marginBottom: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#8A857D', fontSize: 14 }}>Số dư</span><span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>{balance.toLocaleString()}đ</span></div></div>
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

function ProfileTab({ user, displayName, balance, tasksDone, userRole, onLogout, onNavigate }: { user: any; displayName: string; balance: number; tasksDone: number; userRole: string; onLogout: () => void; onNavigate: (v: any) => void }) {
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
          { icon: '📋', label: 'Lịch sử làm task', view: 'taskHistory' },
          { icon: '💳', label: 'Lịch sử giao dịch', view: 'txHistory' },
          ...(userRole === 'admin' ? [{ icon: '⚙️', label: 'Admin (duyệt rút tiền)', view: 'admin' }] : []),
          { icon: '🔔', label: 'Cài đặt thông báo', view: 'settings' },
          { icon: '❓', label: 'Hướng dẫn sử dụng', view: 'help' },
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
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Phương thức</label><select value={method} onChange={e => setMethod(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }}><option value="momo">📱 Ví MoMo</option><option value="bank">🏦 Tài khoản ngân hàng</option></select></div>
        <div style={{ marginBottom: 12 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tài khoản / SĐT</label><input type="text" value={accountInfo} onChange={e => setAccountInfo(e.target.value)} placeholder="Nhập số tài khoản hoặc SĐT MoMo" style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số tiền muốn rút</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={`Tối đa ${balance.toLocaleString()}đ`} style={{ width: '100%', padding: '10px 14px', background: '#0a0a0b', border: '1px solid #1C1C1E', borderRadius: 8, color: '#EDEBE7', fontSize: 14, outline: 'none' }} /></div>
        <div style={{ fontSize: 12, color: '#8A857D', marginBottom: 16 }}>⏱ Thời gian xử lý: 24h · 💸 Phí: 0đ · 📌 Tối thiểu: 50.000đ</div>
        <button onClick={handleWithdraw} disabled={submitting} style={{ width: '100%', padding: '12px 0', background: submitting ? '#8A857D' : '#F5A623', color: '#000', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{submitting ? '⏳ Đang xử lý...' : 'Xác nhận rút tiền'}</button>
      </div>
      {history.length > 0 && (
        <div><div style={{ fontWeight: 600, marginBottom: 12 }}>📜 Lịch sử rút tiền</div>
          <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 16 }}>{history.map((tx, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < history.length - 1 ? '1px solid #1C1C1E' : 'none' }}>
              <div>
                <div style={{ fontSize: 14 }}>{tx.amount.toLocaleString()}đ</div>
                <div style={{ fontSize: 12, color: '#8A857D' }}>{new Date(tx.requested_at).toLocaleDateString('vi-VN')} · {tx.status === 'completed' ? '✅ Hoàn thành' : tx.status === 'pending' ? '⏳ Đang xử lý' : '❌ Từ chối'}</div>
              </div>
              <span style={{ fontWeight: 600, color: tx.status === 'completed' ? '#34D399' : tx.status === 'failed' ? '#F97373' : '#F5A623' }}>{tx.status === 'completed' ? '✅' : tx.status === 'failed' ? '❌' : '⏳'}</span>
            </div>
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
