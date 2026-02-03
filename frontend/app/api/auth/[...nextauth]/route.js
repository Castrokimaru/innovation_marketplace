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
            id: user.user_id,
            email: credentials.email,
            username: credentials.email, // Using email as username for now
            accessToken: user.access_token,
            role: user.role
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
      token.accessToken = user.accessToken
      token.role = user.role
    }
    return token
  },

  async session({ session, token }) {
    session.user.id = token.id
    session.user.email = token.email
    session.user.username = token.username
    session.accessToken = token.accessToken
    session.user.role = token.role
    return session
  }
}

})

export { handler as GET, handler as POST }