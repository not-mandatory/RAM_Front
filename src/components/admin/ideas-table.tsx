"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Search, Trash, CheckCircle, User, ArrowUpRight, X } from "lucide-react"
import { getIdeas } from "@/lib/ideas"
import { useRouter, useSearchParams } from "next/navigation"
import type { Idea } from "@/types/type"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function IdeasTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [ideaToDelete, setIdeaToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApproving, setIsApproving] = useState<string | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)

  // Initialize search query from URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get("search")
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl)
    }
  }, [searchParams])

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await getIdeas()
        setIdeas(data)
        setFilteredIdeas(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch ideas:", error)
        setIsLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = ideas.filter(
        (idea) =>
          idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          idea.submitted_by.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredIdeas(filtered)
    } else {
      setFilteredIdeas(ideas)
    }
  }, [searchQuery, ideas])

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setIdeaToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleRowClick = (idea: Idea) => {
    if (idea.status !== "Approved") {
      setSelectedIdea(idea)
      setIsDetailDialogOpen(true)
    }
  }

  const handleApproveFromDialog = async () => {
    if (selectedIdea) {
      setIsDetailDialogOpen(false)
      await handleApproveIdea({ stopPropagation: () => {} } as React.MouseEvent, selectedIdea.id)
    }
  }

  const handleDeleteConfirm = async () => {
    if (ideaToDelete) {
      try {
        await deleteIdea(ideaToDelete)
        setIdeas(ideas.filter((idea) => idea.id !== ideaToDelete))
        setIsDeleteDialogOpen(false)
        setIdeaToDelete(null)
      } catch (error) {
        console.error("Failed to delete idea:", error)
      }
    }
  }

  const handleApproveIdea = async (e: React.MouseEvent, id: string) => {
    setIsApproving(id)
    e.stopPropagation()
    try {
      router.push(`/admin/project/new?from_idea=${id}`)
    } catch (error) {
      console.error("Failed to approve idea:", error)
      setIsApproving(null)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    // Remove search parameter from URL
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete("search")
    router.replace(newUrl.pathname)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "revenue generation":
        return "bg-green-100 text-green-800 border-green-200"
      case "customer experience":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "operational performance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "sustainable development":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search ideas..."
            className="pl-8 pr-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
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
        {searchParams.get("search") && (
          <div className="ml-4 text-sm text-muted-foreground">Showing results for notification search</div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="rounded-md border overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Title</TableHead>
                <TableHead className="w-[30%]">Description</TableHead>
                <TableHead className="w-[100px]">Category</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead className="text-right w-[160px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIdeas.length > 0 ? (
                filteredIdeas.map((idea) => (
                  <TableRow
                    key={idea.id}
                    onClick={() => {
                      if (idea.status !== "approved") handleRowClick(idea)
                    }}
                    className={`${
                      idea.status === "Approved"
                        ? "bg-gray-100 opacity-70 cursor-not-allowed pointer-events-none"
                        : "cursor-pointer hover:bg-muted/50"
                    } ${
                      searchParams.get("search") &&
                      idea.title.toLowerCase().includes(searchParams.get("search")?.toLowerCase() || "")
                        ? "ring-2 ring-blue-500 ring-opacity-50"
                        : ""
                    }`}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1">
                        {idea.title}
                        {idea.status !== "approved" && <ArrowUpRight className="h-3 w-3 text-muted-foreground" />}
                        {idea.status === "approved" && (
                          <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-500 border-gray-300">
                            Approved
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="line-clamp-2">{idea.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(idea.category)}>
                        {idea.category.charAt(0).toUpperCase() + idea.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {idea.submitted_by}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {idea.status === "approved" ? (
                          <span className="text-xs text-gray-500 italic">Already approved</span>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-[78px] border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                              onClick={(e) => handleApproveIdea(e, idea.id)}
                              disabled={isApproving === idea.id}
                            >
                              {isApproving === idea.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <CheckCircle className="mr-1 h-4 w-4" />
                              )}
                              <span className="text-xs">Approve</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-[78px] border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                              onClick={(e) => handleDeleteClick(e, idea.id)}
                            >
                              <Trash className="mr-1 h-4 w-4" />
                              <span className="text-xs">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? `No ideas found matching "${searchQuery}"` : "No ideas found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the idea and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedIdea?.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getCategoryColor(selectedIdea?.category || "")}>
                {(selectedIdea?.category ?? "").charAt(0).toUpperCase() + (selectedIdea?.category ?? "").slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Submitted by {selectedIdea?.submitted_by} on {selectedIdea?.created_at}
              </span>
            </div>
          </DialogHeader>

          <div className="mt-2">
            <DialogDescription className="text-foreground whitespace-pre-wrap">
              {selectedIdea?.description}
            </DialogDescription>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => {
                setIsDetailDialogOpen(false)
                if (selectedIdea) {
                  setIdeaToDelete(selectedIdea.id)
                  setIsDeleteDialogOpen(true)
                }
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Idea
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveFromDialog}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Idea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

async function deleteIdea(id: string): Promise<void> {
  console.log("Deleting idea with ID:", id)
}
