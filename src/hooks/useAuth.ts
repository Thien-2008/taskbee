"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { normalizePhone, isPhoneNumber } from "@/utils/phone"

interface RegisterInput {
  email: string
  phone: string
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
    const normalizedPhone = normalizePhone(input.phone)

    try {
      // Kiểm tra SĐT trùng
      const { data: existingPhone } = await supabase
        .from("users")
        .select("id")
        .eq("phone", normalizedPhone)
        .maybeSingle()

      if (existingPhone) {
        return { success: false, error: "Số điện thoại này đã được đăng ký" }
      }

      // Tạo tài khoản
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { full_name: input.fullName }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          return { success: false, error: "Email này đã được đăng ký" }
        }
        return { success: false, error: "Đăng ký thất bại, vui lòng thử lại" }
      }

      // Lưu vào bảng users
      if (data.user) {
        await supabase.from("users").insert({
          id: data.user.id,
          email: input.email,
          phone: normalizedPhone,
          full_name: input.fullName,
          balance: 0,
          role: "user",
          terms_accepted_at: new Date().toISOString(),
        })
      }

      // Luôn đăng xuất sau khi đăng ký để buộc user đăng nhập thủ công
      await supabase.auth.signOut()

      return { success: true }

    } finally {
      setLoading(false)
    }
  }

  async function login(identifier: string, password: string): Promise<AuthResult> {
    setLoading(true)

    try {
      let email = identifier.trim()

      // Nếu là SĐT -> lookup email từ bảng users
      if (isPhoneNumber(identifier)) {
        const normalizedPhone = normalizePhone(identifier)

        const { data, error } = await supabase
          .from("users")
          .select("email")
          .eq("phone", normalizedPhone)
          .maybeSingle()

        if (error) {
          return { success: false, error: "Lỗi hệ thống, vui lòng thử lại" }
        }
        if (!data?.email) {
          return { success: false, error: "Số điện thoại chưa được đăng ký" }
        }

        email = data.email
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        if (loginError.message.includes("Email not confirmed")) {
          return { success: false, error: "EMAIL_NOT_CONFIRMED" }
        }
        if (loginError.message.includes("Invalid login credentials")) {
          return { success: false, error: "Thông tin đăng nhập không đúng" }
        }
        return { success: false, error: "Đăng nhập thất bại, vui lòng thử lại" }
      }

      return { success: true }

    } finally {
      setLoading(false)
    }
  }

  async function logout(): Promise<void> { await supabase.auth.signOut() }

  async function sendResetPassword(email: string): Promise<AuthResult> {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) return { success: false, error: "Không thể gửi email, thử lại sau" }
      return { success: true }
    } finally { setLoading(false) }
  }

  async function updatePassword(newPassword: string): Promise<AuthResult> {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) return { success: false, error: "Không thể cập nhật mật khẩu" }
      return { success: true }
    } finally { setLoading(false) }
  }

  async function resendConfirmation(email: string): Promise<AuthResult> {
    setLoading(true)
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email })
      if (error) return { success: false, error: "Không thể gửi lại email" }
      return { success: true }
    } finally { setLoading(false) }
  }

  return { loading, register, login, logout, sendResetPassword, updatePassword, resendConfirmation }
}
