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
import {
  Plane,
  ClipboardCheck,
  Lightbulb,
  LogOut,
  Menu,
  Globe,
  ChevronDown,
  Languages,
} from "lucide-react"

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
      console.error("Erreur lors de la déconnexion :", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return ""
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return parts.map((part) => part[0]).join("").toUpperCase()
  }

  const navItems = [
    {
      name: "Projets",
      href: "/user/project",
      icon: <Plane className="h-4 w-4" />,
    },
    // {
    //   name: "Soumettre une idée",
    //   href: "/user/idea/submit",
    //   icon: <Lightbulb className="h-4 w-4" />,
    // },
    {
      name: "Historique d'évaluation",
      href: "/user/evaluation",
      icon: <ClipboardCheck className="h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          {/* Logo */} 
          <Link href="/user/project" className="hidden items-center space-x-2 md:flex">
            <div className="relative h-16 w-40">
              <Image
                src="/images/ram-logo.png"
                alt="Logo Royal Air Maroc"
                fill
                className="object-contain object-left"
                sizes="160px"
              />
            </div>
          </Link>

          {/* Menu mobile */} 
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="flex items-center space-x-2 mb-8">
                <div className="relative">
                  <div className="h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                    <Plane className="h-5 w-5 text-white transform -rotate-45" />
                  </div>
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

          {/* Navigation desktop */} 
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
          {/* Sélecteur de langue */} 
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
                <span>Arabe</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Languages className="h-4 w-4" />
                <span>Anglais</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menu utilisateur */} 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 gap-1 pl-0">
                <Avatar className="h-8 w-8 border border-muted">
                  <AvatarFallback className="bg-red-100 text-red-800">
                    {getInitials(user?.name)}
                  </AvatarFallback>
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
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "utilisateur@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-red-600"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Déconnexion...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
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
