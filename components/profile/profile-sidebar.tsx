"use client"

import { Clock, MapPin, ChevronRight, Star, Sparkles, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleMap } from "@react-google-maps/api"
import { AdvancedMarker } from "@/components/ui/advanced-marker"

interface ProfileSidebarProps {
    salon: any
}

const DAY_LABELS: Record<string, string> = {
    "Hétfő": "Hétfő",
    "Kedd": "Kedd",
    "Szerda": "Szerda",
    "Csütörtök": "Csütörtök",
    "Péntek": "Péntek",
    "Szombat": "Szombat",
    "Vasárnap": "Vasárnap",
}

export function ProfileSidebar({ salon }: ProfileSidebarProps) {
    const featuredServices = salon.services?.slice(0, 3) || []
    const openingHours = salon.openingHours || []

    // Check if contact info should be shown
    const showPhone = salon.showPhoneOnProfile !== false && salon.phone
    const showEmail = salon.showEmailOnProfile === true && salon.email

    // Map center based on salon coordinates or Budapest as default
    const mapCenter = {
        lat: salon.lat || 47.497913,
        lng: salon.lng || 19.040236
    }

    return (
        <div className="space-y-6">
            {/* Contact Info Widget - only show if there's info to display */}
            {(showPhone || showEmail) && (
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Phone className="h-5 w-5 text-pink-500" />
                        <h3 className="font-bold text-gray-900">Kapcsolat</h3>
                    </div>
                    <div className="space-y-3">
                        {showPhone && (
                            <a
                                href={`tel:${salon.phone}`}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Phone className="h-4 w-4 text-pink-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{salon.phone}</span>
                            </a>
                        )}
                        {showEmail && (
                            <a
                                href={`mailto:${salon.email}`}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                            >
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Mail className="h-4 w-4 text-pink-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">{salon.email}</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Hours Widget - Dynamic from database */}

            {/* Hours Widget - Dynamic from database */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <h3 className="font-bold text-gray-900">Nyitvatartás</h3>
                </div>
                <div className="space-y-2">
                    {openingHours.length > 0 ? (
                        openingHours.map((hour: any) => (
                            <div key={hour.day} className="flex justify-between text-sm">
                                <span className="text-gray-500">{DAY_LABELS[hour.day] || hour.day}</span>
                                {hour.isOpen ? (
                                    <span className="font-medium text-gray-900">{hour.open} - {hour.close}</span>
                                ) : (
                                    <span className="text-red-500 font-medium">Zárva</span>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-2">Nincs nyitvatartás megadva.</p>
                    )}
                </div>
            </div>

            {/* Map Widget */}
            <div className="rounded-3xl overflow-hidden bg-gray-100 aspect-video relative">
                {salon.lat && salon.lng ? (
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={mapCenter}
                        zoom={15}
                        options={{
                            disableDefaultUI: true,
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                        }}
                    >
                        <AdvancedMarker position={mapCenter} />
                    </GoogleMap>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Térkép nem elérhető
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-500">{salon.city}, {salon.address}</p>
        </div>
    )
}
