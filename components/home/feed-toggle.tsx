"use client"

import { cn } from "@/lib/utils"

interface FeedToggleProps {
    view: "posts" | "providers"
    onChange: (view: "posts" | "providers") => void
}

export function FeedToggle({ view, onChange }: FeedToggleProps) {
    return (
        <div className="flex justify-center p-4">
            <div className="flex items-center rounded-full bg-secondary p-1">
                <button
                    onClick={() => onChange("posts")}
                    className={cn(
                        "rounded-full px-6 py-2 text-sm font-medium transition-all",
                        view === "posts"
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Bejegyzések
                </button>
                <button
                    onClick={() => onChange("providers")}
                    className={cn(
                        "rounded-full px-6 py-2 text-sm font-medium transition-all",
                        view === "providers"
                            ? "bg-white text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Szolgáltatók
                </button>
            </div>
        </div>
    )
}
