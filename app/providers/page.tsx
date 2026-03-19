"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ProviderCard } from "@/components/home/provider-card"
import { getAllSalons } from "@/lib/actions/salon"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ProvidersPage() {
    const [providers, setProviders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProviders()
    }, [])

    const loadProviders = async () => {
        try {
            const salons = await getAllSalons()
            const loadedProviders = salons.map((salon: any) => ({
                id: salon.id,
                name: salon.name,
                category: salon.categories?.[0] || "Egyéb", // Use first category for now
                rating: salon.rating || 0,
                reviewCount: salon.reviewCount || 0,
                location: salon.city, // Changed to show city
                image: salon.coverImage || salon.images?.[0] || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
                avatar: salon.profileImage || salon.images?.[0] || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100&q=80",
                languages: salon.languages
            }))

            setProviders(loadedProviders)
        } catch (error) {
            console.error("Error loading salons:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="container mx-auto p-4 space-y-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold">Szolgáltatók</h1>

                    {/* Search and Location */}
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Keresés szolgáltatók között..."
                                className="pl-10 h-12 bg-white border-gray-200"
                            />
                        </div>
                        <Button variant="outline" className="h-12 px-6 gap-2 bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                            <MapPin className="h-4 w-4" />
                            Helyzet megadása
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full text-center text-muted-foreground py-12">
                            Betöltés...
                        </div>
                    ) : providers.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-12">
                            Még nincs egy szalon sem regisztrálva
                        </div>
                    ) : (
                        providers.map((provider) => (
                            <ProviderCard key={provider.id} {...provider} />
                        ))
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
