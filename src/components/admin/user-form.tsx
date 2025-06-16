"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createUser } from "@/lib/users"

const userSchema = z.object({
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().optional(), // Allow empty for update
  position: z.string().min(1, { message: "Position is required." }),
  direction: z.string().min(1, { message: "Direction is required." }),
})

type UserFormValues = z.infer<typeof userSchema>

type User = {
  id: string
  username: string
  email: string
  role: "admin" | "user"
  position: string
  direction: string
  createdAt: string
}

interface UserFormProps {
  user?: User
}

export function UserForm({ user }: UserFormProps = {}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      position: user?.position || "",
      direction: user?.direction || "",
    },
  })

  async function onSubmit(values: UserFormValues) {
    setIsSubmitting(true)
    setError(null)
    try {
      if (user) {
        // UPDATE user
        // Only send password if filled
        const updateBody: any = {
          username: values.username,
          email: values.email,
          position: values.position,
          direction: values.direction,
        }
        if (values.password && values.password.trim() !== "") {
          updateBody.password = values.password
        }
        const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateBody),
        })
        if (!res.ok) {
          const data = await res.json()
          setError(data.error || "Failed to update user.")
          setIsSubmitting(false)
          return
        }
      } else {
        // CREATE user
        console.log("inside create user function")
        await createUser(values)
        
      }
      router.push("/admin/user")
      router.refresh()
    } catch (error) {
      setError("Failed to save user.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input placeholder="Entrer le nom complet" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse mail</FormLabel>
                <FormControl>
                  <Input placeholder="Entrez l’adresse e-mail de l’évaluateur" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{user ? "Nouveau mot de passe (laisser vide pour conserver l’actuel)" : "Password"}</FormLabel>
                <FormControl>
                  <Input placeholder="Entrer mot de passe" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Entrer la position de l'évaluateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direction</FormLabel>
                <FormControl>
                  <Input placeholder="Entrer la direction/département de l'évaluateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/user")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  {user ? "Mise à jour en cours..." : "Création en cours..."}
                </>
              ) : user ? (
                "Mettre à jour l’évaluateur"
              ) : (
                "Créer un nouvel évaluateur"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
