import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXTAUTH_URL || "https://glowyspot.com"
const emailFrom = process.env.EMAIL_FROM || "noreply@mail.glowyspot.com"

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/auth/reset-password?token=${token}`

    await resend.emails.send({
        from: `GlowySpot <${emailFrom}>`,
        to: email,
        subject: "Jelszó visszaállítása",
        html: `
            <h1>Jelszó visszaállítása</h1>
            <p>Kattints az alábbi linkre a jelszavad visszaállításához:</p>
            <a href="${resetLink}">Jelszó visszaállítása</a>
            <p>Ha nem te kérted a jelszó visszaállítását, kérjük hagyd figyelmen kívül ezt az emailt.</p>
        `
    })
}

export const sendWelcomeEmail = async (email: string, name: string) => {
    await resend.emails.send({
        from: `GlowySpot <${emailFrom}>`,
        to: email,
        subject: "Üdvözlünk a GlowySpot-on!",
        html: `
            <h1>Kedves ${name}!</h1>
            <p>Köszönjük, hogy regisztráltál a GlowySpot oldalán.</p>
            <p>Fedezd fel a legjobb szépségipari szolgáltatásokat a közeledben!</p>
        `
    })
}
