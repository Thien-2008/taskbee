import { motion } from 'framer-motion'

export default function HexPasswordStrength({ password }: { password: string }) {
  let strength = 0
  if (password.length >= 6) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  return (
    <div className="flex gap-2 mt-2">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-6 h-6 border border-[#1C1C1E]"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: i <= strength ? '#F5A623' : 'transparent',
            opacity: i <= strength ? 1 : 0.3,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
      <span className="text-xs text-gray-500 ml-2 self-center">
        {strength === 0 && password.length > 0 && 'Yếu'}
        {strength === 1 && 'Trung bình'}
        {strength === 2 && 'Khá'}
        {strength === 3 && 'Mạnh'}
        {strength === 4 && 'Rất mạnh'}
      </span>
    </div>
  )
}
