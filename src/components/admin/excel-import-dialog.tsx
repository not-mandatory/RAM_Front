"use client"

import type React from "react"
import { useState, useRef } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserImportData {
  username: string
  email: string
  password: string
  position: string
  direction: string
  status?: "valid" | "invalid" | "duplicate"
  errors?: string[]
}

export function ExcelImportDialog() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importData, setImportData] = useState<UserImportData[]>([])
  const [validUsers, setValidUsers] = useState<UserImportData[]>([])
  const [invalidUsers, setInvalidUsers] = useState<UserImportData[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Import xlsx library dynamically
      const XLSX = await import("xlsx")

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

      // Skip header row and process data
      const users: UserImportData[] = []
      // const headers = jsonData[0] // not used

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (row.length === 0) continue // Skip empty rows

        const user: UserImportData = {
          username: row[0] || "",
          email: row[1] || "",
          password: row[2] || "",
          position: row[3] || "",
          direction: row[4] || "",
          errors: [],
        }

        // Validate user data
        if (!user.username.trim()) user.errors?.push("Username is required")
        if (!user.email.trim()) user.errors?.push("Email is required")
        if (!user.email.includes("@")) user.errors?.push("Invalid email format")
        if (!user.password.trim()) user.errors?.push("Password is required")
        if (user.password.length < 4) user.errors?.push("Password must be at least 4 characters")
        if (!user.position.trim()) user.errors?.push("Position is required")
        if (!user.direction.trim()) user.errors?.push("Direction is required")

        user.status = user.errors?.length === 0 ? "valid" : "invalid"
        users.push(user)
      }

      setImportData(users)
      setValidUsers(users.filter((u) => u.status === "valid"))
      setInvalidUsers(users.filter((u) => u.status === "invalid"))
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      alert("Error parsing Excel file. Please check the format.")
    } finally {
      setIsUploading(false)
    }
  }

  // --- THIS IS THE UPDATED IMPORT LOGIC FOR FLASK ---
  const handleImport = async () => {
    setIsImporting(true)

    try {
      // Adjust the URL if your Flask server is on a different host/port
      const response = await axios.post(
        "http://localhost:5000/api/admin/import-users",
        validUsers.map(user => ({
          username: user.username,
          email: user.email,
          password: user.password,
          position: user.position,
          direction: user.direction,
        })),
        {
          headers: { "Content-Type": "application/json" },
        }
      )

      // Optionally handle errors/duplicates returned from Flask
      const data = response.data as { created?: any[] }
      alert(`Successfully imported ${data.created?.length || 0} users!`)
      setImportData([])
      setValidUsers([])
      setInvalidUsers([])
      setIsOpen(false)
      window.location.reload()
    } catch (error: any) {
      console.error("Error importing users:", error)
      alert("Error importing users. Please try again.")
    } finally {
      setIsImporting(false)
    }
  }
  // ---------------------------------------------------

  const downloadTemplate = () => {
    const template = [
      ["Nom complet", "Email", "Password", "Position", "Direction"],
      ["John cena", "john.doe@company.com", "password123", "Manager", "IT Department"],
      ["anasskjkj", "janah@company.com", "password456", "Developer", "Engineering"],
    ]

    // Create and download CSV template
    const csvContent = template.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetImport = () => {
    setImportData([])
    setValidUsers([])
    setInvalidUsers([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetImport()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 gap-2 shadow-lg rounded-full font-semibold"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Importer Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importer des évaluateurs depuis Excel
          </DialogTitle>
          <DialogDescription>
Téléversez un fichier Excel pour importer plusieurs évaluateurs en une seule fois. Assurez-vous que votre fichier respecte le format requis.          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h4 className="font-medium text-blue-900">Besoin d’un modèle ?</h4>
              <p className="text-sm text-blue-700">Télécharger modèle Excel</p>
            </div>
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Télécharger modèle
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="excel-file">Sélectionner un fichier Excel</Label>
            <div className="flex items-center gap-2">
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                disabled={isUploading}
              />
              {importData.length > 0 && (
                <Button variant="outline" size="sm" onClick={resetImport}>
                  <X className="h-4 w-4" />
                </Button>   
              )}
            </div>
            {isUploading && (
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Traitement du fichier…</span>
              </div>
            )}
          </div>

          {/* Import Summary */}
          {importData.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{importData.length}</div>
                <div className="text-sm text-gray-600">Nombre total d’évaluateurs</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{validUsers.length}</div>
                <div className="text-sm text-green-600">Évaluateurs valides</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-900">{invalidUsers.length}</div>
                <div className="text-sm text-red-600">Évaluateurs invalides</div>
              </div>
            </div>
          )}

          {/* Data Preview */}
          {importData.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Aperçu des données importées</h4>
              <div className="border rounded-lg overflow-auto max-h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[120px]">Nom complet</TableHead>
                      <TableHead className="min-w-[180px]">Email</TableHead>
                      <TableHead className="min-w-[100px]">Position</TableHead>
                      <TableHead className="min-w-[120px]">Direction</TableHead>
                      <TableHead className="min-w-[200px]">Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importData.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell className="min-w-[80px]">
                          {user.status === "valid" ? (
                            <Badge className="bg-green-100 text-green-800 whitespace-nowrap">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Valide
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 whitespace-nowrap">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Invalide
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium min-w-[120px] truncate" title={user.username}>
                          {user.username}
                        </TableCell>
                        <TableCell className="min-w-[180px] truncate" title={user.email}>
                          {user.email}
                        </TableCell>
                        <TableCell className="min-w-[100px] truncate" title={user.position}>
                          {user.position}
                        </TableCell>
                        <TableCell className="min-w-[120px] truncate" title={user.direction}>
                          {user.direction}
                        </TableCell>
                        <TableCell className="min-w-[200px]">
                          {user.errors && user.errors.length > 0 && (
                            <div className="text-xs text-red-600 max-w-[200px] break-words">
                              {user.errors.join(", ")}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Warnings */}
          {invalidUsers.length > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                {invalidUsers.length}

Les évaluateurs contiennent des erreurs de validation et ne seront pas importés. Veuillez corriger les erreurs dans votre fichier Excel et réessayer.

              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="border-t pt-4 mt-4 bg-white">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleImport}
            disabled={validUsers.length === 0 || isImporting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isImporting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Importation en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                  Importer {validUsers.length} évaluateur{validUsers.length > 1 ? "s" : ""}

              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
