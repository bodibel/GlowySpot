"use client"

import { UserManager } from "@/components/admin/UserManager"
import { MainLayout } from "@/components/layout/main-layout"

export default function AdminProvidersPage() {
    return (
        <MainLayout>
            <div className="container mx-auto p-6">
                <UserManager 
                    filterRole="provider" 
                    title="Szolgáltatók" 
                    description="Regisztrált szolgáltatók (szalon tulajdonosok) kezelése, szerkesztése és törlése."
                />
            </div>
        </MainLayout>
    )
}
