"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Phone, Mail, Eye, Bell, MessageSquare, Calendar, Star, Heart, ThumbsUp, MessageCircle, BarChart3, Edit } from "lucide-react"
import { useState } from "react"

interface ContactSettingsProps {
    salon: {
        phone?: string | null
        email?: string | null
        showPhoneOnProfile?: boolean
        showEmailOnProfile?: boolean
        allowMessages?: boolean
        allowBookings?: boolean
        notifyNewMessage?: boolean
        notifyNewBooking?: boolean
        notifyNewReview?: boolean
        notifyNewFavorite?: boolean
        notifyPostLike?: boolean
        notifyPostComment?: boolean
        notifyWeeklyStats?: boolean
        notifyMonthlyStats?: boolean
    }
    onSave: (data: Partial<ContactSettingsProps['salon']>) => Promise<void>
}

export function ContactSettingsCard({ salon, onSave }: ContactSettingsProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form state
    const [phone, setPhone] = useState(salon.phone || "")
    const [email, setEmail] = useState(salon.email || "")
    const [showPhoneOnProfile, setShowPhoneOnProfile] = useState(salon.showPhoneOnProfile ?? true)
    const [showEmailOnProfile, setShowEmailOnProfile] = useState(salon.showEmailOnProfile ?? false)
    const [allowMessages, setAllowMessages] = useState(salon.allowMessages ?? true)
    const [allowBookings, setAllowBookings] = useState(salon.allowBookings ?? true)
    const [notifyNewMessage, setNotifyNewMessage] = useState(salon.notifyNewMessage ?? true)
    const [notifyNewBooking, setNotifyNewBooking] = useState(salon.notifyNewBooking ?? true)
    const [notifyNewReview, setNotifyNewReview] = useState(salon.notifyNewReview ?? true)
    const [notifyNewFavorite, setNotifyNewFavorite] = useState(salon.notifyNewFavorite ?? false)
    const [notifyPostLike, setNotifyPostLike] = useState(salon.notifyPostLike ?? false)
    const [notifyPostComment, setNotifyPostComment] = useState(salon.notifyPostComment ?? true)
    const [notifyWeeklyStats, setNotifyWeeklyStats] = useState(salon.notifyWeeklyStats ?? true)
    const [notifyMonthlyStats, setNotifyMonthlyStats] = useState(salon.notifyMonthlyStats ?? true)

    const handleSave = async () => {
        setSaving(true)
        try {
            await onSave({
                phone: phone || null,
                email: email || null,
                showPhoneOnProfile,
                showEmailOnProfile,
                allowMessages,
                allowBookings,
                notifyNewMessage,
                notifyNewBooking,
                notifyNewReview,
                notifyNewFavorite,
                notifyPostLike,
                notifyPostComment,
                notifyWeeklyStats,
                notifyMonthlyStats,
            })
            setIsEditing(false)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        // Reset to original values
        setPhone(salon.phone || "")
        setEmail(salon.email || "")
        setShowPhoneOnProfile(salon.showPhoneOnProfile ?? true)
        setShowEmailOnProfile(salon.showEmailOnProfile ?? false)
        setAllowMessages(salon.allowMessages ?? true)
        setAllowBookings(salon.allowBookings ?? true)
        setNotifyNewMessage(salon.notifyNewMessage ?? true)
        setNotifyNewBooking(salon.notifyNewBooking ?? true)
        setNotifyNewReview(salon.notifyNewReview ?? true)
        setNotifyNewFavorite(salon.notifyNewFavorite ?? false)
        setNotifyPostLike(salon.notifyPostLike ?? false)
        setNotifyPostComment(salon.notifyPostComment ?? true)
        setNotifyWeeklyStats(salon.notifyWeeklyStats ?? true)
        setNotifyMonthlyStats(salon.notifyMonthlyStats ?? true)
        setIsEditing(false)
    }

    return (
        <div className="space-y-6">
            {/* Contact Info Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-primary" />
                            Kapcsolati adatok
                        </CardTitle>
                        <CardDescription>Telefonszám és email cím beállítások</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" /> Szerkesztés
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                Telefonszám
                            </Label>
                            {isEditing ? (
                                <Input
                                    type="tel"
                                    placeholder="+36 20 123 4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            ) : (
                                <p className="text-sm py-2">{phone || <span className="text-gray-400">Nincs megadva</span>}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                E-mail cím
                            </Label>
                            {isEditing ? (
                                <Input
                                    type="email"
                                    placeholder="szalon@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            ) : (
                                <p className="text-sm py-2">{email || <span className="text-gray-400">Nincs megadva</span>}</p>
                            )}
                        </div>
                    </div>

                    {/* Profile Display Settings */}
                    <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Megjelenítés a profilon
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Telefonszám mutatása</p>
                                    <p className="text-xs text-gray-500">Látható lesz a profilodon</p>
                                </div>
                                <Switch
                                    checked={showPhoneOnProfile}
                                    onCheckedChange={setShowPhoneOnProfile}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Email cím mutatása</p>
                                    <p className="text-xs text-gray-500">Látható lesz a profilodon</p>
                                </div>
                                <Switch
                                    checked={showEmailOnProfile}
                                    onCheckedChange={setShowEmailOnProfile}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Messaging & Booking Settings */}
                    <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Funkciók engedélyezése
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Üzenetek fogadása</p>
                                    <p className="text-xs text-gray-500">Látogatók küldhetnek privát üzenetet</p>
                                </div>
                                <Switch
                                    checked={allowMessages}
                                    onCheckedChange={setAllowMessages}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-sm">Online időpontfoglalás</p>
                                    <p className="text-xs text-gray-500">Ügyfelek foglalhatnak időpontot az oldalon</p>
                                </div>
                                <Switch
                                    checked={allowBookings}
                                    onCheckedChange={setAllowBookings}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Email Notifications Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-orange-500" />
                        E-mail értesítések
                    </CardTitle>
                    <CardDescription>Válaszd ki, mely eseményekről szeretnél értesítést kapni</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="font-medium text-sm">Új üzenet</p>
                                <p className="text-xs text-gray-500">Valaki üzenetet küldött neked</p>
                            </div>
                        </div>
                        <Switch checked={notifyNewMessage} onCheckedChange={setNotifyNewMessage} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="font-medium text-sm">Új foglalás</p>
                                <p className="text-xs text-gray-500">Valaki időpontot foglalt</p>
                            </div>
                        </div>
                        <Switch checked={notifyNewBooking} onCheckedChange={setNotifyNewBooking} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <div>
                                <p className="font-medium text-sm">Új vélemény</p>
                                <p className="text-xs text-gray-500">Valaki értékelte a szalonodat</p>
                            </div>
                        </div>
                        <Switch checked={notifyNewReview} onCheckedChange={setNotifyNewReview} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5 text-red-500" />
                            <div>
                                <p className="font-medium text-sm">Kedvencnek jelöltek</p>
                                <p className="text-xs text-gray-500">Valaki kedvencei közé tett</p>
                            </div>
                        </div>
                        <Switch checked={notifyNewFavorite} onCheckedChange={setNotifyNewFavorite} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ThumbsUp className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="font-medium text-sm">Lájkolták a bejegyzésedet</p>
                                <p className="text-xs text-gray-500">Valaki lájkolta a bejegyzésedet</p>
                            </div>
                        </div>
                        <Switch checked={notifyPostLike} onCheckedChange={setNotifyPostLike} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="font-medium text-sm">Hozzászólás a bejegyzésedhez</p>
                                <p className="text-xs text-gray-500">Valaki kommentelt a bejegyzésedre</p>
                            </div>
                        </div>
                        <Switch checked={notifyPostComment} onCheckedChange={setNotifyPostComment} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="font-medium text-sm">Heti statisztika</p>
                                <p className="text-xs text-gray-500">Összefoglaló a heti teljesítményről</p>
                            </div>
                        </div>
                        <Switch checked={notifyWeeklyStats} onCheckedChange={setNotifyWeeklyStats} disabled={!isEditing} />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium text-sm">Havi statisztika</p>
                                <p className="text-xs text-gray-500">Összefoglaló a havi teljesítményről</p>
                            </div>
                        </div>
                        <Switch checked={notifyMonthlyStats} onCheckedChange={setNotifyMonthlyStats} disabled={!isEditing} />
                    </div>
                </CardContent>
            </Card>

            {/* Save/Cancel buttons */}
            {isEditing && (
                <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={handleCancel}>
                        Mégse
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary">
                        {saving ? "Mentés..." : "Mentés"}
                    </Button>
                </div>
            )}
        </div>
    )
}
