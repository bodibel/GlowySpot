"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    getAllUsers, 
    updateUserAdmin, 
    deleteUserAdmin, 
    toggleUserRole 
} from "@/lib/actions/user"
import { 
    Edit2, 
    Trash2, 
    RefreshCw, 
    Search,
    User as UserIcon,
    Mail,
    Calendar,
    BadgeCheck,
    MoreVertical,
    Check,
    X,
    UserCircle
} from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

interface UserManagerProps {
    filterRole?: string;
    title: string;
    description: string;
}

export function UserManager({ filterRole, title, description }: UserManagerProps) {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [editData, setEditData] = useState({ name: "", email: "", role: "" })

    const loadUsers = async () => {
        setLoading(true)
        const result = await getAllUsers()
        if (result.success) {
            setUsers(result.users || [])
        } else {
            toast.error(result.error || "Hiba a felhasználók betöltésekor")
        }
        setLoading(false)
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const filteredUsers = users.filter(user => {
        const matchesRole = !filterRole || user.role === filterRole
        const matchesSearch = 
            (user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
             user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesRole && matchesSearch
    })

    const handleEdit = (user: any) => {
        setSelectedUser(user)
        setEditData({
            name: user.name || "",
            email: user.email || "",
            role: user.role
        })
        setIsEditModalOpen(true)
    }

    const handleUpdate = async () => {
        if (!selectedUser) return

        const result = await updateUserAdmin(selectedUser.id, editData)
        if (result.success) {
            toast.success("Felhasználó frissítve")
            setIsEditModalOpen(false)
            loadUsers()
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem visszavonható!")) return

        const result = await deleteUserAdmin(userId)
        if (result.success) {
            toast.success("Felhasználó törölve")
            loadUsers()
        } else {
            toast.error(result.error)
        }
    }

    const handleToggleRole = async (userId: string) => {
        const result = await toggleUserRole(userId)
        if (result.success) {
            toast.success(`Szerepkör módosítva erre: ${result.newRole === 'provider' ? 'Szolgáltató' : 'Látogató'}`)
            loadUsers()
        } else {
            toast.error(result.error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Keresés..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {loading ? (
                            <div className="p-12 text-center text-muted-foreground">
                                <div className="animate-pulse">Adatok betöltése...</div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground">
                                Nincs találat a megadott feltételekkel.
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || ""} className="h-full w-full object-cover" />
                                            ) : (
                                                user.name?.charAt(0) || <UserIcon size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {user.name || "Névtelen"}
                                                {user.role === "admin" && <BadgeCheck className="h-4 w-4 text-blue-500" />}
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Mail size={12} /> {user.email}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-1">
                                                <Calendar size={10} /> 
                                                Regisztrált: {user.createdAt ? format(new Date(user.createdAt), 'yyyy. MMMM d.', { locale: hu }) : "Ismeretlen"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 px-4 md:px-0">
                                        <div className="hidden lg:block text-right mr-4">
                                            <div className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full inline-block ${
                                                user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                user.role === 'provider' ? 'bg-pink-100 text-pink-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {user.role === 'admin' ? 'Admin' : 
                                                 user.role === 'provider' ? 'Szolgáltató' : 'Látogató'}
                                            </div>
                                            {user.role === 'provider' && user.salons?.length > 0 && (
                                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                                    {user.salons.length} szalon
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8"
                                                onClick={() => handleEdit(user)}
                                                title="Szerkesztés"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            
                                            {user.role !== 'admin' && (
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50"
                                                    onClick={() => handleToggleRole(user.id)}
                                                    title={`Váltás ${user.role === 'visitor' ? 'Szolgáltatóra' : 'Látogatóra'}`}
                                                >
                                                    <RefreshCw className="h-4 w-4" />
                                                </Button>
                                            )}

                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 text-red-600 border-red-100 hover:bg-red-50"
                                                onClick={() => handleDelete(user.id)}
                                                title="Törlés"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Felhasználó szerkesztése</DialogTitle>
                        <DialogDescription>
                            Módosítsd a felhasználó adatait.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Név</Label>
                            <Input 
                                id="name" 
                                value={editData.name} 
                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email"
                                value={editData.email} 
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Szerepkör</Label>
                            <Select 
                                value={editData.role} 
                                onValueChange={(value) => setEditData({...editData, role: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Válassz szerepkört" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="visitor">Látogató</SelectItem>
                                    <SelectItem value="provider">Szolgáltató</SelectItem>
                                    <SelectItem value="admin">Adminisztrátor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Mégse</Button>
                        <Button onClick={handleUpdate} className="bg-pink-600 hover:bg-pink-700">Mentés</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
