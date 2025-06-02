import { getProjectById } from "@/lib/projects"
import { EvaluationForm } from "@/components/projects/evaluation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Briefcase, Building2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import Image from "next/image"
import type { Project } from "@/types/type"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getProjectTeam } from "@/lib/projects"

export default async function EvaluatePage({ params }: { params: { projectId: any } }) {
  const project: Project | null = await getProjectById(params.projectId)

  const teamData = await getProjectTeam(params.projectId)

  console.log("hhhhhhhh", project?.image_path)

  if (!project) {
    console.log("Project not found")
    notFound()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Helper function to get a color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ]
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 ">
      <div className="container mx-auto  ">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="mb-6">
            <Link href="/user/project">
              <Button
                variant="ghost"
                className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux projets.
              </Button>
            </Link>
          </div>

          {/* Project Header with Image on left, title and description on right */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {project.image_path && (
              <div className="relative w-full md:w-1/2 h-64 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={project.image_path || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="flex flex-col w-full md:w-1/2">
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>

              {/* Category Badge */}
              <div className="mt-2 mb-4">
                {project.category && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      project.category === "Revenue Generation"
                        ? "bg-green-100 text-green-800"
                        : project.category === "Customer Experience"
                          ? "bg-blue-100 text-blue-800"
                          : project.category === "Operational Performance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {project.category}
                  </span>
                )}
              </div>

              {/* Description beneath the title */}
              <div className="text-muted-foreground whitespace-pre-wrap">{project.description}</div>
            </div>
          </div>

          {/* Innovative Team Display */}
          {teamData && (
            <div className="mb-8 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Equipe de Projet
              </h2>

              <div className="relative">
                {/* Team Lead Section */}
                {teamData.team_leader && (
                  <div className="relative z-10">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-16 w-16 rounded-full ${getAvatarColor(teamData.team_leader.name)} flex items-center justify-center shadow-md border-2 border-white`}
                      >
                        <span className="text-lg font-bold">{getInitials(teamData.team_leader.name)}</span>
                      </div>
                      <div className="mt-2 text-center">
                        <h3 className="font-semibold">{teamData.team_leader.name}</h3>
                        <Badge className="mt-1">Chef d'équipe</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Building2 className="h-3 w-3 mr-1" />
                        {teamData.team_leader.direction}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {teamData.team_leader.position}
                      </div>
                    </div>

                    {/* Connecting line to team members */}
                    {teamData.team_members.length > 0 && <div className="h-8 w-0.5 bg-gray-200 mx-auto mt-2"></div>}
                  </div>
                )}

                {/* Team Members Section */}
                {teamData.team_members.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {teamData.team_members.map((member, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-3 cursor-pointer">
                                <Avatar className={`h-10 w-10 ${getAvatarColor(member.name)}`}>
                                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <div className="overflow-hidden">
                                  <div className="font-medium truncate">{member.name}</div>
                                  <div className="text-xs text-muted-foreground truncate">{member.position}</div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="p-4 max-w-xs">
                              <div className="space-y-2">
                                <div className="font-semibold">{member.name}</div>
                                <div className="text-sm flex items-center">
                                  <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  {member.direction}
                                </div>
                                <div className="text-sm flex items-center">
                                  <Briefcase className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                  {member.position}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Évaluation de projet</h2>
              <p className="text-muted-foreground text-sm">
                Veuillez évaluer ce projet selon les critères suivants de 0 à 5, 5 étant la note la plus élevée.
              </p>
            </div>

            <EvaluationForm projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
