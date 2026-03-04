"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/constants"
import { LogOut, User, Settings } from "lucide-react"
import type { Role } from "@/types"

export function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const { data: session } = useSession()
  if (!session?.user) return null

  const { name, email, role } = session.user
  const initials = getInitials(name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-3 w-full rounded-md p-2 hover:bg-white/10 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-[#D4A843] text-[#0f2440] text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-semibold text-white truncate leading-none">{name}</p>
              <p className="text-[11px] text-white/50 mt-0.5 leading-none">{ROLE_LABELS[role as Role]}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align={collapsed ? "center" : "end"} className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{name}</p>
          <p className="text-xs text-muted-foreground font-normal">{email}</p>
          <p className="text-xs text-[#0f2440] font-medium">{ROLE_LABELS[role as Role]}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
