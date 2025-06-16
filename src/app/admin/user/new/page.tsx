// import { UserForm } from "@/components/admin/user-form"

import { UserForm } from "@/components/admin/user-form"
export default function NewUserPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Créer un nouvel évaluateur</h1>
      <UserForm />
    </div>
  )
}

