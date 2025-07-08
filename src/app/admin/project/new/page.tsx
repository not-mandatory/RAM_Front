import { ProjectForm } from "@/components/projects/project-form"
import { Suspense } from "react";

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau projet</h1>
      <Suspense fallback={<div>Loading form…</div>}>
        <ProjectForm />
      </Suspense>    </div>
  )
}

