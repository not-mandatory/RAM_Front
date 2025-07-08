"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProjectStatisticsTable } from "@/components/admin/project-statistics-table"
import { ProjectsOverview } from "@/components/admin/projects-overview"
import { ProjectsSummaryTable } from "@/components/admin/projects-summary-table"
import { ProjectCommentsTable } from "@/components/admin/project-comments-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllProjectEvaluations, getProjectStatistics } from "@/lib/projects"
import { Suspense } from "react";

// Définition du type pour la réponse API
interface EvaluationResponse {
  answers: number[]
  project_title: string
  username: string
}

// Transformation de la réponse API vers notre format interne
interface FormattedEvaluation {
  id: string
  projectName: string
  userName: string
  quality: number
  timeliness: number
  communication: number
  usability: number
  wouldRecommend: boolean
  date: string
}

// Nouveau type pour les statistiques projets provenant de l'API
interface ProjectStats {
  avg_qst: number
  mean_qsts: number[]
  no_count: number
  project_title: string
  yes_count: number
}

export default function StatisticsPage() {
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get("search") || ""  // always dynamic
  const [evaluationsData, setEvaluationsData] = useState<FormattedEvaluation[]>([])
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("table")

  // charger les données au montage
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [apiResponse, statsResponse] = await Promise.all([
          getAllProjectEvaluations(),
          getProjectStatistics()
        ])
        const formattedEvaluations = formatEvaluations(apiResponse)
        setEvaluationsData(formattedEvaluations)
        setProjectStats(statsResponse)
      } catch (error) {
        console.error("Erreur lors de la récupération des données statistiques :", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-2">
        <div className="container mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
     
      <div className="min-h-screen bg-gray-100 py-10 px-2">
        <div className="container mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                Statistiques des évaluations de projets
              </h1>
              <p className="text-muted-foreground mt-2">
                Consultez et analysez toutes les évaluations de projets soumises.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-lg grid-cols-4">
                <TabsTrigger value="table">Vue Tableau</TabsTrigger>
                <TabsTrigger value="comments">Commentaires</TabsTrigger>
                <TabsTrigger value="summary">Résumé</TabsTrigger>
                <TabsTrigger value="projects">Cartes</TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-6">

                
                  >

                    <ProjectStatisticsTable
                    evaluations={evaluationsData}
                    searchTerm={searchFromUrl}
                    />
              </TabsContent>
              

              <TabsContent value="comments" className="mt-6">

                

                        <ProjectCommentsTable />


              </TabsContent>

              <TabsContent value="summary" className="mt-6">
                
                    <ProjectsSummaryTable projectStats={projectStats} />

              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                
                    <ProjectsOverview projectStats={projectStats} />
                    
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}

// fonction utilitaire
function formatEvaluations(apiResponse: EvaluationResponse[]): FormattedEvaluation[] {
  return apiResponse.map((item, index) => ({
    id: `eval-${index}`,
    projectName: item.project_title,
    userName: item.username,
    quality: item.answers[0],
    timeliness: item.answers[1],
    communication: item.answers[2],
    usability: item.answers[3],
    wouldRecommend: item.answers[4] === 1,
    date: new Date().toISOString(),
  }))
}
