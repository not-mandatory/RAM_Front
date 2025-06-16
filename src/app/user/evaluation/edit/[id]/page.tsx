"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/projects/star-rating"
import { CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

// Define the schema for form validation
const evaluationSchema = z.object({
  q1: z.number().min(1, { message: "Veuillez évaluer la désirabilité (1-5)." }),
  q2: z.number().min(1, { message: "Veuillez évaluer la viabilité (1-5)." }),
  q3: z.number().min(1, { message: "Veuillez évaluer la faisabilité (1-5)." }),
  q4: z.number().min(1, { message: "Veuillez évaluer l'alignement corporate (1-5)." }),
  q5: z.boolean({
    required_error: "Veuillez indiquer si le projet doit continuer.",
  }),
})

type EvaluationFormValues = z.infer<typeof evaluationSchema>

interface Evaluation {
  id: string
  projectId: string
  projectName: string
  date: string // ISO string format
  ratings: {
    q1: number
    q2: number
    q3: number
    q4: number
    q5: boolean // Backend converts 0/1 to true/false
  }
}

export default function EditEvaluationPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use() to fix the warning
  const unwrappedParams = React.use(params as any)
  const evaluationId = unwrappedParams.id

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  // Initialize the form with default values and resolver
  const form = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: false, // Default to false for boolean input
    },
  })

  // Effect hook to fetch the evaluation data when the component mounts or evaluationId changes
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setError(null) // Clear previous errors
        const response = await fetch(`http://localhost:5000/api/user/evaluations/${evaluationId}`, {
          credentials: "include", // Essential for sending HTTP-only cookies
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch evaluation details.")
        }

        const data = await response.json()
        setEvaluation(data.evaluation)

        // Set form values with the fetched data
        form.reset({
          q1: data.evaluation.ratings.q1,
          q2: data.evaluation.ratings.q2,
          q3: data.evaluation.ratings.q3,
          q4: data.evaluation.ratings.q4,
          q5: data.evaluation.ratings.q5,
        })
      } catch (error: any) {
        console.error("Error fetching evaluation:", error)
        setError(error.message || "Impossible de charger l'évaluation. Veuillez réessayer plus tard.")
      } finally {
        setIsLoading(false)
      }
    }

    if (evaluationId) {
      // Only fetch if evaluationId is available
      fetchEvaluation()
    }
  }, [evaluationId, form]) // Dependencies: re-run if evaluationId or form instance changes

  // Handler for form submission
  const handleSubmit = async (data: EvaluationFormValues) => {
    setIsSubmitting(true)
    setError(null) // Clear previous errors

    try {
      const response = await fetch(`http://localhost:5000/api/user/evaluations/${evaluationId}`, {
        method: "PUT", // Use PUT for updating an existing resource
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ratings: data }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Update failed. Please try again.")
      }

      const result = await response.json()
      console.log("Evaluation updated successfully:", result)

      setIsSubmitted(true) // Set submission success state

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/user/evaluation")
        router.refresh() // Refresh data on the evaluations list page
      }, 2000)
    } catch (error: any) {
      console.error("Update error:", error.message)
      setError(error.message || "Une erreur est survenue lors de la mise à jour de l'évaluation.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Render logic based on states ---

  // Show success message after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Évaluation mise à jour !</h3>
              <p className="text-muted-foreground mb-6">Vos modifications ont été enregistrées avec succès.</p>
              <Button onClick={() => router.push("/user/evaluation")}>Retour à l'historique des évaluations</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="mb-6">
            <Link href="/user/evaluation">
              <Button
                variant="ghost"
                className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'historique
              </Button>
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-8 mt-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Form content once data is loaded
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Modifier l'évaluation</h1>
                <p className="text-muted-foreground mt-1">
                  Projet:{" "}
                  <span className="font-medium text-foreground">{evaluation?.projectName || "Chargement..."}</span>
                </p>
              </div>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Instructions</CardTitle>
                  <CardDescription>
                    Modifiez votre évaluation en ajustant les notes ci-dessous. Toutes les questions sont obligatoires.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Vos évaluations aident à déterminer quels projets méritent d'être poursuivis. Veuillez évaluer
                    chaque critère sur une échelle de 1 à 5 étoiles, 5 étant la note la plus élevée.
                  </p>
                </CardContent>
              </Card>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    {/* Question 1: Désirabilité */}
                    <FormField
                      control={form.control}
                      name="q1"
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

                    {/* Question 2: Viabilité */}
                    <FormField
                      control={form.control}
                      name="q2"
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

                    {/* Question 3: Faisabilité */}
                    <FormField
                      control={form.control}
                      name="q3"
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

                    {/* Question 4: Alignement Corporate */}
                    <FormField
                      control={form.control}
                      name="q4"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium">
                            4. Alignement Corporate : le projet est-il aligné avec la stratégie de la RAM et a-t-il un
                            sponsor prêt à le suivre jusqu'au bout ?
                          </FormLabel>
                          <FormControl>
                            <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Question 5 (Boolean) */}
                    <FormField
                      control={form.control}
                      name="q5"
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/user/evaluation")}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Mise à jour en cours...
                        </>
                      ) : (
                        "Mettre à jour l'évaluation"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
