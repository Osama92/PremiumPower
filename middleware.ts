import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

const INTERNAL_ROLES = ["ADMIN", "CUSTOMER_SERVICE", "ENGINEER"]

export default auth(function middleware(req) {
  const { nextUrl, auth: session } = req as NextRequest & { auth: { user?: { role?: string } } | null }
  const isLoggedIn = !!session?.user
  const role = session?.user?.role

  const isLoginPage = nextUrl.pathname === "/login"
  const isInternalRoute = nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/fleet") ||
    nextUrl.pathname.startsWith("/rentals") && !nextUrl.pathname.startsWith("/portal") ||
    nextUrl.pathname.startsWith("/repairs") && !nextUrl.pathname.startsWith("/portal") ||
    nextUrl.pathname.startsWith("/parts") ||
    nextUrl.pathname.startsWith("/orders") && !nextUrl.pathname.startsWith("/portal") ||
    nextUrl.pathname.startsWith("/maintenance") && !nextUrl.pathname.startsWith("/portal") ||
    nextUrl.pathname.startsWith("/customers") ||
    nextUrl.pathname.startsWith("/analytics") ||
    nextUrl.pathname.startsWith("/staff") ||
    nextUrl.pathname.startsWith("/messages") ||
    nextUrl.pathname.startsWith("/articles") ||
    nextUrl.pathname.startsWith("/jobs")
  const isPortalRoute = nextUrl.pathname.startsWith("/portal")

  // Redirect root
  if (nextUrl.pathname === "/") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role === "CUSTOMER") return NextResponse.redirect(new URL("/portal", req.url))
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If logged in, redirect away from login
  if (isLoginPage && isLoggedIn) {
    if (role === "CUSTOMER") return NextResponse.redirect(new URL("/portal", req.url))
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect internal routes
  if (isInternalRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role === "CUSTOMER") return NextResponse.redirect(new URL("/portal", req.url))
    // Admin-only routes
    if (nextUrl.pathname.startsWith("/analytics") || nextUrl.pathname.startsWith("/staff")) {
      if (role !== "ADMIN") return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Protect portal routes
  if (isPortalRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url))
    if (role && INTERNAL_ROLES.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public|pps-logo.png|ondesk.jpg).*)"],
}
