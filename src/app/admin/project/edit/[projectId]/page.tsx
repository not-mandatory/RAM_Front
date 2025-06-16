"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectForm } from "@/components/projects/project-form"
import { getProjectDetails } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditProjectPageProps {
  params: { projectId: string }
}

// Map API response to ProjectForm props
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
          setError("Project not found or could not be loaded.")
          return
        }
        setProject(mapApiProjectToForm(apiProject))
      } catch (err) {
        setError("Failed to load project data. Please try again.")
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
            Return to Projects
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

      <ProjectForm project={project} />
    </div>
  )
}
