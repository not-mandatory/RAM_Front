"use client"
import { getProjects } from "@/lib/projects"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  MoreHorizontal,
  Search,
  Trash,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Users,
  Mail,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Image from "next/image"

// Types
type User = {
  name: string
  position: string
  direction: string
  is_team_lead: boolean
  email?: string
}

type Project = {
  id: string
  title: string
  description: string
  users: User[]
  category?: string
  createdAt?: string
  image_path: string
}

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        const initialExpandedTeams: Record<string, boolean> = {}
        data.forEach((project: Project) => {
          initialExpandedTeams[project.id] = false
        })
        setExpandedTeams(initialExpandedTeams)
        setProjects(data)
        setFilteredProjects(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Échec du chargement des projets :", error)
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.users.some(
            (user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.direction.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
      setFilteredProjects(filtered)
    } else {
      setFilteredProjects(projects)
    }
  }, [searchQuery, projects])

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      try {
        // TODO: Importer et définir la fonction deleteProject
        await deleteProject(projectToDelete)
        setProjects(projects.filter((project) => project.id !== projectToDelete))
        setIsDeleteDialogOpen(false)
        setProjectToDelete(null)
      } catch (error) {
        console.error("Échec de la suppression du projet :", error)
      }
    }
  }

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const toggleTeam = (id: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)

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

  const getTeamLead = (users: User[]) => users.find((user) => user.is_team_lead) || null
  const getTeamMembers = (users: User[]) => users.filter((user) => !user.is_team_lead)

  const getValidImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath
    if (!imagePath.startsWith("/")) return null
    return imagePath
  }

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [id]: true,
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher projets…"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const teamLead = getTeamLead(project.users)
              const teamMembers = getTeamMembers(project.users)
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Image du projet */}
                  <div className="relative w-full h-48 bg-gray-100">
                    {project.image_path && !imageErrors[project.id] && getValidImageUrl(project.image_path) ? (
                      <Image
                        src={getValidImageUrl(project.image_path)!}
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
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/90">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/admin/project/edit/${project.id}`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                          </Link>
                          {/* <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(project.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="break-words">{project.title}</CardTitle>
                      {/* {project.category && (
                        <Badge>{project.category.charAt(0).toUpperCase() + project.category.slice(1)}</Badge>
                      )} */}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="text-sm text-muted-foreground mb-4">
                      <div
                        className={`${
                          expandedDescriptions[project.id] ? "whitespace-pre-wrap" : "line-clamp-3"
                        } h-[4.5rem] overflow-hidden ${expandedDescriptions[project.id] ? "h-auto" : ""}`}
                      >
                        {project.description}
                      </div>
                      {project.description.length > 150 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-8 px-2 text-xs"
                          onClick={() => toggleDescription(project.id)}
                        >
                          {expandedDescriptions[project.id] ? (
                            <>
                              <ChevronUp className="mr-1 h-3 w-3" />
                              Réduire
                            </>
                          ) : (
                            <>
                              <ChevronDown className="mr-1 h-3 w-3" />
                              Lire la suite
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <Collapsible
                      open={expandedTeams[project.id]}
                      onOpenChange={() => toggleTeam(project.id)}
                      className="mt-auto border-t pt-3"
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Équipe</span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {project.users.length}
                            </Badge>
                          </div>
                          {expandedTeams[project.id] ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3 space-y-3">
                        {teamLead && (
                          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md">
                            <Avatar className={`h-10 w-10 ${getAvatarColor(teamLead.name)}`}>
                              <AvatarFallback>{getInitials(teamLead.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{teamLead.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  Responsable
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Briefcase className="h-3 w-3" />
                                {teamLead.position}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Building2 className="h-3 w-3" />
                                {teamLead.direction}
                              </div>
                            </div>
                          </div>
                        )}

                        {teamMembers.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Membres</div>
                            <div className="space-y-2">
                              {teamMembers.map((member, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/30">
                                  <Avatar className={`h-8 w-8 ${getAvatarColor(member.name)}`}>
                                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{member.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{member.position}</div>
                                    <div className="text-xs text-muted-foreground truncate">{member.direction}</div>
                                    {member.email && (
                                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                                        <Mail className="h-3 w-3 flex-shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center py-2">Aucun membre ajouté</div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                  <CardFooter className="flex justify-between text-xs text-muted-foreground border-t pt-3">
                    {project.createdAt ? (
                      <span>Créé le : {new Date(project.createdAt).toLocaleDateString()}</span>
                    ) : (
                      <span></span>
                    )}
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <div className="col-span-full h-24 flex items-center justify-center text-muted-foreground">
              Aucun projet trouvé.
            </div>
          )}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le projet ainsi que toutes ses données associées seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
