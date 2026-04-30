'use client'

import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'

export default function CommunityPage() {
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

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 20px 80px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 12 }}>
              Tiêu chuẩn cộng đồng
            </h1>
            <p style={{ color: '#9A9AA6', fontSize: 16, lineHeight: 1.7 }}>
              Cùng xây dựng môi trường làm việc vi mô minh bạch, tôn trọng và công bằng cho tất cả.
            </p>
          </div>
        </ScrollReveal>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.1}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>1. Nguyên tắc chung</h2>
            <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>
              TaskBee là nơi kết nối Người làm và Doanh nghiệp. Mọi thành viên đều được khuyến khích giao tiếp lịch sự, trung thực và có trách nhiệm với cam kết của mình.
            </p>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.15}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>2. Hành vi bị cấm</h2>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Quấy rối, xúc phạm, đe dọa hoặc phân biệt đối xử.</li>
              <li>Spam, gửi nội dung không liên quan, hoặc quảng cáo trái phép.</li>
              <li>Lừa đảo, mạo danh, hoặc cố ý cung cấp thông tin sai lệch.</li>
              <li>Lợi dụng trẻ vị thành niên hoặc bất kỳ hình thức lạm dụng nào.</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.2}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>3. Công bằng trong công việc</h2>
            <p style={{ color: '#EDEBE7', fontWeight: 600 }}>Đối với Doanh nghiệp:</p>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Mô tả công việc rõ ràng, trung thực, không gây hiểu lầm.</li>
              <li>Không thay đổi mức thưởng hoặc yêu cầu sau khi đã có người nhận việc.</li>
              <li>Duyệt kết quả dựa trên tiêu chí đã công bố, không từ chối tùy tiện.</li>
            </ul>
            <p style={{ color: '#EDEBE7', fontWeight: 600, marginTop: 16 }}>Đối với Người làm:</p>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Chỉ nhận việc khi có khả năng hoàn thành đúng yêu cầu.</li>
              <li>Gửi kết quả trung thực, không dùng bot hay công cụ tự động.</li>
              <li>Không tạo nhiều tài khoản để trục lợi.</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.25}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>4. Nội dung bị cấm</h2>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Nội dung vi phạm pháp luật, kích động bạo lực hoặc thù địch.</li>
              <li>Nội dung khiêu dâm, bóc lột hoặc lạm dụng trẻ em.</li>
              <li>Nội dung lừa đảo, dụ dỗ hoặc gây thiệt hại cho người khác.</li>
              <li>Nội dung xâm phạm quyền riêng tư hoặc dữ liệu cá nhân.</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.3}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>5. Thanh toán và giao dịch</h2>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Chỉ thanh toán qua hệ thống TaskBee, không tự ý thỏa thuận ngoài.</li>
              <li>Không yêu cầu thanh toán ngoài nền tảng để tránh rủi ro.</li>
              <li>Mọi tranh chấp thanh toán được xem xét dựa trên lịch sử và bằng chứng.</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.35}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>6. Quyền riêng tư và bảo mật</h2>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Không công khai thông tin cá nhân của người khác.</li>
              <li>Không thu thập hoặc chia sẻ dữ liệu ngoài phạm vi cần thiết.</li>
              <li>Tôn trọng quyền riêng tư của cả Người làm lẫn Doanh nghiệp.</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.4}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>7. An toàn người dùng</h2>
            <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>
              TaskBee không cho phép bất kỳ hành vi lạm dụng trẻ vị thành niên, khai thác người yếu thế, hoặc nội dung có nguy cơ gây hại nghiêm trọng. Khi phát hiện dấu hiệu vi phạm, chúng tôi có thể tạm khóa hoặc chấm dứt tài khoản ngay lập tức để bảo vệ cộng đồng.
            </p>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.45}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>8. Báo cáo vi phạm</h2>
            <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>
              Nếu bạn phát hiện hành vi hoặc nội dung vi phạm, hãy báo cáo qua:
            </p>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Form hỗ trợ trong ứng dụng (ưu tiên).</li>
              <li>Email: taskbee.support@gmail.com (tiêu đề: [BÁO CÁO VI PHẠM]).</li>
            </ul>
          </ScrollReveal>
        </section>

        <section style={{ marginBottom: 40 }}>
          <ScrollReveal delay={0.5}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>9. Xử lý vi phạm</h2>
            <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
              <li>Vi phạm nhẹ lần đầu: nhắc nhở và hướng dẫn khắc phục.</li>
              <li>Vi phạm lặp lại: tạm khóa tài khoản 7 ngày để xem xét.</li>
              <li>Vi phạm nghiêm trọng hoặc gian lận: khóa tài khoản vĩnh viễn và thu hồi thu nhập liên quan.</li>
            </ul>
            <p style={{ color: '#9A9AA6', lineHeight: 1.8, marginTop: 8 }}>
              Mọi quyết định xử lý đều được thông báo rõ lý do. Người dùng có quyền khiếu nại trong thời hạn quy định.
            </p>
          </ScrollReveal>
        </section>

        <section>
          <ScrollReveal delay={0.55}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, color: '#F5A623', marginBottom: 16 }}>10. Cập nhật tiêu chuẩn</h2>
            <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>
              TaskBee có thể cập nhật Tiêu chuẩn cộng đồng để phù hợp với thực tế vận hành và quy định pháp luật. Các thay đổi quan trọng sẽ được thông báo trước khi áp dụng.
            </p>
          </ScrollReveal>
        </section>

        <div style={{ marginTop: 48, padding: '20px', background: '#161618', borderRadius: 16, border: '1px solid #1C1C1E', textAlign: 'center' }}>
          <p style={{ color: '#9A9AA6', fontSize: 14, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Mail size={16} color="#F5A623" />
            Mọi thắc mắc về Tiêu chuẩn cộng đồng, vui lòng liên hệ: <strong style={{ color: '#F5A623' }}>taskbee.support@gmail.com</strong>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
