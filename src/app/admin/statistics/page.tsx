import { ProjectStatisticsTable } from "@/components/admin/project-statistics-table"
import { ProjectsOverview } from "@/components/admin/projects-overview"
import { ProjectsSummaryTable } from "@/components/admin/projects-summary-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default async function StatisticsPage() {
  const apiResponse = await getAllProjectEvaluations()
  const evaluationsData = formatEvaluations(apiResponse)
  const projectStats = await getProjectStatistics()

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-2">
      <div className="container mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-800">Statistiques des évaluations de projets.
</h1>
            <p className="text-muted-foreground mt-2">Consultez et analysez toutes les évaluations de projets soumises par les utilisateurs.
</p>
          </div>

          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="table">Vue en tableau</TabsTrigger>
              <TabsTrigger value="summary">Sommaire</TabsTrigger>
              <TabsTrigger value="projects">Projets</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6">
              <ProjectStatisticsTable evaluations={evaluationsData} />
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

function StatisticCard({
  title,
  value,
  description,
  trend,
}: {
  title: string
  value: number
  description: string
  trend: number
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value.toFixed(1)}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        <div className={`flex items-center mt-2 text-xs ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
          {trend >= 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path
                fillRule="evenodd"
                d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {Math.abs(trend * 100).toFixed(1)}% from last month
        </div>
      </CardContent>
    </Card>
  )
}

function calculateAverageForMetric(evaluations: FormattedEvaluation[], metric: keyof FormattedEvaluation): number {
  if (evaluations.length === 0) return 0

  const sum = evaluations.reduce((acc, evaluation) => {
    const value = evaluation[metric]
    return acc + (typeof value === "number" ? value : 0)
  }, 0)

  return sum / evaluations.length
}

function calculateRecommendationRate(evaluations: FormattedEvaluation[]): number {
  if (evaluations.length === 0) return 0

  const recommendCount = evaluations.filter((e) => e.wouldRecommend).length
  return Math.round((recommendCount / evaluations.length) * 100)
}
