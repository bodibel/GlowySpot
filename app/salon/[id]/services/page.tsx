"use client"

import { use, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useSalonData } from "@/hooks/useSalonData"
import { Service } from "@/lib/salon-types"
import { createService, updateService, deleteService } from "@/lib/actions/salon"

import { ServicesCard } from "@/components/salon/cards/ServicesCard"
import { ServiceModal } from "@/components/salon/modals/ServiceModal"

export default function SalonServicesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { userData } = useAuth()
    const router = useRouter()

    const {
        salon,
        services,
        setServices,
        loading
    } = useSalonData(id, userData?.id)


    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)

    const handleSaveService = async (serviceData: Omit<Service, 'id'>) => {
        try {
            if (editingService) {
                await updateService(editingService.id, serviceData)
                setServices(services.map(s => s.id === editingService.id ? { ...s, id: editingService.id, ...serviceData } : s))
            } else {
                const newService = await createService({ ...serviceData, salonId: id })
                setServices([...services, newService as unknown as Service])
            }
            setIsServiceModalOpen(false)
            setEditingService(null)
        } catch (error) {
            console.error("Error saving service:", error)
        }
    }

    const handleDeleteService = async (serviceId: string) => {
        if (confirm("Biztosan törlöd ezt a szolgáltatást?")) {
            try {
                await deleteService(serviceId)
                setServices(services.filter(s => s.id !== serviceId))
            } catch (error) {
                console.error("Error deleting service:", error)
            }
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto p-6">
                    <div className="text-muted-foreground">Betöltés...</div>
                </div>
            </MainLayout>
        )
    }

    if (!salon) {
        router.push("/dashboard")
        return null
    }

    return (
        <MainLayout showRightSidebar={false}>
            <div className="container mx-auto p-6 space-y-8">
                <h1 className="text-3xl font-bold mb-6">Szolgáltatások</h1>
                <ServicesCard
                    services={services}
                    currency={salon.currency}
                    onAdd={() => {
                        setEditingService(null)
                        setIsServiceModalOpen(true)
                    }}
                    onEdit={(service) => {
                        setEditingService(service)
                        setIsServiceModalOpen(true)
                    }}
                    onDelete={handleDeleteService}
                />

                <ServiceModal
                    isOpen={isServiceModalOpen}
                    onClose={() => {
                        setIsServiceModalOpen(false)
                        setEditingService(null)
                    }}
                    onSave={handleSaveService}
                    service={editingService || undefined}
                    currency={salon.currency}
                />
            </div>
        </MainLayout>
    )
}
