'use client'

export default function PhoneMockup() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '40px auto',
    }}>
      <div style={{
        width: '280px',
        height: '560px',
        background: '#111113',
        borderRadius: '40px',
        border: '2px solid #1C1C1E',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '24px',
          background: '#111113',
          borderRadius: '0 0 16px 16px',
          zIndex: 10,
        }} />
        
        {/* Status bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px 0',
          fontSize: '11px',
          color: '#9A9AA6',
        }}>
          <span>9:41</span>
          <span>📶 🔋</span>
        </div>

        {/* Screen content */}
        <div style={{
          padding: '16px 14px',
        }}>
          {/* Header */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: '#F5A623',
            marginBottom: 16,
          }}>
            🐝 TaskBee
          </div>

          {/* Balance Card */}
          <div style={{
            background: '#1C1C1E',
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#9A9AA6' }}>Số dư khả dụng</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F5A623' }}>245.000đ</div>
            </div>
            <button style={{
              background: '#F5A623',
              color: '#000',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 11,
              cursor: 'pointer',
            }}>
              Rút
            </button>
          </div>

          {/* Section title */}
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: '#EDEBE7' }}>
            Việc gần bạn
          </div>

          {/* Task Cards */}
          {[
            { title: 'Chụp ảnh cửa hàng', price: '35.000đ', time: '10 phút' },
            { title: 'Khảo sát thị trường', price: '50.000đ', time: '20 phút' },
            { title: 'So sánh giá siêu thị', price: '25.000đ', time: '15 phút' },
          ].map((task, i) => (
            <div key={i} style={{
              background: '#1C1C1E',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 500 }}>{task.title}</div>
                <div style={{ fontSize: 9, color: '#9A9AA6' }}>{task.time}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#34D399' }}>{task.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
