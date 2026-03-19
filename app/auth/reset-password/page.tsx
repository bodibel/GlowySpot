import { Suspense } from "react"
import { ResetPasswordForm } from "./ResetPasswordForm"

export default function ResetPasswordPage() {
    return (
        <div className="container mx-auto flex h-screen items-center justify-center py-20">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Új jelszó megadása</h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        Kérjük, adja meg az új jelszavát alább.
                    </p>
                </div>
                <Suspense fallback={<div className="text-center p-4">Betöltés...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
