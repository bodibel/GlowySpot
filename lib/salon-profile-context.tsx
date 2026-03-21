"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export interface SalonProfileData {
    id: string
    name: string
    avatar: string
    categories: string[]
    rating: number
    reviewCount: number
    city?: string
    district?: string
    ownerId?: string
}

interface SalonProfileContextType {
    salonProfile: SalonProfileData | null
    setSalonProfile: (data: SalonProfileData | null) => void
}

const SalonProfileContext = createContext<SalonProfileContextType | undefined>(undefined)

export function SalonProfileProvider({ children }: { children: ReactNode }) {
    const [salonProfile, setSalonProfile] = useState<SalonProfileData | null>(null)

    return (
        <SalonProfileContext.Provider value={{ salonProfile, setSalonProfile }}>
            {children}
        </SalonProfileContext.Provider>
    )
}

export function useSalonProfile() {
    return useContext(SalonProfileContext)
}
