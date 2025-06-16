"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, ArrowUpDown, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface Evaluation {
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

interface ProjectStatisticsTableProps {
  evaluations: Evaluation[]
  initialSearchTerm?: string
}

export function ProjectStatisticsTable({ evaluations, initialSearchTerm = "" }: ProjectStatisticsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [sortField, setSortField] = useState<keyof Evaluation>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Set initial search term from props
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm)

      // Find and scroll to the matching row without highlighting
      if (evaluations.length > 0) {
        const searchTermLower = initialSearchTerm.toLowerCase()
        const matchingEvaluation = evaluations.find((evaluation) => {
          const projectNameLower = evaluation.projectName.toLowerCase()
          const userNameLower = evaluation.userName.toLowerCase()
          const combinedString = `${projectNameLower} ${userNameLower}`

          // Check if the search term matches both project and user
          const searchKeywords = searchTermLower.split(/\s+/).filter((keyword) => keyword.length > 0)
          return searchKeywords.every((keyword) => combinedString.includes(keyword))
        })

        if (matchingEvaluation) {
          setTimeout(() => {
            const element = document.getElementById(`evaluation-row-${matchingEvaluation.id}`)
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" })
            }
          }, 500)
        }
      }
    }
  }, [initialSearchTerm, evaluations])

  // --- Enhanced filter for AND/OR search logic ---
  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (!searchTerm.trim()) return true

    const searchTermLower = searchTerm.toLowerCase().trim()
    const projectNameLower = evaluation.projectName.toLowerCase()
    const userNameLower = evaluation.userName.toLowerCase()

    // Split search term by spaces to handle multiple keywords
    const searchKeywords = searchTermLower.split(/\s+/).filter((keyword) => keyword.length > 0)

    if (searchKeywords.length === 1) {
      // OR logic: match if either project or user contains the keyword
      const keyword = searchKeywords[0]
      return projectNameLower.includes(keyword) || userNameLower.includes(keyword)
    }

    if (searchKeywords.length === 2) {
      // AND logic: require both keywords to be present, one in project, one in user (any order)
      const [first, second] = searchKeywords
      const firstInProject = projectNameLower.includes(first)
      const secondInUser = userNameLower.includes(second)
      const firstInUser = userNameLower.includes(first)
      const secondInProject = projectNameLower.includes(second)
      return (firstInProject && secondInUser) || (firstInUser && secondInProject)
    }

    // If more than two keywords, require all keywords to be present in either field (flexible AND)
    return searchKeywords.every(
      (keyword) => projectNameLower.includes(keyword) || userNameLower.includes(keyword)
    )
  })

  // Sort evaluations
  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortDirection === "asc"
        ? aValue === bValue
          ? 0
          : aValue
            ? 1
            : -1
        : aValue === bValue
          ? 0
          : aValue
            ? -1
            : 1
    }

    return 0
  })

  // Calculate column averages
  const columnAverages = {
    quality: calculateAverage(filteredEvaluations.map((e) => e.quality)),
    timeliness: calculateAverage(filteredEvaluations.map((e) => e.timeliness)),
    communication: calculateAverage(filteredEvaluations.map((e) => e.communication)),
    usability: calculateAverage(filteredEvaluations.map((e) => e.usability)),
  }

  // Handle sort
  const handleSort = (field: keyof Evaluation) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Calculate row average (mean of all ratings for a single evaluation)
  const calculateRowAverage = (evaluation: Evaluation) => {
    return (evaluation.quality + evaluation.timeliness + evaluation.communication + evaluation.usability) / 4
  }

  // Clear search and update URL
  const clearSearch = () => {
    setSearchTerm("")
    // Remove search parameter from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete("search")
    router.replace(newUrl.pathname)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par projet ou évaluateur..."
            className="pl-8 pr-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-muted"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setSearchTerm("")}>Toutes les évaluations</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("Project A")}>Filter by "Project A"</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("John")}>Filter by "John"</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("Project A John")}>
              Filter by "Project A John"
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("projectName")}>
                  Projet / Évaluateur
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("quality")}
                >
                  Désirabilité
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("timeliness")}
                >
                  Viabilité
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("communication")}
                >
                  Faisabilité
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("usability")}
                >
                  Alignement Corporate
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("wouldRecommend")}
                >
                  Recommander
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">Moyenne</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvaluations.length > 0 ? (
              sortedEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id} id={`evaluation-row-${evaluation.id}`} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{evaluation.projectName}</div>
                      <div className="text-sm text-muted-foreground">{evaluation.userName}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <RatingBadge rating={evaluation.quality} />
                  </TableCell>
                  <TableCell className="text-center">
                    <RatingBadge rating={evaluation.timeliness} />
                  </TableCell>
                  <TableCell className="text-center">
                    <RatingBadge rating={evaluation.communication} />
                  </TableCell>
                  <TableCell className="text-center">
                    <RatingBadge rating={evaluation.usability} />
                  </TableCell>
                  <TableCell className="text-center">
                    {evaluation.wouldRecommend ? (
                      <div className="flex justify-center">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <X className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {calculateRowAverage(evaluation).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? `No evaluations found matching "${searchTerm}"` : "Aucune évaluation trouvée."}
                </TableCell>
              </TableRow>
            )}
            {/* Average row */}
            {filteredEvaluations.length > 0 && (
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>Moyenne de la colonne</TableCell>
                <TableCell className="text-center">{columnAverages.quality.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.timeliness.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.communication.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.usability.toFixed(1)}</TableCell>
                <TableCell className="text-center">
                  {`${Math.round(
                    (filteredEvaluations.filter((e) => e.wouldRecommend).length / filteredEvaluations.length) * 100,
                  )}%`}
                </TableCell>
                <TableCell className="text-center">
                  {(
                    (columnAverages.quality +
                      columnAverages.timeliness +
                      columnAverages.communication +
                      columnAverages.usability) /
                    4
                  ).toFixed(1)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function RatingBadge({ rating }: { rating: number }) {
  let variant = "default"

  if (rating >= 4.5) variant = "bg-green-100 text-green-800 hover:bg-green-100"
  else if (rating >= 3.5) variant = "bg-blue-100 text-blue-800 hover:bg-blue-100"
  else if (rating >= 2.5) variant = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
  else variant = "bg-red-100 text-red-800 hover:bg-red-100"

  return <Badge className={variant}>{rating.toFixed(1)}</Badge>
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
