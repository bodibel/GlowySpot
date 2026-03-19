"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { registerUser } from "@/lib/actions/auth"
import { resetPasswordRequest } from "@/lib/actions/password-reset"
import { Eye, EyeOff } from "lucide-react"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot_password">("login")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState<"visitor" | "provider">("visitor")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            await signIn("google", { callbackUrl: "/" })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                setError("Hibás email vagy jelszó!")
            } else {
                onClose()
            }
        } catch (err: any) {
            console.error("Login error:", err)
            setError("Hiba történt a bejelentkezés során.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("A jelszavak nem egyeznek!")
            return
        }

        setError("")
        setLoading(true)

        try {
            const regResult = await registerUser({
                email,
                name,
                role: email === "admin@glowyspot.com" ? "admin" : role,
                password
            })

            if (regResult.error) {
                setError(regResult.error)
                setLoading(false)
                return
            }

            // Auto login after registration
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                setError("Hiba a bejelentkezésnél a regisztráció után.")
                return
            }

            onClose()
        } catch (err: any) {
            console.error("Registration error:", err)
            setError(err.message || "Hiba történt a regisztráció során.")
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setError("Kérjük, adja meg az email címét!")
            return
        }

        setError("")
        setLoading(true)

        try {
            const result = await resetPasswordRequest(email)
            if (result.error) {
                setError(result.error)
            } else {
                // Show success message in the error box but styled positively? 
                // Let's just use setError for simplicity but prefix it
                setError("Sikeres: " + result.success)
            }
        } catch (err: any) {
            console.error("Forgot password error:", err)
            setError(err.message || "Hiba történt a művelet során.")
        } finally {
            setLoading(false)
        }
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={activeTab === "login" ? "Bejelentkezés" : activeTab === "register" ? "Regisztráció" : "Jelszó visszaállítása"}>
            <div className="flex space-x-2 mb-6 border-b">
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === "login"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    onClick={() => setActiveTab("login")}
                >
                    Bejelentkezés
                </button>
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === "register"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    onClick={() => setActiveTab("register")}
                >
                    Regisztráció
                </button>
            </div>

            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

            {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Email cím"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input
                                placeholder="Jelszó"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => { setActiveTab("forgot_password"); setError(""); }}
                            className="text-xs text-primary hover:underline"
                        >
                            Elfelejtett jelszó?
                        </button>
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Betöltés..." : "Bejelentkezés"}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Vagy</span>
                        </div>
                    </div>
                    <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        Bejelentkezés Google fiókkal
                    </Button>
                </form>
            ) : activeTab === "register" ? (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Teljes név"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="Email cím"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div className="relative">
                            <Input
                                placeholder="Jelszó"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <div className="relative">
                            <Input
                                placeholder="Jelszó megerősítése"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Regisztráció mint:</label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="visitor"
                                    checked={role === "visitor"}
                                    onChange={() => setRole("visitor")}
                                    className="accent-primary"
                                />
                                <span>Látogató</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="provider"
                                    checked={role === "provider"}
                                    onChange={() => setRole("provider")}
                                    className="accent-primary"
                                />
                                <span>Szolgáltató</span>
                            </label>
                        </div>
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Regisztráció..." : "Regisztráció"}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">Vagy</span>
                        </div>
                    </div>
                    <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                        Regisztráció Google fiókkal
                    </Button>
                </form>
            ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Adja meg az email címét, és küldünk egy linket a jelszava visszaállításához.
                    </p>
                    <div className="space-y-2">
                        <Input
                            placeholder="Email cím"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button className="w-full" disabled={loading}>
                        {loading ? "Küldés..." : "Link küldése"}
                    </Button>
                    <div className="flex justify-center mt-2">
                         <button
                            type="button"
                            onClick={() => { setActiveTab("login"); setError(""); }}
                            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                        >
                            Vissza a bejelentkezéshez
                        </button>
                    </div>
                </form>
            )}

            <div className="mt-6 p-4 bg-muted rounded-lg text-xs space-y-3">
                <p className="font-semibold mb-2">Teszt fiókok (Gyors betöltés):</p>

                <div className="grid grid-cols-1 gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="justify-between h-auto py-2"
                        onClick={() => { setEmail("admin@glowyspot.com"); setPassword("password123"); }}
                    >
                        <div className="text-left">
                            <div className="font-medium">Admin</div>
                            <div className="text-muted-foreground text-[10px]">admin@glowyspot.com</div>
                        </div>
                        <span className="text-pink-600 font-bold ml-2">Betöltés</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="justify-between h-auto py-2"
                        onClick={() => { setEmail("provider1@glowyspot.com"); setPassword("password123"); }}
                    >
                        <div className="text-left">
                            <div className="font-medium">Szolgáltató</div>
                            <div className="text-muted-foreground text-[10px]">provider1@glowyspot.com</div>
                        </div>
                        <span className="text-pink-600 font-bold ml-2">Betöltés</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="justify-between h-auto py-2"
                        onClick={() => { setEmail("single_provider@glowyspot.com"); setPassword("password123"); }}
                    >
                        <div className="text-left">
                            <div className="font-medium">1 Szalonos Szolg.</div>
                            <div className="text-muted-foreground text-[10px]">single_provider@glowyspot.com</div>
                        </div>
                        <span className="text-pink-600 font-bold ml-2">Betöltés</span>
                    </Button>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="justify-between h-auto py-2"
                        onClick={() => { setEmail("visitor1@glowyspot.com"); setPassword("password123"); }}
                    >
                        <div className="text-left">
                            <div className="font-medium">Látogató</div>
                            <div className="text-muted-foreground text-[10px]">visitor1@glowyspot.com</div>
                        </div>
                        <span className="text-pink-600 font-bold ml-2">Betöltés</span>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
