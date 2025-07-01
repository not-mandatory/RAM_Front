"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpDown, Check, X } from "lucide-react"
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
  searchTerm?: string
}

export function ProjectStatisticsTable({
  evaluations,
  searchTerm: initialSearchTerm = "",
}: ProjectStatisticsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
  const [sortField, setSortField] = useState<keyof Evaluation>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // keep local input state in sync with prop changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm)
  }, [initialSearchTerm])

  // automatic scroll on first load with search
  useEffect(() => {
    if (initialSearchTerm && evaluations.length > 0) {
      const searchTermLower = initialSearchTerm.toLowerCase()
      const matchingEvaluation = evaluations.find((evaluation) => {
        const combined = `${evaluation.projectName.toLowerCase()} ${evaluation.userName.toLowerCase()}`
        const keywords = searchTermLower.split(/\s+/).filter(Boolean)
        return keywords.every((kw) => combined.includes(kw))
      })

      if (matchingEvaluation) {
        setTimeout(() => {
          const el = document.getElementById(`evaluation-row-${matchingEvaluation.id}`)
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 500)
      }
    }
  }, [initialSearchTerm, evaluations])

  const filteredEvaluations = evaluations.filter((evaluation) => {
    if (!searchTerm.trim()) return true

    const lowerTerm = searchTerm.toLowerCase()
    const project = evaluation.projectName.toLowerCase()
    const user = evaluation.userName.toLowerCase()
    const keywords = lowerTerm.split(/\s+/).filter(Boolean)

    if (keywords.length === 1) {
      return project.includes(keywords[0]) || user.includes(keywords[0])
    }

    if (keywords.length === 2) {
      const [a, b] = keywords
      return (project.includes(a) && user.includes(b)) || (project.includes(b) && user.includes(a))
    }

    return keywords.every((kw) => project.includes(kw) || user.includes(kw))
  })

  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    if (sortField === "date") {
      return sortDirection === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime()
    }

    const aVal = a[sortField]
    const bVal = b[sortField]

    if (typeof aVal === "string")
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal)
    if (typeof aVal === "number")
      return sortDirection === "asc" ? aVal - (bVal as number) : (bVal as number) - aVal
    if (typeof aVal === "boolean")
      return sortDirection === "asc"
        ? aVal === bVal
          ? 0
          : aVal
          ? 1
          : -1
        : aVal === bVal
        ? 0
        : aVal
        ? -1
        : 1

    return 0
  })

  const columnAverages = {
    quality: calculateAverage(filteredEvaluations.map((e) => e.quality)),
    timeliness: calculateAverage(filteredEvaluations.map((e) => e.timeliness)),
    communication: calculateAverage(filteredEvaluations.map((e) => e.communication)),
    usability: calculateAverage(filteredEvaluations.map((e) => e.usability)),
  }

  const handleSort = (field: keyof Evaluation) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const calculateRowAverage = (evaluation: Evaluation) => {
    return (
      (evaluation.quality +
        evaluation.timeliness +
        evaluation.communication +
        evaluation.usability) /
      4
    )
  }

  const clearSearch = () => {
    setSearchTerm("")
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete("search")
    router.replace(newUrl.pathname)  // replace to avoid history spam
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => handleSort("projectName")}>
                <div className="flex items-center gap-1">
                  Projet / Évaluateur
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("quality")}>
                <div className="flex justify-center items-center gap-1">Désirabilité <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("timeliness")}>
                <div className="flex justify-center items-center gap-1">Viabilité <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("communication")}>
                <div className="flex justify-center items-center gap-1">Faisabilité <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("usability")}>
                <div className="flex justify-center items-center gap-1">Alignement Corporate <ArrowUpDown className="h-3 w-3" /></div>
              </TableHead>
              <TableHead className="text-center cursor-pointer" onClick={() => handleSort("wouldRecommend")}>
                <div className="flex justify-center items-center gap-1">Recommandation <ArrowUpDown className="h-3 w-3" /></div>
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
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mx-auto" />
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
                  {searchTerm
                    ? `Aucune évaluation trouvée pour "${searchTerm}"`
                    : "Aucune évaluation trouvée."}
                </TableCell>
              </TableRow>
            )}
            {filteredEvaluations.length > 0 && (
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>Moyenne des colonnes</TableCell>
                <TableCell className="text-center">{columnAverages.quality.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.timeliness.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.communication.toFixed(1)}</TableCell>
                <TableCell className="text-center">{columnAverages.usability.toFixed(1)}</TableCell>
                <TableCell className="text-center">
                  {`${Math.round(
                    (filteredEvaluations.filter((e) => e.wouldRecommend).length /
                      filteredEvaluations.length) *
                      100
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
  return values.reduce((sum, val) => sum + val, 0) / values.length
}
