import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-4 text-muted-foreground/40">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>}
      {actionLabel && (
        <div className="mt-4">
          {actionHref ? (
            <Button asChild className="bg-[#1B3A5C] hover:bg-[#1B3A5C]/90">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} className="bg-[#1B3A5C] hover:bg-[#1B3A5C]/90">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
