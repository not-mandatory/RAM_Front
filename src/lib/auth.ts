import jwtDecode from "jwt-decode"

// Define the JWT payload structure
type JwtPayload = {
  sub: string
  name: string
  email: string
  role: string
  exp: number
  iat: number
}

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const token = localStorage.getItem("access_token")
  if (!token) {
    return false
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000

    // Check if token is expired
    if (decoded.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("access_token")
      return false
    }

    return true
  } catch (error) {
    // Invalid token
    localStorage.removeItem("access_token")
    return false
  }
}

// Check if the user has admin role
export function isAdmin(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const token = localStorage.getItem("access_token")
  if (!token) {
    return false
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.role === "admin"
  } catch (error) {
    return false
  }
}

// Get the current user from the token
export function getCurrentUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("access_token")
  if (!token) {
    return null
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}
