'use client'

import { useRouter } from 'next/navigation'
import { Smartphone, CheckCircle, Wallet } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import Counter from '@/components/Counter'
import HexagonBackground from '@/components/HexagonBackground'
import PhoneMockup from '@/components/PhoneMockup'
import FAQ from '@/components/FAQ'

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
        .card-hover { transition: all 0.3s; cursor: pointer; }
        .card-hover:hover { border-color: rgba(245,166,35,0.3) !important; transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: '#F5A623' }}>
          🐝 TaskBee
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth?mode=login')} className="btn-ghost" style={{ padding: '10px 20px', fontSize: 14 }}>Đăng nhập</button>
          <button onClick={() => router.push('/auth?mode=register')} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Tạo tài khoản miễn phí</button>
        </div>
      </nav>

      {/* Hero với nền Hexagon */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 40px' }}>
        <HexagonBackground />
        <div>
          <ScrollReveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>
              🐝 Nền tảng việc làm vi mô
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 700, margin: '0 auto' }}>
              Việc nhỏ, thu nhập thật.<br />
              <span style={{ color: '#F5A623' }}>Không cần kinh nghiệm, không cần hồ sơ.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p style={{ marginTop: 20, fontSize: 17, color: '#8A857D', maxWidth: 480, lineHeight: 1.7, margin: '20px auto 0' }}>
              Tiền về ví ngay khi task được duyệt. Rút ra ngân hàng, minh bạch từng đồng.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 36px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                Tạo tài khoản miễn phí
              </button>
              <button onClick={() => router.push('/auth?mode=login')} style={{ background: 'transparent', color: '#EDEBE7', border: '1px solid #1C1C1E', padding: '16px 36px', borderRadius: 8, fontWeight: 500, fontSize: 16, cursor: 'pointer' }}>
                Đăng nhập
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mockup điện thoại */}
      <ScrollReveal delay={0.1}>
        <PhoneMockup />
      </ScrollReveal>

      {/* Cách hoạt động */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '40px 16px 60px' }}>
        <ScrollReveal>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cách hoạt động</div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, marginBottom: 40 }}>Ba bước để bắt đầu</h2>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { Icon: Smartphone, title: 'Đăng ký miễn phí', desc: '30 giây, không cần hồ sơ. Bất kỳ ai cũng có thể tham gia.' },
            { Icon: CheckCircle, title: 'Chọn việc phù hợp', desc: 'Duyệt qua các công việc đơn giản, chọn việc bạn muốn làm.' },
            { Icon: Wallet, title: 'Nhận tiền nhanh chóng', desc: 'Rút về MoMo hoặc ngân hàng bất cứ lúc nào, tối thiểu 50.000đ.' },
          ].map(({ Icon, title, desc }, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.1}>
              <div className="card-hover" style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 44, height: 44, background: 'rgba(245,166,35,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color="#F5A623" />
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}>{desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '40px 16px 60px' }}>
        <ScrollReveal>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16 }}>Cam kết của TaskBee</div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', maxWidth: 600, marginBottom: 32 }}>Minh bạch từ ngày đầu tiên</h2>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 2, borderRadius: 16, overflow: 'hidden' }}>
          {[
            { title: 'Tiền được bảo vệ 100%', desc: 'Doanh nghiệp nạp tiền vào escrow trước khi đăng task. Tiền của bạn luôn được đảm bảo.' },
            { title: 'Không phải đa cấp', desc: 'Không yêu cầu nạp tiền, mua gói, hay giới thiệu người khác. Làm task → nhận tiền.' },
            { title: 'Lịch sử công khai', desc: 'Mọi giao dịch rút tiền thành công đều hiển thị công khai (ẩn danh).' },
          ].map(({ title, desc }, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.1}>
              <div style={{ background: '#161618', padding: '24px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5A623', marginTop: 6, flexShrink: 0 }} />
                <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7 }}><strong style={{ color: '#EDEBE7' }}>{title}</strong><br /><br />{desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <ScrollReveal>
        <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '20px 16px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center' }}>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 20px' }}>
              <Counter end={50} suffix="+" />
              <div style={{ fontSize: 14, color: '#8A857D', marginTop: 8 }}>Người dùng đang hoạt động</div>
            </div>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 20px' }}>
              <Counter end={120} suffix="+" />
              <div style={{ fontSize: 14, color: '#8A857D', marginTop: 8 }}>Task đã hoàn thành</div>
            </div>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 20px' }}>
              <Counter end={5000000} prefix="₫" />
              <div style={{ fontSize: 14, color: '#8A857D', marginTop: 8 }}>Đã chi trả cho người dùng</div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 16px 60px' }}>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
      </section>

      {/* CTA cuối */}
      <ScrollReveal delay={0.2}>
        <section style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '50px auto', background: 'linear-gradient(135deg, #1a1508, #0f0e0c)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 24, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🐝</div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 12 }}>Sẵn sàng bắt đầu?</h2>
          <p style={{ color: '#8A857D', marginBottom: 24, fontSize: 15 }}>Tham gia cùng những người đang kiếm thêm thu nhập mỗi ngày. Chỉ cần điện thoại và 2 phút đăng ký.</p>
          <button onClick={() => router.push('/auth?mode=register')} style={{ background: '#F5A623', color: '#000', border: 'none', padding: '16px 40px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Tạo tài khoản miễn phí →
          </button>
          <p style={{ fontSize: 13, color: '#8A857D', marginTop: 16 }}>Không cần thẻ tín dụng · Nhận tiền trong 24h</p>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1C1C1E', padding: '40px 24px', background: '#0a0a0b' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#F5A623', marginBottom: 12 }}>🐝 TaskBee</div>
            <div style={{ fontSize: 13, color: '#8A857D', lineHeight: 1.8 }}>Nền tảng việc làm vi mô trên điện thoại. Kết nối người cần việc với người cần làm.</div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Sản phẩm</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#8A857D' }}>
              <a href="#" style={{ color: '#8A857D', textDecoration: 'none' }}>Cách hoạt động</a>
              <a href="#" style={{ color: '#8A857D', textDecoration: 'none' }}>Dành cho doanh nghiệp</a>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, color: '#EDEBE7' }}>Hỗ trợ & Pháp lý</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#8A857D' }}>
              <a href="#" style={{ color: '#8A857D', textDecoration: 'none' }}>Điều khoản sử dụng</a>
              <a href="#" style={{ color: '#8A857D', textDecoration: 'none' }}>Chính sách bảo mật</a>
              <a href="#" style={{ color: '#8A857D', textDecoration: 'none' }}>Liên hệ hỗ trợ</a>
              <span>support@taskbee.vn</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: '#8A857D', borderTop: '1px solid #1C1C1E', paddingTop: 16 }}>
          © 2025 TaskBee. Tất cả các quyền được bảo lưu.
        </div>
      </footer>
    </div>
  )
}
