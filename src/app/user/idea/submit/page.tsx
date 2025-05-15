"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ideaFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.enum(["revenue", "customer", "operational", "sustainable"], {
    required_error: "Please select a category.",
  }),
})

type IdeaFormValues = z.infer<typeof ideaFormSchema>

export default function SubmitIdeaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mlFeedback, setMlFeedback] = useState<string | null>(null)

  const form = useForm<IdeaFormValues>({
    resolver: zodResolver(ideaFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
    },
  })

  async function onSubmit(data: IdeaFormValues) {
    setIsSubmitting(true)
    setMlFeedback(null)

    try {
      // Simulate API call and ML processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate ML model feedback (in a real app, this would come from the backend)
      
    } catch (error) {
      console.error("Error submitting idea:", error)
    } finally {
      setIsSubmitting(false)
    }
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
            <CardTitle className="text-center text-2xl">Idea Submitted Successfully!</CardTitle>
            <CardDescription className="text-center">
              Thank you for sharing your innovative idea. Our team will review it shortly.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-2">
            <Button onClick={() => setIsSuccess(false)} className="mr-4">
              Submit Another Idea
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/user/project">
          <Button variant="ghost" className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle>Submit Your Idea</CardTitle>
          </div>
          <CardDescription>
            Share your innovative ideas to improve our services. Our AI will analyze your submission to ensure it's
            properly categorized.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mlFeedback && (
            <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
              <AlertTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Feedback
              </AlertTitle>
              <AlertDescription>{mlFeedback}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a concise title for your idea" {...field} />
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
                        placeholder="Describe your idea in detail. What problem does it solve? How can it be implemented?"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category for your idea" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue Generation</SelectItem>
                        <SelectItem value="customer">Customer Experience</SelectItem>
                        <SelectItem value="operational">Operational Performance</SelectItem>
                        <SelectItem value="sustainable">Sustainable Development</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Our AI will analyze if your idea aligns with the selected category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  "Submit Idea"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
