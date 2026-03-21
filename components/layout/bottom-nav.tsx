"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Heart, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/providers", label: "Keresés", icon: Search },
  null, // center slot for floating button
  { href: "/dashboard/favorites", label: "Kedvencek", icon: Heart },
  { href: "/profile/me", label: "Profil", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 flex h-16 items-center justify-around rounded-none border-t border-border md:hidden"
      style={{
        zIndex: "var(--z-bottom-nav)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {navItems.map((item) => {
        if (!item) {
          // Center floating button: create post for logged-in users, search for guests
          if (user) {
            return (
              <Link
                key="center"
                href="/salon"
                className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-white shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95"
                aria-label="Új bejegyzés létrehozása"
              >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </Link>
            )
          }
          return (
            <Link
              key="center"
              href="/providers"
              className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-warm text-white shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95"
              aria-label="Keresés"
            >
              <Search className="h-6 w-6" strokeWidth={2.5} />
            </Link>
          )
        }

        const Icon = item.icon
        const isActive = item.href === "/"
          ? pathname === "/"
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 transition-colors min-w-[44px] min-h-[44px] justify-center",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={item.label}
          >
            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
