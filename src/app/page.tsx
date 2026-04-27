'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

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
        .btn-primary { background: var(--amber); color: #000; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,166,35,0.25); }
        .btn-ghost { background: transparent; color: var(--fg); border: 1px solid var(--border); padding: 14px 32px; border-radius: 8px; font-weight: 500; font-size: 15px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--amber); color: var(--amber); }
        .card-hover { transition: all 0.3s; }
        .card-hover:hover { border-color: rgba(245,166,35,0.3) !important; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease both; }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>🐝 TaskBee</span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth?mode=login')} className="btn-ghost" style={{ padding: '10px 20px', fontSize: 14 }}>Đăng nhập</button>
          <button onClick={() => router.push('/auth?mode=register')} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Đăng ký</button>
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
          <div className="fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Bắt đầu kiếm tiền</button>
            <button onClick={() => router.push('/auth?mode=login')} style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '16px 36px', borderRadius: 8, fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>Đăng nhập</button>
          </div>
        </div>
      </section>

      {/* Cách hoạt động */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '60px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cách hoạt động</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Ba bước để bắt đầu kiếm tiền ngay hôm nay</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { icon: '📱', num: '01', title: 'Đăng ký miễn phí', desc: '30 giây, không cần hồ sơ. Bất kỳ ai cũng có thể tham gia.' },
            { icon: '✅', num: '02', title: 'Làm task đơn giản', desc: 'Gắn thẻ ảnh, nhập liệu hóa đơn. Không cần kỹ năng đặc biệt.' },
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
        <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 40px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Đăng ký miễn phí →</button>
        <p style={{ fontSize: 13, color: '#8A857D', marginTop: 16 }}>Không cần thẻ tín dụng · Nhận tiền trong 24h</p>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1C1C1E', padding: 24, textAlign: 'center', fontSize: 13, color: '#8A857D' }}>
        🐝 TaskBee &nbsp;·&nbsp; © 2025 TaskBee. Nền tảng việc làm vi mô Việt Nam.
      </footer>
    </div>
  )
}
