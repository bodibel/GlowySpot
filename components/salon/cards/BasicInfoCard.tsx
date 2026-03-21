"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { Salon, CURRENCIES } from "@/lib/salon-types"

interface BasicInfoCardProps {
    salon: Salon
    onEdit: () => void
}

export function BasicInfoCard({ salon, onEdit }: BasicInfoCardProps) {
    const getCurrencySymbol = () => {
        return CURRENCIES.find(c => c.code === salon.currency)?.symbol || "Ft"
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Alapadatok</CardTitle>
                        <CardDescription>Szalonod alapvető információi</CardDescription>
                    </div>
                    <Button onClick={onEdit} size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Szerkesztés
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <dl className="space-y-3">
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground">Szalon neve</dt>
                        <dd className="text-sm mt-0.5">{salon.name}</dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground">Cím</dt>
                        <dd className="text-sm mt-0.5">
                            {salon.zipCode} {salon.city}, {salon.street} {salon.houseNumber}
                            {(salon.floor || salon.door) && (
                                <span className="text-muted-foreground ml-1">
                                    {salon.floor ? `${salon.floor}. em. ` : ""}
                                    {salon.door ? `${salon.door}. ajtó` : ""}
                                </span>
                            )}
                            {salon.district ? ` (${salon.district})` : ""}
                            <div className="text-xs text-muted-foreground mt-0.5">{salon.country}</div>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground">Kategóriák</dt>
                        <dd className="flex flex-wrap gap-1 mt-0.5">
                            {salon.categories?.map((cat: string, idx: number) => (
                                <span key={idx} className="text-xs bg-accent text-white px-2 py-0.5 rounded-md font-medium">
                                    {cat}
                                </span>
                            ))}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs font-medium text-muted-foreground">Pénznem</dt>
                        <dd className="text-sm mt-0.5">{salon.currency} ({getCurrencySymbol()})</dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    )
}
