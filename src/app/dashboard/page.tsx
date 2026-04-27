'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { formatPhoneDisplay } from '@/utils/phone'

type Tab = 'dashboard' | 'tasks' | 'withdraw' | 'profile'
type View = 'main' | 'taskHistory' | 'txHistory' | 'settings' | 'help'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [balance, setBalance] = useState(0)
  const [tasksDone, setTasksDone] = useState(0)
  const [userRole, setUserRole] = useState('user')
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [currentView, setCurrentView] = useState<View>('main')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/')
        return
      }
      setUser(session.user)
      loadUserStats(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/')
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadUserStats = async (u: any) => {
    const { data: ud } = await supabase.from('users').select('balance, role, phone, full_name, email').eq('id', u.id).single()
    if (ud) {
      setBalance(ud.balance || 0)
      setUserRole(ud.role || 'user')
      if (ud.full_name) setDisplayName(ud.full_name)
      else if (ud.phone) setDisplayName(formatPhoneDisplay(ud.phone))
      else if (ud.email) setDisplayName(ud.email)
      else setDisplayName('Người dùng')
    }
    const { count } = await supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', u.id).eq('reward_paid', true)
    if (count) setTasksDone(count)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: 40 }}>⏳ Đang tải...</div>

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
      </header>
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 80 }}>
        {currentView === 'taskHistory' && <div style={{ padding: 20, textAlign: 'center', color: '#8A857D' }}>📋 Lịch sử làm task</div>}
        {currentView === 'txHistory' && <div style={{ padding: 20, textAlign: 'center', color: '#8A857D' }}>💳 Lịch sử giao dịch</div>}
        {currentView === 'settings' && <div style={{ padding: 20, textAlign: 'center', color: '#8A857D' }}>🔔 Cài đặt thông báo</div>}
        {currentView === 'help' && <div style={{ padding: 20, textAlign: 'center', color: '#8A857D' }}>❓ Hướng dẫn sử dụng</div>}
        {currentView === 'main' && (
          <>
            {activeTab === 'dashboard' && (
              <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Xin chào, {displayName} 👋</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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
            {activeTab === 'profile' && (
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
                    <div key={i} onClick={() => setCurrentView(item.view)} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < arr.length - 1 ? '1px solid #1C1C1E' : 'none', cursor: 'pointer' }}>
                      <span>{item.icon} {item.label}</span><span style={{ color: '#8A857D' }}>→</span>
                    </div>
                  ))}
                </div>
                <button onClick={handleLogout} style={{ width: '100%', marginTop: 20, padding: '12px 0', background: 'transparent', border: '1px solid #F97373', color: '#F97373', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>🚪 Đăng xuất</button>
              </div>
            )}
          </>
        )}
      </div>
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111113', borderTop: '1px solid #1C1C1E', display: 'flex', justifyContent: 'space-around', padding: '8px 0', zIndex: 50 }}>
        {[
          { key: 'dashboard' as Tab, icon: '🏠', label: 'Tổng quan' },
          { key: 'tasks' as Tab, icon: '📋', label: 'Làm task' },
          { key: 'withdraw' as Tab, icon: '💰', label: 'Rút tiền' },
          { key: 'profile' as Tab, icon: '👤', label: 'Hồ sơ' },
        ].map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setCurrentView('main') }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: activeTab === tab.key ? '#F5A623' : '#8A857D', fontSize: 11, fontWeight: activeTab === tab.key ? 600 : 400 }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span><span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
