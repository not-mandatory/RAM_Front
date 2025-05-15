import type { ReactNode } from "react"
import { AdminNavbar } from "@/components/layout/admin-navbar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
