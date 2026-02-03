import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: number
      username?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: number
    username?: string
    role?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number
    username?: string
    role?: string
    accessToken?: string
    email?: string
  }
}
