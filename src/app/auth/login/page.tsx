import type { Metadata } from "next"
import LoginPageClient from "./login-page-client"

export const metadata: Metadata = {
  title: "Login | Project Evaluation System",
  description: "Login to your account",
}

export default function LoginPage() {
  return <LoginPageClient />
}
