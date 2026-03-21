"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { ActiveSalonIndicator } from "@/components/layout/active-salon-indicator"
import { cn } from "@/lib/utils"

export function MainLayout({
  children,
  showRightSidebar = true,
  fullWidth = false,
}: {
  children: React.ReactNode
  showRightSidebar?: boolean
  fullWidth?: boolean
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* TopBar — sticky, full width, content within 1440px */}
      <TopBar />

      {/* 1440px container — three-column layout */}
      <div className="mx-auto max-w-[1440px] flex items-start">

        {/* Left sidebar — sticky within the 1440px container */}
        <Sidebar />

        {/* Center + Right — fills remaining space */}
        <div className="flex-1 min-w-0 flex items-start gap-6 pl-6 py-5 pb-24 md:pb-8">

          {/* Main feed */}
          <main className={cn(
            "w-full min-w-0",
            fullWidth
              ? "flex-1"
              : showRightSidebar
                ? "flex-shrink-0 lg:max-w-[480px] xl:max-w-[640px]"
                : "max-w-[680px] mx-auto flex-shrink-0"
          )}>
            <ActiveSalonIndicator />
            {children}
          </main>

          {/* Right sidebar — sticky flex item
              self-start + sticky top-14: canonical sticky sidebar pattern in flexbox
              flex-1: fills all remaining horizontal space
              h-[calc(100vh-3.5rem)]: fills viewport below topbar, scrolls internally */}
          {showRightSidebar && (
            <div className="hidden lg:block flex-1 min-w-0 sticky top-[80px] self-start">
              <div className="h-[calc(100vh-3.5rem)] overflow-y-auto pr-6">
                <RightSidebar />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
