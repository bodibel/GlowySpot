import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

type PrismaClientSingleton = PrismaClient

const globalForPrisma = globalThis as unknown as {
    prisma_final: PrismaClientSingleton | undefined
}

function createPrismaClient(): PrismaClientSingleton {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma_final ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma_final = prisma
}

export default prisma
