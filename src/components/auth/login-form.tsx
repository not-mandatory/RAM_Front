"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Lock, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const loginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
  rememberMe: z.boolean(),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  callbackUrl?: string
  useRoleBasedRedirect?: boolean
}

export function LoginForm({ callbackUrl = "/", useRoleBasedRedirect = false }: LoginFormProps) {
  const { login, error: authError, loading } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setError(null)
    try {
      const redirectUrl = useRoleBasedRedirect ? "" : callbackUrl
      const success = await login(data.email, data.password, redirectUrl)
      if (!success) {
        setError("Email ou mot de passe invalide. Veuillez réessayer.")
      }
    } catch (err) {
      console.error("Erreur de connexion :", err)
      setError("Une erreur inattendue s'est produite. Veuillez réessayer.")
    }
  }

  return (
    <div className="grid gap-6">
      {(error || authError) && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error || authError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Adresse email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="prenom.nom@royalairmaroc.com"
                      {...field}
                      className="pl-10 bg-white border-gray-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Mot de passe</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="pl-10 bg-white border-gray-300 focus-visible:ring-red-500 focus-visible:border-red-500"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* Optionnel : Se souvenir de moi + mot de passe oublié */}
          {/* <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true ? true : false)
                    }}
                    className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none text-gray-700 cursor-pointer"
                  >
                    Se souvenir de moi
                  </Label>
                </div>
              )}
            />
            <Link href="#" className="text-sm font-medium hover:underline">
              Mot de passe oublié ?
            </Link>
          </div> */}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-50 px-2 text-gray-500">Ou</span>
        </div>
      </div>

      <div className="text-center text-sm">
        Vous n’avez pas de compte ?{" "}
        <Link href="/auth/signup" className="font-medium text-black-600 hover:text-green-700 hover:underline">
          Contactez l’administrateur
        </Link>
      </div>
    </div>
  )
}
