import { ProjectsGrid } from "@/components/projects/projects-grid"
import { Button } from "@/components/ui/button"
import { BarChart3, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-bold text-2xl md:text-3xl text-gray-800 tracking-tight">
              Projets
            </h1>
            <div className="flex gap-3">
              <Link href="/admin/project/new">
                <Button className="bg-gray-700 hover:bg-gray-800 text-white gap-2 shadow-lg rounded-full font-semibold">
                  <PlusCircle className="h-4 w-4" />
                  Créer un projet
                </Button>
              </Link>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-700"></div>
                  <p className="text-muted-foreground">Chargement des projets...</p>
                </div>
              </div>
            }
          >
            <ProjectsGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
