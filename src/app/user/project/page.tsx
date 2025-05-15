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
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col items-start gap-4 md:gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground">Select a project to evaluate its performance and provide feedback.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
           {projects.map((project: Project) => (
           <ProjectCard key={project.id} project={project} />
           ))}
        </div>

      </div>
    </div>
  )
}

