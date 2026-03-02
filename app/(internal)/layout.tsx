import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) redirect("/login")
  if (session.user.role === "CUSTOMER") redirect("/portal")

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:pl-6 pt-16 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}
