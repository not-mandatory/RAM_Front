import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ClipboardCheck, BarChart3, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">ProjectEval</span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button>Sign in</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Evaluate Projects with Confidence</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              A simple and intuitive platform for evaluating project performance and providing valuable feedback.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Browse Projects</h3>
                <p className="text-muted-foreground">View all your assigned projects in one convenient dashboard.</p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Provide Feedback</h3>
                <p className="text-muted-foreground">Answer simple questions to evaluate project performance.</p>
              </div>

              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-muted-foreground">Monitor project improvements based on evaluation results.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ProjectEval. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
