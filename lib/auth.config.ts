import type { NextAuthConfig } from "next-auth"

// Edge-safe auth config (no Prisma, no bcrypt)
// Used only by middleware to read JWT tokens
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.phone = (user as { phone?: string }).phone
        token.avatar = (user as { avatar?: string }).avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as Record<string, unknown>).id = token.id
        ;(session.user as Record<string, unknown>).role = token.role
        ;(session.user as Record<string, unknown>).phone = token.phone
        ;(session.user as Record<string, unknown>).avatar = token.avatar
      }
      return session
    },
  },
}
