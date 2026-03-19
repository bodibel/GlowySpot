"use client"

import { use } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { CommandHeader } from "@/components/dashboard/command-header"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { TimelineSchedule } from "@/components/dashboard/timeline-schedule"
import { PortfolioVibeWidget } from "@/components/dashboard/portfolio-vibe-widget"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useSalonData } from "@/hooks/useSalonData"

export default function SalonOverviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { userData } = useAuth()
    const router = useRouter()

    const {
        salon,
        loading
    } = useSalonData(id, userData?.id)

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
                    <div className="text-gray-400">Loading Command Center...</div>
                </div>
            </MainLayout>
        )
    }

    if (!salon) {
        // router.push("/dashboard") // Commented out to prevent redirect loop during dev if auth is wonky
        return <MainLayout><div className="p-6">Salon not found or access denied.</div></MainLayout>
    }

    return (
        <MainLayout showRightSidebar={false}>
            <div className="container mx-auto p-6 md:p-8 space-y-10 max-w-7xl">
                {/* Header */}
                <CommandHeader salonName={salon.name} />

                {/* KPI Cards */}
                <KpiCards />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Schedule & Activity (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100 min-h-[500px]">
                            <TimelineSchedule />
                        </div>
                    </div>

                    {/* Right Column - Vibe & Tools (1/3 width) */}
                    <div className="space-y-8">
                        <PortfolioVibeWidget />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
