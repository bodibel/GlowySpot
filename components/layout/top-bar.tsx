"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AuthModal } from "@/components/auth/auth-modal"

export function TopBar() {
  const { user, userData } = useAuth()
  const { unreadCount } = useNotifications()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <header
        className="glass sticky top-0 w-full rounded-none border-b"
        style={{ zIndex: "var(--z-topbar)" }}
      >
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 text-xl font-light tracking-[0.15em] text-foreground hover:opacity-80 transition-opacity"
          >
            GlowySpot
          </Link>

          {/* Search — full on desktop, hidden on mobile */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="glass-solid flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground cursor-pointer hover:border-primary/30 transition-colors">
              <Search className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:block">Keresés...</span>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search icon (mobile only) */}
            <button
              type="button"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent transition-colors"
              aria-label="Keresés"
            >
              <Search className="h-5 w-5" />
            </button>

            {user && (
              <>
                <Link
                  href="/dashboard/messages"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl hover:bg-accent transition-colors"
                  aria-label="Üzenetek"
                >
                  <MessageSquare className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/profile/me"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-rose text-sm font-bold text-white ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  aria-label="Profilom"
                >
                  {userData?.name?.[0] || "U"}
                </Link>
              </>
            )}

            {!user && (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors"
              >
                Bejelentkezés
              </button>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}
