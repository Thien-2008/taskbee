'use client'

import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0a0a0b', color: '#EDEBE7', minHeight: '100vh' }}>
      <style>{`
        .btn-primary { background: #F5A623; color: #000; border: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #FFC04D; transform: translateY(-1px); }
      `}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1C1C1E', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo size={24} variant="full" />
        <button onClick={() => router.push('/')} className="btn-primary" style={{ padding: '8px 18px', fontSize: 13 }}>
          ← Về trang chủ
        </button>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '64px 20px 80px' }}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 8 }}>
          Chính sách bảo mật
        </h1>
        <p style={{ color: '#8A857D', marginBottom: 40 }}>Cập nhật lần cuối: 01/01/2025</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>1. Thông tin thu thập</h2>
          <p style={{ color: '#8A857D', lineHeight: 1.8 }}>Khi đăng ký: họ tên, số điện thoại, email. Khi sử dụng: lịch sử công việc, lịch sử giao dịch, kết quả đã gửi. Tự động: địa chỉ IP, loại thiết bị, hành vi trong ứng dụng (phục vụ phát hiện gian lận và cải thiện dịch vụ).</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>2. Mục đích sử dụng</h2>
          <ul style={{ color: '#8A857D', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Vận hành nền tảng và xử lý thanh toán.</li>
            <li>Xác minh danh tính và chống gian lận.</li>
            <li>Gửi thông báo liên quan đến tài khoản và công việc.</li>
            <li>Cải thiện tính năng dựa trên dữ liệu tổng hợp ẩn danh.</li>
            <li>Tuân thủ nghĩa vụ pháp lý theo quy định Việt Nam.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>3. Cam kết KHÔNG làm</h2>
          <ul style={{ color: '#8A857D', lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Không bán thông tin cá nhân cho bên thứ ba.</li>
            <li>Không chia sẻ dữ liệu nhạy cảm với doanh nghiệp đăng công việc.</li>
            <li>Không gửi email quảng cáo từ đối tác bên ngoài.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>4. Bảo mật dữ liệu</h2>
          <p style={{ color: '#8A857D', lineHeight: 1.8 }}>Dữ liệu nhạy cảm được mã hóa. Toàn bộ kết nối sử dụng HTTPS/TLS. Truy cập nội bộ bị giới hạn theo nguyên tắc "cần biết" và được ghi nhật ký. Kiểm tra bảo mật định kỳ.</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>5. Quyền của bạn</h2>
          <p style={{ color: '#8A857D', lineHeight: 1.8 }}>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân. Gửi yêu cầu về privacy@taskbee.vn – phản hồi trong 5 ngày làm việc. Dữ liệu giao dịch sẽ được ẩn danh hóa và lưu trữ 5 năm theo quy định pháp luật.</p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, color: '#F5A623', marginBottom: 12 }}>6. Liên hệ</h2>
          <p style={{ color: '#8A857D', lineHeight: 1.8 }}>Mọi thắc mắc về bảo mật, vui lòng liên hệ: privacy@taskbee.vn</p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
