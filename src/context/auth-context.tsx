"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define user type
type User = {
  id: string
  name: string
  email: string
  user_role: "admin" | "user"
}

// Define auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string, callbackUrl?: string) => Promise<boolean>
  logout: () => Promise<void>
  error: string | null
}

// Create auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  error: null,
})

// Auth provider props
type AuthProviderProps = {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/verify-token", {
          credentials: "include",
        })

        if (res.ok) {
          const userData = await res.json()
          console.log("User data from API:", userData);
          setUser({
            id: userData.id,  
            name: userData.name,
            email: userData.email,
            user_role: userData.user_role,
          })
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string, callbackUrl?: string): Promise<boolean> => {
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }

      const userData = await res.json()

      setUser({
        id: userData.id,
        name: userData.username,
        email: userData.email,
        user_role: userData.user_role,
      })

      // Determine where to redirect based on role and callbackUrl
      if (callbackUrl && callbackUrl !== "/" && callbackUrl !== "") {
        // If a specific callbackUrl is provided, use it
        router.push(callbackUrl)
      } else {
        // Otherwise, redirect based on user role
        const role = (userData.user_role || "").toString().toLowerCase().trim()
        if (role.includes("admin")) {
          console.log("admin role hhhh:", role)   
          router.push("/admin/project")
        } else {
          console.log("User role hhhh:", role)
          router.push("/user/project") // or wherever regular users should go
        }
      }

      return true

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, error }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)
