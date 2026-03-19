"use client"

import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
    const { user, userData, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/")
            } else if (userData) {
                if (userData.role === "admin") {
                    router.push("/dashboard/admin/overview")
                } else if (userData.role === "provider") {
                    router.push("/dashboard/salons")
                } else {
                    router.push("/dashboard/favorites")
                }
            }
        }
    }, [user, userData, loading, router])

    return (
        <MainLayout>
            <div className="flex h-[50vh] items-center justify-center">
                <div className="text-muted-foreground">Átirányítás...</div>
            </div>
        </MainLayout>
    )
}
