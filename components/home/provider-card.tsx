import Image from "next/image"
import { Star, MapPin, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "@/components/salon/FavoriteButton"

interface ProviderCardProps {
    id: string
    name: string
    category: string
    rating: number
    reviewCount: number
    location: string
    image: string
    avatar: string
    languages?: string[]
}

export function ProviderCard({ id, name, category, rating, reviewCount, location, image, avatar, languages }: ProviderCardProps) {
    return (
        <Link href={`/profile/${id}`} className="block h-full group">
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col bg-white rounded-3xl ring-1 ring-gray-100">
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                    />
                    <div className="absolute top-3 right-3 z-10 transition-transform duration-200 hover:scale-110">
                        <FavoriteButton
                            salonId={id}
                            className="bg-white/90 backdrop-blur-md shadow-sm opacity-90 hover:opacity-100 h-9 w-9"
                            size="icon"
                        />
                    </div>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col gap-3">
                    {/* Header with Avatar and Rating */}
                    <div className="flex justify-between items-start gap-3">
                        <div className="relative -mt-10 mb-1">
                            <div className="h-16 w-16 rounded-2xl border-4 border-white shadow-sm overflow-hidden bg-white">
                                <Image src={avatar} alt={name} fill className="object-cover" sizes="64px" />
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 mt-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">{rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-500">({reviewCount})</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                        <div>
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md mb-1.5">
                                {category}
                            </span>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-pink-600 transition-colors line-clamp-1">
                                {name}
                            </h3>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                            <span className="truncate">{location}</span>
                        </div>
                    </div>

                    {/* Footer / Languages */}
                    {languages && languages.length > 0 && (
                        <div className="pt-3 border-t border-gray-50 flex items-center gap-2 overflow-hidden">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            <div className="flex items-center gap-1.5 overflow-hidden">
                                {languages.slice(0, 2).map((lang) => (
                                    <span key={lang} className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                                        {lang}
                                    </span>
                                ))}
                                {languages.length > 2 && (
                                    <span className="text-xs text-gray-400 pl-0.5">+{languages.length - 2}</span>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
