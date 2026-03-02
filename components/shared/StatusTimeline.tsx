import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Clock } from "lucide-react"
import type { RentalStatus, RepairStatus } from "@/types"
import { RENTAL_STATUS_STEPS, REPAIR_STATUS_STEPS } from "@/lib/constants"

interface TimelineProps {
  currentStatus: string
  type: "rental" | "repair"
  cancelled?: boolean
}

export function StatusTimeline({ currentStatus, type, cancelled }: TimelineProps) {
  const steps = type === "rental" ? RENTAL_STATUS_STEPS : REPAIR_STATUS_STEPS

  const currentIndex = steps.findIndex((s) => s.status === currentStatus)

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
      <ol className="space-y-4">
        {steps.map((step, index) => {
          const isDone = currentIndex > index
          const isActive = currentIndex === index
          const isPending = currentIndex < index

          return (
            <li key={step.status} className="flex items-start gap-4 pl-2">
              <div className="relative z-10 mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 bg-white rounded-full" />
                ) : isActive ? (
                  <div className="h-6 w-6 rounded-full bg-[#1B3A5C] border-2 border-[#1B3A5C] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 bg-white rounded-full" />
                )}
              </div>
              <div className={cn(
                "flex-1 pb-4",
                isActive && "font-semibold text-[#1B3A5C]",
                isPending && "text-gray-400",
                isDone && "text-gray-600"
              )}>
                <p className="text-sm">{step.label}</p>
                {isActive && !cancelled && (
                  <p className="text-xs text-[#D4A843] font-normal flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> Current status
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
