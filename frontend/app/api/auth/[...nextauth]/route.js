import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  // your auth config here
  secret: '/0AbKDKeShhdg06YqGmajdovMjZr0Y/gaffl1V9SPsg8=',
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
    //   const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

    const res = await fetch("http://localhost:5555/login", {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {"Content-Type": "application/json"}
    })

    const user = await res.json()
    if(res.ok && user){
        return user
    }

    return null
     
    }
  })
]


})

export { handler as GET, handler as POST }