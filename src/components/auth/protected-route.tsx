"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to login
      router.push("/auth/login")
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      // User doesn't have the required role, redirect to unauthorized
      router.push("/unauthorized")
    }
  }, [user, loading, router, requiredRole])

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // If user is authenticated and has the required role (or no role is required), render children
  if (user && (!requiredRole || user.role === requiredRole)) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
}
