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

// Define the schema for form validation
const evaluationSchema = z.object({
  qst_1: z.number().min(1, { message: "Veuillez évaluer la désirabilité" }),
  qst_2: z.number().min(1, { message: "Veuillez évaluer la viabilité" }),
  qst_3: z.number().min(1, { message: "Veuillez évaluer la faisabilité" }),
  qst_4: z.number().min(1, { message: "Veuillez évaluer l'alignement corporate" }),
  qst_bool: z.boolean({
    required_error: "Veuillez indiquer si le projet doit continuer",
  }),
})

type EvaluationFormValues = z.infer<typeof evaluationSchema>

interface EvaluationFormProps {
  projectId: string
}

export function EvaluationForm({ projectId }: EvaluationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize the form with default values
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      qst_1: 0,
      qst_2: 0,
      qst_3: 0,
      qst_4: 0,
      // No default value for qst_bool to ensure user makes a selection
    },
  })

  const handleSubmit = async (data: EvaluationFormValues) => {
    setIsSubmitting(true)

    try {
      console.log("Evaluation submitted successfully:", data)
      console.log("Project ID:", projectId)

      

      try {
        const response = await fetch(`/api/project/evaluate/${projectId}`, {
          method: "POST",
          credentials: "include",
          // Include credentials to send cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ratings: data }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Evaluation failed")
        }

        const result = await response.json()
        console.log("Evaluation successful:", result)

        // ✅ Only mark as submitted if everything went well
        setIsSubmitted(true)

        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/user/project")
          router.refresh()
        }, 6000)
      } catch (error: any) {
        console.error("Evaluation error:", error.message)
        // Optional: Show error to user
      }
    } catch (error) {
      console.error("Failed to submit evaluation:", error)
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
        <h3 className="text-xl font-semibold mb-2">Évaluation soumise !</h3>
        <p className="text-muted-foreground mb-6">Merci pour votre retour.</p>
        <Button onClick={() => router.push("/user/project")}>Retour au votre espace.</Button>
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
            name="qst_1"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  1. Désirabilité : le projet semble-t-il résoudre un problème important ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 2 */}
          <FormField
            control={form.control}
            name="qst_2"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  2. Viabilité : le projet a-t-il un Business Model à haut potentiel?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 3 */}
          <FormField
            control={form.control}
            name="qst_3"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  3. Faisabilité : le projet semble-t-il réalisable techniquement au sein de la RAM?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 4 */}
          <FormField
            control={form.control}
            name="qst_4"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-medium">
                  4. Alignement Corporate : le projet est-il aligné avec la stratégie de la RAM et a-t-il un sponsor
                  prêt à le suivre jusqu'au bout ?
                </FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Question 5 (Boolean) - Required with no default selection */}
          <FormField
            control={form.control}
            name="qst_bool"
            render={({ field }) => (
              <FormItem className="space-y-3 pt-2">
                <FormLabel className="text-base font-medium">
                  5. Selon vous le projet doit-il continuer ? <span className="text-red-500">*</span>
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
