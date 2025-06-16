"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon, BarChart3Icon, CheckCircle2, ImageIcon, ChevronDown } from "lucide-react"
import { useState } from "react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    already_evaluated?: boolean
    image_path?: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})

  // Card style for evaluated or not
  const evaluatedStyle = project.already_evaluated
    ? "opacity-70 bg-gray-50 border-gray-200"
    : "hover:border-gray-700 hover:shadow-lg transition-all hover:scale-[1.02]"

  const getValidImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }
    if (!imagePath.startsWith("/")) {
      return null
    }
    return imagePath
  }

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  const toggleDescription = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isExpanded = expandedDescriptions[project.id]
  const shouldShowReadMore = project.description.length > 150
  const displayDescription = isExpanded
    ? project.description
    : shouldShowReadMore
      ? project.description.substring(0, 150) + "..."
      : project.description

  // Card content
  const cardContent = (
    <Card className={`h-full overflow-hidden border-2 ${evaluatedStyle} flex flex-col rounded-2xl shadow-md`}>
      {/* Image section */}
      <div className="relative w-full h-40 bg-muted flex-shrink-0">
        {project.image_path && !imageErrors[project.id] ? (
          <Image
            src={getValidImageUrl(project.image_path) || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => handleImageError(project.id)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Header */}
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold text-gray-800 line-clamp-2">{project.title}</CardTitle>
            {project.already_evaluated && (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" title="Already evaluated" />
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="overflow-hidden">
            <p
              className={`text-[16px] text-gray-500 mb-2 transition-all duration-300 ease-in-out ${
                isExpanded ? "max-h-none" : "max-h-20"
              }`}
            >
              {displayDescription}
            </p>
          </div>
          {shouldShowReadMore && (
            <button
              type="button"
              onClick={(e) => toggleDescription(e, project.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium focus:outline-none transition-colors duration-200 mt-2"
              style={{ padding: "4px 0", background: "none", border: "none" }}
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              <span className="select-none">{isExpanded ? "Lire moins" : "Lire plus"}</span>
            </button>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-3 pb-4 flex justify-between items-center flex-shrink-0 mt-auto">
        <div className="flex items-center text-sm font-medium text-primary">
          {project.already_evaluated ? (
            <span className="text-muted-foreground">Déjà évalué.</span>
          ) : (
            <>
              <BarChart3Icon className="mr-1 h-4 w-4" />
              Évaluer Projet
            </>
          )}
        </div>
        {!project.already_evaluated && <ArrowRightIcon className="h-4 w-4 text-primary" />}
      </CardFooter>
    </Card>
  )

  // Conditionally wrap with Link or return as is
  return project.already_evaluated ? (
    <div className="block h-full">{cardContent}</div>
  ) : (
    <Link href={`/evaluate/${project.id}`} className="block h-full">
      {cardContent}
    </Link>
  )
}
