import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate, getInitials } from "@/lib/utils"
import { Phone } from "lucide-react"
import Link from "next/link"

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
      <PageHeader title="Customers" description={`${customers.length} registered customers`} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Link key={customer.id} href={`/customers/${customer.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#1B3A5C] text-white text-sm font-bold">
                      {getInitials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1B3A5C] truncate">{customer.name}</p>
                      {!customer.isActive && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                    {customer.phone && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{customer.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center">
                  <div>
                    <p className="text-sm font-bold text-[#1B3A5C]">{customer._count.rentalRequests}</p>
                    <p className="text-xs text-muted-foreground">Rentals</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B3A5C]">{customer._count.repairRequests}</p>
                    <p className="text-xs text-muted-foreground">Repairs</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B3A5C]">{customer._count.orders}</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Since {formatDate(customer.createdAt)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {customers.length === 0 && <p className="text-muted-foreground col-span-3 text-center py-12">No customers yet</p>}
      </div>
    </div>
  )
}
