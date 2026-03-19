"use client"

import { use, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/lib/auth-context"
import { createPost, updatePost, deletePost } from "@/lib/actions/salon"
import { useRouter } from "next/navigation"
import { useSalonData } from "@/hooks/useSalonData"
import { Post } from "@/lib/salon-types"

import { PostsCard } from "@/components/salon/cards/PostsCard"
import { PostModal } from "@/components/salon/modals/PostModal"
import { toast } from "sonner"

export default function SalonPostsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { userData } = useAuth()
    const router = useRouter()

    const {
        salon,
        posts,
        setPosts,
        loading
    } = useSalonData(id, userData?.id)

    const [isPostModalOpen, setIsPostModalOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<Post | null>(null)

    const handleSavePost = async (content: string, imageUrls: string[], layout: string) => {
        try {
            if (editingPost) {
                await updatePost(editingPost.id, { content, images: imageUrls, layout })
                setPosts(posts.map(p => p.id === editingPost.id ? { ...p, content, images: imageUrls, layout } : p))
                toast.success("Bejegyzés frissítve!")
            } else {
                const newPost = await createPost({
                    salonId: id,
                    content,
                    images: imageUrls,
                    layout
                })
                setPosts(prev => {
                    if (prev.some(p => p.id === newPost.id)) return prev;
                    return [newPost, ...prev];
                })
                toast.success("Bejegyzés létrehozva!")
            }
            setIsPostModalOpen(false)
            setEditingPost(null)
        } catch (error) {
            console.error("Error saving post:", error)
            toast.error("Hiba történt a mentés során!")
        }
    }

    const handleDeletePost = async (postId: string) => {
        if (confirm("Biztosan törlöd ezt a bejegyzést?")) {
            try {
                await deletePost(postId)
                setPosts(posts.filter(p => p.id !== postId))
                toast.success("Bejegyzés törölve!")
            } catch (error) {
                console.error("Error deleting post:", error)
                toast.error("Hiba történt a törlés során!")
            }
        }
    }

    const formatDate = (dateValue: any) => {
        if (!dateValue) return ""
        // Prisma returns Date object, Firebase matched Timestamp
        const date = new Date(dateValue)
        return date.toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto p-6">
                    <div className="text-muted-foreground">Betöltés...</div>
                </div>
            </MainLayout>
        )
    }

    if (!salon && !loading) {
        return (
            <MainLayout showRightSidebar={false}>
                <div className="container mx-auto p-6 text-center">
                    <p className="text-muted-foreground">Szalon nem található vagy nincs jogosultságod.</p>
                </div>
            </MainLayout>
        )
    }

    if (!salon) return null

    return (
        <MainLayout showRightSidebar={false}>
            <div className="container mx-auto p-6 space-y-8 min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Bejegyzések kezelése</h1>
                <PostsCard
                    posts={posts}
                    onAddPost={() => {
                        setEditingPost(null)
                        setIsPostModalOpen(true)
                    }}
                    onEditPost={(post) => {
                        setEditingPost(post)
                        setIsPostModalOpen(true)
                    }}
                    onDeletePost={handleDeletePost}
                    formatDate={formatDate}
                />

                <PostModal
                    isOpen={isPostModalOpen}
                    onClose={() => {
                        setIsPostModalOpen(false)
                        setEditingPost(null)
                    }}
                    onSave={handleSavePost}
                    initialContent={editingPost?.content}
                    initialImages={editingPost?.images}
                    initialLayout={editingPost?.layout}
                    isEditing={!!editingPost}
                />
            </div>
        </MainLayout>
    )
}
