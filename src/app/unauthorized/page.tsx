import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <ShieldAlert className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        You don't have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Log In with Different Account</Button>
        </Link>
      </div>
    </div>
  )
}
