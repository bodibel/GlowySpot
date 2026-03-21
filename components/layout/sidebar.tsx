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
import { FilterPanel } from "@/components/layout/filter-panel"
import { getSalonLinks } from "@/lib/navigation-config"
import { adminLinks, authLinks, loggedInVisitorLinks } from "@/lib/navigation-config"
import { useAuth } from "@/lib/auth-context"
import { useFilter } from "@/lib/filter-context"
import { useNotifications } from "@/lib/notification-context"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()
  const params = useParams()
  const { user, userData } = useAuth()
  const { isFilterModalOpen, toggleFilterModal, clearFilters } = useFilter()
  const { unreadCount } = useNotifications()

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const isSalonContext = !!(pathname.startsWith("/salon/") && params.id)
  const salonId = params.id as string | undefined
  const isAdmin = userData?.role === "admin"
  const isOnDashboard = pathname?.startsWith("/dashboard")

  // Nav links per context
  const navLinks = isSalonContext && salonId
    ? getSalonLinks(salonId)
    : isAdmin
      ? adminLinks
      : isOnDashboard && userData
        ? [...authLinks, ...loggedInVisitorLinks]
        : null   // main pages → show filter panel

  const showNavLinks = !!(navLinks && (isSalonContext || isAdmin || isOnDashboard))
  const showFilterPanel = !showNavLinks

  return (
    <>
      <aside
        className="hidden lg:flex flex-col glass border-r border-border w-[220px] flex-shrink-0 sticky top-[80px] self-start h-[calc(100vh-5rem)] overflow-y-auto"
        style={{ zIndex: "var(--z-sidebar)" }}
      >
        {/* ── Nav links (salon / admin context) ── */}
        {showNavLinks && navLinks && (
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon
              let isActive = false
              if (link.href) {
                isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                if (salonId && link.href === `/salon/${salonId}`) {
                  isActive = pathname === link.href
                }
              }

              const content = (
                <>
                  <Icon className={cn("h-5 w-5 shrink-0 transition-transform", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                  <span className="text-sm font-medium truncate">{link.label}</span>
                  {link.badge === "unread-messages" && unreadCount > 0 && (
                    <Badge className="ml-auto bg-primary text-primary-foreground border-none h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full">
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
                  <button key={index} type="button" onClick={link.onClick} className={cn(commonClass, "w-full")}>
                    {content}
                  </button>
                )
              }

              return (
                <Link key={link.href} href={link.href!} className={commonClass}>
                  {content}
                </Link>
              )
            })}
          </nav>
        )}

        {/* ── Inline Filter Panel (main context) ── */}
        {showFilterPanel && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <span className="text-sm font-semibold text-foreground">Szűrők</span>
              <button
                onClick={clearFilters}
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors"
              >
                Alaphelyzet
              </button>
            </div>

            {/* Filter content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <FilterPanel compact />
            </div>

            {/* Apply button */}
            <div className="flex-shrink-0 border-t border-border p-3">
              <Button className="w-full text-sm rounded-xl font-semibold">
                Szűrés alkalmazása
              </Button>
            </div>
          </>
        )}

        {/* ── Logged-in user nav links (non-salon, non-admin) ── */}
        {!showNavLinks && !showFilterPanel && navLinks && (
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navLinks.map((link, index) => {
              const Icon = link.icon
              const isActive = link.href
                ? link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
                : false
              const commonClass = cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors min-h-[44px]",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-primary-subtle hover:text-foreground"
              )
              if (link.onClick) {
                return (
                  <button key={index} type="button" onClick={link.onClick} className={cn(commonClass, "w-full")}>
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium truncate">{link.label}</span>
                    {link.badge === "unread-messages" && unreadCount > 0 && (
                      <Badge className="ml-auto bg-primary text-primary-foreground border-none h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                )
              }
              return (
                <Link key={link.href} href={link.href!} className={commonClass}>
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium truncate">{link.label}</span>
                  {link.badge === "unread-messages" && unreadCount > 0 && (
                    <Badge className="ml-auto bg-primary text-primary-foreground border-none h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        )}

        {/* ── User card — bottom ── */}
        <div className="flex-shrink-0 border-t border-border p-3">
          {userData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary">
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
                onClick={() => signOut({ callbackUrl: "/" })}
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
