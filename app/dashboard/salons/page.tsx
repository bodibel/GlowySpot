"use client"

import { useEffect, useState, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Star, Store } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Salon } from "@/lib/salon-types"
import { getUserSalons } from "@/lib/actions/salon"
import Link from "next/link"
import { SalonWizard } from "@/components/wizard/SalonWizard"

export default function SalonsPage() {
    const { userData } = useAuth()
    const [salons, setSalons] = useState<Salon[]>([])
    const [loading, setLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const fetchSalons = useCallback(async () => {
        if (!userData?.id) return

        try {
            const salonsData = await getUserSalons(userData.id)
            setSalons(salonsData as unknown as Salon[])
        } catch (error) {
            console.error("Error fetching salons:", error)
        } finally {
            setLoading(false)
        }
    }, [userData])

    useEffect(() => {
        fetchSalons()
    }, [fetchSalons])

    const handleCreateSuccess = () => {
        fetchSalons()
    }

    return (
        <MainLayout showRightSidebar={false}>
            <div className="container mx-auto p-6 md:p-8 max-w-7xl space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Szalonjaim</h1>
                        <p className="text-gray-500">Kezeld a regisztrált szépségszalonjaidat.</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-pink-600 hover:bg-pink-700 text-white rounded-2xl px-6 h-12 shadow-lg shadow-pink-200/50 transition-all hover:-translate-y-0.5"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Új szalon hozzáadása
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : salons.length === 0 ? (
                    <div className="rounded-3xl bg-white p-12 text-center border-2 border-dashed border-gray-100 shadow-sm">
                        <div className="h-16 w-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Store className="h-8 w-8 text-pink-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Még nincs regisztrált szalonod</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Hozd létre az első szalonodat, hogy elkezdd hirdetni a szolgáltatásaidat és fogadd az ügyfeleket.
                        </p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            variant="outline"
                            className="rounded-xl border-gray-200"
                        >
                            Szalon létrehozása
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {salons.map((salon) => (
                            <Link key={salon.id} href={`/salon/${salon.id}`} className="group">
                                <div className="bg-white rounded-[32px] overflow-hidden shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-xl hover:ring-pink-100 hover:-translate-y-1 h-full flex flex-col">
                                    <div className="h-56 bg-gray-50 relative overflow-hidden">
                                        {salon.images?.[0] ? (
                                            <img
                                                src={salon.images[0]}
                                                alt={salon.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                                <Store className="h-10 w-10" />
                                                <span className="text-xs font-medium uppercase tracking-widest">Nincs kép</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm rounded-xl px-2 py-1 flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-black text-gray-900">{salon.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-1">{salon.name}</h3>
                                        <div className="flex items-start gap-1.5 text-gray-500 text-sm mb-4">
                                            <MapPin className="h-4 w-4 mt-0.5 text-pink-500 flex-shrink-0" />
                                            <span className="line-clamp-2">{salon.city}, {salon.address}</span>
                                        </div>
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                {salon.reviewCount} Értékelés
                                            </span>
                                            <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-all">
                                                <Plus className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <SalonWizard
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                />
            </div>
        </MainLayout>
    )
}
