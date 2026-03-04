import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PartsView } from "./PartsView"

export default async function PartsPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  const parts = await prisma.sparePart.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spare Parts Inventory"
        description={`${parts.length} product${parts.length !== 1 ? "s" : ""}`}
        action={
          isAdmin ? (
            <Button asChild size="sm" className="h-8 text-[13px] bg-[#0f2440] hover:bg-[#0f2440]/90">
              <Link href="/parts/new">
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Part
              </Link>
            </Button>
          ) : undefined
        }
      />
      <PartsView parts={parts} isAdmin={isAdmin} />
    </div>
  )
}
