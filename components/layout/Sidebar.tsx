"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ADMIN_NAV, CS_NAV, ENGINEER_NAV } from "@/lib/constants"
import { UserMenu } from "./UserMenu"
import Image from "next/image"
import {
  LayoutDashboard, Gauge, CalendarDays, Wrench, Package, ShoppingCart,
  ClipboardCheck, Users, BarChart3, BookOpen, MessageSquare, UserCog,
  ClipboardList, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Gauge, CalendarDays, Wrench, Package, ShoppingCart,
  ClipboardCheck, Users, BarChart3, BookOpen, MessageSquare, UserCog, ClipboardList,
}

export function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = session?.user?.role
  const navItems = role === "ADMIN" ? ADMIN_NAV : role === "CUSTOMER_SERVICE" ? CS_NAV : ENGINEER_NAV

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-[14px] border-b border-white/10",
        collapsed && !mobile ? "justify-center px-3" : ""
      )}>
        <div className="flex-shrink-0 w-8 h-8 rounded overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/pps-logo.png"
            alt="PPS"
            width={32}
            height={32}
            className="object-contain w-7 h-7"
          />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-none tracking-wide">PPS Hub</p>
            <p className="text-[10px] text-white/45 mt-0.5 leading-none">Premium Power Solutions</p>
          </div>
        )}
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-white/50 hover:text-white hover:bg-white/10 h-7 w-7"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        <ul className={cn("space-y-px", collapsed && !mobile ? "px-2" : "px-2")}>
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed && !mobile ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md text-[13px] font-medium transition-all duration-150",
                    collapsed && !mobile ? "justify-center p-2.5" : "px-2.5 py-2",
                    isActive
                      ? "bg-[#D4A843] text-[#0f2440] font-semibold"
                      : "text-white/65 hover:text-white hover:bg-white/10",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Menu */}
      <div className="border-t border-white/10 p-2.5">
        <UserMenu collapsed={collapsed && !mobile} />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out flex-shrink-0",
        "bg-[#0f2440]",
        collapsed ? "w-[56px]" : "w-[210px]"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 bg-[#0f2440] border border-white/15 rounded-full p-1 shadow-lg text-white/50 hover:text-white transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#0f2440] text-white rounded-md p-2 shadow-lg border border-white/10"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[210px] bg-[#0f2440] text-white border-0">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}
