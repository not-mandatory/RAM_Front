import type { ReactNode } from "react"
import { UserNavbar } from "@/components/layout/user-navbar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <UserNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
