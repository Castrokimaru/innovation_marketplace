import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // your auth config here
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "Email", type: "text", placeholder: "jsmith" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {"Content-Type": "application/json"}
    })

    const user = await res.json()
    if(res.ok && user){
        return {
          id: user.id,
          email: user.email,
          username: user.username, 
        };
    }

    return null
     
    }
  })
],

callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username; 
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username; 
      return session;
    },
  },


})

export { handler as GET, handler as POST }