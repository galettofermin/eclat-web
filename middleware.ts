import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // /admin/* sin sesión → redirigir a /login
  if (isAdminPath && !user) {
    return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
  }

  // /admin/* con sesión pero no es director → redirigir al inicio
  if (isAdminPath && user && user.email !== DIRECTOR_EMAIL) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Director logueado en /login → redirigir al admin
  if (isLoginPath && user?.email === DIRECTOR_EMAIL) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
