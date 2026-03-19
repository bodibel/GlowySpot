"use client"

import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ClosedDateModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (date: string, reason: string) => void
}

export function ClosedDateModal({ isOpen, onClose, onSave }: ClosedDateModalProps) {
    const [date, setDate] = useState("")
    const [reason, setReason] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!date || !reason) return
        onSave(date, reason)
        setDate("")
        setReason("")
    }

    const handleClose = () => {
        setDate("")
        setReason("")
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Új zárt nap hozzáadása"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Dátum *</label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Indok *</label>
                    <Input
                        placeholder="pl. Szabadság, Ünnepnap"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Mégse
                    </Button>
                    <Button type="submit">
                        Hozzáadás
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
