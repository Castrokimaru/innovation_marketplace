import NextAuth, { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      username?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User extends DefaultUser {
    username?: string
    accessToken?: string
  }
}
