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
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-7 pt-16 lg:pt-7 max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  )
}
