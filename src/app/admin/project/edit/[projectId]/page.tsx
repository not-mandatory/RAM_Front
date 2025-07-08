"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/projects/project-form"
import { getProjectDetails } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react";

interface EditProjectPageProps {
  params: { projectId: string }
}

// Mapper la réponse API vers les props du formulaire de projet
function mapApiProjectToForm(apiProject: any) {
  return {
    id: apiProject.id?.toString(),
    title: apiProject.title || "",
    description: apiProject.description || "",
    category: apiProject.category || undefined,
    createdAt: apiProject.createdAt ?? "",
    image: apiProject.image_path || "",
    teamLeadId: apiProject.team?.team_leader?.id || undefined,
    teamMembers: apiProject.team?.team_members
      ? apiProject.team.team_members.map((member: any) => ({ userId: member.id }))
      : [],
  }
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const unwrappedParams = React.use(params)
  const { projectId } = unwrappedParams

  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const apiProject = await getProjectDetails(projectId)
        if (!apiProject) {
          setError("Projet introuvable ou impossible à charger.")
          return
        }
        setProject(mapApiProjectToForm(apiProject))
      } catch (err) {
        setError("Échec du chargement des données du projet. Veuillez réessayer.")
      } finally {
        setIsLoading(false)
      }
    }
    if (projectId) fetchProject()
  }, [projectId])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/project")}>
            Retour aux projets
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <p>Pas de données de projet disponibles. Veuillez vérifier l’URL ou réessayer.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* <div className="mb-6">
        <Link href={`/admin/project`}>
          <Button variant="ghost" className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Retour aux projets
          </Button>
        </Link>
      </div> */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifier Projet</h1>
      </div>
      <Suspense
            fallback={
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-700"></div>
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              </div>
            }
          >
          <ProjectForm project={project} />          
       </Suspense>

            
    </div>
  )
}
