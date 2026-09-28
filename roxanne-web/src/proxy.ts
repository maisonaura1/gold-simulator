import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, readSession } from '@/lib/session'

/**
 * Optimistic gate for the dashboard: bounces visitors without a valid signed
 * cookie to the login page. Every admin page, Server Action and Route Handler
 * still verifies the session itself (see lib/auth.ts) — this is not the only check.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value)
  if (session) return NextResponse.next()

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const login = new URL('/admin/login', request.url)
  if (pathname !== '/admin') login.searchParams.set('next', pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
