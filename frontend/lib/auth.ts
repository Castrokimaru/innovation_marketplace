import type { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const BASE = process.env.NEXT_PUBLIC_BASE_URL || ""

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const email = credentials?.email
        const password = credentials?.password
        if (!email || !password) return null

        const res = await fetch(`${BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) return null

        const data = await res.json()
        const accessToken = data.access_token ?? data.accessToken ?? data.token
        const user = data.user ?? data

        if (!accessToken || !user?.id) return null

        return {
          id: String(user.id),
          email: user.email,
          role: user.role ?? user?.role?.name,
          username: user.username ?? user.first_name ?? "",
          accessToken,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.username = user.username
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }: any) {
      session.user.id = String(token.id ?? "")
      session.user.role = token.role
      session.user.username = token.username
      session.accessToken = token.accessToken
      return session
    },
  },
}
