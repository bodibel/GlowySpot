"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, Share2, Star, Pencil, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PostDetailModal } from "./post-detail-modal"
import { Badge } from "@/components/ui/badge"

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

    const renderImages = () => {
        const images = post.images || []
        const layout = post.layout || "grid"

        if (images.length === 0) return <div className="aspect-[4/5] bg-gray-50 flex items-center justify-center"><LayoutGrid className="h-10 w-10 text-gray-200" /></div>

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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
                                    }}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-sm"
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
                <div className="flex flex-col gap-1 bg-gray-50">
                    {images.slice(0, 3).map((img, i) => (
                        <div key={i} className="relative aspect-[16/9] w-full">
                            <Image src={img} alt="" fill className="object-cover" />
                        </div>
                    ))}
                    {images.length > 3 && (
                        <div className="p-3 text-center bg-white border-t border-gray-100">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">+{images.length - 3} további kép</span>
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
                    <div key={i} className={cn("relative group/img h-full", i === 0 && images.length === 3 && "row-span-2")}>
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

    return (
        <>
            <div className="group relative w-full overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-md">
                <div
                    className="relative cursor-pointer overflow-hidden"
                    onClick={() => setIsModalOpen(true)}
                >
                    {renderImages()}

                    {/* Price Tag Overlay */}
                    {post.author.minPrice && post.author.minPrice > 0 && (
                        <div className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                            {post.author.minPrice} {post.author.currency}-tól
                        </div>
                    )}

                    {/* Edit Badge for Owners */}
                    {isOwner && onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(post);
                            }}
                            className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-pink-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                        >
                            <Pencil className="h-3 w-3" />
                            Szerkesztés
                        </button>
                    )}

                    {/* Gradient Overlay at Bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 p-6 text-white w-full pointer-events-none">
                        <div className="mb-2 flex items-center gap-3 pointer-events-auto">
                            <Link
                                href={`/profile/${post.author.id}`}
                                className="flex items-center gap-3 transition-opacity hover:opacity-80"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white">
                                    <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold leading-none text-white hover:underline">{post.author.name}</span>
                                    <span className="text-xs text-gray-200">{post.author.role}</span>
                                </div>
                            </Link>
                            <div className="ml-auto flex items-center gap-1 text-yellow-400">
                                <Star className="h-4 w-4 fill-yellow-400" />
                                <span className="text-sm font-bold">{post.author.rating?.toFixed(1) || "0.0"}</span>
                            </div>
                        </div>

                        <div
                            className="cursor-pointer mb-4 pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsModalOpen(true);
                            }}
                        >
                            <p className="line-clamp-2 text-sm text-gray-100 font-light">
                                {post.content}
                            </p>
                            {post.content.length > 80 && (
                                <span className="text-[10px] text-gray-300 font-bold hover:text-white transition-colors uppercase tracking-widest mt-1 inline-block">
                                    több...
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-white/20 pt-4 pointer-events-auto">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLiked(!isLiked);
                                        if (onLike) onLike(post.id);
                                    }}
                                    className="group/btn flex items-center gap-2 transition-colors hover:text-pink-400"
                                >
                                    <Heart className={cn("h-6 w-6", isLiked && "fill-pink-500 text-pink-500")} />
                                    <span className="text-sm font-medium">{post.likes + (isLiked && !post.isLiked ? 1 : (!isLiked && post.isLiked ? -1 : 0))}</span>
                                </button>
                                <button
                                    className="flex items-center gap-2 hover:text-blue-400"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <MessageCircle className="h-6 w-6" />
                                    <span className="text-sm font-medium">{post.comments}</span>
                                </button>
                            </div>
                            <button
                                className="hover:text-gray-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Share2 className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
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
