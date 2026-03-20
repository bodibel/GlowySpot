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
        <div
          className={cn(
            "flex flex-1 flex-col min-w-0 transition-all",
            "md:ml-[60px] lg:ml-[220px]"
          )}
        >
          <ActiveSalonIndicator />

          <div
            className={cn(
              "flex gap-0 px-4 sm:px-6 lg:px-8 py-6 w-full",
              "pb-24 md:pb-6",
              showRightSidebar ? "justify-center xl:justify-start" : "justify-center"
            )}
          >
            <main
              className={cn(
                "w-full transition-all duration-300",
                showRightSidebar ? "max-w-[680px]" : "max-w-7xl mx-auto"
              )}
            >
              {children}
            </main>

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

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
