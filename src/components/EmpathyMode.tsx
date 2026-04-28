'use client'

import { useState, useEffect } from 'react'

export function useBatteryLevel() {
  const [batteryLevel, setBatteryLevel] = useState<number>(1)

  useEffect(() => {
    const getBattery = async () => {
      try {
        // @ts-ignore
        const battery = await navigator.getBattery()
        setBatteryLevel(battery.level)
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level)
        })
      } catch {
        // Nếu không hỗ trợ Battery API, mặc định pin đầy
        setBatteryLevel(1)
      }
    }
    getBattery()
  }, [])

  return batteryLevel
}

export default function EmpathyMode() {
  const batteryLevel = useBatteryLevel()
  const isLowPower = batteryLevel < 0.2

  // Khi pin dưới 20%, thêm class vào body để CSS có thể phản ứng
  useEffect(() => {
    if (isLowPower) {
      document.body.classList.add('low-power-mode')
    } else {
      document.body.classList.remove('low-power-mode')
    }
    return () => document.body.classList.remove('low-power-mode')
  }, [isLowPower])

  return null // Component này không render gì, chỉ chạy logic
}
