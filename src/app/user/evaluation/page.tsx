"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Calendar, Star, Check, X, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Evaluation {
  id: string
  projectId: string
  projectName: string
  date: string
  ratings: {
    q1: number // Désirabilité
    q2: number // Viabilité
    q3: number // Faisabilité
    q4: number // Alignement Corporate
    q5: boolean // Should continue
  }
}

export default function UserEvaluationsPage() {
  const router = useRouter()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchEvaluations = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/user/evaluations", {
                credentials: "include", // Important for sending cookies/JWT
            });

            if (!response.ok) {
                // If the response is not OK, try to parse the error message from the backend
                const errorData = await response.json();
                console.error("Backend error fetching evaluations:", errorData);
                // Throw an error with a more descriptive message
                throw new Error(errorData.error || "Failed to fetch evaluations");
            }

            // The backend now directly returns an array of evaluations
            const data = await response.json();
            setEvaluations(data);
            setFilteredEvaluations(data); // Initialize filtered evaluations with all data
        } catch (error) {
            console.error("Error fetching user evaluations:", error);
            // You might want to show an error message to the user here,
            // e.g., by updating a state variable for error display.
            // Removed mock data as it's no longer needed with a working backend.
        } finally {
            setIsLoading(false); // Always set loading to false after fetch attempt
        }
    };

    fetchEvaluations();
}, []); // Empty dependency array means this effect runs once after the initial render


  // Filter evaluations based on search term and active tab
  useEffect(() => {
    let filtered = evaluations

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((evaluation) =>
        evaluation.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply tab filter
    if (activeTab === "positive") {
      filtered = filtered.filter((evaluation) => evaluation.ratings.q5 === true)
    } else if (activeTab === "negative") {
      filtered = filtered.filter((evaluation) => evaluation.ratings.q5 === false)
    }

    setFilteredEvaluations(filtered)
  }, [searchTerm, activeTab, evaluations])

  // Calculate average rating for an evaluation
  const calculateAverageRating = (ratings: Evaluation["ratings"]) => {
    return (ratings.q1 + ratings.q2 + ratings.q3 + ratings.q4) / 4
  }

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy", { locale: fr })
    } catch (error) {
      return "Date invalide"
    }
  }

  // Handle edit evaluation
  const handleEditEvaluation = (evaluationId: string) => {
    router.push(`/user/evaluation/edit/${evaluationId}`)
  }

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{Math.round(rating)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          {/* <div className="mb-6">
            <Link href="/user/project">
              <Button
                variant="ghost"
                className="pl-0 flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour aux projets
              </Button>
            </Link>
          </div> */}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">Historique des évaluations</h1>
              <p className="text-muted-foreground mt-1">
                Consultez et modifiez vos évaluations de projets précédentes.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un projet..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <DropdownMenu>
                {/* <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtrer</span>
                  </Button>
                </DropdownMenuTrigger> */}
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setActiveTab("all")}>Toutes les évaluations</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("positive")}>
                    Projets recommandés (Oui)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("negative")}>
                    Projets non recommandés (Non)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="positive">Recommandés</TabsTrigger>
                <TabsTrigger value="negative">Non recommandés</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardHeader className="pb-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton key={j} className="h-16 w-full" />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredEvaluations.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">Projet</TableHead>
                          <TableHead className="text-center">Désirabilité</TableHead>
                          <TableHead className="text-center">Viabilité</TableHead>
                          <TableHead className="text-center">Faisabilité</TableHead>
                          <TableHead className="text-center">Alignement</TableHead>
                          <TableHead className="text-center">Recommandé</TableHead>
                          <TableHead className="text-center">Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEvaluations.map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell className="font-medium">{evaluation.projectName}</TableCell>
                            <TableCell className="text-center">{renderStarRating(evaluation.ratings.q1)}</TableCell>
                            <TableCell className="text-center">{renderStarRating(evaluation.ratings.q2)}</TableCell>
                            <TableCell className="text-center">{renderStarRating(evaluation.ratings.q3)}</TableCell>
                            <TableCell className="text-center">{renderStarRating(evaluation.ratings.q4)}</TableCell>
                            <TableCell className="text-center">
                              {evaluation.ratings.q5 ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  Oui
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">
                                  <X className="h-3.5 w-3.5 mr-1" />
                                  Non
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(evaluation.date)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEvaluation(evaluation.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
  {searchTerm ? (
    `Aucune évaluation trouvée pour "${searchTerm}"`
  ) : activeTab === "positive" ? (
    "Vous n'avez recommandé aucun projet pour le moment."
  ) : activeTab === "negative" ? (
    "Vous n'avez aucun projet noté comme non recommandé."
  ) : (
    "Vous n'avez pas encore évalué de projets."
  )}
</div>

                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
