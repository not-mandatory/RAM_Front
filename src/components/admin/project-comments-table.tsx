"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, ArrowUpDown, MessageSquare } from "lucide-react"

interface CommentData {
  username: string
  project_name: string
  comment: string
  created_at: string
}

export function ProjectCommentsTable() {
  const [comments, setComments] = useState<CommentData[]>([])
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(null)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:5000/api/comments/all", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Échec du chargement des commentaires : ${response.statusText}`)
        }

        const data = await response.json()
        setComments(data.comments || [])
      } catch (error) {
        setError("Échec du chargement des commentaires. Veuillez réessayer.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [])

  const handleCommentClick = (comment: CommentData) => {
    setSelectedComment(comment)
    setIsCommentModalOpen(true)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredComments = comments
    .filter((comment) => comment.comment && comment.comment.trim() !== "")
    .filter(
      (comment) =>
        comment.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const sortedComments = [...filteredComments].sort((a, b) => {
    let aValue, bValue

    if (sortField === "project_name") {
      aValue = a.project_name
      bValue = b.project_name
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else if (sortField === "username") {
      aValue = a.username
      bValue = b.username
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    } else if (sortField === "created_at") {
      aValue = new Date(a.created_at).getTime()
      bValue = new Date(b.created_at).getTime()
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Commentaires des évaluations de projets</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Commentaires des évaluations de projets</h2>
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher dans les commentaires..."
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
              <TableHead
                className="text-center align-middle px-4 py-3 cursor-pointer"
                onClick={() => handleSort("project_name")}
              >
                Nom du projet <ArrowUpDown className="inline ml-1 h-3 w-3" />
              </TableHead>
              <TableHead
                className="text-center align-middle px-4 py-3 cursor-pointer"
                onClick={() => handleSort("username")}
              >
                Évaluateur <ArrowUpDown className="inline ml-1 h-3 w-3" />
              </TableHead>
              <TableHead className="text-center align-middle px-4 py-3">
                <span>
                  <MessageSquare className="inline mr-1 h-4 w-4" />
                  Commentaire
                </span>
              </TableHead>
              <TableHead
                className="text-center align-middle px-4 py-3 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date <ArrowUpDown className="inline ml-1 h-3 w-3" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedComments.map((comment, index) => (
              <TableRow
                key={index}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleCommentClick(comment)}
              >
                <TableCell className="text-center align-middle px-4 py-3">{comment.project_name}</TableCell>
                <TableCell className="text-center align-middle px-4 py-3">{comment.username}</TableCell>
                <TableCell className="text-center align-middle px-4 py-3">{comment.comment}</TableCell>
                <TableCell className="text-center align-middle px-4 py-3">
                  {new Date(comment.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal du commentaire */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaire pour "{selectedComment?.project_name}"
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-900">Utilisateur :</span>
                  <span className="text-gray-700">{selectedComment?.username}</span>
                  <span className="text-sm text-gray-500">
                    • {selectedComment?.created_at ? new Date(selectedComment.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="font-medium text-gray-900 block mb-2">Commentaire :</span>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedComment?.comment}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
