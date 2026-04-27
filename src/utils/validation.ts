export function validateEmail(email: string): string | null {
  if (!email) return "Vui lòng nhập email"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không hợp lệ"
  return null
}

export function validatePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return "Vui lòng nhập số điện thoại"
  if (!/^(84|0)\d{9}$/.test(digits)) return "Số điện thoại không hợp lệ (VD: 0912345678)"
  return null
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("84")) return digits
  if (digits.startsWith("0")) return "84" + digits.slice(1)
  return digits
}

export function isPhoneNumber(input: string): boolean {
  const digits = input.replace(/\D/g, "")
  return /^(84|0)\d{9}$/.test(digits)
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
  errors: string[]
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const errors: string[] = []
  if (password.length < 8) errors.push("Ít nhất 8 ký tự")
  if (!/[A-Z]/.test(password)) errors.push("Ít nhất 1 chữ hoa")
  if (!/[a-z]/.test(password)) errors.push("Ít nhất 1 chữ thường")
  if (!/[0-9]/.test(password)) errors.push("Ít nhất 1 chữ số")

  const bonus = /[^A-Za-z0-9]/.test(password) ? 1 : 0
  const score = Math.min(4, (4 - errors.length) + bonus) as 0|1|2|3|4

  const map = {
    0: { label: "Rất yếu", color: "#ef4444" },
    1: { label: "Yếu", color: "#f97316" },
    2: { label: "Trung bình", color: "#eab308" },
    3: { label: "Mạnh", color: "#22c55e" },
    4: { label: "Rất mạnh", color: "#16a34a" },
  }

  return { score, errors, ...map[score] }
}

export function validatePassword(password: string): string | null {
  const { errors } = checkPasswordStrength(password)
  if (errors.length > 0) return errors[0]
  return null
}

export function validatePasswordMatch(pw: string, confirm: string): string | null {
  if (!confirm) return "Vui lòng xác nhận mật khẩu"
  if (pw !== confirm) return "Mật khẩu không khớp"
  return null
}

export function validateFullName(name: string): string | null {
  if (!name.trim()) return "Vui lòng nhập họ và tên"
  if (name.trim().split(/\s+/).length < 2) return "Vui lòng nhập đầy đủ họ và tên"
  if (name.trim().length < 4) return "Họ và tên quá ngắn"
  return null
}
