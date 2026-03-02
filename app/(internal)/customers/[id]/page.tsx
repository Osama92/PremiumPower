import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate, formatNaira, getInitials } from "@/lib/utils"
import Link from "next/link"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const customer = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER" },
    select: {
      id: true, name: true, email: true, phone: true, address: true, createdAt: true,
      rentalRequests: {
        orderBy: { createdAt: "desc" },
        include: { generator: { select: { brand: true, kvaCapacity: true } } },
        take: 10,
      },
      repairRequests: { orderBy: { createdAt: "desc" }, take: 10 },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: { include: { sparePart: { select: { name: true } } } } },
        take: 10,
      },
    },
  })

  if (!customer) notFound()

  return (
    <div className="space-y-6">
      <PageHeader title={customer.name} description={customer.email} />

      {/* Profile card */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-[#1B3A5C] text-white text-xl font-bold">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-[#1B3A5C]">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              {customer.phone && <p className="text-sm">{customer.phone}</p>}
              {customer.address && <p className="text-sm text-muted-foreground">{customer.address}</p>}
              <p className="text-xs text-muted-foreground mt-1">Customer since {formatDate(customer.createdAt)}</p>
            </div>
            <div className="ml-auto grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Rentals", value: customer.rentalRequests.length },
                { label: "Repairs", value: customer.repairRequests.length },
                { label: "Orders", value: customer.orders.length },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-[#1B3A5C]">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rentals">
        <TabsList>
          <TabsTrigger value="rentals">Rentals ({customer.rentalRequests.length})</TabsTrigger>
          <TabsTrigger value="repairs">Repairs ({customer.repairRequests.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({customer.orders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="rentals" className="space-y-3 mt-4">
          {customer.rentalRequests.map((r) => (
            <Link key={r.id} href={`/rentals/${r.id}`}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.kvaNeeded}KVA — {r.generator?.brand || "No generator"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(r.startDate)} → {formatDate(r.endDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.totalCost && <span className="text-sm font-medium text-[#D4A843]">{formatNaira(r.totalCost)}</span>}
                    <StatusBadge status={r.status} type="rental" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {customer.rentalRequests.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No rentals</p>}
        </TabsContent>

        <TabsContent value="repairs" className="space-y-3 mt-4">
          {customer.repairRequests.map((r) => (
            <Link key={r.id} href={`/repairs/${r.id}`}>
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.generatorBrand}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{r.problemDescription}</p>
                  </div>
                  <StatusBadge status={r.status} type="repair" />
                </CardContent>
              </Card>
            </Link>
          ))}
          {customer.repairRequests.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No repairs</p>}
        </TabsContent>

        <TabsContent value="orders" className="space-y-3 mt-4">
          {customer.orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{o.items.map((i) => i.sparePart?.name).join(", ")}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#D4A843]">{formatNaira(o.totalAmount)}</span>
                  <StatusBadge status={o.status} type="order" />
                </div>
              </CardContent>
            </Card>
          ))}
          {customer.orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No orders</p>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
