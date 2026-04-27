const SALT = "tbk9x2" // KHÔNG thay đổi sau khi có user thật

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("84")) return digits
  if (digits.startsWith("0")) return "84" + digits.slice(1)
  return digits
}

export function phoneToEmail(phone: string): string {
  return `${normalizePhone(phone)}.${SALT}@taskbee.local`
}

export function isPhoneNumber(input: string): boolean {
  const digits = input.replace(/\D/g, "")
  return /^(84|0)\d{9}$/.test(digits)
}

export function formatPhoneDisplay(phone: string): string {
  const digits = normalizePhone(phone)
  const local = "0" + digits.slice(2)
  return local.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")
}
