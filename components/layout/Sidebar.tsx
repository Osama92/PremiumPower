"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ADMIN_NAV, CS_NAV, ENGINEER_NAV } from "@/lib/constants"
import { UserMenu } from "./UserMenu"
import {
  LayoutDashboard, Zap, CalendarDays, Wrench, Package, ShoppingCart,
  ClipboardCheck, Users, BarChart3, BookOpen, MessageSquare, UserCog,
  ClipboardList, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Zap, CalendarDays, Wrench, Package, ShoppingCart,
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
        "flex items-center gap-3 p-4 border-b border-sidebar-border",
        collapsed && !mobile ? "justify-center" : ""
      )}>
        <div className="w-8 h-8 rounded-lg bg-[#D4A843] flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-[#1B3A5C]" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="text-sm font-bold text-sidebar-foreground leading-none">PPS Hub</p>
            <p className="text-xs text-sidebar-foreground/60">Premium Power</p>
          </div>
        )}
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#D4A843] text-[#1B3A5C]"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    collapsed && !mobile ? "justify-center px-2" : ""
                  )}
                  title={collapsed && !mobile ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {(!collapsed || mobile) && <span>{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <UserMenu collapsed={collapsed && !mobile} />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground h-screen sticky top-0 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-sidebar border border-sidebar-border rounded-full p-1 shadow-md text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#1B3A5C] text-white rounded-lg p-2 shadow-lg"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-0">
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>
    </>
  )
}
