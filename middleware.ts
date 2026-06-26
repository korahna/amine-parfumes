import createMiddleware from 'next-intl/middleware'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['fr', 'ar']
const defaultLocale = 'fr'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
})

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Handle admin routes with Supabase auth
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isLoginPage = pathname === '/admin/login'

    if (!isLoginPage && !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    if (isLoginPage && user) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return supabaseResponse
  }

  // Handle locale routing for all other routes
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(fr|ar)/:path*', '/admin/:path*'],
}
