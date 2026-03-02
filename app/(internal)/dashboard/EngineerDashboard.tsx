"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/dashboard/KPICard"
import { StatusBadge, UrgencyBadge } from "@/components/shared/StatusBadge"
import { Wrench, CheckCircle, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Props {
  myJobs: { id: string; status: string; urgency: string; generatorBrand: string; location: string | null; customer: { name: string } | null }[]
  completedToday: number
  pendingVisits: number
}

export function EngineerDashboard({ myJobs, completedToday, pendingVisits }: Props) {
  const emergencyJobs = myJobs.filter((j) => j.urgency === "EMERGENCY")
  const urgentJobs = myJobs.filter((j) => j.urgency === "URGENT")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A5C]">Engineer Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your assigned jobs and schedule</p>
      </div>

      <div className="flex gap-2">
        <Button asChild size="sm" className="bg-[#1B3A5C]">
          <Link href="/jobs">All Jobs</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/maintenance">Maintenance</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Active Jobs" value={myJobs.length} icon={<Wrench className="h-5 w-5" />} color="blue" />
        <KPICard title="Completed Today" value={completedToday} icon={<CheckCircle className="h-5 w-5" />} color="green" />
        <KPICard title="Pending Visits" value={pendingVisits} icon={<Calendar className="h-5 w-5" />} color="gold" />
        <KPICard title="Emergency Jobs" value={emergencyJobs.length} icon={<AlertCircle className="h-5 w-5" />} color={emergencyJobs.length > 0 ? "red" : "green"} />
      </div>

      {emergencyJobs.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Emergency Jobs — Immediate Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            {emergencyJobs.map((job) => (
              <Link key={job.id} href={`/repairs/${job.id}`} className="flex items-center justify-between p-2 rounded hover:bg-red-100 transition-colors">
                <div>
                  <p className="text-sm font-semibold">{job.customer?.name}</p>
                  <p className="text-xs text-red-600">{job.generatorBrand} · {job.location || "Location TBD"}</p>
                </div>
                <StatusBadge status={job.status} type="repair" />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B3A5C] text-base">My Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myJobs.map((job) => (
              <Link key={job.id} href={`/repairs/${job.id}`} className="flex items-center justify-between p-3 border rounded-lg hover:border-[#1B3A5C]/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{job.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{job.generatorBrand} · {job.location || "Lagos"}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <UrgencyBadge urgency={job.urgency} />
                  <StatusBadge status={job.status} type="repair" />
                </div>
              </Link>
            ))}
            {myJobs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No active jobs assigned</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
