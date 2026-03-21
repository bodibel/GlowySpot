"use client"

import { Plus } from "lucide-react"
import Image from "next/image"

export function StoryBar() {
    const stories = [
        { name: "My Story", image: null, isUser: true },
        { name: "Studio Lux", image: "/uploads/fuss_02.png" },
        { name: "Nails by...", image: "/uploads/kosmetik_stock_06.png" },
        { name: "BarberPro", image: "/uploads/pedicure_stock_05.png" },
        { name: "Elite...", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" },
        { name: "Glow...", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80" },
    ]

    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-4">
                {stories.map((story, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group">
                        <div className={`relative h-[72px] w-[72px] rounded-full p-[3px] ${story.isUser ? "border-2 border-dashed border-gray-300" : "bg-gradient-to-tr from-yellow-400 via-primary to-purple-500"}`}>
                            <div className="relative h-full w-full rounded-full border-2 border-white bg-white overflow-hidden">
                                {story.isUser ? (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 group-hover:bg-gray-100">
                                        <Plus className="h-6 w-6" />
                                    </div>
                                ) : (
                                    <Image
                                        src={story.image!}
                                        alt={story.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                )}
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 truncate w-full text-center">
                            {story.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
