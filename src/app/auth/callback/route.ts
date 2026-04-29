import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookies().get(name)?.value
          },
          set(name, value, options) {
            cookies().set(name, value, options)
          },
          remove(name, options) {
            cookies().set(name, '', { ...options, maxAge: 0 })
          },
        },
      }
    )
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Chuyển thẳng vào Dashboard sau khi xác nhận email thành công
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
