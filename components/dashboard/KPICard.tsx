import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: React.ReactNode
  color?: "blue" | "gold" | "green" | "red" | "purple"
  subtitle?: string
}

const COLOR_MAP = {
  blue:   { bar: "bg-[#0f2440]", icon: "bg-[#0f2440]/8 text-[#0f2440]" },
  gold:   { bar: "bg-[#D4A843]", icon: "bg-[#D4A843]/10 text-[#b88a25]" },
  green:  { bar: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600" },
  red:    { bar: "bg-red-500", icon: "bg-red-50 text-red-600" },
  purple: { bar: "bg-violet-500", icon: "bg-violet-50 text-violet-600" },
}

function getValueSize(value: string | number): string {
  const str = String(value)
  if (str.length > 14) return "text-[13px]"
  if (str.length > 10) return "text-[16px]"
  if (str.length > 7) return "text-[20px]"
  return "text-[26px]"
}

export function KPICard({ title, value, change, changeType = "neutral", icon, color = "blue", subtitle }: KPICardProps) {
  const colors = COLOR_MAP[color]
  const valueSize = getValueSize(value)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-150">
      <div className={cn("h-[3px] w-full", colors.bar)} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider leading-none truncate">{title}</p>
            <p className={cn("font-bold text-gray-900 mt-2 leading-tight tracking-tight break-words", valueSize)}>{value}</p>
            {subtitle && (
              <p className="text-[11px] text-gray-400 mt-1.5 truncate">{subtitle}</p>
            )}
            {change && (
              <div className={cn(
                "flex items-center gap-1 mt-1.5 text-[11px] font-medium",
                changeType === "positive" && "text-emerald-600",
                changeType === "negative" && "text-red-500",
                changeType === "neutral" && "text-gray-400",
              )}>
                {changeType === "positive" ? <TrendingUp className="h-3 w-3 flex-shrink-0" /> :
                 changeType === "negative" ? <TrendingDown className="h-3 w-3 flex-shrink-0" /> :
                 <Minus className="h-3 w-3 flex-shrink-0" />}
                <span className="truncate">{change}</span>
              </div>
            )}
          </div>
          <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5", colors.icon)}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
