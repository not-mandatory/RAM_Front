"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { getIdeaDetails } from "@/lib/ideas"
import {
  ImageIcon,
  X,
  Upload,
  Plus,
  Users,
  UserPlus,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  UserRound,
  UserCog,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUsers } from "@/lib/users" // Import the getUsers function

// Define the User type based on what getUsers returns
type User = {
  id: number
  username: string
  position: string
  direction: string
  avatar?: string
}

// Define a schema for team members
const teamMemberSchema = z.object({
  userId: z.number().min(1, { message: "User selection is required" }),
})

// Update the project schema to include team information and team members
const projectSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  // category: z.enum(
  //   ["Développement durable", "Performance opérationnelle", "Expérience client", "Génération de revenus"],
  //   {
  //     required_error: "Please select a category.",
  //   },
  // ),
  // Team lead information
  teamLeadId: z.number().min(1, {
    message: "Team lead selection is required.",
  }),
  // Array of team members
  teamMembers: z.array(teamMemberSchema).optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

// Update the Project type to include team information
type Project = {
  id: string
  title: string
  description: string
  createdAt: string
  teamLeadId?: string
  image?: string
  image_path?: string
  teamMembers?: Array<{
    userId: string
  }>
}

interface ProjectFormProps {
  project?: Project
}

export function ProjectForm({ project }: ProjectFormProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ideaId = searchParams.get("from_idea")
  const projectId = searchParams.get("projectId")

  const [idea, setIdea] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image || null)
  const [isLoadingIdea, setIsLoadingIdea] = useState(!!ideaId)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [teamSectionOpen, setTeamSectionOpen] = useState(true)
  const [teamLeadOpen, setTeamLeadOpen] = useState(false)
  const [teamMembersOpen, setTeamMembersOpen] = useState(false)
  const [teamLeadSearchOpen, setTeamLeadSearchOpen] = useState(false)
  const [selectedTeamLead, setSelectedTeamLead] = useState<User | null>(null)
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<User[]>([])
  const [teamLeadSearchQuery, setTeamLeadSearchQuery] = useState("")
  const [teamMemberSearchQuery, setTeamMemberSearchQuery] = useState("")
  const [teamMemberSearchOpen, setTeamMemberSearchOpen] = useState(false)
  const [removeImage, setRemoveImage] = useState(false);
  const [users, setUsers] = useState<User[]>([])

  // console.log("ideaId from search params:", ideaId)

  // Create form with default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      // category:
      //   (project?.category as
      //     | "Développement durable"
      //     | "Performance opérationnelle"
      //     | "Expérience client"
      //     | "Génération de revenus") || undefined,
      // Add default values for team information
      teamLeadId: project?.teamLeadId ? parseInt(project.teamLeadId, 10) || undefined : undefined,
      // Initialize team members array
      teamMembers: project?.teamMembers?.map((member) => ({ userId: parseInt(member.userId, 10) })) || [],
    },
  })

  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false
    // Check if URL ends with a common image extension
    return /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i.test(url)
  }

  // Fetch users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true)
      setUsersError(null)
      try {
        const fetchedUsers = await getUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        setUsersError("Failed to load users. Please try again.")
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [])

  

  // Fetch idea details if coming from idea approval
  useEffect(() => {
    if (ideaId) {
      setIsLoadingIdea(true);
      getIdeaDetails(ideaId)
        .then((ideaData) => {
          setIdea(ideaData);
          // When idea data arrives, reset the form with those values
          form.reset({
            title: ideaData.title || "",
            description: ideaData.description || "",
            // category: ideaData.category || undefined,
            teamLeadId: undefined,
            teamMembers: [],
    });
        })
        .finally(() => setIsLoadingIdea(false));
    }
  }, [ideaId]);












  // Set up field array for team members
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  })

  // Effect to update selected team lead when form value changes
  useEffect(() => {
    const teamLeadId = form.watch("teamLeadId")
    if (teamLeadId && users.length > 0) {
      const teamLead = users.find((user) => user.id === teamLeadId)
      if (teamLead) {
        setSelectedTeamLead(teamLead)
      }
    }
  }, [form.watch("teamLeadId"), users])

  // Effect to update selected team members when form value changes
  useEffect(() => {
    const teamMembers = form.watch("teamMembers") || []
    if (users.length > 0) {
      const selectedUsers = teamMembers
        .map((member) => users.find((user) => user.id === member.userId))
        .filter(Boolean) as User[]

      setSelectedTeamMembers(selectedUsers)
    }
  }, [form.watch("teamMembers"), users])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Store the file for later submission
    setSelectedFile(file)

    // Create a preview URL for the UI
    const imageUrl = URL.createObjectURL(file)
    setImagePreview(imageUrl)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setSelectedFile(null)
    setRemoveImage(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Add a new team member
  const addTeamMember = (userId: string) => {
    // Check if user is already selected
    const isAlreadySelected = fields.some((field) => field.userId === Number(userId))

    // Check if user is the team lead
    const isTeamLead = form.getValues("teamLeadId") === Number(userId)

    if (!isAlreadySelected && !isTeamLead) {
      append({ userId: Number(userId) })
    }
  }

  // Remove a team member
  const removeTeamMember = (index: number) => {
    remove(index)
  }

  // Filter users for team member selection (exclude team lead and already selected members)
  const getFilteredUsers = () => {
    const teamLeadId = form.getValues("teamLeadId")
    const teamMemberIds = fields.map((field) => field.userId)

    return users.filter(
      (user) =>
        user.id !== teamLeadId &&
        !teamMemberIds.includes(user.id) &&
        (teamMemberSearchQuery === "" ||
          user.username.toLowerCase().includes(teamMemberSearchQuery.toLowerCase()) ||
          user.position.toLowerCase().includes(teamMemberSearchQuery.toLowerCase()) ||
          user.direction.toLowerCase().includes(teamMemberSearchQuery.toLowerCase())),
    )
  }

  // Add a function to filter users for team lead selection
  const getFilteredTeamLeadUsers = () => {
    // Exclude users that are already team members
    const teamMemberIds = fields.map((field) => field.userId)

    return users.filter(
      (user) =>
        !teamMemberIds.includes(user.id) &&
        (teamLeadSearchQuery === "" ||
          user.username.toLowerCase().includes(teamLeadSearchQuery.toLowerCase()) ||
          user.position.toLowerCase().includes(teamLeadSearchQuery.toLowerCase()) ||
          user.direction.toLowerCase().includes(teamLeadSearchQuery.toLowerCase())),
    )
  }

  // Update the onSubmit function to include team information
  async function onSubmit(values: ProjectFormValues) {
    
    setIsSubmitting(true)

    try {
      // Create FormData object to handle file upload
      const formData = new FormData()

      // Add form fields to FormData
      formData.append("title", values.title)
      formData.append("description", values.description)
      // formData.append("category", values.category)

      if (removeImage) {
        // If the user chose to remove the image, add a flag
        formData.append("removeImage", "true")
        console.log("Removing image from project")
      }

      // Add team lead ID
      formData.append("teamLeadId", values.teamLeadId.toString())

      // Add team members as JSON string
      if (values.teamMembers && values.teamMembers.length > 0) {
        formData.append("teamMembers", JSON.stringify(values.teamMembers))
      }

      // Add file if selected
      if (selectedFile) {
        formData.set("removeImage", "false")

        formData.append("image", selectedFile)

      } else if (imagePreview && imagePreview.startsWith("http")) {
        // If using an image URL, pass it as a string
        formData.set("removeImage", "false")
        formData.append("imageUrl", imagePreview)
      }

      // If we have an existing S3 image path and no new file is selected
      if (!selectedFile && imagePreview && imagePreview.includes("s3.amazonaws.com")) {
        formData.append("existingImagePath", imagePreview)
      }

      // Add project ID if editing
      if (project?.id) {
        formData.append("id", project.id)
      }

      // Add idea ID if coming from idea approval
      if (ideaId) {
        formData.append("ideaId", ideaId)
      }

      console.log("Submitting form with values:", values)
      console.log("Form data:", formData.values())
      //console.log("Selected file:", selectedFile)

      // Send the form data to the server
      const endpoint = project?.id ? `http://localhost:5000/api/project/update/${project.id}` : "/api/project/create"

      const response = await fetch(endpoint, {
        method: project?.id ? "PUT" : "POST",
        body: formData,
        // Note: Don't set Content-Type header when using FormData
        // The browser will automatically set it with the correct boundary
      })

      if (!response.ok) {
        throw new Error(`Failed to ${project?.id ? "update" : "create"} project: ${response.statusText}`)
      }

      const result = await response.json()
      console.log(`Project ${project?.id ? "updated" : "created"} successfully:`, result)

      // If we came from an idea approval, mark the idea as approved
      if (ideaId) {
        try {
          const approveResponse = await fetch(`/api/idea/approve/${ideaId}`, {
            method: "POST",
          })

          if (!approveResponse.ok) {
            console.error("Failed to mark idea as approved:", approveResponse.statusText)
          }
        } catch (error) {
          console.error("Failed to mark idea as approved:", error)
          // Continue anyway as the project was created successfully
        }
      }

      // Redirect to projects list
      router.push("/admin/project")
      router.refresh()
    } catch (error) {
      console.error("Failed to save project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingIdea) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
          {/* Project Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <span>Détails du projet</span>
                <Badge variant="outline" className="ml-2">
                  Requis
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du projet</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrez le nom du projet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Entrez la description du projet" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Génération de revenus">Génération de revenus</SelectItem>
                        <SelectItem value="Expérience client">Éxpérience client</SelectItem>
                        <SelectItem value="Performance opérationnelle">Performance opérationnelle</SelectItem>
                        <SelectItem value="Développement durable">Développement durable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </CardContent>
          </Card>

          {/* Team Information Section */}
          <div className="w-full">
            <Card>
              <CardHeader className="border-b">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    setTeamSectionOpen(!teamSectionOpen)
                  }}
                >
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>Informations sur l’équipe</span>
                    <Badge variant="outline" className="ml-2">
                      Requis
                    </Badge>
                  </CardTitle>
                  {teamSectionOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CardHeader>

              {teamSectionOpen && (
                <CardContent className="pt-4 space-y-4">
                  {isLoadingUsers ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-muted-foreground">Chargement des utilisateurs...</p>
                    </div>
                  ) : usersError ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-destructive">{usersError}</p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={(e) => {
                          e.preventDefault()
                          // Retry loading users
                          async function fetchUsers() {
                            setIsLoadingUsers(true)
                            setUsersError(null)
                            try {
                              const fetchedUsers = await getUsers()
                              setUsers(fetchedUsers)
                            } catch (error) {
                              console.error("Failed to fetch users:", error)
                              setUsersError("Failed to load users. Please try again.")
                            } finally {
                              setIsLoadingUsers(false)
                            }
                          }
                          fetchUsers()
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Team Lead Section */}
                      <div className="border rounded-lg">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30"
                          onClick={(e) => {
                            e.preventDefault()
                            setTeamLeadOpen(!teamLeadOpen)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Chef d’équipe</h3>
                            <Badge variant="outline" className="ml-2">
                              Requis
                            </Badge>
                            {selectedTeamLead && (
                              <Badge variant="secondary" className="ml-2">
                                1
                              </Badge>
                            )}
                          </div>
                          {teamLeadOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>

                        {teamLeadOpen && (
                          <div className="p-4 pt-0 space-y-4">
                            <FormField
                              control={form.control}
                              name="teamLeadId"
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  {/* Team lead search button */}
                                  <div className="w-full mt-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="w-full justify-between"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setTeamLeadSearchOpen(!teamLeadSearchOpen)
                                      }}
                                    >
                                      {selectedTeamLead ? "Changer le chef d’équipe" : "Trouver un chef d’équipe"}
                                      {teamLeadSearchOpen ? (
                                        <ChevronUp className="h-4 w-4 ml-2" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                      )}
                                    </Button>

                                    {/* Team lead search panel */}
                                    {teamLeadSearchOpen && (
                                      <div className="p-3 bg-muted/30 rounded-md border mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Search className="h-4 w-4 text-muted-foreground" />
                                          <h4 className="text-sm font-medium">Trouver le chef d’équipe</h4>
                                        </div>
                                        <div className="relative">
                                          <Input
                                            placeholder="Rechercher par nom, poste ou direction…
"
                                            value={teamLeadSearchQuery}
                                            onChange={(e) => setTeamLeadSearchQuery(e.target.value)}
                                            className="pr-10"
                                          />
                                          {teamLeadSearchQuery && (
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="icon"
                                              className="absolute right-0 top-0 h-full w-10 px-3 text-muted-foreground"
                                              onClick={(e) => {
                                                e.preventDefault()
                                                setTeamLeadSearchQuery("")
                                              }}
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>

                                        <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
                                          {getFilteredTeamLeadUsers().length > 0 ? (
                                            getFilteredTeamLeadUsers().map((user) => (
                                              <div
                                                key={user.id}
                                                className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                                                onClick={(e) => {
                                                  e.preventDefault()
                                                  form.setValue("teamLeadId", user.id)
                                                  setSelectedTeamLead(user)
                                                  setTeamLeadSearchOpen(false)
                                                }}
                                              >
                                                <div className="flex items-center gap-2">
                                                  <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                      src={user.avatar || "/placeholder.svg?height=40&width=40"}
                                                      alt={user.username}
                                                    />
                                                    <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                                  </Avatar>
                                                  <div>
                                                    <div className="font-medium">{user.username}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                      {user.position} • {user.direction}
                                                    </div>
                                                  </div>
                                                </div>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={(e) => {
                                                    e.stopPropagation()
                                                    form.setValue("teamLeadId", user.id)
                                                    setSelectedTeamLead(user)
                                                    setTeamLeadSearchOpen(false)
                                                  }}
                                                >
                                                  <Check className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-center py-4 text-muted-foreground">
                                              {teamLeadSearchQuery ? "No matching users found" : "No available users"}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Selected team lead */}
                                  {selectedTeamLead ? (
                                    <div className="space-y-2 mt-4">
                                      <h4 className="text-sm font-medium flex items-center gap-2">
                                        <UserCog className="h-4 w-4" />
                                        Chef d’équipe sélectionné
                                      </h4>
                                      <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarImage
                                              src={selectedTeamLead.avatar || "/placeholder.svg?height=40&width=40"}
                                              alt={selectedTeamLead.username}
                                            />
                                            <AvatarFallback>{selectedTeamLead.username.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <h4 className="font-medium">{selectedTeamLead.username}</h4>
                                            <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                              <span>{selectedTeamLead.position}</span>
                                              <span className="hidden sm:block">•</span>
                                              <span>{selectedTeamLead.direction}</span>
                                            </div>
                                          </div>
                                          <Badge className="ml-auto">Chef d’équipe</Badge>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            form.setValue("teamLeadId", "")
                                            setSelectedTeamLead(null)
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground mt-4">
                                      <UserCog className="h-12 w-12 mb-2 opacity-20" />
                                      <p>Aucun chef d’équipe sélectionné</p>
                                      <p className="text-sm">
                                        Utilisez le bouton « Trouver le chef d’équipe » ci-dessus pour sélectionner un chef d’équipe.
                                      </p>
                                    </div>
                                  )}

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {/* Team Members Section */}
                      <div className="border rounded-lg">
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30"
                          onClick={(e) => {
                            e.preventDefault()
                            setTeamMembersOpen(!teamMembersOpen)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-medium">Membres de l’équipe</h3>
                            <Badge variant="outline" className="ml-2">
                              Optionnel
                            </Badge>
                            {fields.length > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                {fields.length}
                              </Badge>
                            )}
                          </div>
                          {teamMembersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>

                        {teamMembersOpen && (
                          <div className="p-4 pt-0 space-y-4">
                            {/* Team member search button */}
                            <div className="w-full mt-4">
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full justify-between"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setTeamMemberSearchOpen(!teamMemberSearchOpen)
                                }}
                              >
                                Trouver des membres de l’équipe
                                {teamMemberSearchOpen ? (
                                  <ChevronUp className="h-4 w-4 ml-2" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                )}
                              </Button>

                              {/* Team member search panel */}
                              {teamMemberSearchOpen && (
                                <div className="p-3 bg-muted/30 rounded-md border mt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="text-sm font-medium">Trouver des membres de l’équipe</h4>
                                  </div>
                                  <div className="relative">
                                    <Input
                                      placeholder="Rechercher par nom, position ou direction…"
                                      value={teamMemberSearchQuery}
                                      onChange={(e) => setTeamMemberSearchQuery(e.target.value)}
                                      className="pr-10"
                                    />
                                    {teamMemberSearchQuery && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full w-10 px-3 text-muted-foreground"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          setTeamMemberSearchQuery("")
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>

                                  <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
                                    {getFilteredUsers().length > 0 ? (
                                      getFilteredUsers().map((user) => (
                                        <div
                                          key={user.id}
                                          className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            addTeamMember(String(user.id))
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                              <AvatarImage
                                                src={user.avatar || "/placeholder.svg?height=40&width=40"}
                                                alt={user.username}
                                              />
                                              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <div className="font-medium">{user.username}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {user.position} • {user.direction}
                                              </div>
                                            </div>
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              addTeamMember(String(user.id))
                                            }}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      ))
                                    ) : (
                                      <div className="text-center py-4 text-muted-foreground">
                                        {teamMemberSearchQuery ? "No matching users found" : "No available users"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Selected team members */}
                            {fields.length > 0 ? (
                              <div className="space-y-2 mt-4">
                                <h4 className="text-sm font-medium flex items-center gap-2">
                                  <UserRound className="h-4 w-4" />
                                  Membres de l’équipe sélectionnés ({fields.length})
                                </h4>
                                <div className="space-y-2">
                                  {fields.map((field, index) => {
                                    const user = users.find((u) => u.id === field.userId)
                                    if (!user) return null

                                    return (
                                      <div
                                        key={field.id}
                                        className="flex items-center justify-between p-3 bg-background rounded-md border"
                                      >
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-10 w-10">
                                            <AvatarImage
                                              src={user.avatar || "/placeholder.svg?height=40&width=40"}
                                              alt={user.username}
                                            />
                                            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <h4 className="font-medium">{user.username}</h4>
                                            <div className="flex flex-col sm:flex-row sm:gap-2 text-sm text-muted-foreground">
                                              <span>{user.position}</span>
                                              <span className="hidden sm:block">•</span>
                                              <span>{user.direction}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            removeTeamMember(index)
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                                <Users className="h-12 w-12 mb-2 opacity-20" />
                                <p>Aucun membre de l’équipe sélectionné</p>
                                <p className="text-sm">Utilisez le bouton « Trouver des membres de l’équipe » ci-dessus pour ajouter des membres à l’équipe.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Image upload section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span>Image du projet</span>
                <Badge variant="outline" className="ml-2">
                  Optionnel
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Image preview */}
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-md overflow-hidden border">
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      {selectedFile ? (
                        <img
                          src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                          alt="Project preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Project preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Hide the broken image
                              e.currentTarget.style.display = "none"
                              // Show error message
                              const container = e.currentTarget.parentElement
                              if (container) {
                                const errorDiv = document.createElement("div")
                                errorDiv.className = "flex flex-col items-center justify-center h-full w-full"
                                errorDiv.innerHTML = `
                        <ImageIcon class="h-10 w-10 text-muted-foreground/40 mb-2" />
                        <p class="text-sm text-red-500 text-center px-4">Unable to load image from this URL. Please use a direct image URL (ending with .jpg, .png, etc.)</p>
                      `
                                container.appendChild(errorDiv)
                              }
                            }}
                          />
                          <div className="hidden preview-image-fallback flex-col items-center justify-center h-full w-full">
                            <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
                            <p className="text-sm text-red-500 text-center px-4">Impossible de charger l’image depuis cette URL.</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-48 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                    <ImageIcon className="h-10 w-10 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Télécharger une image de projet</p>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Sélectionner une image
                    </Button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  name="image"
                />

                {/* Image URL input with validation */}
                {!selectedFile && (
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Ou saisissez une URL d’image directe (se terminant par .jpg, .png, etc.) :
                    </p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imagePreview || ""}
                        onChange={(e) => {
                          const url = e.target.value
                          setImagePreview(url)
                          setSelectedFile(null)
                        }}
                        name="imageUrl"
                        className={imagePreview && !isValidImageUrl(imagePreview) ? "border-red-300" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Force refresh the preview
                          const currentUrl = imagePreview
                          setImagePreview(null)
                          setTimeout(() => setImagePreview(currentUrl), 10)
                        }}
                      >
                        Tester URL
                      </Button>
                    </div>
                    {imagePreview && !isValidImageUrl(imagePreview) && (
                      <p className="text-xs text-red-500">
                        Cette URL ne semble pas être un lien direct vers une image. Veuillez utiliser une URL se terminant par .jpg, .png, .gif, etc.

                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/project")}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  {project ? "Mise à jour en cours..." : "Création en cours..."}
                </>
              ) : project ? (
                "Mettre à jour le projet"
              ) : (
                "Créer le projet"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}