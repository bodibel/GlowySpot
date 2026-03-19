"use client"

import { GoogleMap, Marker } from "@react-google-maps/api"
import { useMemo } from "react"

interface SalonLocationMapProps {
    center: { lat: number; lng: number }
    markerPosition?: { lat: number; lng: number }
}

export function SalonLocationMap({ center, markerPosition }: SalonLocationMapProps) {
    const mapContainerStyle = useMemo(() => ({
        width: "100%",
        height: "200px",
        borderRadius: "0.5rem",
    }), [])

    const options = useMemo(() => ({
        disableDefaultUI: true,
        zoomControl: true,
    }), [])

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={options}
        >
            {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
    )
}
