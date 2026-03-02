"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/dashboard/KPICard"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { formatDate } from "@/lib/utils"
import { PhoneCall, ClipboardList, Bell, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Props {
  todayRentals: number
  pendingQuotes: number
  recentInteractions: { id: string; status: string; urgency: string; generatorBrand: string; createdAt: Date; customer: { name: string } | null }[]
}

export function CSDashboard({ todayRentals, pendingQuotes, recentInteractions }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Customer Service Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage customer requests and interactions</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button asChild size="sm" className="bg-[#1B3A5C]">
          <Link href="/rentals">Rental Requests</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/repairs">Repair Requests</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/customers">Customers</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Today's Bookings" value={todayRentals} icon={<ClipboardList className="h-5 w-5" />} color="blue" />
        <KPICard title="Pending Quotes" value={pendingQuotes} icon={<Bell className="h-5 w-5" />} color="gold" />
        <KPICard title="Follow-ups Due" value={3} icon={<PhoneCall className="h-5 w-5" />} color="red" />
        <KPICard title="Active Customers" value={pendingQuotes + todayRentals + 5} icon={<Users className="h-5 w-5" />} color="green" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B3A5C] text-base">Recent Repair Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentInteractions.map((r) => (
              <Link key={r.id} href={`/repairs/${r.id}`} className="flex items-center justify-between py-2 border-b last:border-0 hover:bg-gray-50 px-2 -mx-2 rounded">
                <div>
                  <p className="text-sm font-medium">{r.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{r.generatorBrand} · {formatDate(r.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <UrgencyBadge urgency={r.urgency} />
                  <StatusBadge status={r.status} type="repair" />
                </div>
              </Link>
            ))}
            {recentInteractions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No recent interactions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
