"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import {
    Search,
    User,
    Menu,
    X,
    LayoutGrid,
    Users,
    Heart,
    Briefcase,
    User as UserIcon,
    LogOut,
    Filter,
    MessageSquare,
    MessageCircle,
    Store,
    BarChart3,
    Settings,
    FileText,
    Info,
    Image as ImageIcon,
    Calendar,
    ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthModal } from "@/components/auth/auth-modal"
import { FilterModal } from "@/components/layout/filter-modal"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/lib/notification-context"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"


export function Navbar() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
    const { user, userData } = useAuth()
    const { unreadCount } = useNotifications()
    const pathname = usePathname()
    const params = useParams()

    const handleLogout = () => {
        signOut({ callbackUrl: "/" })
        setIsMobileMenuOpen(false)
    }

    // Determine context
    const isSalonContext = pathname.startsWith("/salon/") && params.id
    const salonId = params.id as string

    // Base links for visitors (non-logged in)
    const visitorLinks = [
        { href: "/", label: "Bejegyzések", icon: LayoutGrid },
        { href: "/providers", label: "Szolgáltatók", icon: Users },
        {
            label: "Szűrők",
            icon: Filter,
            onClick: () => {
                setIsFilterModalOpen(true)
                setIsMobileMenuOpen(false)
            }
        },
    ]

    const authLinks = [
        { href: "/dashboard/messages", label: "Üzenetek", icon: MessageSquare },
        { href: "/dashboard/favorites", label: "Kedvencek", icon: Heart },
    ]

    // Links for logged-in users (Visitor role)
    const loggedInVisitorLinks = [
        { href: "/dashboard", label: "Vezérlőpult", icon: Briefcase },
        { href: "/dashboard/comments", label: "Hozzászólásaim", icon: MessageCircle },
    ]

    // Links for Providers
    const providerLinks = [
        { href: "/dashboard/salons", label: "Vállalkozásom", icon: Store },
    ]

    // Links for Admin
    const adminLinks = [
        { href: "/dashboard/admin/overview", label: "Áttekintés", icon: BarChart3 },
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
        currentLinks = [...visitorLinks, ...authLinks, ...loggedInVisitorLinks, ...providerLinks]
    } else if (userData) {
        currentLinks = [...visitorLinks, ...authLinks, ...loggedInVisitorLinks]
    } else {
        currentLinks = visitorLinks
    }

    return (
        <>
            <nav className="xl:hidden sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600" />
                        <span className="text-xl font-bold tracking-tight">GlowySpot</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {user && (
                            <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
                                {userData?.name?.[0] || "U"}
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="md:hidden fixed right-0 top-16 bottom-0 w-64 bg-white z-50 shadow-lg">
                        <div className="flex flex-col h-full">
                            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">


                                {currentLinks.map((link, index) => {
                                    const Icon = link.icon

                                    // Custom active logic
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
                                                className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                            >
                                                <Icon className="h-5 w-5" />
                                                {link.label}
                                            </button>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-pink-50 text-pink-600"
                                                    : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="flex-1">{link.label}</span>
                                            {link.label === "Üzenetek" && unreadCount > 0 && (
                                                <span className="bg-pink-600 text-white h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full ml-auto shadow-sm">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="border-t p-4">
                                {userData ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3">
                                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                                {userData.name?.[0] || "U"}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-medium">{userData.name || "Felhasználó"}</p>
                                                <p className="truncate text-xs text-muted-foreground">{userData.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-3 text-muted-foreground hover:text-red-600"
                                            onClick={handleLogout}
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Kijelentkezés
                                        </Button>
                                    </>
                                ) : (
                                    <div className="px-4 space-y-3">
                                        <p className="text-sm text-muted-foreground text-center">Nincs bejelentkezve</p>
                                        <Button
                                            className="w-full"
                                            onClick={() => {
                                                setIsAuthModalOpen(true)
                                                setIsMobileMenuOpen(false)
                                            }}
                                        >
                                            Bejelentkezés
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
        </>
    )
}
