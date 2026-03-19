"use client"

import { Bell } from "lucide-react"
import Image from "next/image"

export function CommandHeader({ salonName }: { salonName: string }) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Good Morning, {salonName}</h1>
                <p className="text-gray-500">Here's your studio's activity for {today}.</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search appointments..."
                        className="rounded-full bg-white border-0 py-2.5 px-4 pr-10 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-pink-500 w-64"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <button className="relative p-2.5 bg-white rounded-full ring-1 ring-gray-200 hover:bg-gray-50">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
            </div>
        </div>
    )
}
