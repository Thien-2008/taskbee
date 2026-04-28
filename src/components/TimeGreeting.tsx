'use client'

import { useState, useEffect } from 'react'

export function useTimeGreeting() {
  const [greeting, setGreeting] = useState('')
  const [subtext, setSubtext] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting('Chào buổi sáng!')
      setSubtext('Bắt đầu ngày mới với những nhiệm vụ đầy hứa hẹn.')
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Chào buổi chiều!')
      setSubtext('Thời điểm lý tưởng để hoàn thành thêm vài nhiệm vụ.')
    } else {
      setGreeting('Chào buổi tối!')
      setSubtext('Thư giãn và kiếm thêm thu nhập trước khi kết thúc ngày.')
    }
  }, [])

  return { greeting, subtext }
}
