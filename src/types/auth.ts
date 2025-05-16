// User type definition
export type User = {
    id: string
    username: string
    email: string
    role: "admin" | "user"
    position?: string
    direction?: string
  }
  
  // Login request type
  export type LoginRequest = {
    email: string
    password: string
    rememberMe?: boolean
  }
  
  // Login response type
  export type LoginResponse = {
    id: string
    username: string
    email: string
    role: "admin" | "user"
    token?: string
  }
  
  // Auth error type
  export type AuthError = {
    message: string
    status: number
  }
  