export function ProfileTabs({ activeTab, onChange, isTeam }: { activeTab: string, onChange: (tab: string) => void, isTeam?: boolean }) {
    const tabs = [
        { id: "posts", label: "Bejegyzések" },
        { id: "services", label: "Szolgáltatások" },
        { id: "gallery", label: "Galéria" },
        { id: "reviews", label: "Értékelések" },
        { id: "about", label: isTeam ? "Csapatunk" : "Rólam" },
    ]

    return (
        <div className="border-b border-gray-100 sticky top-0 z-10 bg-white/95 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex gap-8 justify-center">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`py-4 text-sm font-bold border-b-[3px] transition-colors ${activeTab === tab.id
                                ? "border-pink-600 text-gray-900"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
