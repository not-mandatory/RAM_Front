'use client'
import { getUserProjects } from "@/lib/projects"
import { ProjectCard } from "@/components/projects/project-card"

import { Project } from "@/types/type"
import { useEffect, useState } from "react" 


export default function DashboardPage() {

    const [projects, setProjects] = useState<Project[]>([])
    
    const [isLoading, setIsLoading] = useState(true)
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const data = await getUserProjects()
          console.log("Fetched projects:", data)
          setProjects(data)
          setIsLoading(false)
        } catch (error) {
          console.error("Failed to fetch projects:", error)
          setIsLoading(false)
        }
      }
  
      fetchProjects()
    }, [])


  return (
    
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="flex flex-col items-start gap-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
            <p className="text-muted-foreground">Sélectionnez un projet pour évaluer sa performance et fournir un feedback.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              <span className="ml-4 text-gray-500">Chargement des projets...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {projects.map((project: Project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

