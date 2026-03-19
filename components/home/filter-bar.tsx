"use client"

import { Search, MapPin, Filter } from "lucide-react"

export function FilterBar() {
    return (
        <div className="border-b bg-white px-4 py-3 md:sticky md:top-0 md:z-10">
            <div className="container mx-auto flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Helyszín (pl. Budapest)"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>

                <div className="relative flex-1">
                    <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                        <option>Válassz kategóriát</option>
                        <option>Fodrászat</option>
                        <option>Kozmetika</option>
                        <option>Kézápolás</option>
                        <option>Lábápolás</option>
                        <option>Masszázs</option>
                    </select>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Keresés szolgáltatásra..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
            </div>
        </div>
    )
}
