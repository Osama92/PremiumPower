import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate, getInitials } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/constants"
import type { Role } from "@/types"

export default async function StaffPage() {
  const staff = await prisma.user.findMany({
    where: { role: { not: "CUSTOMER" } },
    select: {
      id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
      _count: { select: { assignedRentals: true, assignedRepairs: true } },
    },
    orderBy: { role: "asc" },
  })

  const roleColors: Record<string, string> = {
    ADMIN: "bg-[#1B3A5C] text-white",
    CUSTOMER_SERVICE: "bg-indigo-100 text-indigo-800",
    ENGINEER: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Management" description={`${staff.length} team members`} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#1B3A5C] text-white font-bold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-[#1B3A5C]">{member.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[member.role] || "bg-gray-100"}`}>
                      {ROLE_LABELS[member.role as Role]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  {member.phone && <p className="text-xs text-muted-foreground">{member.phone}</p>}
                </div>
                {!member.isActive && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
              </div>
              {(member.role === "ENGINEER" || member.role === "CUSTOMER_SERVICE") && (
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t text-center">
                  <div>
                    <p className="text-sm font-bold text-[#1B3A5C]">{member._count.assignedRentals}</p>
                    <p className="text-xs text-muted-foreground">Rentals</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1B3A5C]">{member._count.assignedRepairs}</p>
                    <p className="text-xs text-muted-foreground">Repairs</p>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">Joined {formatDate(member.createdAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
