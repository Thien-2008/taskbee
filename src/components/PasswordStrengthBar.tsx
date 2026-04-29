'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

interface Props {
  password: string
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
  let label = '', color = '#9A9AA6', glow = false
  if (clamped >= 3) { label = 'Trung bình'; color = '#D89A3A' }
  if (clamped >= 5) { label = 'Khá'; color = '#F5A623' }
  if (clamped >= 7) { label = 'Mạnh'; color = '#FFC04D'; glow = true }
  if (clamped >= 10) { label = 'Rất mạnh'; color = '#FFC04D'; glow = true }
  return { label, percent, color, glow }
}

function getChecks(password: string) {
  return [
    { label: 'Ít nhất 8 ký tự', met: password.length >= 8 },
    { label: 'Có chữ hoa & chữ thường', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'Có ít nhất 1 số', met: /\d/.test(password) },
    { label: 'Có ký tự đặc biệt (!@#$...)', met: /[^A-Za-z0-9]/.test(password) },
  ]
}

export default function PasswordStrengthBar({ password }: Props) {
  const { percent, color, glow, label } = getStrength(password)
  const checks = getChecks(password)

  if (!password) return null

  return (
    <div className="mt-2">
      {/* Track nền */}
      <div className="h-[2px] w-full bg-[#1C1C1E] rounded-full overflow-visible relative">
        {/* Fill line */}
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${percent}%`,
            background: `linear-gradient(90deg, ${color}, ${glow ? '#FFC04D' : color})`,
            boxShadow: glow ? `0 0 12px ${color}, 0 0 24px ${color}44` : 'none',
          }}
          initial={{ width: '0%' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Shimmer sweep */}
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

      {/* Label */}
      <p className="text-[11px] text-right mt-1" style={{ color }}>{label}</p>

      {/* Checklist */}
      <div className="mt-2 space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]" style={{ color: check.met ? '#F5A623' : '#6B6B70' }}>
            {check.met ? <Check size={12} /> : <X size={12} />}
            <span>{check.label}</span>
          </div>
        ))}
      </div>

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
