import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = 'https://fwdhtdpzxvvjattbllfl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_xnvX6Ov1Y8DYUY8-AAcEsQ_4CBr36CB'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/login'
  const DIRECTOR_EMAIL = 'galettofermin@gmail.com'

  if (isAdminPath && !user) {
    return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
  }

  if (isAdminPath && user && user.email !== DIRECTOR_EMAIL) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isLoginPath && user?.email === DIRECTOR_EMAIL) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
