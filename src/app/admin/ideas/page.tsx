import { IdeasTable } from "@/components/admin/ideas-table"

export default function IdeasPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Submitted Ideas</h1>
        <div className="text-sm text-muted-foreground">Approve ideas to convert them into projects</div>
      </div>
      <IdeasTable />
    </div>
  )
}
