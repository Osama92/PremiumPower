"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Settings } from "lucide-react"

const ALL_STATUSES = [
  "SUBMITTED", "ASSESSED", "QUOTE_SENT", "APPROVED",
  "IN_PROGRESS", "PARTS_ORDERED", "COMPLETED", "INVOICED", "PAID", "CANCELLED"
]

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: "Submitted", ASSESSED: "Assessed", QUOTE_SENT: "Quote Sent",
  APPROVED: "Approved", IN_PROGRESS: "In Progress", PARTS_ORDERED: "Parts Ordered",
  COMPLETED: "Completed", INVOICED: "Invoiced", PAID: "Paid", CANCELLED: "Cancelled",
}

// Engineers can only progress to specific statuses
const ENGINEER_STATUSES = ["IN_PROGRESS", "PARTS_ORDERED", "COMPLETED"]

interface Props {
  repairId: string
  currentStatus: string
  engineers: { id: string; name: string }[]
  currentEngineerId?: string
  isEngineer?: boolean
}

export function RepairStatusUpdate({ repairId, currentStatus, engineers, currentEngineerId, isEngineer }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [engineerId, setEngineerId] = useState(currentEngineerId || "")
  const [diagnosisNotes, setDiagnosisNotes] = useState("")
  const [estimatedCost, setEstimatedCost] = useState("")
  const [finalCost, setFinalCost] = useState("")
  const [loading, setLoading] = useState(false)

  const availableStatuses = isEngineer ? ENGINEER_STATUSES : ALL_STATUSES

  async function save() {
    setLoading(true)
    try {
      const body: Record<string, unknown> = { status }
      if (engineerId && !isEngineer) body.engineerId = engineerId
      if (diagnosisNotes) body.diagnosisNotes = diagnosisNotes
      if (estimatedCost) body.estimatedCost = parseFloat(estimatedCost)
      if (finalCost) body.finalCost = parseFloat(finalCost)

      const res = await fetch(`/api/repairs/${repairId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      toast.success("Repair updated")
      setOpen(false)
      router.refresh()
    } catch {
      toast.error("Update failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-[#1B3A5C]">
          <Settings className="mr-2 h-4 w-4" />
          Update Repair
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Repair Job</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isEngineer && (
            <div>
              <Label>Assign Engineer</Label>
              <Select value={engineerId} onValueChange={setEngineerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select engineer" />
                </SelectTrigger>
                <SelectContent>
                  {engineers.map((eng) => (
                    <SelectItem key={eng.id} value={eng.id}>{eng.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Diagnosis Notes (optional)</Label>
            <Textarea
              value={diagnosisNotes}
              onChange={(e) => setDiagnosisNotes(e.target.value)}
              placeholder="Technical findings..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!isEngineer && (
              <div>
                <Label>Estimated Cost (₦)</Label>
                <Input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
            {(status === "COMPLETED" || status === "INVOICED" || status === "PAID") && (
              <div>
                <Label>Final Cost (₦)</Label>
                <Input
                  type="number"
                  value={finalCost}
                  onChange={(e) => setFinalCost(e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>

          <Button onClick={save} disabled={loading} className="w-full bg-[#1B3A5C]">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
