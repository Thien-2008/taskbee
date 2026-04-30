import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const { username } = await request.json()

  if (!username || typeof username !== 'string') {
    return NextResponse.json({ error: 'Thiếu tên đăng nhập' }, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('username', username.trim())
    .single()

  if (error || !data?.email) {
    return NextResponse.json({ error: 'Tên đăng nhập không tồn tại' }, { status: 404 })
  }

  return NextResponse.json({ email: data.email })
}
