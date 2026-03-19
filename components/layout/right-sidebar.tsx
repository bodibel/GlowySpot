export function RightSidebar() {
    return (
        <div className="space-y-6">
            {/* Search Placeholder */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search services, salons..."
                    className="w-full rounded-full border-none bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-gray-900/5 focus:ring-2 focus:ring-primary"
                />
            </div>

            {/* Recommended Salons Widget */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Recommended</h3>
                    <button className="text-xs font-medium text-primary hover:underline">See All</button>
                </div>
                {/* Skeletons for now */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-100" />
                            <div className="flex-1">
                                <div className="h-3 w-24 rounded bg-gray-100" />
                                <div className="mt-1 h-2 w-16 rounded bg-gray-50" />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gray-50" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Trending Tags Widget */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <h3 className="mb-4 font-semibold text-gray-900">Trending Near You</h3>
                <div className="flex flex-wrap gap-2">
                    {["#nails", "#summer", "#balayage", "#facial", "#makeup"].map((tag) => (
                        <span key={tag} className="cursor-pointer rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 px-2">
                <p className="font-medium">© 2026 GlowySpot</p>
                <div className="mt-2 flex gap-2">
                    <span>Privacy</span>
                    <span>Terms</span>
                    <span>About</span>
                </div>
            </div>
        </div>
    )
}
