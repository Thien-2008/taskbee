'use client'

import { useRouter } from 'next/navigation'
import { Smartphone, CheckCircle, Wallet, Shield, Lock, Eye } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import HexagonBackground from '@/components/HexagonBackground'
import PhoneMockup from '@/components/PhoneMockup'
import FAQ from '@/components/FAQ'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import StickyCTA from '@/components/StickyCTA'
import LogoReveal from '@/components/LogoReveal'

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

        /* Nút chính */
        .btn-primary {
          background: #F5A623;
          color: #000;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }
        .btn-primary:hover::before {
          left: 100%;
        }
        .btn-primary:hover {
          background: #FFC04D;
          transform: translateY(-2px);
          box-shadow: 0 0 0 1px rgba(245,166,35,0.3), 0 4px 20px rgba(245,166,35,0.25), 0 8px 40px rgba(245,166,35,0.12);
        }
        .btn-primary:active {
          transform: scale(0.98);
        }

        /* Nút ghost */
        .btn-ghost {
          background: transparent;
          color: #EDEBE7;
          border: 1px solid #1C1C1E;
          padding: 14px 32px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 15px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .btn-ghost:hover {
          border-color: #F5A623;
          color: #F5A623;
          box-shadow: 0 0 15px rgba(245,166,35,0.1);
        }

        /* Card hover với glow */
        .card-hover {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: default;
        }
        .card-hover:hover {
          border-color: rgba(245,166,35,0.35) !important;
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(245,166,35,0.08), 0 8px 32px rgba(0,0,0,0.4);
        }

        /* Focus ring cho accessibility */
        :focus-visible {
          outline: 2px solid rgba(245,166,35,0.8);
          outline-offset: 3px;
          border-radius: 4px;
        }
      `}</style>

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E' }}>
        <Logo size={28} variant="full" />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/auth?mode=login')} className="btn-ghost" style={{ padding: '10px 20px', fontSize: 14 }}>Đăng nhập</button>
          <button onClick={() => router.push('/auth?mode=register')} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Tạo tài khoản miễn phí</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 16px 40px' }}>
        <HexagonBackground />
        <div>
          <ScrollReveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', color: '#F5A623', padding: '6px 16px', borderRadius: 100, fontSize: 13, marginBottom: 24 }}>
              <Logo size={16} variant="icon" />
              Nền tảng việc làm vi mô
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
              Tiền về ví ngay khi task được duyệt. Rút về ngân hàng, minh bạch từng đồng.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/auth?mode=register')} className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>
                Tạo tài khoản miễn phí
              </button>
              <button onClick={() => router.push('/auth?mode=login')} className="btn-ghost" style={{ padding: '16px 36px', fontSize: 16 }}>
                Đăng nhập
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust Section */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '60px 16px' }}>
        <ScrollReveal>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16, textAlign: 'center' }}>Cam kết của TaskBee</div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', maxWidth: 600, margin: '0 auto 40px', textAlign: 'center' }}>Minh bạch từ ngày đầu tiên</h2>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { Icon: Shield, title: 'Tiền được bảo vệ 100%', desc: 'Doanh nghiệp giữ tiền trong escrow, chỉ giải ngân khi task được duyệt.' },
            { Icon: Lock, title: 'Không phải đa cấp', desc: 'Không cần nạp tiền, mua gói, giới thiệu. Làm task → nhận tiền.' },
            { Icon: Eye, title: 'Lịch sử công khai', desc: 'Mọi giao dịch đều hiển thị minh bạch trong tài khoản của bạn.' },
          ].map(({ Icon, title, desc }, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.1}>
              <div className="card-hover" style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 24px' }}>
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

      {/* Phone Mockup */}
      <ScrollReveal delay={0.1}>
        <PhoneMockup />
      </ScrollReveal>

      {/* How it Works */}
      <section style={{ position: 'relative', zIndex: 10, maxWidth: 960, margin: '0 auto', padding: '60px 16px' }}>
        <ScrollReveal>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16, textAlign: 'center' }}>Cách hoạt động</div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(28px, 4vw, 42px)', maxWidth: 600, margin: '0 auto 40px', textAlign: 'center' }}>Ba bước để bắt đầu</h2>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { Icon: Smartphone, title: 'Đăng ký miễn phí', desc: '30 giây, không cần hồ sơ. Ai cũng có thể tham gia.' },
            { Icon: CheckCircle, title: 'Chọn việc phù hợp', desc: 'Duyệt các công việc đơn giản, chọn việc bạn muốn.' },
            { Icon: Wallet, title: 'Nhận tiền nhanh chóng', desc: 'Rút về ngân hàng khi đạt mức tối thiểu.' },
          ].map(({ Icon, title, desc }, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.1}>
              <div className="card-hover" style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 24px' }}>
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

      {/* FAQ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 16px 60px' }}>
        <ScrollReveal>
          <FAQ />
        </ScrollReveal>
      </section>

      {/* CTA */}
      <ScrollReveal delay={0.2}>
        <section style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '50px auto', background: 'linear-gradient(135deg, #1a1508, #0f0e0c)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 24, padding: '60px 24px', textAlign: 'center' }}>
          <Logo size={48} variant="icon" />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 36px)', marginTop: 16 }}>Sẵn sàng bắt đầu?</h2>
          <p style={{ color: '#8A857D', margin: '12px 0 24px', fontSize: 15 }}>Tham gia cùng những người đang kiếm thêm thu nhập mỗi ngày.</p>
          <button onClick={() => router.push('/auth?mode=register')} className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
            Tạo tài khoản miễn phí →
          </button>
        </section>
      </ScrollReveal>

      <StickyCTA />
      <Footer />
    </div>
  )
}
