"use server"

import { sendWelcomeEmail } from "@/lib/mail"
import prisma from "@/lib/db"
import bcrypt from "bcryptjs"

export async function registerUser(data: { email: string; name: string; role: string; password?: string }) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            return { error: "A felhasználó már létezik ezzel az email címmel." }
        }

        let hashedPassword = undefined
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10)
        }

        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                role: data.role,
                password: hashedPassword
            }
        })

        try {
            await sendWelcomeEmail(data.email, user.name || "Felhasználó")
        } catch(emailError) {
             console.error("Failed to send welcome email:", emailError)
        }

        return { success: true, user }
    } catch (error: any) {
        console.error("Registration error:", error)
        return { error: "Hiba történt a regisztráció során. Kérjük, próbáld újra!" }
    }
}
