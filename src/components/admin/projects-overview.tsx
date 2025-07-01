"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ThumbsUp, ThumbsDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ProjectStats {
  avg_qst: number
  mean_qsts: number[]
  no_count: number
  project_title: string
  yes_count: number
}

interface ProjectsOverviewProps {
  projectStats: ProjectStats[]
}

export function ProjectsOverview({ projectStats }: ProjectsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projectStats.filter((project) =>
    project.project_title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher un projet..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, projectIndex) => (
            <ProjectCard key={`project-overview-${projectIndex}-${project.project_title}`} project={project} />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground col-span-full">
            Aucun projet ne correspond à votre recherche.
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectStats }) {
  const totalEvaluations = project.yes_count + project.no_count
  const recommendationRate = totalEvaluations > 0 ? Math.round((project.yes_count / totalEvaluations) * 100) : 0

  const questionNames = ["Désirabilité", "Viabilité", "Faisabilité", "Alignement Corporate"]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.project_title}</CardTitle>
            <CardDescription className="mt-1">
              {totalEvaluations} évaluation{totalEvaluations > 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Badge
            className={
              recommendationRate >= 70
                ? "bg-green-100 text-green-800"
                : recommendationRate >= 50
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }
          >
            {recommendationRate}% Recommandé
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Note Globale</span>
              <span className="font-medium">{project.avg_qst.toFixed(1)}/5</span>
            </div>
            <Progress value={project.avg_qst * 20} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {project.mean_qsts.map((value, index) => (
              <div key={`${project.project_title}-criteria-${index}-${questionNames[index]}`} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{questionNames[index]}</span>
                  <span>{value.toFixed(1)}</span>
                </div>
                <Progress value={value * 20} className="h-1.5" />
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-2 border-t">
            <div className="flex items-center gap-1.5 text-green-600">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{project.yes_count}</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-600">
              <ThumbsDown className="h-4 w-4" />
              <span className="font-medium">{project.no_count}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
