"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
    LayoutGrid,
    Users,
    Heart,
    Briefcase,
    User,
    LogOut,
    Store,
    Settings,
    Calendar,
    Image as ImageIcon,
    FileText,
    Info,
    ArrowLeft,
    BarChart3,
    MapPin,
    X,
    Star,
    Clock,
    Search,
    MessageSquare,
    Plus,
    Trash2,
    ShieldCheck,
    Mail,
    Inbox,
    AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth/auth-modal"
import { FilterModal } from "@/components/layout/filter-modal"

import { useAuth } from "@/lib/auth-context"
import { useFilter } from "@/lib/filter-context"
import { useNotifications } from "@/lib/notification-context"
import { signOut } from "next-auth/react"

export function Sidebar() {
    const pathname = usePathname()
    const params = useParams()
    const { userData } = useAuth()
    const {
        location,
        filters,
        isFilterModalOpen,
        toggleFilterModal,
        removeServiceFilter,
        updateFilters,
        addServiceFilter
    } = useFilter()
    const { unreadCount } = useNotifications()

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    const handleLogout = () => {
        signOut({ callbackUrl: "/" })
    }

    // Determine context
    const isSalonContext = pathname.startsWith("/salon/") && params.id
    const salonId = params.id as string

    // Base links for visitors (non-logged in)
    const visitorLinks = [
        { href: "/", label: "Bejegyzések", icon: LayoutGrid },
        { href: "/providers", label: "Szolgáltatók", icon: Users },
    ]

    const authLinks = [
        { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare },
        { href: "/dashboard/favorites", label: "Kedvencek", icon: Heart },
    ]

    // Links for logged-in users (Visitor role)
    const loggedInVisitorLinks = [
        { href: "/profile/me", label: "Profilom", icon: User },
    ]

    // Links for Providers
    const providerLinks = [
        { href: "/dashboard/salons", label: "Vállalkozásom", icon: Store },
        { href: "/profile/me", label: "Profilom", icon: User },
    ]

    // Links for Admin
    const adminLinks = [
        { href: "/dashboard/admin/overview", label: "Áttekintés", icon: BarChart3 },
        { href: "/dashboard/admin/providers", label: "Szolgáltatók", icon: Briefcase },
        { href: "/dashboard/admin/visitors", label: "Látogatók", icon: Users },
        { href: "/dashboard/admin/settings", label: "Beállítások", icon: Settings },
    ]

    // Salon Management Links
    const salonLinks = [
        { href: `/salon/${salonId}`, label: "Áttekintés", icon: BarChart3 },
        { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare },
        { href: `/salon/${salonId}/posts`, label: "Bejegyzéseim", icon: FileText },
        { href: `/salon/${salonId}/settings`, label: "Adatok", icon: Info },
        { href: `/salon/${salonId}/services`, label: "Szolgáltatások", icon: Briefcase },
        { href: `/salon/${salonId}/gallery`, label: "Galéria", icon: ImageIcon },
        { href: `/salon/${salonId}/hours`, label: "Nyitvatartás", icon: Calendar },
        { href: `/salon/${salonId}/team`, label: "Csapat / Rólam", icon: Users },
        { href: `/salon/${salonId}/contact`, label: "Kapcsolat", icon: Settings },
    ]

    let currentLinks: any[] = []

    if (isSalonContext) {
        currentLinks = salonLinks
    } else if (userData?.role === "admin") {
        currentLinks = [...visitorLinks, ...authLinks, ...adminLinks]
    } else if (userData?.role === "provider") {
        currentLinks = [...visitorLinks, ...authLinks, ...providerLinks]
    } else if (userData) {
        currentLinks = [...visitorLinks, ...authLinks, ...loggedInVisitorLinks]
    } else {
        currentLinks = visitorLinks
    }

    // Service label mapping for chips
    const serviceLabels: Record<string, string> = {
        nails: "Műköröm",
        hair: "Fodrászat",
        skin: "Kozmetika",
        pedi: "Pedikűr",
        makeup: "Smink"
    }

    const trendingCategories = [
        { id: 'nails', label: 'Műköröm' },
        { id: 'hair', label: 'Fodrászat' },
        { id: 'pedi', label: 'Pedikűr' },
    ]

    const hasActiveFilters =
        filters.services.length > 0 ||
        filters.rating !== null ||
        filters.openNow ||
        filters.availableToday

    return (
        <div className="space-y-6 pb-6">
            {/* 1. BRAND - Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 transition-transform group-hover:scale-110" />
                    <span className="text-xl font-bold tracking-tight">GlowySpot</span>
                </Link>
            </div>

            <div className="flex flex-col space-y-6">
                {/* 2. MAIN MENU - Card */}
                <nav className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 space-y-1">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menü</h3>


                    {currentLinks.map((link, index) => {
                        const Icon = link.icon
                        let isActive = false
                        if (link.href === `/salon/${salonId}`) {
                            isActive = pathname === link.href
                        } else {
                            isActive = link.href && (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                        }

                        if (link.onClick) {
                            return (
                                <button
                                    key={index}
                                    onClick={link.onClick}
                                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                                >
                                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    {link.label}
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-pink-50 text-pink-600 shadow-[inset_0_0_0_1px_rgba(219,39,119,0.1)]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
                                )}
                            >
                                <Icon className={cn("h-5 w-5 transition-transform", isActive ? "stroke-[2.5px] scale-110" : "stroke-2 group-hover:scale-110")} />
                                <span className="flex-1">{link.label}</span>
                                {link.label === "Üzenetek" && unreadCount > 0 && (
                                    <Badge className="bg-pink-600 text-white border-none h-5 min-w-[20px] px-1 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ml-auto">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {!isSalonContext && !pathname.startsWith('/dashboard') && !pathname.startsWith('/profile') && (
                    <>
                        {/* 3. CONTEXT & FILTERS - Card */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 space-y-6">
                            {/* Location */}
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Helyzetem</h3>
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <MapPin className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">{location.city}, {location.country}</p>
                                        <p className="text-[10px] text-gray-500">{location.radius} km-en belül</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full mt-3 bg-white text-[11px] h-8 rounded-lg border-gray-200 hover:border-pink-200 hover:text-pink-600"
                                    onClick={() => toggleFilterModal(true)}
                                >
                                    Módosítás
                                </Button>
                            </div>

                            {/* Filters */}
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex justify-between items-center">
                                    Szűrés
                                    {hasActiveFilters && (
                                        <button
                                            onClick={() => updateFilters({
                                                services: [],
                                                rating: null,
                                                openNow: false,
                                                availableToday: false
                                            })}
                                            className="text-[10px] text-pink-600 hover:underline font-bold"
                                        >
                                            Összes törlése
                                        </button>
                                    )}
                                </h3>

                                <div className="space-y-2">
                                    {hasActiveFilters ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {filters.services.map(service => (
                                                <Badge key={service} variant="secondary" className="bg-pink-50/50 text-pink-700 hover:bg-pink-100/50 border-none gap-1 pl-2 pr-1 py-1 font-medium text-[10px]">
                                                    {serviceLabels[service] || service}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:bg-pink-200 rounded-full p-[1px]"
                                                        onClick={() => removeServiceFilter(service)}
                                                    />
                                                </Badge>
                                            ))}
                                            {filters.rating && (
                                                <Badge variant="secondary" className="bg-yellow-50/50 text-yellow-700 hover:bg-yellow-100/50 border-none gap-1 pl-2 pr-1 py-1 font-medium text-[10px]">
                                                    <Star className="h-3 w-3 fill-yellow-700" /> {filters.rating}+
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:bg-yellow-200 rounded-full p-[1px]"
                                                        onClick={() => updateFilters({ rating: null })}
                                                    />
                                                </Badge>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Nincs aktív szűrő</p>
                                    )}

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="w-full justify-start text-[11px] text-pink-600 hover:bg-pink-50 h-8 px-2 rounded-lg"
                                        onClick={() => toggleFilterModal(true)}
                                    >
                                        <Search className="h-3 w-3 mr-2" />
                                        Minden szűrő...
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </>
                )}

                {/* 4. AUTH / USER - Card */}
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5 transition-all">
                    {userData ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/50 border border-gray-100">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-pink-600 font-bold text-sm shadow-sm">
                                    {userData.name?.[0] || "U"}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="truncate text-xs font-bold text-gray-900">{userData.name || "Felhasználó"}</p>
                                    <p className="truncate text-[10px] text-gray-500">{userData.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 h-10 px-3 rounded-xl transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-xs font-bold">Kijelentkezés</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-1">Fiók</p>
                            <Button
                                className="w-full h-10 text-xs font-bold bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg shadow-gray-200"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                Bejelentkezés
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <FilterModal isOpen={isFilterModalOpen} onClose={() => toggleFilterModal(false)} />
        </div>
    )
}
