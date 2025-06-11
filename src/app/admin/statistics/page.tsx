"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProjectStatisticsTable } from "@/components/admin/project-statistics-table"
import { ProjectsOverview } from "@/components/admin/projects-overview"
import { ProjectsSummaryTable } from "@/components/admin/projects-summary-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllProjectEvaluations } from "@/lib/projects"
import { getProjectStatistics } from "@/lib/projects"

// Define the type for the API response
interface EvaluationResponse {
  answers: number[]
  project_title: string
  username: string
}

// Map the API response to our internal format
interface FormattedEvaluation {
  id: string
  projectName: string
  userName: string
  quality: number
  timeliness: number
  communication: number
  usability: number
  wouldRecommend: boolean
  date: string // We'll use current date since it's not provided
}

// New interface for project statistics from API
interface ProjectStats {
  avg_qst: number
  mean_qsts: number[]
  no_count: number
  project_title: string
  yes_count: number
}

export default function StatisticsPage() {
  const searchParams = useSearchParams()
  const [evaluationsData, setEvaluationsData] = useState<FormattedEvaluation[]>([])
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("table")

  // Initialize search term from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [searchParams])

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [apiResponse, statsResponse] = await Promise.all([getAllProjectEvaluations(), getProjectStatistics()])

        const formattedEvaluations = formatEvaluations(apiResponse)
        setEvaluationsData(formattedEvaluations)
        setProjectStats(statsResponse)
      } catch (error) {
        console.error("Error fetching statistics data:", error)
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
              Statistiques des évaluations de projets.
            </h1>
            <p className="text-muted-foreground mt-2">
              Consultez et analysez toutes les évaluations de projets soumises par les utilisateurs.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="table">Vue en tableau</TabsTrigger>
              <TabsTrigger value="summary">Sommaire</TabsTrigger>
              <TabsTrigger value="projects">Projets</TabsTrigger>
            </TabsList>

            {activeTab === "table" && (
              <TabsContent value="table" className="mt-6">
                <ProjectStatisticsTable evaluations={evaluationsData} initialSearchTerm={searchTerm} />
              </TabsContent>
            )}

            {activeTab === "summary" && (
              <TabsContent value="summary" className="mt-6">
                <ProjectsSummaryTable projectStats={projectStats} />
              </TabsContent>
            )}

            {activeTab === "projects" && (
              <TabsContent value="projects" className="mt-6">
                <ProjectsOverview projectStats={projectStats} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Helper function to format the API response
function formatEvaluations(apiResponse: EvaluationResponse[]): FormattedEvaluation[] {
  return apiResponse.map((item, index) => {
    return {
      id: `eval-${index}`,
      projectName: item.project_title,
      userName: item.username,
      quality: item.answers[0],
      timeliness: item.answers[1],
      communication: item.answers[2],
      usability: item.answers[3],
      wouldRecommend: item.answers[4] === 1,
      date: new Date().toISOString(),
    }
  })
}
