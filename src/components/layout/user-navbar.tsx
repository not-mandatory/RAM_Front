"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Plane, ClipboardCheck, Lightbulb, User, LogOut, Menu, Globe, Bell, ChevronDown, Languages } from "lucide-react"

interface UserNavbarProps {
  user?: {
    name: string
    email: string
    role: string
  }
  onLogout?: () => void
}

export function UserNavbar({ user: propUser, onLogout }: UserNavbarProps) {
  const pathname = usePathname()
  const [notifications] = useState(3)

  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (err) {
      console.error("Error during logout:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get user initials for avatar
  const getInitials = (name?: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[1] ? part[0] + part[1] : part[0]) // Take first two letters if available
    .join("")
    .toUpperCase();
};

  const navItems = [
    // {
    //   name: "Évaluer",
    //   href: "/dashboard",
    //   icon: <ClipboardCheck className="h-4 w-4" />,
    // },
    {
      name: "Projets",
      href: "/user/project",
      icon: <Plane className="h-4 w-4" />,
    },
    {
      name: "Soumettre une Idée",
      href: "/user/idea/submit",
      icon: <Lightbulb className="h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          {/* Logo */}
          <Link href="/user/project" className="hidden items-center space-x-2 md:flex">
            <div className="relative">
              <div className="h-9 w-9 overflow-hidden  flex items-center justify-center">
                <Image
                    src="/images/ram-logo.png"
                    alt="Royal Air Maroc Logo"
                    width={50}
                    height={36}
                    className="object-contain"
                    priority
                  />              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Royal Air Maroc
              </span>
              <span className="text-[10px] leading-none text-muted-foreground">RAM</span>
            </div>
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center space-x-2 mb-8">
                <div className="relative">
                  <div className="h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white transform -rotate-45" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Royal Air Maroc
                  </span>
                  <span className="text-[10px] leading-none text-muted-foreground">RAM</span>
                </div>
              </div>
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-red-50 text-red-700 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-700",
                  pathname === item.href ? "text-red-700" : "text-muted-foreground",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Language selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" />
                <span>Français</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" />
                <span>العربية</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" />
                <span>English</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {notifications}
              </span>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 gap-1 pl-0">
                <Avatar className="h-8 w-8 border border-muted">
                  <AvatarFallback className="bg-red-100 text-red-800">{getInitials(user?.name)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-flex text-sm font-normal">
                  {user?.name || "Utilisateur"}
                  <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Utilisateur"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon Profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex cursor-pointer items-center text-red-600"
                onClick={handleLogout}
                  disabled={isLoggingOut}
                  
                >
                  {isLoggingOut ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Déconnexion</span>
                    </>
                  )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
