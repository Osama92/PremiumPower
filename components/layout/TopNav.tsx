"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials } from "@/lib/utils"
import { Zap, ShoppingCart, Bell, LogOut, Menu, X } from "lucide-react"
import { useCartStore } from "@/hooks/useCart"
import { useState } from "react"

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal" },
  { label: "Rent Generator", href: "/portal/rentals" },
  { label: "Repairs", href: "/portal/repairs" },
  { label: "Spare Parts", href: "/portal/store" },
  { label: "Maintenance", href: "/portal/maintenance" },
  { label: "Guides", href: "/portal/guides" },
]

export function TopNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const cartItems = useCartStore((s) => s.items)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/portal" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1B3A5C] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#D4A843]" />
            </div>
            <span className="font-bold text-[#1B3A5C] text-lg">PPS Hub</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href))
                    ? "bg-[#1B3A5C] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/portal/store/cart" className="relative p-2 rounded-lg hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4A843] text-[#1B3A5C] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User */}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-[#1B3A5C] text-white text-xs font-bold">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {session.user.name.split(" ")[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{session.user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/portal/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/portal/messages">Messages</Link>
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
            )}

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden py-3 border-t border-gray-100">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium mb-1",
                  pathname === link.href || (link.href !== "/portal" && pathname.startsWith(link.href))
                    ? "bg-[#1B3A5C] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
