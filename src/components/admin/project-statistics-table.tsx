"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, ArrowUpDown, Check, X } from "lucide-react"

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
}

export function ProjectStatisticsTable({ evaluations }: ProjectStatisticsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Evaluation>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filter evaluations based on search term
  const filteredEvaluations = evaluations.filter(
    (evaluation) =>
      evaluation.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by project or user..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setSearchTerm("")}>All Evaluations</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("user")}>Filter by "user"</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSearchTerm("anass")}>Filter by "anass"</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => handleSort("projectName")}>
                  Project / User
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("quality")}
                >
                  Quality
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("timeliness")}
                >
                  Timeliness
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("communication")}
                >
                  Communication
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("usability")}
                >
                  Usability
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div
                  className="flex items-center justify-center gap-1 cursor-pointer"
                  onClick={() => handleSort("wouldRecommend")}
                >
                  Recommend
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="text-center">Mean</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEvaluations.length > 0 ? (
              sortedEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id}>
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
                  No evaluations found.
                </TableCell>
              </TableRow>
            )}
            {/* Average row */}
            {filteredEvaluations.length > 0 && (
              <TableRow className="bg-muted/50 font-medium">
                <TableCell>Column Average</TableCell>
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
