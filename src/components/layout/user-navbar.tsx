"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut, FileText, Lightbulb } from "lucide-react"
import { useState } from "react"

export function UserNavbar() {
  const router = useRouter()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include", // Send the HttpOnly cookie
      })

      if (res.ok) {
        router.push("/")
      } else {
        console.error("Logout failed")
        setIsLoggingOut(false)
      }
    } catch (err) {
      console.error("Error during logout:", err)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>Project Evaluation</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard" className="text-sm font-medium hover:underline">
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Projects
            </span>
          </Link>
          <Link href="/ideas/submit" className="text-sm font-medium hover:underline">
            <span className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              Ideas
            </span>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm font-medium hover:underline flex items-center gap-1 relative"
          >
            {isLoggingOut ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1"></div>
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </>
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
