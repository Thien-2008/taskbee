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

  async function logout() { await supabase.auth.signOut() }
  return { loading, register, login, logout }
}
