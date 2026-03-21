"use client"

import { Calendar, DollarSign, Eye, TrendingUp } from "lucide-react"

export function KpiCards() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Bookings */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100/50 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bookings Today</span>
                    <div className="p-2 rounded-xl bg-accent text-primary">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-gray-900">12</h3>
                    <span className="text-sm font-medium text-green-500">+2 from yesterday</span>
                </div>
                {/* Mini Chart Mockup */}
                <div className="mt-4 flex items-end gap-1 h-8">
                    {[40, 60, 45, 70, 50, 60, 80].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-sm ${i === 6 ? "bg-primary" : "bg-primary/10"}`} />
                    ))}
                </div>
            </div>

            {/* Revenue */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100/50 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Revenue</span>
                    <div className="p-2 rounded-xl bg-accent text-primary">
                        <DollarSign className="h-5 w-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-gray-900">$8,450</h3>
                    <span className="text-sm font-medium text-green-500 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +15.4%
                    </span>
                </div>
                {/* Sparkline Mockup */}
                <svg className="w-full h-10 mt-3 text-primary" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0,35 C20,35 20,10 40,25 C60,40 60,5 100,20" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {/* Reach */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100/50 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Reach</span>
                    <div className="p-2 rounded-xl bg-accent text-primary">
                        <Eye className="h-5 w-5" />
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-gray-900">14.2k</h3>
                    <span className="text-sm font-medium text-green-500">+8% this week</span>
                </div>
                <div className="mt-4 flex items-end gap-1 h-8">
                    {[30, 40, 35, 50, 45, 60, 65].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className={`flex-1 rounded-sm ${i === 6 ? "bg-primary" : "bg-gray-100"}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}
