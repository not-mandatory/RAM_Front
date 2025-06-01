import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon, BarChart3Icon, CheckCircle2, ImageIcon } from "lucide-react"
import { useState } from "react"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    already_evaluated?: boolean
    image_path?: string // New image field
  }
}

export function ProjectCard({ project }: ProjectCardProps) {

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  
  // Apply styles based on evaluation status
  const evaluatedStyle = project.already_evaluated
    ? "opacity-70 bg-gray-50 border-gray-200"
    : "hover:border-primary/50 hover:shadow-md transition-all hover:scale-[1.02]"

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

  // Create the card content
  const cardContent = (
    <Card className={`h-full overflow-hidden border-2 ${evaluatedStyle}`}>
      {/* Image section */}
      <div className="relative w-full h-40 bg-muted">
        {project.image_path  ? (
                              <Image
                                src={getValidImageUrl(project.image_path)}
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

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
            {project.already_evaluated && <CheckCircle2 className="h-5 w-5 text-green-600" title="Already evaluated" />}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter className="pt-3 pb-4 flex justify-between items-center">
        <div className="flex items-center text-sm font-medium text-primary">
          {project.already_evaluated ? (
            <span className="text-muted-foreground">Déjà évalué.</span>
          ) : (
            <>
              <BarChart3Icon className="mr-1 h-4 w-4" />
              Evaluer Projet
            </>
          )}
        </div>
        {!project.already_evaluated && <ArrowRightIcon className="h-4 w-4 text-primary" />}
      </CardFooter>
    </Card>
  )

  // Conditionally wrap with Link or return as is
  return project.already_evaluated ? (
    <div className="block">{cardContent}</div>
  ) : (
    <Link href={`/evaluate/${project.id}`} className="block">
      {cardContent}
    </Link>
  )
}

