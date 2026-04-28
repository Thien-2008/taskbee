'use client'

import { useRouter } from 'next/navigation'
import { UserPlus, Search, PlaySquare, CheckCircle2, Wallet } from 'lucide-react'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

const steps = [
  {
    icon: UserPlus,
    title: 'Bước 1: Tạo tài khoản',
    desc: 'Đăng ký miễn phí trong 2 phút bằng số điện thoại hoặc email. Xác thực danh tính cơ bản để đảm bảo an toàn cho tài khoản của bạn.',
    time: 'Thời gian: dưới 2 phút',
    note: 'Không cần hồ sơ, không cần kinh nghiệm.',
  },
  {
    icon: Search,
    title: 'Bước 2: Duyệt và nhận việc',
    desc: 'Xem danh sách công việc đang mở. Mỗi việc hiển thị rõ phần thưởng, thời gian hoàn thành và yêu cầu cụ thể. Chọn việc phù hợp và nhấn Nhận việc.',
    time: 'Linh hoạt theo lịch của bạn',
    note: 'Bạn có thể nhận nhiều việc cùng lúc, miễn là hoàn thành đúng hạn.',
  },
  {
    icon: PlaySquare,
    title: 'Bước 3: Thực hiện và gửi kết quả',
    desc: 'Làm theo hướng dẫn chi tiết của từng công việc. Gửi kết quả đúng định dạng yêu cầu. Hệ thống ghi nhận và chuyển sang trạng thái chờ duyệt.',
    time: 'Tùy theo độ khó của công việc',
    note: 'Nếu chưa chắc chắn, bạn có thể hủy việc trước khi nộp – không bị phạt.',
  },
  {
    icon: CheckCircle2,
    title: 'Bước 4: Duyệt kết quả',
    desc: 'Người đăng việc hoặc hệ thống kiểm tra kết quả của bạn. Nếu đạt yêu cầu, phần thưởng sẽ được ghi vào Ví TaskBee. Nếu cần chỉnh sửa, bạn sẽ nhận được thông báo rõ lý do.',
    time: 'Thời gian duyệt: thường trong 24 giờ',
    note: 'Luôn có lý do cụ thể nếu kết quả bị từ chối – minh bạch tuyệt đối.',
  },
  {
    icon: Wallet,
    title: 'Bước 5: Nhận tiền về ngân hàng',
    desc: 'Khi số dư đạt mức tối thiểu, bạn có thể yêu cầu rút về tài khoản ngân hàng. Lệnh rút được duyệt từ Thứ 2 đến Thứ 6, 8:00 – 20:00.',
    time: 'Tiền về trong vài phút đến vài giờ sau duyệt',
    note: 'Không thu phí rút tiền. Lịch sử giao dịch rõ ràng từng đồng.',
  },
]

export default function HowItWorksPage() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
      <style>{`
        .btn-primary { background: #F5A623; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); }
      `}</style>

      {/* Navbar đơn giản */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={24} variant="full" />
        <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
          ← Về trang chủ
        </button>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 20px 32px', textAlign: 'center', userSelect: 'none', WebkitUserSelect: 'none' }}>
        <ScrollReveal>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.15, marginBottom: 16 }}>
            TaskBee hoạt động như thế nào?
          </h1>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p style={{ color: '#8A857D', fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            Từ lúc đăng ký đến lúc nhận tiền, mọi bước đều minh bạch và rõ ràng.
          </p>
        </ScrollReveal>
      </section>

      {/* Timeline các bước */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '20px 20px 80px' }}>
        {steps.map((step, idx) => (
          <ScrollReveal key={idx} delay={idx * 0.1}>
            <div style={{
              display: 'flex',
              gap: 16,
              marginBottom: 40,
              background: '#161618',
              border: '1px solid #1C1C1E',
              borderRadius: 16,
              padding: '24px 20px',
              alignItems: 'flex-start',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}>
              <div style={{
                width: 48,
                height: 48,
                background: 'rgba(245,166,35,0.1)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <step.icon size={22} color="#F5A623" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: '#8A857D', lineHeight: 1.7, marginBottom: 8 }}>{step.desc}</div>
                <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 500 }}>{step.time}</div>
                <div style={{ fontSize: 12, color: '#5C5A55', marginTop: 4, fontStyle: 'italic' }}>💡 {step.note}</div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* CTA cuối trang */}
      <section style={{ textAlign: 'center', padding: '40px 20px 60px', maxWidth: 500, margin: '0 auto' }}>
        <ScrollReveal delay={0.2}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
            Đã hiểu quy trình? Bắt đầu ngay.
          </h2>
          <button onClick={() => router.push('/auth?mode=register')} className="btn-primary">
            Tạo tài khoản miễn phí
          </button>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  )
}
