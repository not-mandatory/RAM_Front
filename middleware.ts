import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define routes that require authentication
const authRoutes = ["/evaluate", "/ideas", "/user"]

// Define prefix for admin routes
const ADMIN_PATH_PREFIX = "/admin"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from cookies or headers
  const token =
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.split(" ")[1]

  // Check if the path requires authentication
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = pathname.startsWith(ADMIN_PATH_PREFIX)

  // Redirect to login if accessing an auth or admin route without token
  if ((isAuthRoute || isAdminRoute) && !token) {
    const url = new URL("/", request.url)
    url.searchParams.set("callbackUrl", encodeURIComponent(pathname))
    return NextResponse.redirect(url)
  }

  // If token exists, verify admin role for admin routes
  if (token) {
    try {
      const isAdmin = checkIfUserIsAdmin(token)

      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    } catch (error) {
      const url = new URL("/", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Placeholder for decoding and verifying user role
function checkIfUserIsAdmin(token: string): boolean {
  // In real app: decode JWT and check role
  // const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // return decoded.role === 'admin'

  return token.includes("admin")
}

// Configure middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts, /images (static files)
     * 4. /login, /register (auth pages)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml (SEO files)
     */
    "/((?!api|_next|fonts|images|login|register|_vercel|favicon.ico|sitemap.xml).*)",
  ],
}
