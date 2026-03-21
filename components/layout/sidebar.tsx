"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import { FilterModal } from "@/components/layout/filter-modal"
import { getNavLinks } from "@/lib/navigation-config"
import { useAuth } from "@/lib/auth-context"
import { useFilter } from "@/lib/filter-context"
import { useNotifications } from "@/lib/notification-context"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const { user, userData } = useAuth()
  const { isFilterModalOpen, toggleFilterModal } = useFilter()
  const { unreadCount } = useNotifications()

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const isSalonContext = !!(pathname.startsWith("/salon/") && params.id)
  const salonId = params.id as string | undefined

  const navLinks = getNavLinks(
    userData?.role,
    isSalonContext,
    salonId,
    !!user,
    () => toggleFilterModal(true)
  )

  const handleLogout = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <>
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-0 flex-col glass border-r border-border transition-all w-[60px] lg:w-[220px]"
        style={{ zIndex: "var(--z-sidebar)" }}
      >
        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navLinks.map((link, index) => {
            const Icon = link.icon

            let isActive = false
            if (link.href) {
              isActive = link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
              // Exact match for salon overview to avoid matching sub-pages
              if (salonId && link.href === `/salon/${salonId}`) {
                isActive = pathname === link.href
              }
            }

            const content = (
              <>
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    isActive ? "stroke-[2.5px]" : "stroke-2"
                  )}
                />
                <span className="hidden lg:block text-sm font-medium truncate">{link.label}</span>
                {link.badge === "unread-messages" && unreadCount > 0 && (
                  <Badge className="hidden lg:flex ml-auto bg-primary text-primary-foreground border-none h-5 min-w-[20px] px-1.5 items-center justify-center text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </Badge>
                )}
              </>
            )

            const commonClass = cn(
              "relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors min-h-[44px]",
              isActive
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:bg-primary-subtle hover:text-foreground"
            )

            if (link.onClick) {
              return (
                <div key={index} className="relative group">
                  <button
                    type="button"
                    onClick={link.onClick}
                    className={cn(commonClass, "w-full")}
                    aria-label={link.label}
                  >
                    {content}
                  </button>
                  <span className="lg:hidden absolute left-full ml-2 z-10 hidden group-hover:block bg-surface text-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow border border-border">
                    {link.label}
                  </span>
                </div>
              )
            }

            return (
              <div key={link.href} className="relative group">
                <Link href={link.href!} className={commonClass} aria-label={link.label}>
                  {content}
                </Link>
                <span className="lg:hidden absolute left-full ml-2 z-10 hidden group-hover:block bg-surface text-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow border border-border">
                  {link.label}
                  {link.badge === "unread-messages" && unreadCount > 0 && (
                    <span className="ml-1 font-bold text-primary">({unreadCount})</span>
                  )}
                </span>
              </div>
            )
          })}
        </nav>

        {/* User card — visible only at lg+ */}
        <div className="hidden lg:block border-t border-border p-3">
          {userData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-accent/50">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent-warm/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {userData.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-xs font-bold text-foreground">{userData.name ?? "Felhasználó"}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{userData.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs">Kijelentkezés</span>
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full text-xs font-semibold rounded-xl"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Bejelentkezés
            </Button>
          )}
        </div>
      </aside>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <FilterModal isOpen={isFilterModalOpen} onClose={() => toggleFilterModal(false)} />
    </>
  )
}
