"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { FeedCard } from "@/components/home/feed-card"
import { StoryBar } from "@/components/home/story-bar"
import { HeroBanner } from "@/components/home/hero-banner"
import { getCategories } from "@/lib/actions/category"
import {
  Scissors,
  Sparkles,
  Hand,
  User,
  Palette,
  Waves,
  Smile,
  Search
} from "lucide-react"

// Icon mapping lookup
const ICON_MAP: Record<string, any> = {
  Scissors,
  Sparkles,
  Hand,
  User,
  Palette,
  Waves,
  Smile,
}
import { getRecentPosts, updatePost, toggleLike } from "@/lib/actions/salon"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/lib/filter-context"
import { useAuth } from "@/lib/auth-context"
import { PostModal } from "@/components/salon/modals/PostModal"
import { toast } from "sonner"

export default function Home() {
  const { userData } = useAuth()
  const { location, filters, addServiceFilter, removeServiceFilter } = useFilter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])

  // Edit Post State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setIsPostModalOpen(true)
  }

  const handleSavePost = async (content: string, imageUrls: string[], layout: string) => {
    try {
      if (editingPost) {
        await updatePost(editingPost.id, { content, images: imageUrls, layout })
        setPosts(posts.map(p => p.id === editingPost.id ? { ...p, content, images: imageUrls, layout } : p))
        toast.success("Bejegyzés frissítve!")
      }
      setIsPostModalOpen(false)
      setEditingPost(null)
    } catch (error) {
      console.error("Error saving post:", error)
      toast.error("Hiba történt a mentés során!")
    }
  }

  const handleToggleLike = async (postId: string) => {
    if (!userData) {
      toast.error("Be kell jelentkezned a kedveléshez!")
      return
    }
    try {
      await toggleLike(postId, userData.id)
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Hiba történt!")
    }
  }

  useEffect(() => {
    const loadCategories = async () => {
      const fetched = await getCategories()
      setCategories(fetched)
    }
    loadCategories()
  }, [])

  // Pagination State
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  useEffect(() => {
    setPage(1)
    loadInitialData()
  }, [location.lat, location.lng, location.radius, filters.services])

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || isFetchingMore) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePosts()
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    )

    const sentinel = document.getElementById("scroll-sentinel")
    if (sentinel) observer.observe(sentinel)

    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, posts])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const recentPosts = await getRecentPosts(1, {
        lat: location.lat,
        lng: location.lng,
        radius: location.radius,
        categories: filters.services
      }, userData?.id)
      setPosts(formatPosts(recentPosts))
      setHasMore(recentPosts.length === 20)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMorePosts = async () => {
    setIsFetchingMore(true)
    const nextPage = page + 1
    try {
      const newPosts = await getRecentPosts(nextPage, {
        lat: location.lat,
        lng: location.lng,
        radius: location.radius,
        categories: filters.services
      }, userData?.id)
      if (newPosts.length === 0) {
        setHasMore(false)
      } else {
        setPosts(prev => [...prev, ...formatPosts(newPosts)])
        setPage(nextPage)
        setHasMore(newPosts.length === 20)
      }
    } catch (error) {
      console.error("Error loading more posts:", error)
    } finally {
      setIsFetchingMore(false)
    }
  }

  const formatPosts = (rawPosts: any[]) => {
    return rawPosts.map(p => {
      const prices = p.salon.services?.map((s: any) => s.price) || []
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0

      return {
        id: p.id,
        author: {
          id: p.salon.id,
          name: p.salon.name,
          ownerId: p.salon.ownerId,
          avatar: p.salon.profileImage || p.salon.images?.[0] || "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=100&q=80",
          role: p.salon.categories?.[0] || "Szolgáltató",
          currency: p.salon.currency || "HUF",
          minPrice: minPrice,
          rating: p.salon.rating || 0,
          reviewCount: p.salon.reviewCount || 0
        },
        isLiked: p.isLiked,
        images: p.images,
        layout: p.layout,
        content: p.content,
        likes: p._count?.likes || 0,
        comments: p._count?.comments || 0,
        createdAt: new Date(p.createdAt)
      }
    })
  }

  const toggleCategory = (category: string) => {
    // This now syncs with the global filter context
  }

  return (
    <MainLayout>
      <div className="space-y-8 pb-10 w-full max-w-2xl">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Filters - Card Wrapper */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <Button
              variant={filters.services.length === 0 ? "default" : "outline"}
              className={`rounded-full px-6 h-9 text-sm font-medium ${filters.services.length === 0 ? "bg-gray-900 text-white hover:bg-black" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}
              onClick={() => {
                // Clear all service filters
                filters.services.forEach(s => removeServiceFilter(s))
              }}
            >
              All
            </Button>
            {categories.map((category) => {
              const id = category.slug
              const isSelected = filters.services.includes(id)
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  className={`rounded-full px-6 h-9 text-sm font-medium whitespace-nowrap ${isSelected
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  onClick={() => isSelected ? removeServiceFilter(id) : addServiceFilter(id)}
                >
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Stories - Card Wrapper with Sticky Container */}
        <div className="sticky top-16 xl:top-0 z-30 transition-[top]">
          <div className="bg-transparent py-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
              <StoryBar />
            </div>
          </div>
        </div>

        {/* Recent Works Header */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold font-serif text-gray-900">Legújabb Bejegyzések</h2>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Kiemelt</span>
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {posts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              isOwner={userData?.id === post.author.ownerId}
              onEdit={handleEditPost}
              onLike={handleToggleLike}
            />
          ))}

          {/* Scroll Sentinel / Loading States */}
          {loading && posts.length === 0 && (
            <div className="space-y-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[4/5] w-full rounded-3xl bg-gray-100 animate-pulse" />)}
            </div>
          )}

          {hasMore && posts.length > 0 && (
            <div id="scroll-sentinel" className="h-10 flex justify-center items-center">
              {isFetchingMore && <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />}
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400 font-medium">You've reached the end of elegance</p>
            </div>
          )}
        </div>
      </div>
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
    </MainLayout>
  )
}
