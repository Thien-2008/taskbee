'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { User, LogOut, Shield, Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'

export default function DashboardPage() {
  const router = useRouter()
  const [supabase] = useState(() => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!))
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace('/auth?mode=login')
        return
      }
      setUser(user)
      
      // Lấy thông tin profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)
      setLoading(false)
    }
    getUser()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('taskbee_email')
    router.replace('/auth?mode=login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F5A623]" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] font-dm-sans">
      {/* Navbar đơn giản */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0b]/90 backdrop-blur-xl border-b border-[#1C1C1E] px-6 py-4 flex items-center justify-between">
        <Logo size={28} variant="full" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#161618] border border-[#2A2A2E] text-[#9A9AA6] hover:text-[#F87171] hover:border-[#F87171]/30 transition-all duration-300 text-sm"
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </nav>

      {/* Nội dung chính */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Chào mừng */}
          <div className="mb-8">
            <h1 className="text-3xl font-space-grotesk font-bold text-white mb-2">
              Xin chào{profile?.username ? `, ${profile.username}` : ''}!
            </h1>
            <p className="text-[#9A9AA6]">
              Chào mừng bạn đến với TaskBee. Dashboard đang được xây dựng.
            </p>
          </div>

          {/* Card thông tin tài khoản */}
          <div className="grid gap-4">
            <div className="bg-[#161618] border border-[#1C1C1E] rounded-2xl p-6">
              <h2 className="font-space-grotesk font-semibold text-white mb-4 flex items-center gap-2">
                <Shield size={18} className="text-[#F5A623]" />
                Thông tin tài khoản
              </h2>
              
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#9A9AA6]" />
                  <div>
                    <p className="text-xs text-[#9A9AA6]">Email</p>
                    <p className="text-white">{user?.email || '—'}</p>
                  </div>
                </div>

                {/* Username */}
                <div className="flex items-center gap-3">
                  <User size={16} className="text-[#9A9AA6]" />
                  <div>
                    <p className="text-xs text-[#9A9AA6]">Tên đăng nhập</p>
                    <p className="text-white">{profile?.username || 'Chưa đặt'}</p>
                  </div>
                </div>

                {/* Trạng thái xác minh email */}
                <div className="flex items-center gap-3">
                  {user?.email_confirmed_at ? (
                    <CheckCircle size={16} className="text-[#4ADE80]" />
                  ) : (
                    <XCircle size={16} className="text-[#F87171]" />
                  )}
                  <div>
                    <p className="text-xs text-[#9A9AA6]">Trạng thái email</p>
                    <p className={user?.email_confirmed_at ? 'text-[#4ADE80]' : 'text-[#F87171]'}>
                      {user?.email_confirmed_at ? 'Đã xác minh' : 'Chưa xác minh'}
                    </p>
                  </div>
                </div>

                {/* Ngày tham gia */}
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-[#9A9AA6]" />
                  <div>
                    <p className="text-xs text-[#9A9AA6]">Tham gia từ</p>
                    <p className="text-white">
                      {profile?.created_at
                        ? new Date(profile.created_at).toLocaleDateString('vi-VN')
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder cho các tính năng sau */}
            <div className="bg-[#161618] border border-[#1C1C1E] rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4 opacity-30">🚧</div>
              <p className="text-[#9A9AA6]">Các tính năng đang được phát triển</p>
              <p className="text-sm text-[#4A4A50] mt-1">Số dư · Nhiệm vụ · Rút tiền</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
