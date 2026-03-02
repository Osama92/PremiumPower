import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TopNav } from "@/components/layout/TopNav"

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role !== "CUSTOMER") redirect("/dashboard")

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
