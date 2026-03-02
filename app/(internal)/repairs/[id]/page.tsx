import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/shared/PageHeader"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { StatusTimeline } from "@/components/shared/StatusTimeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate, formatNaira, formatPhone } from "@/lib/utils"
import { User, Phone, Wrench, MapPin } from "lucide-react"
import { RepairStatusUpdate } from "./RepairStatusUpdate"

export default async function RepairDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const repair = await prisma.repairRequest.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      engineer: { select: { id: true, name: true, phone: true } },
      invoices: true,
      fieldReports: { include: { engineer: { select: { name: true } } } },
    },
  })

  if (!repair) notFound()

  const engineers = await prisma.user.findMany({
    where: { role: "ENGINEER", isActive: true },
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Repair #${repair.id.slice(-6).toUpperCase()}`}
        description={`${repair.generatorBrand} repair for ${repair.customer?.name}`}
        action={
          ["ADMIN", "CUSTOMER_SERVICE", "ENGINEER"].includes(session?.user?.role || "") ? (
            <RepairStatusUpdate
              repairId={repair.id}
              currentStatus={repair.status}
              engineers={engineers}
              currentEngineerId={repair.engineerId || undefined}
              isEngineer={session?.user?.role === "ENGINEER"}
            />
          ) : undefined
        }
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusTimeline currentStatus={repair.status} type="repair" cancelled={repair.status === "CANCELLED"} />
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm flex items-center justify-between">
              Repair Details
              <div className="flex gap-2">
                <UrgencyBadge urgency={repair.urgency} />
                <StatusBadge status={repair.status} type="repair" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Customer</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{repair.customer?.name}</span>
                </div>
                {repair.customer?.phone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatPhone(repair.customer.phone)}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Generator</p>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{repair.generatorBrand}</span>
                </div>
                {repair.generatorModel && <p className="text-xs text-muted-foreground ml-6">Model: {repair.generatorModel}</p>}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Problem Description</p>
              <p className="text-sm">{repair.problemDescription}</p>
            </div>

            {repair.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{repair.location}</p>
              </div>
            )}

            <Separator />

            {/* Cost info */}
            <div className="grid grid-cols-2 gap-3">
              {repair.estimatedCost && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Estimated Cost</p>
                  <p className="text-lg font-bold text-yellow-700">{formatNaira(repair.estimatedCost)}</p>
                </div>
              )}
              {repair.finalCost && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Final Cost</p>
                  <p className="text-lg font-bold text-green-700">{formatNaira(repair.finalCost)}</p>
                </div>
              )}
            </div>

            {repair.diagnosisNotes && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-700 mb-1">Diagnosis Notes</p>
                <p className="text-sm">{repair.diagnosisNotes}</p>
              </div>
            )}

            {repair.partsRequired && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Parts Required</p>
                <p className="text-sm">{repair.partsRequired}</p>
              </div>
            )}

            {repair.engineer && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-700">Assigned Engineer</p>
                  <p className="text-sm font-semibold">{repair.engineer.name}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Field Reports */}
      {repair.fieldReports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[#1B3A5C] text-sm">Field Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {repair.fieldReports.map((report) => (
              <div key={report.id} className="p-3 border rounded-lg mb-2 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{report.engineer?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</p>
                </div>
                <p className="text-sm text-gray-600">{report.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
