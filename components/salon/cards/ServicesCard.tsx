"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Service, CURRENCIES } from "@/lib/salon-types"

interface ServicesCardProps {
    services: Service[]
    currency: string
    onAdd: () => void
    onEdit: (service: Service) => void
    onDelete: (serviceId: string) => void
}

export function ServicesCard({ services, currency, onAdd, onEdit, onDelete, limit }: ServicesCardProps & { limit?: number }) {
    const getCurrencySymbol = () => {
        return CURRENCIES.find(c => c.code === currency)?.symbol || "Ft"
    }

    const displayedServices = limit ? services.slice(0, limit) : services

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Szolgáltatások</CardTitle>
                        <CardDescription className="text-base">Kezeld a szolgáltatásait</CardDescription>
                    </div>
                    <Button onClick={onAdd} size="default">
                        <Plus className="h-5 w-5 mr-2" /> Új szolgáltatás
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {services.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 text-lg">
                        Még nincs szolgáltatás hozzáadva
                    </div>
                ) : (
                    <div className="space-y-6">
                        {displayedServices.map((service) => (
                            <div key={service.id} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-semibold text-lg truncate">{service.name}</h4>
                                        <span className="text-sm px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                                            {service.duration} perc
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-primary">
                                        {service.price} {getCurrencySymbol()}
                                    </p>
                                    {service.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {service.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(service)} className="h-10 w-10">
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(service.id)} className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {limit && services.length > limit && (
                            <p className="text-sm text-muted-foreground text-center pt-2">
                                +{services.length - limit} további szolgáltatás
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
