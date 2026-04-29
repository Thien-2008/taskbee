'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const IDLE_LIMIT = 30 * 60 * 1000
const WARNING_BEFORE = 2 * 60 * 1000
const THROTTLE_MS = 1000

export function useIdleLogout() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!))
  const timer = useRef<NodeJS.Timeout>()
  const warningTimer = useRef<NodeJS.Timeout>()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(120)
  const lastReset = useRef(0)

  const throttledReset = useCallback(() => {
    const now = Date.now()
    if (now - lastReset.current < THROTTLE_MS) return
    lastReset.current = now

    clearTimeout(timer.current)
    clearTimeout(warningTimer.current)
    setShowWarning(false)
    setCountdown(120)

    warningTimer.current = setTimeout(() => {
      setShowWarning(true)
      setCountdown(120)
    }, IDLE_LIMIT - WARNING_BEFORE)

    timer.current = setTimeout(async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('taskbee_email')
      router.replace('/auth?reason=idle')
    }, IDLE_LIMIT)
  }, [supabase, router])

  // Multi-tab logout sync
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/auth?reason=idle')
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, throttledReset, { passive: true }))
    const onMouseMove = () => throttledReset()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    throttledReset()

    let countdownInterval: NodeJS.Timeout
    if (showWarning) {
      countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }

    return () => {
      events.forEach(e => window.removeEventListener(e, throttledReset))
      window.removeEventListener('mousemove', onMouseMove)
      clearTimeout(timer.current)
      clearTimeout(warningTimer.current)
      clearInterval(countdownInterval)
    }
  }, [showWarning, throttledReset])

  const extendSession = () => {
    setShowWarning(false)
    throttledReset()
  }

  const logoutNow = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('taskbee_email')
    router.replace('/auth?reason=idle')
  }

  return { showWarning, countdown, extendSession, logoutNow }
}
