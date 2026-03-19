import Image from "next/image"
import { MapPin, Star, MessageCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileHeaderProps {
    provider: {
        id: string
        name: string
        category: string
        coverImage: string
        avatar: string
        location: string
        rating: number
        reviewCount: number
    }
    onMessageClick?: () => void
}

export function ProfileHeader({ provider, onMessageClick }: ProfileHeaderProps) {
    return (
        <div className="bg-white shadow-sm">
            <div className="relative h-48 w-full bg-muted md:h-64">
                <Image src={provider.coverImage} alt="Cover" fill className="object-cover" />
            </div>
            <div className="container mx-auto px-4 pb-6">
                <div className="relative -mt-16 mb-4 flex flex-col items-center md:flex-row md:items-end md:gap-6">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                        <Image src={provider.avatar} alt={provider.name} fill className="object-cover" />
                    </div>
                    <div className="mt-4 flex-1 text-center md:mb-2 md:mt-0 md:text-left">
                        <div className="inline-block rounded-lg bg-white/90 px-4 py-2 backdrop-blur-md shadow-sm">
                            <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                            <p className="text-muted-foreground">{provider.category}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap justify-center gap-4 md:justify-start">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{provider.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{provider.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground">({provider.reviewCount} értékelés)</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 md:mb-2 md:mt-0">
                        <Button onClick={onMessageClick}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Üzenet
                        </Button>
                        <Button variant="outline" size="icon">
                            <Heart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
