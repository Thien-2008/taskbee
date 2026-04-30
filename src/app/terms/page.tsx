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
        <p style={{ color: '#9A9AA6', marginBottom: 40 }}>Cập nhật lần cuối: 30/04/2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>1. Phạm vi áp dụng</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Điều khoản này áp dụng cho toàn bộ Người làm, Doanh nghiệp và bất kỳ ai sử dụng dịch vụ của TaskBee. TaskBee là nền tảng trung gian kết nối Người làm và Doanh nghiệp. Khi sử dụng dịch vụ, bạn đồng ý với các điều khoản dưới đây.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>2. Điều kiện sử dụng</h2>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Người dùng phải đủ 18 tuổi và cư trú hợp pháp tại Việt Nam.</li>
            <li>Cung cấp thông tin đăng ký chính xác, trung thực và cập nhật khi cần.</li>
            <li>Mỗi người chỉ được sở hữu một tài khoản duy nhất. Việc tạo nhiều tài khoản để trục lợi là vi phạm nghiêm trọng.</li>
            <li>TaskBee có thể yêu cầu xác minh bổ sung khi cần để đảm bảo an toàn cho tài khoản và giao dịch.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>3. Quyền và nghĩa vụ của Người làm</h2>
          <p style={{ color: '#EDEBE7', fontWeight: 600 }}>Quyền:</p>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Tự do nhận hoặc từ chối công việc.</li>
            <li>Xem toàn bộ lịch sử giao dịch và trạng thái công việc.</li>
            <li>Rút thu nhập về tài khoản ngân hàng cá nhân theo quy định.</li>
            <li>Khiếu nại quyết định duyệt trong vòng 48 giờ làm việc nếu cho rằng có sai sót hoặc không công bằng.</li>
          </ul>
          <p style={{ color: '#EDEBE7', fontWeight: 600 }}>Nghĩa vụ:</p>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Thực hiện công việc trung thực, đúng hướng dẫn và đúng hạn.</li>
            <li>Không sử dụng bot, công cụ tự động trái phép hoặc hình thức gian lận.</li>
            <li>Không gửi kết quả giả, kết quả sao chép hoặc dữ liệu vi phạm.</li>
            <li>Không tiết lộ nội dung công việc, tài liệu hoặc thông tin của công việc cho bên thứ ba nếu không được phép.</li>
            <li>Không tạo nhiều tài khoản để trục lợi hoặc lách hệ thống.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>4. Quyền và nghĩa vụ của Doanh nghiệp</h2>
          <ul style={{ color: '#9A9AA6', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Cung cấp mô tả công việc đầy đủ, rõ ràng và không gây hiểu lầm trước khi đăng.</li>
            <li>Công bố tiêu chí duyệt rõ ràng và nhất quán trước khi công việc được nhận.</li>
            <li>Không thay đổi mức thưởng hoặc yêu cầu sau khi công việc đã được nhận, trừ khi có lý do chính đáng và thông báo phù hợp.</li>
            <li>Duyệt hoặc từ chối kết quả dựa trên tiêu chí đã công bố, không từ chối tùy tiện.</li>
            <li>Thanh toán đúng hạn cho các công việc đạt yêu cầu.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>5. Thanh toán và rút tiền</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Thu nhập chỉ được ghi nhận sau khi công việc được duyệt. Yêu cầu rút tiền được xử lý từ Thứ 2 đến Thứ 6, trong khung giờ 8:00 – 20:00 (không bao gồm ngày lễ, Thứ 7, Chủ nhật). Tiền về tài khoản ngân hàng trong 1-2 ngày làm việc sau khi duyệt. TaskBee không thu phí rút tiền.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>6. Chất lượng và vi phạm</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>Gian lận bị phát hiện sẽ bị thu hồi thu nhập liên quan và khóa tài khoản vĩnh viễn. Vi phạm nhẹ lần đầu sẽ nhận cảnh báo và hướng dẫn. Từ lần thứ 3, tài khoản có thể bị tạm khóa 7 ngày để xem xét. Chính sách này áp dụng bình đẳng cho cả Người làm và Doanh nghiệp.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>7. Giới hạn trách nhiệm</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>TaskBee là nền tảng trung gian, không phải bên sử dụng lao động. Chúng tôi không đảm bảo số lượng công việc hay mức thu nhập cụ thể và không chịu trách nhiệm về thiệt hại gián tiếp do sự cố kỹ thuật ngoài khả năng kiểm soát hợp lý.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>8. Thay đổi điều khoản</h2>
          <p style={{ color: '#9A9AA6', lineHeight: 1.8 }}>TaskBee có thể cập nhật điều khoản khi cần. Các thay đổi quan trọng sẽ được thông báo trước ít nhất 7 ngày qua email hoặc ứng dụng. Tiếp tục sử dụng sau ngày hiệu lực đồng nghĩa với việc chấp nhận điều khoản mới.</p>
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
