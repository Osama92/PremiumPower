import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import type { Role } from "@/types"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.isActive) return null

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) return null

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as Role,
            phone: user.phone ?? undefined,
            avatar: user.avatar ?? undefined,
          }
        } catch (err) {
          console.error("[auth] authorize error:", err)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
        token.phone = (user as { phone?: string }).phone
        token.avatar = (user as { avatar?: string }).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.phone = token.phone as string | undefined
        session.user.avatar = token.avatar as string | undefined
      }
      return session
    },
  },
})

declare module "next-auth" {
  interface User {
    role: Role
    phone?: string
    avatar?: string
  }
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: Role
      phone?: string
      avatar?: string
    }
  }
}
