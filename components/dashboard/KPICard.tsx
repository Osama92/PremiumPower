import { Card, CardContent } from "@/components/ui/card"
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
  blue: { bg: "bg-[#1B3A5C]", icon: "bg-[#1B3A5C]/10 text-[#1B3A5C]" },
  gold: { bg: "bg-[#D4A843]", icon: "bg-[#D4A843]/10 text-[#D4A843]" },
  green: { bg: "bg-emerald-600", icon: "bg-emerald-50 text-emerald-600" },
  red: { bg: "bg-red-600", icon: "bg-red-50 text-red-600" },
  purple: { bg: "bg-purple-600", icon: "bg-purple-50 text-purple-600" },
}

export function KPICard({ title, value, change, changeType = "neutral", icon, color = "blue", subtitle }: KPICardProps) {
  const colors = COLOR_MAP[color]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-[#1B3A5C] mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            {change && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                changeType === "positive" && "text-green-600",
                changeType === "negative" && "text-red-600",
                changeType === "neutral" && "text-muted-foreground",
              )}>
                {changeType === "positive" ? <TrendingUp className="h-3 w-3" /> :
                 changeType === "negative" ? <TrendingDown className="h-3 w-3" /> :
                 <Minus className="h-3 w-3" />}
                {change}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", colors.icon)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
