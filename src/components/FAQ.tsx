'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: 'TaskBee có thu phí người dùng không?',
    answer: 'Không. TaskBee không thu bất kỳ khoản phí nào từ người dùng. Bạn nhận đủ số tiền hiển thị trên mỗi task.',
  },
  {
    question: 'Làm sao để nhận tiền?',
    answer: 'Sau khi hoàn thành task và được duyệt, tiền sẽ vào số dư của bạn. Bạn có thể rút về MoMo hoặc tài khoản ngân hàng bất cứ lúc nào, tối thiểu 50.000đ.',
  },
  {
    question: 'Tôi cần kinh nghiệm gì không?',
    answer: 'Không cần. Các task trên TaskBee được thiết kế đơn giản, có hướng dẫn rõ ràng. Bất kỳ ai có điện thoại đều có thể tham gia.',
  },
  {
    question: 'Rút tiền mất bao lâu?',
    answer: 'Yêu cầu rút tiền được xử lý trong vòng 24 giờ. Thông thường, tiền sẽ về tài khoản của bạn trong vài giờ.',
  },
  {
    question: 'Thông tin cá nhân của tôi có an toàn không?',
    answer: 'Có. TaskBee chỉ thu thập thông tin cần thiết để xác minh và thanh toán. Dữ liệu của bạn được mã hóa và không chia sẻ với bên thứ ba.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#F5A623', marginBottom: 16, textAlign: 'center' }}>
        Câu hỏi thường gặp
      </div>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 'clamp(24px, 3vw, 32px)', textAlign: 'center', marginBottom: 40 }}>
        Bạn cần biết gì?
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqData.map((item, i) => (
          <div key={i} style={{
            background: '#161618',
            border: '1px solid #1C1C1E',
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'all 0.3s',
          }}>
            <button
              onClick={() => toggleIndex(i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                color: '#EDEBE7',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 500,
                textAlign: 'left',
              }}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                color="#9A9AA6"
                style={{
                  transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
                  flexShrink: 0,
                  marginLeft: 12,
                }}
              />
            </button>
            {openIndex === i && (
              <div style={{
                padding: '0 20px 16px',
                fontSize: 14,
                color: '#9A9AA6',
                lineHeight: 1.7,
              }}>
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
