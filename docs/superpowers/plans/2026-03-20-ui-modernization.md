# UI Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize GlowySpot's UI with a Soft Violet color palette, glassmorphism components, hybrid navigation (top bar + sidebar), dark/light theme toggle, and a responsive layout with mobile bottom navigation.

**Architecture:** Replace the current pink/white design system with a Soft Violet Tailwind v4 theme. Restructure the layout from a single `xl` breakpoint with hamburger nav into a three-tier responsive layout: desktop (top bar + text sidebar), tablet (top bar + icon sidebar), mobile (simplified top bar + bottom nav). New shared navigation config eliminates link duplication across sidebar and navbar.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4 (`@theme`), Radix UI / shadcn components, Lucide React icons, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `app/globals.css` | Modify | All CSS tokens (colors, radii, glass utilities, z-index, reduced-motion) |
| `app/layout.tsx` | Modify | Add FOIT script, wrap with ThemeProvider |
| `lib/theme-context.tsx` | Create | ThemeProvider, useTheme hook, localStorage + system preference |
| `lib/navigation-config.ts` | Create | Shared nav link arrays by role/context |
| `components/ui/theme-toggle.tsx` | Create | Sun/moon slide toggle |
| `components/ui/glass-card.tsx` | Create | Reusable glass-solid card wrapper |
| `components/layout/top-bar.tsx` | Create | Sticky top bar (all breakpoints) |
| `components/layout/bottom-nav.tsx` | Create | Mobile bottom navigation (<768px) |
| `components/layout/sidebar.tsx` | Modify | Glassmorphism, icon-only at md, text at lg+, uses navigation-config |
| `components/layout/navbar.tsx` | Modify | Keep file, gut to stub (preserved for `xl:hidden` backward compat during migration → deleted at end) |
| `components/layout/main-layout.tsx` | Modify | New responsive layout: top-bar, sidebar breakpoints, bottom-nav |
| `components/ui/button.tsx` | Modify | Add `gradient` variant (violet→rose), update border-radius to `rounded-xl` |
| `components/ui/input.tsx` | Modify | Glass background, updated border/focus, `rounded-xl` |
| `components/ui/card.tsx` | Modify | Add `glass` and `solid` variants |
| `components/ui/badge.tsx` | Modify | Pill shape (rounded-full), updated colors |
| `components/ui/dialog.tsx` | Modify | Glass background, stronger blur overlay |
| `components/home/feed-card.tsx` | Modify | Card Feed layout: header + media + action row + text below image |

---

## Phase 1 — Theme Foundation

### Task 1: Update globals.css with Soft Violet tokens

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css content**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter);

  /* Surfaces */
  --color-background: #faf5f8;
  --color-surface: #ffffff;
  --color-surface-glass: rgba(255,255,255,0.6);
  --color-foreground: #2d1f3d;

  /* Primary (violet) */
  --color-primary: #9b8ec4;
  --color-primary-hover: #7c6dab;
  --color-primary-foreground: #ffffff;

  /* shadcn tokens */
  --color-secondary: #f0ecf5;
  --color-secondary-foreground: #2d1f3d;
  --color-muted: #f5f0f8;
  --color-muted-foreground: #6b5a8a;
  --color-accent: #f0e4ef;
  --color-accent-foreground: #9b8ec4;
  --color-border: rgba(107,90,138,0.15);
  --color-input: rgba(107,90,138,0.15);
  --color-ring: #9b8ec4;
  --color-popover: #ffffff;
  --color-popover-foreground: #2d1f3d;

  /* Accent palette */
  --color-accent-rose: #d4a0b0;
  --color-accent-coral: #e8a090;
  --color-accent-peony: #e6cece;

  /* Border radii (increased for glass style) */
  --radius-lg: 0.75rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.25rem;

  /* Z-index scale */
  --z-bottom-nav: 40;
  --z-sidebar: 40;
  --z-topbar: 50;
  --z-overlay: 60;
  --z-modal: 70;
  --z-toast: 80;
}

/* Dark mode overrides */
.dark {
  --color-background: #1a1428;
  --color-surface: #2a2240;
  --color-surface-glass: rgba(42,34,64,0.6);
  --color-foreground: #f4e0e8;
  --color-primary-hover: #b4a5d6;
  --color-secondary: #2a2240;
  --color-secondary-foreground: #f4e0e8;
  --color-muted: #231c38;
  --color-muted-foreground: #8b7aad;
  --color-accent: #3a2f52;
  --color-accent-foreground: #d4a0b0;
  --color-accent-peony: #5e3f54;
  --color-border: rgba(155,142,196,0.15);
  --color-input: rgba(155,142,196,0.2);
  --color-popover: #2a2240;
  --color-popover-foreground: #f4e0e8;
}

/* Theme transition */
*, *::before, *::after {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Glassmorphism utilities */
.glass {
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
}

.glass-solid {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

@supports not (backdrop-filter: blur(20px)) {
  .glass { background: var(--color-surface); }
}

@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--color-surface);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-background);
  color: var(--color-foreground);
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | tail -20
```
Expected: Build succeeds (or shows only unrelated errors — no CSS parse errors)

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add app/globals.css && git commit -m "feat: replace color palette with Soft Violet theme tokens"
```

---

### Task 2: Create ThemeProvider with FOIT prevention

**Files:**
- Create: `lib/theme-context.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create lib/theme-context.tsx**

```tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("glowyspot-theme") as Theme | null
    if (stored) setThemeState(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    let resolved: "light" | "dark"

    if (theme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      resolved = theme
    }

    setResolvedTheme(resolved)
    if (resolved === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    if (theme !== "system") {
      localStorage.setItem("glowyspot-theme", theme)
    } else {
      localStorage.removeItem("glowyspot-theme")
    }
  }, [theme])

  // Also listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? "dark" : "light"
      setResolvedTheme(resolved)
      if (resolved === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 2: Update app/layout.tsx — add FOIT script and ThemeProvider**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { FilterProvider } from "@/lib/filter-context";
import { GoogleMapsProvider } from "@/components/GoogleMapsProvider";
import { NotificationProvider } from "@/lib/notification-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GlowySpot - Find Your Beauty Professional",
  description: "Book appointments with the best beauty professionals near you.",
  keywords: ["szépség", "fodrász", "kozmetika", "masszázs", "szalon", "Budapest", "Magyarország"],
  authors: [{ name: "GlowySpot" }],
  openGraph: {
    type: "website",
    locale: "hu_HU",
    url: "https://glowyspot.com",
    siteName: "GlowySpot",
    title: "GlowySpot - Szépségipar Szakemberei",
    description: "Találd meg a legjobb szépségipari szakembereket Magyarországon",
  },
  robots: { index: true, follow: true },
};

// Inline script to prevent flash-of-incorrect-theme (FOIT)
const foitScript = `
  (function() {
    try {
      var stored = localStorage.getItem('glowyspot-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var isDark = stored === 'dark' || (!stored && prefersDark);
      if (isDark) document.documentElement.classList.add('dark');
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: foitScript }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <GoogleMapsProvider>
              <FilterProvider>
                <NotificationProvider>
                  {children}
                  <Toaster richColors position="top-center" closeButton />
                </NotificationProvider>
              </FilterProvider>
            </GoogleMapsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | tail -20
```
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add lib/theme-context.tsx app/layout.tsx && git commit -m "feat: add ThemeProvider with dark/light mode and FOIT prevention"
```

---

### Task 3: Create ThemeToggle component

**Files:**
- Create: `components/ui/theme-toggle.tsx`

- [ ] **Step 1: Create theme-toggle.tsx**

```tsx
"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-7 w-12 items-center rounded-full border border-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDark ? "bg-primary/20" : "bg-muted",
        className
      )}
      aria-label="Téma váltása"
      aria-pressed={isDark}
    >
      <span
        className={cn(
          "absolute flex h-5 w-5 items-center justify-center rounded-full bg-primary transition-transform duration-200 shadow-sm",
          isDark ? "translate-x-6" : "translate-x-1"
        )}
      >
        {isDark
          ? <Moon className="h-3 w-3 text-primary-foreground" />
          : <Sun className="h-3 w-3 text-primary-foreground" />
        }
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No new errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/ui/theme-toggle.tsx && git commit -m "feat: add ThemeToggle sun/moon switch component"
```

---

## Phase 2 — Shared Navigation Config + Layout Restructure

### Task 4: Create navigation-config.ts

**Files:**
- Create: `lib/navigation-config.ts`

- [ ] **Step 1: Create lib/navigation-config.ts**

```ts
import {
  LayoutGrid, Users, Heart, Briefcase, User, Store,
  Settings, Calendar, Image as ImageIcon, FileText,
  Info, BarChart3, MessageSquare, MessageCircle,
  Filter, ShieldCheck
} from "lucide-react"

export interface NavLink {
  href?: string
  label: string
  icon: React.ElementType
  onClick?: () => void
  badge?: "unread-messages"
}

export const visitorLinks: NavLink[] = [
  { href: "/", label: "Bejegyzések", icon: LayoutGrid },
  { href: "/providers", label: "Szolgáltatók", icon: Users },
]

export const authLinks: NavLink[] = [
  { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare, badge: "unread-messages" },
  { href: "/dashboard/favorites", label: "Kedvencek", icon: Heart },
]

export const loggedInVisitorLinks: NavLink[] = [
  { href: "/profile/me", label: "Profilom", icon: User },
]

export const providerLinks: NavLink[] = [
  { href: "/dashboard/salons", label: "Vállalkozásom", icon: Store },
  { href: "/profile/me", label: "Profilom", icon: User },
]

export const adminLinks: NavLink[] = [
  { href: "/dashboard/admin/overview", label: "Áttekintés", icon: BarChart3 },
  { href: "/dashboard/admin/providers", label: "Szolgáltatók", icon: Briefcase },
  { href: "/dashboard/admin/visitors", label: "Látogatók", icon: Users },
  { href: "/dashboard/admin/settings", label: "Beállítások", icon: Settings },
]

export function getSalonLinks(salonId: string): NavLink[] {
  return [
    { href: `/salon/${salonId}`, label: "Áttekintés", icon: BarChart3 },
    { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare, badge: "unread-messages" },
    { href: `/salon/${salonId}/posts`, label: "Bejegyzéseim", icon: FileText },
    { href: `/salon/${salonId}/settings`, label: "Adatok", icon: Info },
    { href: `/salon/${salonId}/services`, label: "Szolgáltatások", icon: Briefcase },
    { href: `/salon/${salonId}/gallery`, label: "Galéria", icon: ImageIcon },
    { href: `/salon/${salonId}/hours`, label: "Nyitvatartás", icon: Calendar },
    { href: `/salon/${salonId}/team`, label: "Csapat / Rólam", icon: Users },
    { href: `/salon/${salonId}/contact`, label: "Kapcsolat", icon: Settings },
  ]
}

export function getNavLinks(
  role: string | undefined,
  isSalonContext: boolean,
  salonId: string,
  isLoggedIn: boolean,
  openFilters?: () => void
): NavLink[] {
  if (isSalonContext) return getSalonLinks(salonId)
  if (role === "admin") return [...visitorLinks, ...authLinks, ...adminLinks]
  if (role === "provider") return [...visitorLinks, ...authLinks, ...providerLinks]
  if (isLoggedIn) return [...visitorLinks, ...authLinks, ...loggedInVisitorLinks]

  const links: NavLink[] = [...visitorLinks]
  if (openFilters) {
    links.push({ label: "Szűrők", icon: Filter, onClick: openFilters })
  }
  return links
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors from the new file

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add lib/navigation-config.ts && git commit -m "feat: add shared navigation config (eliminates link duplication)"
```

---

### Task 5: Create TopBar component

**Files:**
- Create: `components/layout/top-bar.tsx`

- [ ] **Step 1: Create components/layout/top-bar.tsx**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { AuthModal } from "@/components/auth/auth-modal"
import { cn } from "@/lib/utils"

export function TopBar() {
  const { user, userData } = useAuth()
  const { unreadCount } = useNotifications()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <header
        className="glass sticky top-0 w-full rounded-none"
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

          {/* Search — full on desktop, icon on tablet */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="glass-solid flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground">
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
```

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/layout/top-bar.tsx && git commit -m "feat: add TopBar component with search, notifications, theme toggle"
```

---

### Task 6: Create BottomNav component

**Files:**
- Create: `components/layout/bottom-nav.tsx`

- [ ] **Step 1: Create components/layout/bottom-nav.tsx**

```tsx
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
      {navItems.map((item, index) => {
        if (!item) {
          // Center floating button
          return (
            <Link
              key="new-post"
              href={user ? "/salon" : "/auth/login"}
              className="relative -mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-rose text-white shadow-lg shadow-primary/30 ring-4 ring-background transition-transform active:scale-95"
              aria-label="Új bejegyzés létrehozása"
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
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
              "flex flex-col items-center gap-0.5 px-3 py-2 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-label={item.label}
          >
            {/* Active indicator */}
            <span
              className={cn(
                "absolute top-0 h-0.5 w-8 rounded-full transition-all",
                isActive ? "bg-primary" : "bg-transparent"
              )}
              style={{ position: "relative" }}
            />
            <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/layout/bottom-nav.tsx && git commit -m "feat: add BottomNav for mobile with floating action button"
```

---

### Task 7: Refactor Sidebar to use navigation-config + glassmorphism

**Files:**
- Modify: `components/layout/sidebar.tsx`

- [ ] **Step 1: Replace sidebar.tsx content**

Replace the full file with a version that:
- Imports `getNavLinks` from `@/lib/navigation-config`
- Shows icon + text at `lg+` breakpoint, icon-only at `md-lg`
- Uses glass utility class for the panel background
- Uses `var(--color-primary)` instead of `pink-*` classes

Key structural change — the sidebar wrapper:
```tsx
<aside
  className="hidden md:flex fixed left-0 top-14 bottom-0 flex-col glass border-r border-border transition-all"
  style={{ zIndex: "var(--z-sidebar)", width: "60px" }}
>
```
For desktop (lg+), text labels are visible alongside icons. Use Tailwind responsive classes:
```tsx
<span className="hidden lg:block text-sm font-medium">{link.label}</span>
```
And width:
```tsx
{/* On lg+, apply inline width 220px via CSS; otherwise 60px */}
className="hidden md:flex ... lg:w-[220px] w-[60px]"
```

Active state: violet accent instead of pink:
```tsx
isActive
  ? "bg-primary/10 text-primary border-l-2 border-primary"
  : "text-muted-foreground hover:bg-accent hover:text-foreground"
```

Icon-only tooltips at md (tablet):
```tsx
<div className="relative group" title={link.label}>
  <Icon />
  <span className="lg:hidden absolute left-full ml-2 hidden group-hover:block bg-surface text-foreground text-xs rounded px-2 py-1 whitespace-nowrap shadow border border-border">
    {link.label}
  </span>
</div>
```

**Note to implementer:** This file is authored from scratch (not a diff). Use the existing `sidebar.tsx` as a base and apply the following structural changes. Ensure the file:
1. Uses `getNavLinks(userData?.role, isSalonContext, salonId, !!user, openFilters)` from navigation-config
2. Renders AuthModal and FilterModal at bottom
3. No hardcoded `pink-*` color classes
4. User card at bottom of sidebar (visible only at `lg+`)

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/layout/sidebar.tsx && git commit -m "feat: refactor Sidebar to glassmorphism, icon/text responsive, use navigation-config"
```

---

### Task 8: Update MainLayout and deprecate Navbar

**Files:**
- Modify: `components/layout/main-layout.tsx`
- Modify: `components/layout/navbar.tsx`

- [ ] **Step 1: Update main-layout.tsx**

Replace with new responsive layout:

```tsx
"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { ActiveSalonIndicator } from "@/components/layout/active-salon-indicator"
import { cn } from "@/lib/utils"

export function MainLayout({
  children,
  showRightSidebar = true
}: {
  children: React.ReactNode
  showRightSidebar?: boolean
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar — all breakpoints */}
      <TopBar />

      <div className="flex max-w-[1440px] mx-auto relative">
        {/* Left sidebar — md and above */}
        <Sidebar />

        {/* Main content — offset by sidebar width */}
        <div className={cn(
          "flex flex-1 flex-col min-w-0 transition-all",
          "md:ml-[60px] lg:ml-[220px]" // matches sidebar widths
        )}>
          <ActiveSalonIndicator />

          <div className={cn(
            "flex gap-0 px-4 sm:px-6 lg:px-8 py-6 w-full",
            "pb-24 md:pb-6", // extra bottom padding for mobile bottom nav
            showRightSidebar ? "justify-center xl:justify-start" : "justify-center"
          )}>
            <main className={cn(
              "w-full transition-all duration-300",
              showRightSidebar ? "max-w-[680px]" : "max-w-7xl mx-auto"
            )}>
              {children}
            </main>

            {/* Right sidebar — xl only */}
            {showRightSidebar && (
              <div className="hidden flex-1 min-w-[360px] max-w-[420px] ml-8 xl:block">
                <div className="sticky top-20">
                  <RightSidebar />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
```

- [ ] **Step 2: Gut navbar.tsx to a no-op stub** (it may still be imported somewhere)

```tsx
// Deprecated — replaced by TopBar + BottomNav
// This file is kept to avoid import errors during migration.
// Safe to delete after verifying no remaining imports.
export function Navbar() {
  return null
}
```

- [ ] **Step 3: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 4: Check for remaining Navbar imports**

```bash
cd "C:\Dev\Glwyspot" && grep -r "from.*navbar" . --include="*.tsx" --include="*.ts" | grep -v node_modules
```
Expected: Only `components/layout/main-layout.tsx` (or none if already removed)

- [ ] **Step 5: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/layout/main-layout.tsx components/layout/navbar.tsx && git commit -m "feat: restructure MainLayout with TopBar+Sidebar+BottomNav, deprecate Navbar"
```

---

## Phase 3 — Component Restyling

### Task 9: Update Button component

**Files:**
- Modify: `components/ui/button.tsx`

- [ ] **Step 1: Update button.tsx variants**

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "gradient" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
      gradient: "bg-gradient-to-br from-primary to-accent-rose text-white hover:opacity-90 shadow-sm hover:scale-[1.02] transition-transform",
      destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    }

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
```

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/ui/button.tsx && git commit -m "feat: update Button with gradient variant and rounded-xl style"
```

---

### Task 10: Update Input, Card, Badge, Dialog components

**Files:**
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/card.tsx`
- Modify: `components/ui/badge.tsx`
- Create: `components/ui/glass-card.tsx`

- [ ] **Step 1: Update input.tsx**

Change the className in the `<input>` element:
```tsx
"flex h-10 w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
```

- [ ] **Step 2: Update card.tsx — add glass/solid variants**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "solid"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "solid", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl text-foreground",
        variant === "glass" && "glass shadow-lg",
        variant === "solid" && "glass-solid shadow-md",
        variant === "default" && "bg-surface border border-border shadow-md",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

// CardHeader, CardTitle, CardDescription, CardContent, CardFooter stay the same
// (copy from original file, no changes needed)
```

- [ ] **Step 3: Update badge.tsx**

The current badge already uses `rounded-full`. The only changes needed are increasing font-weight from `font-semibold` to `font-medium` (subtler look) and ensuring the `default` variant primary color uses token (already does). Replace the `badgeVariants` cva base string:

```tsx
// Change base string from:
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
// To:
"inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
```

Variants are already using token classes (`bg-primary`, `bg-secondary`) — no changes needed there.

- [ ] **Step 4: Create components/ui/glass-card.tsx**

```tsx
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: boolean // true = glass (blur), false = glass-solid (no blur, default)
}

export function GlassCard({ className, blur = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        blur ? "glass" : "glass-solid",
        "shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/ui/input.tsx components/ui/card.tsx components/ui/badge.tsx components/ui/glass-card.tsx && git commit -m "feat: update Input/Card/Badge to glass style, add GlassCard component"
```

---

### Task 11: Update Dialog for glass style

**Files:**
- Modify: `components/ui/dialog.tsx`

- [ ] **Step 1: Find the DialogContent overlay and content classes in dialog.tsx**

Read the file first to find exact classes, then update:
- Overlay: change `bg-black/80` → `bg-foreground/40 backdrop-blur-sm`
- Content: add `glass shadow-2xl` classes, change `rounded-lg` → `rounded-2xl`

- [ ] **Step 2: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 3: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/ui/dialog.tsx && git commit -m "feat: update Dialog with glass overlay and rounded-2xl style"
```

---

## Phase 4 — Feed Card Redesign

### Task 12: Redesign FeedCard to card-feed layout

**Files:**
- Modify: `components/home/feed-card.tsx`

The current FeedCard uses an image-first grid layout with text overlaid on the image. We need to change it to a **card-feed** layout: header → media → action row → text below image (Instagram-style but with more info).

- [ ] **Step 1: Update feed-card.tsx wrapper and layout**

Change the root element:
```tsx
// Before:
<div className="group relative w-full overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md">

// After:
<div className="group relative w-full overflow-hidden rounded-2xl bg-surface border border-border shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-lg">
```

- [ ] **Step 2: Add header row above image**

Add before `{renderImages()}`:
```tsx
{/* Card header */}
<div className="flex items-center gap-3 px-4 pt-4 pb-3">
  <Link href={`/profile/${post.author.id}`} className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity">
    <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
      <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
    </div>
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-foreground">{post.author.name}</p>
      <p className="text-[11px] text-muted-foreground">
        {post.author.role} · {formatDistanceToNow(post.createdAt, { locale: hu, addSuffix: true })}
      </p>
    </div>
  </Link>
  {post.author.rating && (
    <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
      <Star className="h-3.5 w-3.5 fill-amber-500" />
      <span className="text-xs font-bold">{post.author.rating.toFixed(1)}</span>
    </div>
  )}
</div>
```

Note: Add `import { formatDistanceToNow } from "date-fns"` and `import { hu } from "date-fns/locale"` at top. Check if date-fns is installed: `npm list date-fns`

- [ ] **Step 3: Move actions and text below media**

Remove the gradient overlay and bottom text from inside the image area. Add below `{renderImages()}`:
```tsx
{/* Actions row */}
<div className="flex items-center gap-4 px-4 py-3 border-t border-border/50">
  <button
    onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); if (onLike) onLike(post.id); }}
    className={cn("flex items-center gap-1.5 text-sm transition-colors hover:text-primary", isLiked && "text-primary")}
    aria-label="Kedvelés"
  >
    <Heart className={cn("h-5 w-5", isLiked && "fill-primary stroke-primary")} />
    <span className="font-medium">{post.likes + (isLiked && !post.isLiked ? 1 : (!isLiked && post.isLiked ? -1 : 0))}</span>
  </button>
  <button
    onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    aria-label="Hozzászólások"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="font-medium">{post.comments}</span>
  </button>
  <button
    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
    aria-label="Megosztás"
  >
    <Share2 className="h-5 w-5" />
  </button>
  <div className="flex-1" />
  <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Mentés">
    <Bookmark className="h-5 w-5" />
  </button>
</div>

{/* Text content */}
<div className="px-4 pb-4 space-y-2">
  <p className="text-sm text-foreground">
    <span className="font-semibold">{post.author.name} </span>
    <span
      className={cn("cursor-pointer", !isExpanded && "line-clamp-2")}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {post.content}
    </span>
    {!isExpanded && post.content.length > 100 && (
      <button
        className="text-muted-foreground text-xs font-medium hover:text-foreground ml-1"
        onClick={() => setIsExpanded(true)}
      >
        ... több
      </button>
    )}
  </p>

  {post.author.minPrice && post.author.minPrice > 0 && (
    <button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent-rose py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
      Foglalj időpontot · {post.author.minPrice} {post.author.currency}-tól
    </button>
  )}
</div>
```

- [ ] **Step 4: Add `isExpanded` state at top of component**

```tsx
const [isExpanded, setIsExpanded] = useState(false)
```

Add `Bookmark` to lucide imports.

- [ ] **Step 5: Verify build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```
Expected: No errors

- [ ] **Step 6: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add components/home/feed-card.tsx && git commit -m "feat: redesign FeedCard to card-feed layout with header, actions, text below image"
```

---

## Phase 5 — Polish & Accessibility

### Task 13: Remove hardcoded pink classes across the codebase

- [ ] **Step 1: Search for remaining pink classes**

```bash
cd "C:\Dev\Glwyspot" && grep -r "pink-\|rose-600\|from-pink\|to-rose" . --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".git"
```

- [ ] **Step 2: Replace each occurrence**

Common replacements:
- `bg-pink-600` / `bg-pink-500` → `bg-primary`
- `text-pink-600` / `text-pink-500` → `text-primary`
- `border-pink-` → `border-primary/30`
- `bg-pink-50` → `bg-accent`
- `from-pink-500 to-rose-600` → `from-primary to-accent-rose`
- `hover:text-pink-600` → `hover:text-primary`
- `ring-pink-` → `ring-primary/30`

Focus on these files first (highest density):
- `components/layout/sidebar.tsx` (already updated in Task 7)
- `components/layout/right-sidebar.tsx`
- `components/dashboard/` directory
- `components/salon/` directory
- `components/auth/` directory

- [ ] **Step 3: Verify build after changes**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1 | grep -E "error|Error" | head -10
```

- [ ] **Step 4: Commit**

```bash
cd "C:\Dev\Glwyspot" && git add -A && git commit -m "feat: replace hardcoded pink-* classes with CSS token classes"
```

---

### Task 14: Add ARIA labels and focus styles to new navigation components

- [ ] **Step 1: Verify ARIA labels on TopBar**

Open `components/layout/top-bar.tsx` and confirm:
- Search button has `aria-label="Keresés"`
- Messages link has `aria-label="Üzenetek"`
- Avatar link has `aria-label="Profilom"`
- ThemeToggle has `aria-label="Téma váltása"` (already in component)

- [ ] **Step 2: Verify ARIA labels on BottomNav**

Open `components/layout/bottom-nav.tsx` and confirm each nav item has `aria-label`.

- [ ] **Step 3: Verify sidebar icon-only tooltips**

In `components/layout/sidebar.tsx`, confirm that icon-only buttons (md breakpoint) have:
- `aria-label={link.label}` on each button/link
- Hover tooltip visible (`title` attribute or CSS tooltip)

- [ ] **Step 4: Test keyboard navigation manually**

Start dev server:
```bash
cd "C:\Dev\Glwyspot" && npm run dev
```
Open `http://localhost:3000` and Tab through the page. Verify:
- Top bar elements are reachable by keyboard
- Focus rings are visible (violet outline)
- Bottom nav items are reachable on mobile viewport (resize browser)

- [ ] **Step 5: Commit any a11y fixes**

```bash
cd "C:\Dev\Glwyspot" && git add -A && git commit -m "fix: ensure ARIA labels and keyboard accessibility on all nav components"
```

---

### Task 15: Final build verification and cleanup

- [ ] **Step 1: Run full build**

```bash
cd "C:\Dev\Glwyspot" && npm run build 2>&1
```
Expected: `✓ Compiled successfully` with no errors

- [ ] **Step 2: Run lint**

```bash
cd "C:\Dev\Glwyspot" && npm run lint 2>&1 | head -30
```
Fix any lint errors before proceeding.

- [ ] **Step 3: Delete navbar.tsx stub** (if no remaining imports)

```bash
cd "C:\Dev\Glwyspot" && grep -r "from.*navbar" . --include="*.tsx" --include="*.ts" | grep -v node_modules
```
If empty: delete the file and remove any import.

- [ ] **Step 4: Verify dark mode works in browser**

Start dev server, open `http://localhost:3000`:
1. Toggle dark mode — page should switch without flash
2. Refresh — theme should persist (no flash on reload)
3. Check sidebar at different viewport widths:
   - < 768px: no sidebar, bottom nav visible
   - 768-1023px: 60px icon sidebar, no bottom nav
   - 1024-1279px: 220px text sidebar, no right sidebar
   - 1280px+: full layout with right sidebar

- [ ] **Step 5: Final commit**

```bash
cd "C:\Dev\Glwyspot" && git add -A && git commit -m "feat: complete UI modernization - Soft Violet theme, glassmorphism, responsive layout"
```

---

## Quick Reference

### CSS Token Replacements
| Old (pink era) | New (violet era) |
|----------------|-----------------|
| `bg-pink-600` | `bg-primary` |
| `text-pink-600` | `text-primary` |
| `bg-pink-50` | `bg-accent` |
| `from-pink-500 to-rose-600` | `from-primary to-accent-rose` |
| `border-gray-200` | `border-border` |
| `bg-white` | `bg-surface` |
| `bg-gray-50` | `bg-muted` |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-900` | `text-foreground` |
| `rounded-2xl bg-white shadow-sm` | `glass-solid rounded-2xl shadow-md` |

### Dev Commands
```bash
npm run dev    # Start dev server at localhost:3000
npm run build  # Production build (run to check for errors)
npm run lint   # ESLint check
```
