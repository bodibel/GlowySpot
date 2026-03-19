"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { User, Mail, Shield, Calendar, Edit2, Heart, Store, Briefcase } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ProfileEditModal } from "@/components/dashboard/modals/ProfileEditModal"

export default function MyProfilePage() {
    const { userData } = useAuth()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    if (!userData) {
        return (
            <MainLayout showRightSidebar={false}>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-gray-400 font-medium">Kérlek jelentkezz be a profilod megtekintéséhez.</p>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout showRightSidebar={false}>
            <div className="container mx-auto p-6 md:p-8 max-w-5xl space-y-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profilom</h1>
                    <p className="text-gray-500">Személyes adataid és fiókbeállításaid kezelése.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* User Info Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-pink-200">
                                    {userData.name?.[0] || "U"}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {userData.email}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-gray-200"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Szerkesztés
                                </Button>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Shield className="h-4 w-4 text-pink-600" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jogosultság</span>
                                    </div>
                                    <p className="font-bold text-gray-900 capitalize">{userData.role === 'provider' ? 'Szolgáltató' : 'Látogató'}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Calendar className="h-4 w-4 text-pink-600" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tagság kezdete</span>
                                    </div>
                                    <p className="font-bold text-gray-900">2026. Január</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <Link href="/dashboard/favorites" className="group">
                                <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all group-hover:shadow-xl group-hover:ring-pink-100">
                                    <div className="h-12 w-12 rounded-2xl bg-pink-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Heart className="h-6 w-6 text-pink-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Kedvencek</h3>
                                    <p className="text-sm text-gray-500">Mentsd el kedvenc szalonjaidat és szolgáltatóidat.</p>
                                </div>
                            </Link>

                            {userData.role !== 'visitor' && (
                                <Link href="/dashboard/salons" className="group">
                                    <div className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-gray-900/5 transition-all group-hover:shadow-xl group-hover:ring-pink-100">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Store className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Vállalkozásom</h3>
                                        <p className="text-sm text-gray-500">Kezeld saját szalonjaidat és szolgáltatásaidat.</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="space-y-6">
                        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-pink-600" />
                                Statisztika
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-500">Foglalások száma</span>
                                    <span className="font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-500">Értékeléseid</span>
                                    <span className="font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-sm text-gray-500">Aktív bejegyzések</span>
                                    <span className="font-bold text-gray-900">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={userData}
            />
        </MainLayout>
    )
}
