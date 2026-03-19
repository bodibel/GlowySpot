
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("--- DB STATUS CHECK ---")
    try {
        const userCount = await prisma.user.count()
        const salonCount = await prisma.salon.count()
        const postCount = await prisma.post.count()
        const categoryCount = await prisma.category.count()
        const messageCount = await prisma.message.count()
        
        console.log(`Users: ${userCount}`)
        console.log(`Salons: ${salonCount}`)
        console.log(`Posts: ${postCount}`)
        console.log(`Categories: ${categoryCount}`)
        console.log(`Messages: ${messageCount}`)
        
        if (userCount > 0) {
            const admin = await prisma.user.findFirst({ where: { role: 'admin' } })
            console.log(`Admin exists: ${!!admin}`)
            if (admin) console.log(`Admin email: ${admin.email}`)
        }
    } catch (error) {
        console.error("DB CHECK FAILED:", error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
