'use client'

import { useRouter } from 'next/navigation'
import { Zap, TrendingUp, Shield, BarChart3 } from 'lucide-react'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

const benefits = [
  { icon: Zap, title: 'Triển khai nhanh', desc: 'Hàng ngàn người dùng sẵn sàng nhận việc ngay khi bạn đăng. Kết quả đầu tiên có thể về trong vài giờ.' },
  { icon: TrendingUp, title: 'Chỉ trả cho kết quả', desc: 'Ngân sách được giữ an toàn. Bạn chỉ thanh toán khi công việc đạt yêu cầu và được duyệt.' },
  { icon: Shield, title: 'Kiểm soát chất lượng', desc: 'Tự đặt tiêu chí đánh giá. Hệ thống hỗ trợ duyệt kết quả và báo cáo chi tiết.' },
  { icon: BarChart3, title: 'Báo cáo minh bạch', desc: 'Theo dõi tiến độ, số lượng công việc đã hoàn thành, chi phí thực tế qua dashboard trực quan.' },
]

export default function BusinessPage() {
  const router = useRouter()
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', userSelect: 'none' }}>
      <style>{`
        .btn-primary { background: #F5A623; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); }
      `}</style>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={24} variant="full" />
        <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>← Về trang chủ</button>
      </nav>
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 20px 32px', textAlign: 'center' }}>
        <ScrollReveal>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.15, marginBottom: 16 }}>Giải pháp nhân lực linh hoạt cho doanh nghiệp</h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p style={{ color: '#9A9AA6', fontSize: 16, lineHeight: 1.7, margin: 0 }}>Thuê người làm việc theo từng công việc nhỏ. Chỉ trả tiền khi có kết quả – không rủi ro, không ràng buộc. Người làm có quyền khiếu nại nếu đánh giá không công bằng.</p>
        </ScrollReveal>
      </section>
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {benefits.map((item, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <div style={{ background: '#161618', border: '1px solid #1C1C1E', borderRadius: 16, padding: '28px 24px', height: '100%' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(245,166,35,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <item.icon size={20} color="#F5A623" />
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: '#9A9AA6', lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          </ScrollReveal>
        ))}
      </section>
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px' }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 32, textAlign: 'center' }}>Quy trình đăng công việc đơn giản</h2>
        </ScrollReveal>
        {[
          { step: 1, title: 'Đăng ký tài khoản doanh nghiệp', desc: 'Tạo hồ sơ công ty và xác minh trong 1 ngày làm việc.' },
          { step: 2, title: 'Tạo công việc mới', desc: 'Điền mô tả, tiêu chí, thời gian và ngân sách cho từng công việc.' },
          { step: 3, title: 'Nhận kết quả và duyệt', desc: 'Kiểm tra kết quả người dùng gửi về. Duyệt hoặc yêu cầu chỉnh sửa.' },
          { step: 4, title: 'Thanh toán tự động', desc: 'Hệ thống tự động giải ngân cho những kết quả đạt yêu cầu.' },
        ].map((item, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: '20px', background: '#161618', borderRadius: 12, border: '1px solid #1C1C1E' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5A623', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{item.step}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: '#9A9AA6', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 60px' }}>
        <ScrollReveal>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 4vw, 28px)', marginBottom: 24, textAlign: 'center' }}>TaskBee vs Thuê part‑time vs Agency</h2>
        </ScrollReveal>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1C1C1E' }}>
                <th style={{ padding: 12, textAlign: 'left', color: '#F5A623' }}>Tiêu chí</th>
                <th style={{ padding: 12, textAlign: 'center', color: '#EDEBE7' }}>TaskBee</th>
                <th style={{ padding: 12, textAlign: 'center', color: '#9A9AA6' }}>Thuê part‑time</th>
                <th style={{ padding: 12, textAlign: 'center', color: '#9A9AA6' }}>Agency</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #1C1C1E' }}>
                <td style={{ padding: 12 }}>Chi phí cố định</td>
                <td style={{ padding: 12, textAlign: 'center', color: '#F5A623' }}>Không</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Có</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Có</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1C1C1E' }}>
                <td style={{ padding: 12 }}>Thời gian triển khai</td>
                <td style={{ padding: 12, textAlign: 'center', color: '#F5A623' }}>Vài giờ</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Vài tuần</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Vài tuần</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1C1C1E' }}>
                <td style={{ padding: 12 }}>Quy mô linh hoạt</td>
                <td style={{ padding: 12, textAlign: 'center', color: '#F5A623' }}>1 – 10.000+</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Hạn chế</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Hạn chế</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #1C1C1E' }}>
                <td style={{ padding: 12 }}>Chỉ trả khi xong</td>
                <td style={{ padding: 12, textAlign: 'center', color: '#F5A623' }}>Có</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Không</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Không</td>
              </tr>
              <tr>
                <td style={{ padding: 12 }}>Kiểm soát chất lượng</td>
                <td style={{ padding: 12, textAlign: 'center', color: '#F5A623' }}>Có</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Tự làm</td>
                <td style={{ padding: 12, textAlign: 'center' }}>Phụ thuộc</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section style={{ textAlign: 'center', padding: '40px 20px 60px' }}>
        <ScrollReveal delay={0.2}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>Sẵn sàng tối ưu vận hành?</h2>
          <button onClick={() => router.push('/contact')} className="btn-primary">Liên hệ tư vấn doanh nghiệp</button>
        </ScrollReveal>
      </section>
      <Footer />
    </div>
  )
}
