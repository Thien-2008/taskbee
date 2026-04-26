'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'withdraw'>('dashboard')

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
                alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.')
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    // Auth form
    if (!user) {
        return (
            <div style={{
                fontFamily: "'DM Sans', sans-serif",
                background: '#0a0a0b',
                color: '#EDEBE7',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                userSelect: 'none',
            }}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
                <div style={{ width: '100%', maxWidth: 380, background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '32px 24px' }}>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, textAlign: 'center', marginBottom: 24, color: '#F5A623' }}>🐝 TaskBee</h1>
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
                            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
                        </button>
                    </form>
                    <p style={{ textAlign: 'center', fontSize: 14, marginTop: 16, color: '#8A857D' }}>
                        {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                        <button onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'none', border: 'none', color: '#F5A623', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                            {isLogin ? 'Đăng ký' : 'Đăng nhập'}
                        </button>
                    </p>
                </div>
            </div>
        )
    }

    // Dashboard
    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#0a0a0b',
            color: '#EDEBE7',
            minHeight: '100vh',
            userSelect: 'none',
        }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

            {/* Header */}
            <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#8A857D' }}>{user.email}</span>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, padding: '12px 20px', background: '#0a0a0b', borderBottom: '1px solid #1C1C1E' }}>
                {[
                    { key: 'dashboard' as const, label: '📊 Tổng quan' },
                    { key: 'tasks' as const, label: '📋 Làm task' },
                    { key: 'withdraw' as const, label: '💰 Rút tiền' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 500,
                            background: activeTab === tab.key ? '#F5A623' : 'transparent',
                            color: activeTab === tab.key ? '#000' : '#8A857D',
                            transition: 'all 0.2s',
                        }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
                {activeTab === 'dashboard' && <Dashboard user={user} />}
                {activeTab === 'tasks' && <TaskList />}
                {activeTab === 'withdraw' && <Withdraw />}
            </div>
        </div>
    )
}

function Dashboard({ user }: { user: any }) {
    const [balance, setBalance] = useState(0)
    const [tasksDone, setTasksDone] = useState(0)

    useEffect(() => {
        supabase.from('users').select('balance').eq('id', user.id).single().then(({ data }) => {
            if (data) setBalance(data.balance)
        })
        supabase.from('assignments').select('id', { count: 'exact' }).eq('user_id', user.id).eq('reward_paid', true).then(({ count }) => {
            if (count) setTasksDone(count)
        })
    }, [user.id])

    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Xin chào, {user.email}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Số dư</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28, color: '#F5A623' }}>{balance.toLocaleString()}đ</div>
                </div>
                <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}>
                    <div style={{ fontSize: 13, color: '#8A857D', marginBottom: 6 }}>Task đã làm</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 28 }}>{tasksDone}</div>
                </div>
            </div>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>📢 Thông báo</h3>
                <p style={{ fontSize: 14, color: '#8A857D' }}>Chưa có task nào được giao cho bạn. Hãy vào tab "Làm task" để tìm việc ngay!</p>
            </div>
        </div>
    )
}

function TaskList() {
    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Danh sách task</h2>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                <p style={{ color: '#8A857D' }}>Tính năng đang được phát triển. Quay lại sau nhé!</p>
            </div>
        </div>
    )
}

function Withdraw() {
    return (
        <div>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Rút tiền</h2>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
                <p style={{ color: '#8A857D' }}>Tính năng đang được phát triển. Quay lại sau nhé!</p>
            </div>
        </div>
    )
}
