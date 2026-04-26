'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hours, setHours] = useState(2)
    const [showAuth, setShowAuth] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)

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

    const fmtCurrency = (n: number) => n.toLocaleString('vi-VN')
    const daily = Math.round(hours * 35 * 900)
    const weekly = daily * 7
    const monthly = daily * 25

    // Dashboard sau khi đăng nhập
    if (user) {
        return <Dashboard user={user} onLogout={handleLogout} />
    }

    // Form auth (popup)
    if (showAuth) {
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, color: '#F5A623' }}>🐝 TaskBee</h1>
                        <button onClick={() => setShowAuth(false)} style={{ background: 'none', border: 'none', color: '#8A857D', fontSize: 20, cursor: 'pointer' }}>✕</button>
                    </div>
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

    // Landing page
    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#0a0a0b',
            color: '#EDEBE7',
            overflowX: 'hidden',
            userSelect: 'none',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
                :root { --amber: #F5A623; --bg: #0a0a0b; --card: #161618; --fg: #EDEBE7; --muted: #8A857D; --border: #1C1C1E; }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                .btn-primary {
                    background: var(--amber); color: #000; border: none; padding: 12px 24px; border-radius: 8px;
                    font-weight: 700; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
                }
                .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,166,35,0.25); }
                .btn-ghost {
                    background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 12px 24px;
                    border-radius: 8px; font-weight: 500; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
                }
                .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
                .card-hover { transition: all 0.3s; }
                .card-hover:hover { border-color: rgba(245,166,35,0.3) !important; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.7s ease both; }
            `}</style>

            {/* Canvas nền lục giác */}
            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

            {/* Navigation */}
            <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-ghost" onClick={() => { setIsLogin(true); setShowAuth(true) }}>Đăng nhập</button>
                    <button className="btn-primary" onClick={() => { setIsLogin(false); setShowAuth(true) }}>Đăng ký</button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 60px' }}>
                <div>
                    <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>
                        🐝 Nền tảng việc làm vi mô
                    </div>
                    <h1 className="fade-up" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 700, margin: '0 auto' }}>
                        Điện thoại của bạn<br /> là <span style={{ color: '#F5A623' }}>công cụ kiếm tiền</span>
                    </h1>
                    <p className="fade-up" style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, lineHeight: 1.7, margin: '20px auto 0' }}>
                        Làm những công việc nhỏ thực sự — gắn thẻ ảnh, nhập liệu — ngay trên điện thoại. Được trả tiền thật, minh bạch, trong 24 giờ.
                    </p>
                    <div className="hero-actions fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
                        <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }} onClick={() => { setIsLogin(false); setShowAuth(true) }}>Bắt đầu kiếm tiền</button>
                        <button className="btn-ghost" style={{ fontSize: 16, padding: '16px 36px' }}>Tôi là doanh nghiệp →</button>
                    </div>
                </div>
            </section>

            {/* Cách hoạt động */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cách hoạt động</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Ba bước để bắt đầu kiếm tiền ngay hôm nay</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                    {[
                        { icon: '📱', num: '01', title: 'Đăng ký bằng số điện thoại', desc: '30 giây, không cần hồ sơ. Bất kỳ ai cũng có thể tham gia.' },
                        { icon: '✅', num: '02', title: 'Làm 5 task thử miễn phí', desc: 'Hệ thống đánh giá độ chính xác qua 5 task demo trước khi nhận việc thật.' },
                        { icon: '💰', num: '03', title: 'Nhận tiền trong 24 giờ', desc: 'Rút về MoMo hoặc ngân hàng bất cứ lúc nào, tối thiểu 50.000đ.' },
                    ].map(({ icon, num, title, desc }) => (
                        <div key={num} className="card-hover" style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 64, color: 'rgba(245,166,35,0.06)', position: 'absolute', top: 12, right: 20, lineHeight: 1 }}>{num}</div>
                            <div style={{ width: 44, height: 44, background: 'rgba(245,166,35,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{icon}</div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{title}</div>
                            <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Calculator */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Tính thu nhập</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', maxWidth: 600, marginBottom: 32 }}>Bạn có thể kiếm được bao nhiêu?</h2>
                <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 20, padding: '32px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 14, color: '#8A857D', marginBottom: 12 }}>Số giờ làm mỗi ngày: <strong style={{ color: '#EDEBE7' }}>{hours} giờ</strong></div>
                        <input type="range" min="1" max="8" value={hours} onChange={e => setHours(+e.target.value)}
                            style={{ width: '100%', height: 4, background: 'rgba(245,166,35,0.2)', borderRadius: 2, outline: 'none', marginBottom: 16 }} />
                        <div style={{ fontSize: 13, color: '#8A857D' }}>* Ước tính dựa trên tốc độ làm việc bình thường</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 36, color: '#F5A623' }}>~{fmtCurrency(daily)}đ</div>
                        <div style={{ color: '#8A857D', marginBottom: 16, fontSize: 14 }}>mỗi ngày</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                            <span style={{ color: '#8A857D' }}>Mỗi tuần</span><span style={{ fontWeight: 600 }}>~{fmtCurrency(weekly)}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: '#8A857D' }}>Mỗi tháng</span><span style={{ fontWeight: 600, color: '#F5A623' }}>~{(monthly / 1000000).toFixed(1)}Mđ</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cam kết của TaskBee</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', maxWidth: 600, marginBottom: 32 }}>Minh bạch từ ngày đầu tiên</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, borderRadius: 16, overflow: 'hidden' }}>
                    {[
                        { title: 'Tiền được bảo vệ 100%', desc: 'Doanh nghiệp nạp tiền vào escrow trước khi đăng task. Tiền của bạn luôn được đảm bảo.' },
                        { title: 'Không phải đa cấp', desc: 'Không yêu cầu nạp tiền, mua gói, hay giới thiệu người khác. Làm task → nhận tiền.' },
                        { title: 'Lịch sử công khai', desc: 'Mọi giao dịch rút tiền thành công đều hiển thị công khai (ẩn danh).' },
                    ].map(({ title, desc }) => (
                        <div key={title} style={{ background: '#161618', padding: '24px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5A623', marginTop: 6, flexShrink: 0 }} />
                            <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}><strong style={{ color: '#EDEBE7' }}>{title}</strong><br /><br />{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '50px auto', background: 'linear-gradient(135deg, #1a1508, #0f0e0c)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 24, padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🐝</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 12 }}>Sẵn sàng bắt đầu<br />kiếm tiền chưa?</h2>
                <p style={{ color: '#8A857D', marginBottom: 24, fontSize: 15 }}>Hàng nghìn người đang kiếm thêm thu nhập mỗi ngày. Chỉ cần điện thoại và 2 phút đăng ký.</p>
                <button className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }} onClick={() => { setIsLogin(false); setShowAuth(true) }}>Đăng ký miễn phí →</button>
                <p style={{ fontSize: 13, color: '#8A857D', marginTop: 16 }}>Không cần thẻ tín dụng · Nhận tiền trong 24h</p>
            </section>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1C1C1E', padding: 24, textAlign: 'center', fontSize: 13, color: '#8A857D' }}>
                🐝 TaskBee &nbsp;·&nbsp; © 2025 TaskBee. Nền tảng việc làm vi mô Việt Nam.
            </footer>
        </div>
    )
}

// Dashboard (sau khi đăng nhập)
function Dashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'withdraw'>('dashboard')
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
        <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', userSelect: 'none' }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
            <header style={{ background: '#111113', borderBottom: '1px solid #1C1C1E', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: '#F5A623' }}>🐝 TaskBee</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, color: '#8A857D' }}>{user.email}</span>
                    <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid #1C1C1E', color: '#EDEBE7', padding: '6px 14px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>Đăng xuất</button>
                </div>
            </header>
            <div style={{ display: 'flex', gap: 4, padding: '12px 20px', borderBottom: '1px solid #1C1C1E' }}>
                {[
                    { key: 'dashboard' as const, label: '📊 Tổng quan' },
                    { key: 'tasks' as const, label: '📋 Làm task' },
                    { key: 'withdraw' as const, label: '💰 Rút tiền' },
                ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, background: activeTab === tab.key ? '#F5A623' : 'transparent', color: activeTab === tab.key ? '#000' : '#8A857D' }}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
                {activeTab === 'dashboard' && (
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
                    </div>
                )}
                {activeTab === 'tasks' && (
                    <div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Danh sách task</h2>
                        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                            <p style={{ color: '#8A857D' }}>Tính năng đang được phát triển. Quay lại sau nhé!</p>
                        </div>
                    </div>
                )}
                {activeTab === 'withdraw' && (
                    <div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Rút tiền</h2>
                        <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 12, padding: 28, textAlign: 'center' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
                            <p style={{ color: '#8A857D' }}>Tính năng đang được phát triển. Quay lại sau nhé!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
