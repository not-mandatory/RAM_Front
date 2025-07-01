"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/projects/star-rating"
import { CheckCircle2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const evaluationSchema = z.object({
  q1: z.number().min(1, { message: "Veuillez noter l'attractivité" }),
  q2: z.number().min(1, { message: "Veuillez noter la viabilité" }),
  q3: z.number().min(1, { message: "Veuillez noter la faisabilité" }),
  q4: z.number().min(1, { message: "Veuillez noter l'alignement stratégique" }),
  q5: z.boolean({
    required_error: "Veuillez indiquer si le projet doit continuer",
  }),
  comment: z.string().optional(),
})

type EvaluationFormValues = z.infer<typeof evaluationSchema>

interface EvaluationFormProps {
  projectId: string
}

export function EvaluationForm({ projectId }: EvaluationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      comment: "",
    },
  })

  const handleSubmit = async (data: EvaluationFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/project/evaluate/${projectId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ratings: data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Échec de l’évaluation")
      }

      const result = await response.json()
      console.log("Évaluation réussie :", result)

      setIsSubmitted(true)

      setTimeout(() => {
        router.push("/user/project")
        router.refresh()
      }, 6000)
    } catch (error: any) {
      console.error("Erreur lors de l’évaluation :", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Évaluation envoyée !</h3>
        <p className="text-muted-foreground mb-6">Merci pour votre retour.</p>
        <Button onClick={() => router.push("/user/project")}>Retour au tableau de bord</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="space-y-6">
          {/* Question 1 */}
          <FormField
            control={form.control}
            name="q1"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  1. Attractivité : Le projet répond-il à un problème important ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 2 */}
          <FormField
            control={form.control}
            name="q2"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  2. Viabilité : Le projet dispose-t-il d’un modèle économique prometteur ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 3 */}
          <FormField
            control={form.control}
            name="q3"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  3. Faisabilité : Le projet semble-t-il techniquement réalisable au sein de RAM ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 4 */}
          <FormField
            control={form.control}
            name="q4"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  4. Alignement stratégique : Le projet est-il aligné avec la stratégie de RAM et soutenu par un sponsor ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 5 */}
          <FormField
            control={form.control}
            name="q5"
            render={({ field }) => (
              <FormItem className="space-y-3 pt-2">
                <FormLabel className="text-base font-medium">
                  5. Selon vous, le projet doit-il continuer ? <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={field.value === true ? "default" : "outline"}
                    className={`w-24 ${field.value === true ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={() => field.onChange(true)}
                  >
                    Oui
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === false ? "default" : "outline"}
                    className={`w-24 ${field.value === false ? "bg-red-600 hover:bg-red-700" : ""}`}
                    onClick={() => field.onChange(false)}
                  >
                    Non
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Commentaire libre */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="space-y-3 pt-2">
                <FormLabel className="text-base font-medium">Commentaire supplémentaire (facultatif)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Partagez vos idées, suggestions ou préoccupations concernant ce projet..."
                    className="min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Envoi en cours...
              </>
            ) : (
              "Soumettre l’évaluation"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
