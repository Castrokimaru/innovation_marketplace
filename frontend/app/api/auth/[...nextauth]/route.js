import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
          }
        )

        const user = await res.json()
        if (res.ok && user) {
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            accessToken: user.access_token || user.accessToken
          }
        }

        return null
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.username = user.username
        // preserve backend JWT if returned from login
        token.accessToken = user.accessToken || user.access_token || token.accessToken
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.email = token.email
      session.user.username = token.username
      // make access token available on the client session
      session.accessToken = token.accessToken
      return session
    }
  }
})

export { handler as GET, handler as POST }
