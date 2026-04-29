'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const IDLE_LIMIT = 30 * 60 * 1000      // 30 phút
const WARNING_BEFORE = 2 * 60 * 1000   // Cảnh báo trước 2 phút

export function useIdleLogout() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!))
  const timer = useRef<NodeJS.Timeout>()
  const warningTimer = useRef<NodeJS.Timeout>()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 phút đếm ngược

  const reset = () => {
    clearTimeout(timer.current)
    clearTimeout(warningTimer.current)
    setShowWarning(false)
    setCountdown(120)

    // Cảnh báo sau 28 phút
    warningTimer.current = setTimeout(() => {
      setShowWarning(true)
      setCountdown(120)
    }, IDLE_LIMIT - WARNING_BEFORE)

    // Đăng xuất sau 30 phút
    timer.current = setTimeout(async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('taskbee_email') // Xóa email đã nhớ khi đăng xuất
      router.replace('/auth?reason=idle')
    }, IDLE_LIMIT)
  }

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    reset()

    // Đếm ngược khi hiển thị cảnh báo
    let countdownInterval: NodeJS.Timeout
    if (showWarning) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }

    return () => {
      events.forEach(e => window.removeEventListener(e, reset))
      clearTimeout(timer.current)
      clearTimeout(warningTimer.current)
      clearInterval(countdownInterval)
    }
  }, [showWarning])

  const extendSession = () => {
    setShowWarning(false)
    reset()
  }

  const logoutNow = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('taskbee_email')
    router.replace('/auth?reason=idle')
  }

  return { showWarning, countdown, extendSession, logoutNow }
}
