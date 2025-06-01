import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define routes that require authentication
const authRoutes = ["/evaluate", "/ideas", "/user"]

// Define prefix for admin routes
const ADMIN_PATH_PREFIX = "/admin"

// Flask backend URL
const FLASK_API_URL = "http://localhost:5000"



export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware running for path:", pathname)


 console.log("🍪 MIDDLEWARE COOKIE DEBUG:")
 console.log("Path:", pathname)
 console.log("Cookies header:", request.headers.get("cookie"))
 console.log("All cookies:", request.cookies.getAll())

console.log("Middleware running for path:", pathname)

  console.log("==== MIDDLEWARE DEBUG ====")
  console.log("Current URL path:", pathname)
  console.log("isUserRoute check:", pathname.startsWith("/user"))
  console.log("Request method:", request.method)
  console.log("Request headers:", Object.fromEntries(request.headers))
  console.log("========================")

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  const isAdminRoute = pathname.startsWith(ADMIN_PATH_PREFIX)
  const isUserRoute = pathname.startsWith("/user")

  console.log("Path type:", { isAuthRoute, isAdminRoute, isUserRoute })

  if (isAuthRoute || isAdminRoute || isUserRoute) {

    console.log("afyrrt Path type:", { isAuthRoute, isAdminRoute, isUserRoute })
    try {
      // Log the cookies being sent
      console.log("Cookies being sent:", request.headers.get("cookie"))

      const response = await fetch(`${FLASK_API_URL}/api/verify-token`, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      })

      if (!response.ok) {
        console.log("Token verification failed:", response.status)
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Get user data from response
      const userData = await response.json()
      console.log("User data from API:", userData)

      // Get the role and log the exact value for debugging
      const rawRole = userData.user_role
      console.log("Raw role value:", rawRole, "Type:", typeof rawRole)

      // Normalize the role for comparison (handle null/undefined and convert to lowercase)
      const role = (rawRole || "").toString().toLowerCase().trim()
      console.log("Normalized role for comparison:", role)
      // Check if the role is empty after normalization
      // Check admin routes with more flexible comparison
      if (isAdminRoute) {
        
        console.log("Checking admin access with role:", role)
        // Check if role contains "admin" instead of exact match
        if (!role.includes("admin")) {
          console.log("Unauthorized access to admin route by role:", role)
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
      }

      // For user routes, block admins from accessing them
      if (isUserRoute) {
        console.log("User route accessed with role:", role)
        // Check if the role contains "admin" - if so, block access
        if (role.includes("admin")) {
          console.log("Admin attempting to access user route - redirecting to unauthorized")
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }

        // Also check if the role doesn't contain "user" and isn't admin
        // This handles cases where the role is neither admin nor user
        if (!role.includes("user") && !role.includes("admin")) {
          console.log("Non-user, non-admin role attempting to access user route:", role)
          return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
      }
    } catch (error) {
      console.error("Auth verification error:", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Configure middleware matcher
export const config = {
  matcher: ["/((?!api|_next|fonts|images|auth|_vercel|favicon.ico|sitemap.xml).*)"],
}
