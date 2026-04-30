'use client'

import { useRouter } from 'next/navigation'
import { Mail, Clock, Shield } from 'lucide-react'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function ContactPage() {
  const router = useRouter()
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh', userSelect: 'none' }}>
      <style>{`
        .btn-primary { background: #F5A623; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); }
        .card-contact { background: #161618; border: 1px solid #1C1C1E; border-radius: 16px; padding: 28px 24px; }
        .highlight-box { background: rgba(245,166,35,0.05); border: 1px solid rgba(245,166,35,0.2); border-radius: 12px; padding: 20px; }
      `}</style>
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={24} variant="full" />
        <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>← Về trang chủ</button>
      </nav>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 20px 80px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 12 }}>Cần hỗ trợ? Chúng tôi ở đây.</h1>
            <p style={{ color: '#9A9AA6', fontSize: 16, lineHeight: 1.7 }}>Gửi câu hỏi, báo lỗi hoặc yêu cầu hỗ trợ. Chúng tôi ưu tiên các vấn đề liên quan đến tài khoản và thanh toán.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="highlight-box" style={{ marginBottom: 40, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <Clock size={24} color="#F5A623" style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, marginBottom: 8, color: '#F5A623' }}>Thời gian xử lý rút tiền</div>
              <p style={{ color: '#EDEBE7', lineHeight: 1.8, margin: 0 }}>
                Thứ 2 – Thứ 6, 8:00 sáng – 20:00 tối.<br />
                <span style={{ color: '#9A9AA6', fontSize: 14 }}>Yêu cầu ngoài khung giờ hoặc Thứ 7, Chủ nhật, ngày lễ sẽ được xử lý vào ngày làm việc tiếp theo.</span>
              </p>
            </div>
          </div>
        </ScrollReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
          <ScrollReveal delay={0.15}>
            <div className="card-contact">
              <Mail size={22} color="#F5A623" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 8 }}>Email hỗ trợ</div>
              <p style={{ color: '#9A9AA6', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>Phản hồi trong 24-48 giờ làm việc. Phù hợp với các vấn đề cần mô tả chi tiết hoặc đính kèm tài liệu.</p>
              <div style={{ color: '#F5A623', fontWeight: 500, fontSize: 14 }}>taskbee.support@gmail.com</div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="card-contact">
              <Shield size={22} color="#F5A623" style={{ marginBottom: 12 }} />
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, marginBottom: 8 }}>Form trong ứng dụng</div>
              <p style={{ color: '#9A9AA6', fontSize: 14, lineHeight: 1.6 }}>Ưu tiên sử dụng form hỗ trợ trong ứng dụng TaskBee để lưu lịch sử rõ ràng và phản hồi nhanh nhất.</p>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={0.25}>
          <div style={{ marginTop: 60 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 24, textAlign: 'center' }}>Câu hỏi thường gặp về hỗ trợ</h2>
            <div className="card-contact" style={{ marginBottom: 16 }}>
              <strong style={{ color: '#EDEBE7' }}>Rút tiền mất bao lâu?</strong>
              <p style={{ color: '#9A9AA6', margin: '8px 0 0', lineHeight: 1.7 }}>Sau khi lệnh được duyệt, tiền thường về trong vài phút đến vài giờ, tùy ngân hàng nhận.</p>
            </div>
            <div className="card-contact" style={{ marginBottom: 16 }}>
              <strong style={{ color: '#EDEBE7' }}>Công việc bị từ chối, tôi phải làm sao?</strong>
              <p style={{ color: '#9A9AA6', margin: '8px 0 0', lineHeight: 1.7 }}>Bạn có 48 giờ làm việc để gửi khiếu nại qua form trong ứng dụng hoặc email. Nêu rõ mã công việc và lý do bạn cho rằng kết quả đạt yêu cầu.</p>
            </div>
            <div className="card-contact">
              <strong style={{ color: '#EDEBE7' }}>Tôi có thể liên hệ khẩn cấp bằng cách nào?</strong>
              <p style={{ color: '#9A9AA6', margin: '8px 0 0', lineHeight: 1.7 }}>Gửi email với tiêu đề bắt đầu bằng "[KHẨN]" cho các vấn đề về thanh toán hoặc tài khoản bị khóa. Chúng tôi ưu tiên xử lý nhanh nhất có thể.</p>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  )
}
