export function RightSidebar() {
    return (
        <div className="space-y-5">
            {/* Recommended Salons Widget */}
            <div className="rounded-2xl bg-surface p-5 border border-border shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground text-sm">Ajánlott szalonok</h3>
                    <button type="button" className="text-xs font-medium text-primary hover:underline">Összes</button>
                </div>
                {/* Skeletons */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-secondary" />
                            <div className="flex-1">
                                <div className="h-3 w-24 rounded bg-secondary" />
                                <div className="mt-1 h-2 w-16 rounded bg-muted" />
                            </div>
                            <div className="h-8 w-16 rounded-xl bg-primary/10" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Tags Widget */}
            <div className="rounded-2xl bg-surface p-5 border border-border shadow-sm">
                <h3 className="mb-4 font-semibold text-foreground text-sm">Trending a közeledben</h3>
                <div className="flex flex-wrap gap-2">
                    {["#műköröm", "#nyár", "#balayage", "#arckezelés", "#smink"].map((tag) => (
                        <span
                            key={tag}
                            className="cursor-pointer rounded-full bg-accent/15 text-accent-dim px-3 py-1 text-xs font-medium hover:bg-accent/25 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-muted-foreground px-2">
                <p className="font-medium">© 2026 GlowySpot</p>
                <div className="mt-2 flex gap-3">
                    <span className="hover:text-foreground cursor-pointer transition-colors">Adatvédelem</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">ÁSZF</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">Rólunk</span>
                </div>
            </div>
        </div>
    )
}
