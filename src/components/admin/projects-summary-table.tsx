"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUpDown, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"

// Interface for the project statistics from the API
interface ProjectStats {
  avg_qst: number
  mean_qsts: number[]
  no_count: number
  project_title: string
  yes_count: number
  image?: string
}

interface ProjectsSummaryTableProps {
  projectStats: ProjectStats[]
}

export function ProjectsSummaryTable({ projectStats }: ProjectsSummaryTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("project_title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter projects based on search term
  const filteredProjects = projectStats.filter((project) =>
    project.project_title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let aValue, bValue

    if (sortField === "project_title") {
      aValue = a.project_title
      bValue = b.project_title
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else if (sortField === "avg_qst") {
      aValue = a.avg_qst
      bValue = b.avg_qst
    } else if (sortField === "yes_count") {
      aValue = a.yes_count
      bValue = b.yes_count
    } else if (sortField === "no_count") {
      aValue = a.no_count
      bValue = b.no_count
    } else if (sortField.startsWith("criteria_")) {
      const index = Number.parseInt(sortField.split("_")[1])
      aValue = a.mean_qsts[index]
      bValue = b.mean_qsts[index]
    } else {
      return 0
    }

    if (sortDirection === "asc") {
      return aValue - bValue
    } else {
      return bValue - aValue
    }
  })

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get question names for the mean_qsts array
  const questionNames = ["Désirabilité", "Viabilité", "Faisabilité", "Alignement Corporate"]

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("project_title")}
                >
                  Project Name
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              {questionNames.map((name, index) => (
                <TableHead key={`summary-header-${index}-${name}`} className="text-center">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center gap-1 p-0 font-semibold hover:bg-transparent w-full"
                    onClick={() => handleSort(`criteria_${index}`)}
                  >
                    {name}
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              ))}
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center gap-1 p-0 font-semibold hover:bg-transparent w-full"
                  onClick={() => handleSort("avg_qst")}
                >
                  Moyenne
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center gap-1 p-0 font-semibold hover:bg-transparent w-full"
                  onClick={() => handleSort("yes_count")}
                >
                  <ThumbsUp className="h-4 w-4 text-green-600 mr-1" />
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button
                  variant="ghost"
                  className="flex items-center justify-center gap-1 p-0 font-semibold hover:bg-transparent w-full"
                  onClick={() => handleSort("no_count")}
                >
                  <ThumbsDown className="h-4 w-4 text-red-600 mr-1" />
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project, projectIndex) => (
                <TableRow key={`summary-project-${projectIndex}-${project.project_title}`}>
                  <TableCell className="font-medium">{project.project_title}</TableCell>
                  {project.mean_qsts.map((value, index) => (
                    <TableCell
                      key={`${project.project_title}-rating-${index}-${questionNames[index]}`}
                      className="text-center"
                    >
                      <RatingBadge rating={value} />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-medium">
                    <Badge
                      className={
                        project.avg_qst >= 4
                          ? "bg-green-100 text-green-800"
                          : project.avg_qst >= 3
                            ? "bg-blue-100 text-blue-800"
                            : project.avg_qst > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }
                    >
                      {project.avg_qst.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <span className="font-medium text-green-600">{project.yes_count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <span className="font-medium text-red-600">{project.no_count}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No projects found matching your search.
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
  if (rating === 0) {
    return <span className="text-gray-400">-</span>
  }

  let variant = "default"

  if (rating >= 4.5) variant = "bg-green-100 text-green-800 hover:bg-green-100"
  else if (rating >= 3.5) variant = "bg-blue-100 text-blue-800 hover:bg-blue-100"
  else if (rating >= 2.5) variant = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
  else variant = "bg-red-100 text-red-800 hover:bg-red-100"

  return <Badge className={variant}>{rating.toFixed(1)}</Badge>
}
