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

  // Format the API response to match our expected structure
  const evaluationsData = formatEvaluations(apiResponse)

  // Get project statistics for the Projects tab
  // In a real app, this would be a separate API call
  const projectStats = await getProjectStatistics()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Evaluations Statistics</h1>
          <p className="text-muted-foreground mt-2">View and analyze all project evaluations submitted by users.</p>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            <ProjectStatisticsTable evaluations={evaluationsData} />
          </TabsContent>

          {/* REPLACED SUMMARY TAB CONTENT WITH PROJECT SUMMARY TABLE */}
          <TabsContent value="summary" className="mt-6">
            <ProjectsSummaryTable projectStats={projectStats} />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectsOverview projectStats={projectStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Helper function to format the API response
function formatEvaluations(apiResponse: EvaluationResponse[]): FormattedEvaluation[] {
  return apiResponse.map((item, index) => {
    // Map the answers array to our specific fields
    // Assuming: answers[0] = quality, answers[1] = timeliness,
    // answers[2] = communication, answers[3] = usability, answers[4] = wouldRecommend (1 = true, 0 = false)
    return {
      id: `eval-${index}`, // Generate a unique ID
      projectName: item.project_title,
      userName: item.username,
      quality: item.answers[0],
      timeliness: item.answers[1],
      communication: item.answers[2],
      usability: item.answers[3],
      wouldRecommend: item.answers[4] === 1, // Convert 1/0 to boolean
      date: new Date().toISOString(), // Use current date since it's not provided
    }
  })
}

// Mock function to get project statistics - in a real app, this would be an API call
// async function getProjectStatistics(): Promise<ProjectStats[]> {
//   // This is the data provided by the user
//   return [
//     {
//       avg_qst: 3.42,
//       mean_qsts: [4.0, 4.33, 2.67, 2.67],
//       no_count: 0,
//       project_title: "entertain our passengers",
//       yes_count: 3,
//     },
//     {
//       avg_qst: 4.08,
//       mean_qsts: [4.33, 5.0, 3.33, 3.67],
//       no_count: 4,
//       project_title: "lottery win",
//       yes_count: 2,
//     },
//     {
//       avg_qst: 3.88,
//       mean_qsts: [4.0, 3.5, 4.5, 3.5],
//       no_count: 1,
//       project_title: "Iot sensors",
//       yes_count: 1,
//     },
//     {
//       avg_qst: 2.5,
//       mean_qsts: [1.0, 2.0, 3.0, 4.0],
//       no_count: 1,
//       project_title: "another",
//       yes_count: 0,
//     },
//     {
//       avg_qst: 0.0,
//       mean_qsts: [0, 0, 0, 0],
//       no_count: 0,
//       project_title: "tryy",
//       yes_count: 0,
//     },
//     {
//       avg_qst: 0.0,
//       mean_qsts: [0, 0, 0, 0],
//       no_count: 0,
//       project_title: "zigzag",
//       yes_count: 0,
//     },
//     {
//       avg_qst: 0.0,
//       mean_qsts: [0, 0, 0, 0],
//       no_count: 0,
//       project_title: "tramway",
//       yes_count: 0,
//     },
//     {
//       avg_qst: 3.75,
//       mean_qsts: [3.0, 4.0, 5.0, 3.0],
//       no_count: 0,
//       project_title: "now navbar",
//       yes_count: 1,
//     },
//   ]
// }

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
