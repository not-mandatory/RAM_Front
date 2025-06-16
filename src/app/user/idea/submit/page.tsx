"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Lightbulb,
  ArrowLeft,
  Sparkles,
  Brain,
  CheckCircle,
  Edit3,
} from "lucide-react"
import Link from "next/link"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const ideaFormSchema = z.object({
  title: z.string().min(5, {
    message: "Le titre doit contenir au moins 5 caractères.",
  }),
  description: z.string().min(20, {
    message: "La description doit contenir au moins 20 caractères.",
  }),
  category: z.string().optional(),
})

type IdeaFormValues = z.infer<typeof ideaFormSchema>

const categories = [
  "Génération de revenus",
  "Expérience client",
  "Performance opérationnelle",
  "Développement durable"
]

export default function SubmitIdeaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [suggestedCategory, setSuggestedCategory] = useState<string>("")

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  })

  async function onAnalyze(data: Pick<IdeaFormValues, "title" | "description">) {
    setIsAnalyzing(true)

    

    

    try {
      const res = await fetch("http://127.0.0.1:5000/api/idea/analyze", {
        method: "POST",
        credentials: "include", // Include credentials for CORS
        headers: {
          "Content-Type": "application/json",
           // Include credentials for CORS
           
          
        },
        body: JSON.stringify(data),
      })

      const jsonResponse = await res.json()
      if (res.ok) {
        setSuggestedCategory(jsonResponse.suggestedCategory)
        form.setValue("category", jsonResponse.suggestedCategory)
        setCurrentStep(2)
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse :", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function onSubmit(data: IdeaFormValues) {
    setIsSubmitting(true)

    

    try {
      const res = await fetch("/api/idea/submit", {
        method: "POST",
        credentials: "include", // Include credentials for CORS
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(data),
      })

      const jsonResponse = await res.json()
      if (res.ok) {
        setIsSuccess(true)
        setCurrentStep(3)
        form.reset()
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleStepOneSubmit(data: IdeaFormValues) {
    onAnalyze({ title: data.title, description: data.description })
  }

  function resetForm() {
    setCurrentStep(1)
    setSuggestedCategory("")
    setIsSuccess(false)
    form.reset()
  }

  if (isSuccess) {
    return (
      <div className="container max-w-2xl mx-auto py-10 px-4">
        <Card className="border-green-200">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Idée soumise avec succès !
            </CardTitle>
            <CardDescription className="text-center">
              Merci pour votre contribution. Notre équipe examinera votre idée très bientôt.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2">
            <Button onClick={resetForm} className="mr-4">
              Soumettre une autre idée
            </Button>
            <Link href="/user/project">
              <Button variant="outline">Retour à la page d'acceuil</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
   <div className="min-h-screen bg-gray-100 py-10">
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
      {/* <div className="mb-6">
        <Link href="/user/project">
          <Button variant="ghost" className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Retour à la page d'accueil
          </Button>
        </Link>
      </div> */}

      {/* Indicateur de progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1
            </div>
            <span className="text-sm font-medium">Décrire l'idée</span>
          </div>
          <div className={`h-px flex-1 mx-4 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`}></div>
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2
            </div>
            <span className="text-sm font-medium">Confirmer la catégorie</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            {currentStep === 1 ? (
              <Lightbulb className="h-5 w-5 text-primary" />
            ) : (
              <Brain className="h-5 w-5 text-primary" />
            )}
            <CardTitle>
              {currentStep === 1 ? "Soumettre une idée" : "Analyse IA"}
            </CardTitle>
          </div>
          <CardDescription>
            {currentStep === 1
              ? "Partagez vos idées innovantes pour améliorer nos services. L'IA vous aidera à choisir la bonne catégorie."
              : "Voici la catégorie suggérée par l'IA. Vous pouvez la confirmer ou en sélectionner une autre."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {currentStep === 1 ? (
              <form onSubmit={form.handleSubmit(handleStepOneSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'idée</FormLabel>
                      <FormControl>
                        <Input placeholder="Donnez un titre concis à votre idée" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre idée en détail. Quel problème résout-elle ? Comment peut-elle être mise en œuvre ?"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyser l'idée
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Analyse terminée</AlertTitle>
                  <AlertDescription>
                    Catégorie suggérée par l'IA : <strong>{suggestedCategory}</strong>
                    <br />
                    
                  </AlertDescription>
                </Alert>

                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">TITRE</h4>
                    <p className="font-medium">{form.getValues("title")}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">DESCRIPTION</h4>
                    <p className="text-sm">{form.getValues("description")}</p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Choix de la catégorie
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez ou confirmez la catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              <div className="flex items-center gap-2">
                                {category === suggestedCategory && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                                {category}
                                {category === suggestedCategory && (
                                  <span className="text-xs text-green-600">(Suggéré par IA)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Acceptez la suggestion ou choisissez une autre catégorie.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Modifier
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Soumission en cours...
                      </>
                    ) : (
                      "Soumettre l'idée"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
    </div>
  )
}
