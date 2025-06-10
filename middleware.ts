import { updateSession } from '@/lib/supabase/session'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // In production, only allow access to the homepage
  if (process.env.NODE_ENV === 'production') {
    const { pathname } = request.nextUrl

    // Allow only the homepage ("/") in production
    if (pathname !== '/') {
      // Redirect all other routes to the homepage
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Continue with session handling
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
