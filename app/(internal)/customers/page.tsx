import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { CustomersView } from "./CustomersView"

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true, name: true, email: true, phone: true, address: true, createdAt: true, isActive: true,
      _count: { select: { rentalRequests: true, repairRequests: true, orders: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description={`${customers.length} registered customer${customers.length !== 1 ? "s" : ""}`} />
      <CustomersView customers={customers} />
    </div>
  )
}
