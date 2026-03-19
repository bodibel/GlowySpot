"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Navbar } from "@/components/layout/navbar"
import { RightSidebar } from "@/components/layout/right-sidebar"
import { ActiveSalonIndicator } from "@/components/layout/active-salon-indicator"
import { cn } from "@/lib/utils"

export function MainLayout({ children, showRightSidebar = true }: { children: React.ReactNode, showRightSidebar?: boolean }) {
    return (
        <div className="min-h-screen bg-secondary flex justify-center w-full">
            <div className="flex w-full max-w-[1440px] relative">
                {/* Left Sidebar - Sticky inside container for desktop */}
                <aside className="hidden xl:block w-[240px] sticky top-6 h-fit z-40 px-4">
                    <Sidebar />
                </aside>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col min-w-0">
                    {/* Mobile Navbar */}
                    <Navbar />

                    {/* Active Salon Indicator */}
                    <ActiveSalonIndicator />

                    <div className={cn(
                        "flex gap-0 px-0 sm:px-6 lg:px-8 py-6 w-full",
                        showRightSidebar ? "justify-center xl:justify-start" : "justify-center"
                    )}>
                        {/* Feed / Page Content - Centered in the middle space or wide if no sidebar */}
                        <main className={cn(
                            "w-full transition-all duration-300 px-4 sm:px-0",
                            showRightSidebar ? "max-w-[680px]" : "max-w-7xl mx-auto"
                        )}>
                            {children}
                        </main>

                        {/* Right Sidebar - Sticky & Flexible Width */}
                        {showRightSidebar && (
                            <div className="hidden flex-1 min-w-[360px] max-w-[420px] ml-8 xl:block">
                                <div className="sticky top-6">
                                    <RightSidebar />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
