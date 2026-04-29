export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'taskbee', 'support',
  'help', 'mod', 'moderator', 'staff', 'owner', 'ceo', 'founder',
  'api', 'dev', 'developer', 'bot', 'test', 'user', 'guest'
]

export function validateUsername(username: string): string | null {
  if (!username || username.length < 3) return 'Tên đăng nhập phải có ít nhất 3 ký tự'
  if (username.length > 24) return 'Tên đăng nhập tối đa 24 ký tự'
  if (!/^[a-z0-9_-]+$/i.test(username)) return 'Tên đăng nhập chỉ được dùng chữ cái, số, gạch dưới và gạch ngang'
  if (/^[0-9_-]/.test(username)) return 'Tên đăng nhập không được bắt đầu bằng số hoặc ký tự đặc biệt'
  if (RESERVED_USERNAMES.includes(username.toLowerCase())) return 'Tên đăng nhập này không được phép sử dụng'
  return null
}
