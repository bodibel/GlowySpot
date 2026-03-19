"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    size?: "sm" | "md" | "lg" | "xl"
}

export function Modal({ isOpen, onClose, children, title, size = "md" }: ModalProps) {
    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl"
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
                <DialogContent 
                    className={cn(
                        "fixed left-[50%] top-[50%] z-[101] grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-none bg-background p-6 shadow-lg duration-200 sm:rounded-2xl",
                        "max-h-[90vh] overflow-y-auto outline-none",
                        sizeClasses[size]
                    )}
                    onPointerDownOutside={onClose}
                    onEscapeKeyDown={onClose}
                >
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2 z-10">
                        {title && <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={onClose} 
                            className="h-8 w-8 ml-auto rounded-full hover:bg-gray-100"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Bezárás</span>
                        </Button>
                    </div>
                    <div>{children}</div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
