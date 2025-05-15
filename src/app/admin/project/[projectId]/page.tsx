'use client'
import { ProjectForm } from "@/components/projects/project-form"

export default async function EditProjectPage({ params }: { params: { id: string } }) {

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <ProjectForm />
    </div>
  )
}

