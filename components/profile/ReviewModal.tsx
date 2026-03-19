"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, Loader2 } from "lucide-react"
import { createReview } from "@/lib/actions/salon"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ReviewModalProps {
    isOpen: boolean
    onClose: () => void
    salonId: string
    userId: string
    onSuccess: () => void
}

export function ReviewModal({ isOpen, onClose, salonId, userId, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [hover, setHover] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim()) {
            toast.error("Kérlek, írj egy rövid véleményt!")
            return
        }

        setIsSubmitting(true)
        try {
            await createReview({
                salonId,
                userId,
                rating,
                comment: comment.trim()
            })
            toast.success("Értékelés sikeresen elküldve!")
            onSuccess()
            onClose()
            setComment("")
            setRating(5)
        } catch (error) {
            console.error("Error submitting review:", error)
            toast.error("Hiba történt az értékelés küldése során!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold font-serif text-gray-900">Milyen volt a tapasztalatod?</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={cn(
                                            "h-10 w-10 transition-colors",
                                            (hover || rating) >= star
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            {rating === 5 ? "Kiváló" : rating === 4 ? "Nagyon jó" : rating === 3 ? "Megfelelő" : rating === 2 ? "Gyenge" : "Rossz"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Írd meg a véleményed..."
                            className="w-full min-h-[120px] rounded-2xl bg-gray-50 border-none p-4 text-sm focus:ring-2 focus:ring-pink-100 transition-all resize-none placeholder:text-gray-400"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 rounded-xl h-12 font-bold text-gray-500"
                            disabled={isSubmitting}
                        >
                            Mégse
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-xl h-12 font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Küldés"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
