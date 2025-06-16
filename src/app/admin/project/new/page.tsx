import { ProjectForm } from "@/components/projects/project-form"

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Créer un nouveau projet</h1>
      <ProjectForm />
    </div>
  )
}

