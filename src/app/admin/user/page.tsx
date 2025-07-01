import { UserManagementTable } from "@/components/admin/user-management-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { ExcelImportDialog } from "@/components/admin/excel-import-dialog"

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Gestion des Évaluateurs</h1>

            <div className="flex gap-3">
              <ExcelImportDialog />
              <Link href="/admin/user/new">
                <Button className="bg-gray-700 hover:bg-gray-800 text-white gap-2 shadow-lg rounded-full font-semibold">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter un Évaluateur
                </Button>
              </Link>
            </div>
          </div>
          <UserManagementTable />
        </div>
      </div>
    </div>
  )
}
