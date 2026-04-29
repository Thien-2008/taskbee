'use client'

import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

export default function TermsPage() {
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
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 8 }}>Điều khoản sử dụng</h1>
        <p style={{ color: '#9A9AA6', marginBottom: 40 }}>Cập nhật lần cuối: 15/02/2026</p>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>1. Giới thiệu</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>TaskBee là nền tảng kết nối người thực hiện công việc vi mô với doanh nghiệp có nhu cầu thuê ngoài. Sử dụng dịch vụ đồng nghĩa đồng ý với các điều khoản dưới đây.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>2. Điều kiện tham gia</h2>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Đủ 18 tuổi, cư trú hợp pháp tại Việt Nam.</li>
            <li>Cung cấp thông tin đăng ký chính xác và trung thực.</li>
            <li>Mỗi người chỉ được sở hữu một tài khoản duy nhất.</li>
          </ul>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>3. Quyền và nghĩa vụ của Người dùng</h2>
          <p style={{ color: '#EDEBE7', fontWeight: 600 }}>Quyền:</p>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Tự do nhận hoặc từ chối công việc.</li>
            <li>Xem toàn bộ lịch sử giao dịch và trạng thái công việc.</li>
            <li>Rút thu nhập về tài khoản ngân hàng cá nhân.</li>
            <li>Khiếu nại quyết định duyệt trong vòng 48 giờ làm việc.</li>
          </ul>
          <p style={{ color: '#EDEBE7', fontWeight: 600 }}>Nghĩa vụ:</p>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Thực hiện công việc trung thực, đúng hướng dẫn.</li>
            <li>Không sử dụng bot, công cụ tự động trái phép.</li>
            <li>Không tiết lộ nội dung công việc cho bên thứ ba.</li>
            <li>Không tạo nhiều tài khoản để trục lợi.</li>
          </ul>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>4. Quyền và nghĩa vụ của Doanh nghiệp</h2>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Cung cấp mô tả công việc đầy đủ, rõ ràng.</li>
            <li>Không thay đổi mức thưởng sau khi đã đăng công việc.</li>
            <li>Duyệt hoặc từ chối kết quả dựa trên tiêu chí đã công bố.</li>
            <li>Thanh toán đúng hạn cho các công việc đạt yêu cầu.</li>
          </ul>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>5. Thanh toán</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Thu nhập chỉ được ghi nhận sau khi công việc được duyệt. Yêu cầu rút tiền được xử lý từ Thứ 2 đến Thứ 6, trong khung giờ 8:00 – 20:00 (không bao gồm ngày lễ, Thứ 7, Chủ nhật). Tiền về tài khoản ngân hàng trong 1-2 ngày làm việc sau khi duyệt.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>6. Chất lượng và vi phạm</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Gian lận bị phát hiện sẽ bị thu hồi thu nhập liên quan và khóa tài khoản vĩnh viễn. Vi phạm nhẹ lần đầu sẽ nhận cảnh báo và hướng dẫn. Từ lần thứ 3, tài khoản có thể bị tạm khóa 7 ngày để xem xét.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>7. Giới hạn trách nhiệm</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>TaskBee là nền tảng trung gian, không phải bên sử dụng lao động. Chúng tôi không đảm bảo số lượng công việc hay mức thu nhập cụ thể và không chịu trách nhiệm về thiệt hại gián tiếp do sự cố kỹ thuật.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>8. Thay đổi điều khoản</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>TaskBee có thể cập nhật điều khoản. Thay đổi quan trọng sẽ được thông báo trước ít nhất 7 ngày qua email hoặc ứng dụng. Tiếp tục sử dụng sau ngày hiệu lực đồng nghĩa chấp nhận điều khoản mới.</p>
        </section>
        <section>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>9. Liên hệ</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Mọi thắc mắc vui lòng gửi về: taskbee.support@gmail.com</p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
