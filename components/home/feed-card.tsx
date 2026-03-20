"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Star, Pencil, LayoutGrid, ChevronLeft, ChevronRight, Bookmark } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { hu } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"

interface FeedCardProps {
    post: {
        id: string
        author: {
            id: string
            name: string
            avatar: string
            role: string
            currency?: string
            minPrice?: number
            rating?: number
            reviewCount?: number
        }
        images: string[]
        layout?: string
        content: string
        likes: number
        comments: number
        isLiked?: boolean
        createdAt: Date
    }
    isOwner?: boolean
    onEdit?: (post: any) => void
    onLike?: (postId: string) => void
}

export function FeedCard({ post, isOwner, onEdit, onLike }: FeedCardProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked || false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)

    const renderImages = () => {
        const images = post.images || []
        const layout = post.layout || "grid"

        if (images.length === 0) return <div className="aspect-[4/5] bg-muted flex items-center justify-center"><LayoutGrid className="h-10 w-10 text-muted-foreground/30" /></div>

        if (layout === "carousel") {
            return (
                <div className="relative aspect-[4/5] w-full group/carousel">
                    <Image
                        src={images[currentImageIndex]}
                        alt={post.content}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 600px"
                    />
                    {images.length > 1 && (
                        <>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
                                    }}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
                                    aria-label="Előző kép"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
                                    aria-label="Következő kép"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "h-1.5 rounded-full transition-all shadow-sm",
                                            i === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )
        }

        if (layout === "collage" && images.length >= 3) {
            return (
                <div className="grid grid-cols-2 gap-1 aspect-[4/5] overflow-hidden">
                    <div className="relative h-full">
                        <Image src={images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div className="grid grid-rows-2 gap-1">
                        <div className="relative h-full">
                            <Image src={images[1]} alt="" fill className="object-cover" />
                        </div>
                        <div className="relative h-full">
                            <Image src={images[2]} alt="" fill className="object-cover" />
                            {images.length > 3 && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-black text-xl">+{images.length - 3}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        if (layout === "columns") {
            return (
                <div className="flex flex-col gap-1 bg-muted">
                    {images.slice(0, 3).map((img, i) => (
                        <div key={i} className="relative aspect-[16/9] w-full">
                            <Image src={img} alt="" fill className="object-cover" />
                        </div>
                    ))}
                    {images.length > 3 && (
                        <div className="p-3 text-center border-t border-border">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">+{images.length - 3} további kép</span>
                        </div>
                    )}
                </div>
            )
        }

        // Default: Grid
        return (
            <div className={cn(
                "grid gap-1 aspect-[4/5] w-full overflow-hidden",
                images.length === 1 ? "grid-cols-1" :
                    images.length === 2 ? "grid-cols-2" :
                        "grid-cols-2 grid-rows-2"
            )}>
                {images.slice(0, 4).map((img, i) => (
                    <div key={i} className={cn("relative h-full", i === 0 && images.length === 3 && "row-span-2")}>
                        <Image src={img} alt="" fill className="object-cover" />
                        {i === 3 && images.length > 4 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="text-white font-black text-xl">+{images.length - 4}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    const likeCount = post.likes + (isLiked && !post.isLiked ? 1 : (!isLiked && post.isLiked ? -1 : 0))

    return (
        <>
            <div className="group relative w-full overflow-hidden rounded-2xl bg-surface border border-border shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-lg">

                {/* Card header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                    <Link
                        href={`/profile/${post.author.id}`}
                        className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                    >
                        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{post.author.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                                {post.author.role} · {formatDistanceToNow(post.createdAt, { locale: hu, addSuffix: true })}
                            </p>
                        </div>
                    </Link>
                    {post.author.rating !== undefined && post.author.rating > 0 && (
                        <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
                            <Star className="h-3.5 w-3.5 fill-amber-500" />
                            <span className="text-xs font-bold">{post.author.rating.toFixed(1)}</span>
                        </div>
                    )}
                    {isOwner && onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(post)}
                            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95"
                            aria-label="Bejegyzés szerkesztése"
                        >
                            <Pencil className="h-3 w-3" />
                            Szerkesztés
                        </button>
                    )}
                </div>

                {/* Media */}
                <div
                    className="cursor-pointer overflow-hidden"
                    onClick={() => setIsModalOpen(true)}
                >
                    {renderImages()}
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-4 px-4 py-3 border-t border-border/50">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); if (onLike) onLike(post.id); }}
                        className={cn("flex items-center gap-1.5 text-sm transition-colors hover:text-primary", isLiked && "text-primary")}
                        aria-label="Kedvelés"
                    >
                        <Heart className={cn("h-5 w-5", isLiked && "fill-primary stroke-primary")} />
                        <span className="font-medium">{likeCount}</span>
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Hozzászólások"
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-medium">{post.comments}</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Megosztás"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>
                    <div className="flex-1" />
                    <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Mentés"
                    >
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>

                {/* Text content */}
                <div className="px-4 pb-4 space-y-2">
                    <p className="text-sm text-foreground">
                        <span className="font-semibold">{post.author.name} </span>
                        <span
                            className={cn("cursor-pointer", !isExpanded && "line-clamp-2")}
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {post.content}
                        </span>
                        {!isExpanded && post.content.length > 100 && (
                            <button
                                type="button"
                                className="text-muted-foreground text-xs font-medium hover:text-foreground ml-1"
                                onClick={() => setIsExpanded(true)}
                            >
                                ... több
                            </button>
                        )}
                    </p>

                    {post.author.minPrice !== undefined && post.author.minPrice > 0 && (
                        <button
                            type="button"
                            className="w-full rounded-xl bg-gradient-to-r from-primary to-accent-rose py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        >
                            Foglalj időpontot · {post.author.minPrice} {post.author.currency}-tól
                        </button>
                    )}
                </div>
            </div>

            <PostDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                post={post}
                onLike={onLike}
            />
        </>
    )
}
