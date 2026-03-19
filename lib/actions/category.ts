"use server"

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { requireSession } from "@/lib/auth-utils"

async function requireAdmin() {
    const userId = await requireSession()
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
    })
    if (user?.role !== "admin") {
        throw new Error("Unauthorized")
    }
}

export async function getCategories(all?: boolean) {
    try {
        const categories = await prisma.category.findMany({
            where: all ? {} : { isActive: true },
            orderBy: { order: 'asc' }
        })
        return categories
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function createCategory(data: { name: string; slug: string; icon?: string; order?: number }) {
    await requireAdmin()
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                icon: data.icon,
                order: data.order || 0,
                isActive: true
            }
        })
        revalidatePath("/")
        revalidatePath("/dashboard/admin/settings")
        return { success: true, category }
    } catch (error: any) {
        console.error("Error creating category:", error)
        return { success: false, error: error.message || "Failed to create category" }
    }
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; icon?: string; order?: number; isActive?: boolean }) {
    await requireAdmin()
    try {
        const category = await prisma.category.update({
            where: { id },
            data
        })
        revalidatePath("/")
        revalidatePath("/dashboard/admin/settings")
        return { success: true, category }
    } catch (error: any) {
        console.error("Error updating category:", error)
        return { success: false, error: error.message || "Failed to update category" }
    }
}

export async function deleteCategory(id: string) {
    await requireAdmin()
    try {
        // We could either delete or just inactivate. 
        // Let's check if it's used first? Usually it's safer to just inactivate.
        const category = await prisma.category.update({
            where: { id },
            data: { isActive: false }
        })
        revalidatePath("/")
        revalidatePath("/dashboard/admin/settings")
        return { success: true, category }
    } catch (error: any) {
        console.error("Error deleting category:", error)
        return { success: false, error: error.message || "Failed to delete category" }
    }
}
