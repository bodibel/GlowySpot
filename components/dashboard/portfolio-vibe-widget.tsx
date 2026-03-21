"use client"

import { Plus, Wand2, CheckCircle2 } from "lucide-react"
import Image from "next/image"

const SAMPLE_IMAGES = [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200",
    "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200",
    "https://images.unsplash.com/photo-1582242542187-50b31057865f?w=200",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200",
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=200",
]

export function PortfolioVibeWidget() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-xl text-gray-900">Portfolio Manager</h3>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">New Upload</span>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="font-bold text-gray-900">Vibe Check Tool</h4>
                        <p className="text-xs text-gray-500">Aesthetic consistency analysis</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-sm font-bold border border-green-100">
                        <CheckCircle2 className="h-4 w-4" /> 94% MATCH
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    {SAMPLE_IMAGES.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                            <Image src={src} alt="Portfolio" fill className="object-cover" />
                        </div>
                    ))}
                    <button className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary/30 hover:text-primary hover:bg-primary-subtle transition-colors">
                        <Plus className="h-6 w-6" />
                    </button>
                    <button className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200 text-primary/70 bg-primary/10 hover:bg-primary/20 transition-colors">
                        <Wand2 className="h-6 w-6" />
                    </button>
                </div>

                <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Active Palette</span>
                    <div className="flex gap-2">
                        {["#eec7ba", "#bba19b", "#d61c69", "#1f1a1d", "#f5f5f5"].map(color => (
                            <div key={color} className="h-8 w-12 rounded-full shadow-sm ring-1 ring-black/5" style={{ backgroundColor: color }} />
                        ))}
                    </div>
                </div>

                <button className="w-full mt-6 bg-gray-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                    <Wand2 className="h-4 w-4" /> Optimize Feed Vibe
                </button>
            </div>
        </div>
    )
}
