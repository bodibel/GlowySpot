import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Hiányzó adatok!")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error("Hibás email cím vagy jelszó.")
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)

                if (!isValid) {
                    throw new Error("Hibás email cím vagy jelszó.")
                }

                return user
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async signIn({ user, account }: any) {
            // Check if user is inactive and within the 30-day restoration window
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email }
            })

            if (dbUser && !dbUser.isActive && dbUser.inactivatedAt) {
                const now = new Date()
                const daysDiff = (now.getTime() - dbUser.inactivatedAt.getTime()) / (1000 * 3600 * 24)

                if (daysDiff <= 30) {
                    // Restore account and associated data
                    await prisma.user.update({
                        where: { id: dbUser.id },
                        data: { isActive: true, inactivatedAt: null }
                    })
                    await prisma.salon.updateMany({
                        where: { ownerId: dbUser.id, inactivatedAt: { not: null } },
                        data: { isActive: true, inactivatedAt: null }
                    })
                    const salons = await prisma.salon.findMany({
                        where: { ownerId: dbUser.id },
                        select: { id: true }
                    })
                    const salonIds = salons.map(s => s.id)
                    await prisma.post.updateMany({
                        where: { salonId: { in: salonIds }, inactivatedAt: { not: null } },
                        data: { isActive: true, inactivatedAt: null }
                    })
                } else {
                    // Block login if past 30 days
                    return false
                }
            }
            return true
        },
        async session({ session, token }: any) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                (session.user as any).role = token.role;
                session.user.name = token.name;
            }
            return session
        },
        async jwt({ token, user, trigger }: any) {
            if (user) {
                // Initial login – persist role and name in token
                token.sub = user.id
                token.role = user.role
                token.name = user.name
            } else if (token.sub && !token.role) {
                // Ha a role hiányzik a token-ből (pl. régi session), frissítsük DB-ből
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, name: true }
                })
                if (dbUser) {
                    token.role = dbUser.role
                    token.name = dbUser.name
                }
            }
            if (trigger === "update") {
                // Re-fetch on explicit session update (e.g. profile change)
                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    select: { role: true, name: true }
                })
                if (dbUser) {
                    token.role = dbUser.role
                    token.name = dbUser.name
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/',
        error: '/auth/error',
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
