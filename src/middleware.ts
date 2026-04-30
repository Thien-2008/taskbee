import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Cho phép callback route đi qua không bị chặn
  if (req.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }

  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  // Nếu chưa đăng nhập mà vào dashboard → redirect về login
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL('/auth?mode=login', req.url))
  }

  // Nếu đã đăng nhập mà vào auth page → redirect về dashboard
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
