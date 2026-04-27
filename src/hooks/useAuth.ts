"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

interface RegisterInput {
  email: string
  password: string
  fullName: string
}

interface AuthResult {
  success: boolean
  error?: string
}

export function useAuth() {
  const [loading, setLoading] = useState(false)

  async function register(input: RegisterInput): Promise<AuthResult> {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: { data: { full_name: input.fullName.trim() } }
      })
      if (error) {
        if (error.message.includes('already registered')) return { success: false, error: 'Email này đã được đăng ký' }
        return { success: false, error: 'Đăng ký thất bại, thử lại' }
      }
      await supabase.auth.signOut()
      return { success: true }
    } finally { setLoading(false) }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        if (error.message.includes('Email not confirmed')) return { success: false, error: 'Vui lòng xác nhận email trước khi đăng nhập' }
        return { success: false, error: 'Email hoặc mật khẩu không đúng' }
      }
      return { success: true }
    } finally { setLoading(false) }
  }

  async function savePhone(userId: string, phone: string): Promise<AuthResult> {
    setLoading(true)
    try {
      const digits = phone.replace(/\D/g, '')
      const normalized = digits.startsWith('0') ? '84' + digits.slice(1) : digits
      if (!/^84\d{9}$/.test(normalized)) return { success: false, error: 'Số điện thoại không hợp lệ' }
      const { error } = await supabase.from('users').update({ phone: normalized }).eq('id', userId)
      if (error) return { success: false, error: 'Lưu thất bại, thử lại' }
      return { success: true }
    } finally { setLoading(false) }
  }

  async function logout() { await supabase.auth.signOut() }
  return { loading, register, login, savePhone, logout }
}
