'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [hours, setHours] = useState(2)

    // Canvas lục giác nền
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let hexParticles: any[] = []
        let animId: number

        function resizeCanvas() {
            canvas!.width = window.innerWidth
            canvas!.height = window.innerHeight
        }

        class HexParticle {
            x: number; y: number; size: number
            vx: number; vy: number; opacity: number
            rot: number; rotV: number
            constructor() {
                this.x = Math.random() * canvas!.width
                this.y = Math.random() * canvas!.height
                this.size = Math.random() * 16 + 6
                this.vx = (Math.random() - 0.5) * 0.2
                this.vy = (Math.random() - 0.5) * 0.2
                this.opacity = Math.random() * 0.08 + 0.02
                this.rot = Math.random() * Math.PI
                this.rotV = (Math.random() - 0.5) * 0.002
            }
            update() {
                this.x += this.vx
                this.y += this.vy
                this.rot += this.rotV
                if (this.x < -50) this.x = canvas!.width + 50
                if (this.x > canvas!.width + 50) this.x = -50
                if (this.y < -50) this.y = canvas!.height + 50
                if (this.y > canvas!.height + 50) this.y = -50
            }
            draw() {
                ctx!.save()
                ctx!.translate(this.x, this.y)
                ctx!.rotate(this.rot)
                ctx!.beginPath()
                for (let i = 0; i < 6; i++) {
                    const a = (Math.PI / 3) * i - Math.PI / 6
                    const px = this.size * Math.cos(a)
                    const py = this.size * Math.sin(a)
                    i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py)
                }
                ctx!.closePath()
                ctx!.strokeStyle = 'rgba(245,166,35,' + this.opacity + ')'
                ctx!.lineWidth = 1
                ctx!.stroke()
                ctx!.restore()
            }
        }

        function initHexParticles() {
            const count = Math.min(Math.floor((canvas!.width * canvas!.height) / 30000), 50)
            hexParticles = []
            for (let i = 0; i < count; i++) hexParticles.push(new HexParticle())
        }

        function drawConnections() {
            for (let i = 0; i < hexParticles.length; i++) {
                for (let j = i + 1; j < hexParticles.length; j++) {
                    const dx = hexParticles[i].x - hexParticles[j].x
                    const dy = hexParticles[i].y - hexParticles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 150) {
                        const op = (1 - dist / 150) * 0.03
                        ctx!.beginPath()
                        ctx!.moveTo(hexParticles[i].x, hexParticles[i].y)
                        ctx!.lineTo(hexParticles[j].x, hexParticles[j].y)
                        ctx!.strokeStyle = 'rgba(245,166,35,' + op + ')'
                        ctx!.lineWidth = 0.4
                        ctx!.stroke()
                    }
                }
            }
        }

        function animateHex() {
            ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
            hexParticles.forEach((p: any) => { p.update(); p.draw() })
            drawConnections()
            animId = requestAnimationFrame(animateHex)
        }

        resizeCanvas()
        initHexParticles()
        animateHex()
        window.addEventListener('resize', () => { resizeCanvas(); initHexParticles() })

        return () => { cancelAnimationFrame(animId) }
    }, [])

    function fmtCurrency(n: number) {
        return n.toLocaleString('vi-VN')
    }

    const daily = Math.round(hours * 35 * 900)
    const weekly = daily * 7
    const monthly = daily * 25

    return (
        <div style={{
            fontFamily: "'DM Sans', sans-serif",
            background: '#0a0a0b',
            color: '#EDEBE7',
            overflowX: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
                :root {
                    --amber: #F5A623;
                    --bg: #0a0a0b;
                    --bg2: #111113;
                    --card: #161618;
                    --fg: #EDEBE7;
                    --muted: #8A857D;
                    --border: #1C1C1E;
                }
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: var(--bg); color: var(--fg); overflow-x: hidden; }
                .nav-glass {
                    background: rgba(10,10,11,0.85);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                }
                .btn-primary {
                    background: var(--amber);
                    color: #000;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: all 0.2s;
                }
                .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,166,35,0.25); }
                .btn-ghost {
                    background: transparent;
                    color: var(--fg);
                    border: 1px solid var(--border);
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 15px;
                    cursor: pointer;
                    font-family: 'DM Sans', sans-serif;
                    transition: all 0.2s;
                }
                .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
                .card-hover {
                    transition: all 0.3s;
                }
                .card-hover:hover {
                    border-color: rgba(245,166,35,0.3) !important;
                    transform: translateY(-4px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up { animation: fadeUp 0.7s ease both; }
                @media (max-width: 680px) {
                    .hero-actions { flex-direction: column; align-items: center; }
                }
            `}</style>

            {/* Canvas nền */}
            <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

            {/* Navigation */}
            <nav className="nav-glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
                <a href="#" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    🐝 TaskBee
                </a>
                <button className="btn-primary">Đăng ký ngay</button>
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
                        <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>Bắt đầu kiếm tiền</button>
                        <button className="btn-ghost" style={{ fontSize: 16, padding: '16px 36px' }}>Tôi là doanh nghiệp →</button>
                    </div>
                </div>
            </section>

            {/* Cách hoạt động */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cách hoạt động</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Ba bước để bắt đầu kiếm tiền ngay hôm nay</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                    {[
                        { icon: '📱', num: '01', title: 'Đăng ký bằng số điện thoại', desc: '30 giây, không cần hồ sơ. Bất kỳ ai cũng có thể tham gia.' },
                        { icon: '✅', num: '02', title: 'Làm 5 task thử miễn phí', desc: 'Hệ thống đánh giá độ chính xác qua 5 task demo trước khi nhận việc thật.' },
                        { icon: '💰', num: '03', title: 'Nhận tiền trong 24 giờ', desc: 'Rút về MoMo hoặc ngân hàng bất cứ lúc nào, tối thiểu 50.000đ.' },
                    ].map(({ icon, num, title, desc }) => (
                        <div key={num} className="card-hover" style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '36px 28px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 64, color: 'rgba(245,166,35,0.06)', position: 'absolute', top: 12, right: 20, lineHeight: 1 }}>{num}</div>
                            <div style={{ width: 44, height: 44, background: 'rgba(245,166,35,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>{icon}</div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{title}</div>
                            <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Calculator */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Tính thu nhập</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Bạn có thể kiếm được bao nhiêu?</h2>
                <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 20, padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 14, color: '#8A857D', marginBottom: 12 }}>Số giờ làm mỗi ngày: <strong style={{ color: '#EDEBE7' }}>{hours} giờ</strong></div>
                        <input type="range" min="1" max="8" value={hours} onChange={e => setHours(+e.target.value)}
                            style={{ width: '100%', height: 4, background: 'rgba(245,166,35,0.2)', borderRadius: 2, outline: 'none', marginBottom: 20, WebkitAppearance: 'none' }} />
                        <div style={{ fontSize: 13, color: '#8A857D' }}>* Ước tính dựa trên tốc độ làm việc bình thường</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 48, color: '#F5A623' }}>~{fmtCurrency(daily)}đ</div>
                        <div style={{ color: '#8A857D', marginBottom: 20 }}>mỗi ngày</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8 }}>
                            <span style={{ color: '#8A857D' }}>Mỗi tuần</span>
                            <span style={{ fontWeight: 600 }}>~{fmtCurrency(weekly)}đ</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: 8 }}>
                            <span style={{ color: '#8A857D' }}>Mỗi tháng</span>
                            <span style={{ fontWeight: 600, color: '#F5A623' }}>~{(monthly / 1000000).toFixed(1)}Mđ</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '60px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cam kết của TaskBee</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Minh bạch từ ngày đầu tiên</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, borderRadius: 16, overflow: 'hidden' }}>
                    {[
                        { title: 'Tiền được bảo vệ 100%', desc: 'Doanh nghiệp nạp tiền vào escrow trước khi đăng task. Tiền của bạn luôn được đảm bảo.' },
                        { title: 'Không phải đa cấp', desc: 'Không yêu cầu nạp tiền, mua gói, hay giới thiệu người khác. Làm task → nhận tiền.' },
                        { title: 'Lịch sử công khai', desc: 'Mọi giao dịch rút tiền thành công đều hiển thị công khai (ẩn danh).' },
                    ].map(({ title, desc }) => (
                        <div key={title} style={{ background: '#161618', padding: 32, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5A623', marginTop: 6, flexShrink: 0 }} />
                            <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}><strong style={{ color: '#EDEBE7' }}>{title}</strong><br /><br />{desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '60px auto', background: 'linear-gradient(135deg, #1a1508, #0f0e0c)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 24, padding: '72px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🐝</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 44px)', marginBottom: 12 }}>Sẵn sàng bắt đầu<br />kiếm tiền chưa?</h2>
                <p style={{ color: '#8A857D', marginBottom: 24 }}>Hàng nghìn người đang kiếm thêm thu nhập mỗi ngày. Chỉ cần điện thoại và 2 phút đăng ký.</p>
                <button className="btn-primary" style={{ fontSize: 17, padding: '18px 48px' }}>Đăng ký miễn phí →</button>
                <p style={{ fontSize: 13, color: '#8A857D', marginTop: 16 }}>Không cần thẻ tín dụng · Nhận tiền trong 24h</p>
            </section>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1C1C1E', padding: 32, textAlign: 'center', fontSize: 13, color: '#8A857D' }}>
                🐝 TaskBee &nbsp;·&nbsp; © 2025 TaskBee. Nền tảng việc làm vi mô Việt Nam.
            </footer>
        </div>
    )
}
