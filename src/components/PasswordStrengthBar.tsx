'use client'

import { motion } from 'framer-motion'

interface Props {
  password: string
}

export default function PasswordStrengthBar({ password }: Props) {
  const { percent, color, glow, label } = getStrength(password)

  return (
    <div className="mt-2">
      <div className="h-[2px] w-full bg-[#1C1C1E] rounded-full overflow-visible relative">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color}, ${glow ? '#FCD34D' : color})`,
            boxShadow: glow ? `0 0 12px ${color}, 0 0 24px ${color}44` : 'none',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {glow && (
            <div
              className="absolute top-[-1px] left-[-20px] w-[40px] h-[4px] rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                animation: 'shimmer-run 1.8s ease-in-out infinite',
              }}
            />
          )}
        </motion.div>
      </div>
      <p className="text-[11px] text-right mt-1" style={{ color }}>{label}</p>

      <style>{`
        @keyframes shimmer-run {
          0% { left: -40px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: calc(100% + 40px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}

function getStrength(password: string) {
  if (!password) return { label: '', percent: 0, color: '#2A2A2E', glow: false }
  let score = 0
  if (password.length >= 8) score += 3
  if (password.length >= 14) score += 2
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 2
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 2
  const lower = password.toLowerCase()
  const common = ['password', '123456', '12345678', 'qwerty', 'abc123', '111111', 'admin', 'taskbee']
  if (common.some(w => lower.includes(w))) score = Math.max(0, score - 5)

  const clamped = Math.min(10, Math.max(0, score))
  const percent = clamped * 10
  let label = 'Yếu', color = '#8A857D', glow = false
  if (clamped >= 3) { label = 'Trung bình'; color = '#F5A623' }
  if (clamped >= 5) { label = 'Khá'; color = '#F5A623' }
  if (clamped >= 7) { label = 'Mạnh'; color = '#FFC04D' }
  if (clamped >= 10) { label = 'Rất mạnh'; color = '#FFC04D'; glow = true }
  return { label, percent, color, glow }
}
