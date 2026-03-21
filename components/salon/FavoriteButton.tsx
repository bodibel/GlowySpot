"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toggleFavorite, isSalonFavorite } from "@/lib/actions/salon"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { AuthModal } from "@/components/auth/auth-modal"

interface FavoriteButtonProps {
    salonId: string
    className?: string
    iconClassName?: string
    variant?: "ghost" | "outline" | "default" | "secondary"
    size?: "default" | "sm" | "lg" | "icon"
    showText?: boolean
}

export function FavoriteButton({
    salonId,
    className,
    iconClassName,
    variant = "ghost",
    size = "icon",
    showText = false
}: FavoriteButtonProps) {
    const { userData } = useAuth()
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isToggling, setIsToggling] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    useEffect(() => {
        const checkStatus = async () => {
            if (userData?.id) {
                const status = await isSalonFavorite(salonId, userData.id)
                setIsFavorite(status)
            }
            setLoading(false)
        }
        checkStatus()
    }, [salonId, userData?.id])

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!userData) {
            setIsAuthModalOpen(true)
            return
        }

        setIsToggling(true)
        try {
            const result = await toggleFavorite(salonId, userData.id)
            setIsFavorite(result.isFavorite)
            if (result.isFavorite) {
                toast.success("Hozzáadva a kedvencekhez!")
            } else {
                toast.success("Eltávolítva a kedvencekből!")
            }
        } catch (error) {
            console.error("Favorite toggle failed:", error)
            toast.error("Hiba történt a mentés során.")
        } finally {
            setIsToggling(false)
        }
    }

    if (loading) {
        return (
            <div className={cn("animate-pulse bg-gray-100 rounded-full", className)} style={{ width: '40px', height: '40px' }} />
        )
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                className={cn(
                    "transition-all duration-300",
                    isFavorite ? "text-primary bg-accent hover:bg-primary/10 hover:text-primary" : "text-gray-400 hover:text-primary hover:bg-accent",
                    className
                )}
                onClick={handleToggle}
                disabled={isToggling}
            >
                <Heart
                    className={cn(
                        "h-5 w-5 transition-transform",
                        isFavorite ? "fill-current scale-110" : "scale-100",
                        isToggling && "scale-90",
                        iconClassName
                    )}
                />
                {showText && <span className="ml-2">{isFavorite ? "Kedvenc" : "Kedvencek közé"}</span>}
            </Button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    )
}
