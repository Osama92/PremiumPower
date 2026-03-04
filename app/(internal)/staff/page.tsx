import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PageHeader } from "@/components/shared/PageHeader"
import { StaffView } from "./StaffView"

export default async function StaffPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  const staff = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    select: {
      id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
      _count: { select: { assignedRentals: true, assignedRepairs: true } },
    },
    orderBy: { role: "asc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" description={`${staff.length} team member${staff.length !== 1 ? "s" : ""}`} />
      <StaffView staff={staff} isAdmin={isAdmin} />
    </div>
  )
}
