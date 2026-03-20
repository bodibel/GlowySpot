"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
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
