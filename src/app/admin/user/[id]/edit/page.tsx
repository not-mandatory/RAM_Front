"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { UserForm } from "@/components/admin/user-form" // Adjust path as needed

// Import the User type from the same place as UserForm to ensure consistency
import type { User } from "@/types/user"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id

  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setError("User not found")
        setUser(undefined)
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchUser()
  }, [userId])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => router.push("/admin/user")}
          >
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <p>Données des évaluateurs non chargées.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Mettre à jour l'évaluateur</h1>
      <UserForm user={user} />
    </div>
  )
}
