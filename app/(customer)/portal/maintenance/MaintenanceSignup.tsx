"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function MaintenanceSignup({ packageType, packageName }: { packageType: string; packageName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function subscribe() {
    setLoading(true)
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType, startDate: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Subscribed to ${packageName}! We'll schedule your first visit.`)
      router.refresh()
    } catch {
      toast.error("Subscription failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={subscribe}
      disabled={loading}
      className={`w-full ${packageType === "PREMIUM" ? "bg-[#D4A843] text-[#1B3A5C] hover:bg-[#D4A843]/90" : "bg-[#1B3A5C] hover:bg-[#1B3A5C]/90"}`}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Subscribe
    </Button>
  )
}
