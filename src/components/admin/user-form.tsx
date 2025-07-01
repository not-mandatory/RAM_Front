"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createUser } from "@/lib/users"

const userSchema = z.object({
  username: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide." }),
  password: z.string().optional(),
  position: z.string().min(1, { message: "Le poste est obligatoire." }),
  direction: z.string().min(1, { message: "Le département est obligatoire." }),
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
        // Mettre à jour l'utilisateur
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
          setError(data.error || "Échec de la mise à jour de l'utilisateur.")
          setIsSubmitting(false)
          return
        }
      } else {
        // Créer un nouvel utilisateur
        await createUser(values)
      }
      router.push("/admin/user")
      router.refresh()
    } catch (error) {
      setError("Échec de l'enregistrement de l'utilisateur.")
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
                  <Input placeholder="Entrez le nom complet" {...field} />
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
                <FormLabel>Adresse email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Entrez l'adresse email"
                    type="email"
                    {...field}
                  />
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
                <FormLabel>
                  {user
                    ? "Nouveau mot de passe (laisser vide pour garder l'actuel)"
                    : "Mot de passe"}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Entrez le mot de passe" type="password" {...field} />
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
                  <Input
                    placeholder="Entrez le département ou la division de l'évaluateur"
                    {...field}
                  />
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
                  <Input placeholder="Entrez le poste de l'évaluateur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/user")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  {user ? "Mise à jour..." : "Création..."}
                </>
              ) : user ? (
                "Mettre à jour l'évaluateur"
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
