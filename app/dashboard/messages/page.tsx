"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, User, ChevronRight, MessageSquare, ShieldCheck, Mail, Inbox, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserMessages, sendMessage, markMessageAsRead, getAdminUser } from "@/lib/actions/salon"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { hu } from "date-fns/locale"

interface Thread {
    id: string;
    otherUser: {
        id: string;
        name: string | null;
        image: string | null;
    };
    lastMessage: any;
    messages: any[];
    unreadCount: number;
}

export default function MessagesPage() {
    const { userData } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [sending, setSending] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [admin, setAdmin] = useState<{ id: string, name: string, image: string | null } | null>(null)

    // Reference for scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const loadMessages = useCallback(async (shouldScroll = false) => {
        if (!userData?.id) return
        try {
            const data = await getUserMessages(userData.id)
            setMessages(data)
            if (shouldScroll) {
                setTimeout(scrollToBottom, 100)
            }
        } catch (error) {
            console.error("Error loading messages:", error)
        } finally {
            setLoading(false)
        }
    }, [userData?.id])

    const loadAdmin = async () => {
        const adminUser = await getAdminUser()
        if (adminUser) {
            setAdmin(adminUser as any)
        }
    }

    useEffect(() => {
        if (userData?.id) {
            loadMessages(true)
            loadAdmin()

            const interval = setInterval(() => {
                loadMessages()
            }, 5000)

            return () => clearInterval(interval)
        }
    }, [userData?.id, loadMessages])

    // Group messages into threads
    const threads: Thread[] = []
    const messagesMap = new Map<string, any[]>()

    messages.forEach(msg => {
        const otherUserId = msg.senderId === userData?.id ? msg.receiverId : msg.senderId
        if (!messagesMap.has(otherUserId)) {
            messagesMap.set(otherUserId, [])
        }
        messagesMap.get(otherUserId)?.push(msg)
    })

    messagesMap.forEach((msgs, otherUserId) => {
        const sortedMsgs = [...msgs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        const lastMsg = sortedMsgs[sortedMsgs.length - 1]
        const otherUser = lastMsg.senderId === userData?.id ? lastMsg.receiver : lastMsg.sender

        threads.push({
            id: otherUserId,
            otherUser,
            lastMessage: lastMsg,
            messages: sortedMsgs,
            unreadCount: msgs.filter(m => !m.isRead && m.receiverId === userData?.id).length
        })
    })

    // Sort threads by last message time
    threads.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())

    const filteredThreads = threads.filter(t =>
        t.otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    let activeThread = threads.find(t => t.id === activeThreadId)

    // Effect to auto-read messages when thread is active and new messages arrive
    useEffect(() => {
        if (activeThread && userData?.id) {
            const unreadMsgs = activeThread.messages.filter(m => !m.isRead && m.receiverId === userData.id)
            if (unreadMsgs.length > 0) {
                const readAll = async () => {
                    for (const msg of unreadMsgs) {
                        await markMessageAsRead(msg.id)
                    }
                    loadMessages()
                }
                readAll()
            }
            scrollToBottom()
        }
    }, [activeThread?.messages.length, activeThreadId, userData?.id])

    // If trying to message admin and no thread exists, create a dummy one
    if (!activeThread && activeThreadId && admin && activeThreadId === admin.id) {
        activeThread = {
            id: admin.id,
            otherUser: {
                id: admin.id,
                name: admin.name,
                image: admin.image
            },
            lastMessage: { content: "", createdAt: new Date().toISOString() },
            messages: [],
            unreadCount: 0
        }
    }

    const handleSendReply = async () => {
        if (!userData?.id || !activeThreadId || !replyContent.trim()) return

        setSending(true)
        try {
            await sendMessage({
                senderId: userData.id,
                receiverId: activeThreadId,
                content: replyContent,
                subject: activeThread?.lastMessage.subject || "Válasz"
            })
            setReplyContent("")
            await loadMessages(true)
        } catch (error) {
            console.error("Error sending reply:", error)
            alert("Hiba történt az üzenet küldésekor.")
        } finally {
            setSending(false)
        }
    }

    const handleSelectThread = async (threadId: string) => {
        setActiveThreadId(threadId)
    }

    const handleMessageAdmin = () => {
        if (!admin) {
            alert("Sajnáljuk, az adminisztrátor jelenleg nem elérhető.")
            return
        }
        setActiveThreadId(admin.id)
    }

    if (!userData) {
        return (
            <MainLayout showRightSidebar={false}>
                <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md w-full text-center p-8 space-y-4">
                        <div className="bg-pink-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto text-pink-500">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Bejelentkezés szükséges</h2>
                        <p className="text-muted-foreground">Az üzeneteid megtekintéséhez kérlek jelentkezz be.</p>
                        <Button className="w-full bg-pink-600 hover:bg-pink-700">Bejelentkezés</Button>
                    </Card>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout showRightSidebar={false}>
            <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-100px)]">
                <div className="flex flex-col md:flex-row gap-6 h-full">
                    {/* Sidebar: Thread List */}
                    <div className="w-full md:w-[350px] flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Üzenetek</h1>
                            {admin && userData.id !== admin.id && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs font-bold gap-1.5 text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-full px-3"
                                    onClick={handleMessageAdmin}
                                >
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Admin értesítése
                                </Button>
                            )}
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Keresés az üzenetek között..."
                                className="pl-10 h-11 bg-white border-gray-100 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Card className="flex-1 overflow-hidden border-gray-100 shadow-sm rounded-2xl flex flex-col">
                            <CardContent className="p-0 flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
                                        <p className="text-sm text-gray-400">Betöltés...</p>
                                    </div>
                                ) : filteredThreads.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {filteredThreads.map(thread => (
                                            <button
                                                key={thread.id}
                                                onClick={() => handleSelectThread(thread.id)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-gray-50 group",
                                                    activeThreadId === thread.id ? "bg-pink-50/50" : ""
                                                )}
                                            >
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                                        <AvatarImage src={thread.otherUser.image || ""} />
                                                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold">
                                                            {thread.otherUser.name?.[0] || <User className="h-4 w-4" />}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {thread.unreadCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                            {thread.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <p className={cn(
                                                            "text-sm font-bold truncate",
                                                            thread.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                                                        )}>
                                                            {thread.otherUser.name || "Ismeretlen"}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            {thread.lastMessage.createdAt ? format(new Date(thread.lastMessage.createdAt), "HH:mm", { locale: hu }) : ""}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-xs truncate",
                                                        thread.unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-400"
                                                    )}>
                                                        {thread.lastMessage.content}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                        <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                                            <Mail className="h-8 w-8 text-gray-200" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">Nincsenek üzenetek</h3>
                                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                                            Itt jelennek meg a kapott és küldött üzeneteid.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content: Message Thread */}
                    <div className="flex-1 flex flex-col h-full">
                        {activeThread ? (
                            <Card className="flex-1 overflow-hidden border-gray-100 shadow-sm rounded-2xl flex flex-col bg-white">
                                <CardHeader className="p-4 border-b border-gray-50 bg-white sticky top-0 z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-gray-100">
                                                <AvatarImage src={activeThread.otherUser.image || ""} />
                                                <AvatarFallback className="bg-gray-100 text-gray-500 text-xs font-bold">
                                                    {activeThread.otherUser.name?.[0] || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-900">{activeThread.otherUser.name}</h3>
                                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    Elérhető
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                                    {activeThread.messages.map((msg, index) => {
                                        const isMine = msg.senderId === userData.id
                                        return (
                                            <div
                                                key={msg.id}
                                                className={cn(
                                                    "flex flex-col max-w-[80%]",
                                                    isMine ? "ml-auto items-end" : "mr-auto items-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "p-4 rounded-2xl text-sm shadow-sm",
                                                        isMine
                                                            ? "bg-pink-600 text-white rounded-br-none"
                                                            : "bg-white text-gray-700 border border-gray-100 rounded-bl-none"
                                                    )}
                                                >
                                                    {msg.salon && (
                                                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded mb-2 mr-2 border border-pink-100/50">
                                                            {msg.salon.name}
                                                        </span>
                                                    )}
                                                    {msg.subject && (
                                                        <p className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest mb-2 pb-1.5 border-b opacity-60 inline-block",
                                                            isMine ? "border-white/20" : "border-gray-100"
                                                        )}>
                                                            {msg.subject}
                                                        </p>
                                                    )}
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium mt-1.5 px-1">
                                                    {format(new Date(msg.createdAt), "HH:mm | MMM d.", { locale: hu })}
                                                </span>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </CardContent>

                                <div className="p-4 border-t border-gray-50 bg-white">
                                    <div className="flex items-center gap-2">
                                        <Textarea
                                            placeholder="Válasz írása..."
                                            className="min-h-[44px] h-[44px] flex-1 resize-none bg-gray-50/50 border-transparent focus:border-pink-100 focus:bg-white rounded-xl transition-all py-3 px-4 text-sm"
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    handleSendReply()
                                                }
                                            }}
                                        />
                                        <Button
                                            size="icon"
                                            className="h-11 w-11 rounded-xl bg-pink-600 hover:bg-pink-700 shadow-md shadow-pink-100 transition-all active:scale-90 shrink-0"
                                            disabled={!replyContent.trim() || sending}
                                            onClick={handleSendReply}
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="flex-1 flex flex-col items-center justify-center border-gray-100 shadow-sm rounded-2xl bg-white/50 border-dashed">
                                <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-sm mb-4 border border-gray-50">
                                    <Inbox className="h-10 w-10 text-gray-200" />
                                </div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Válassz ki egy üzenetet</h2>
                                <p className="text-gray-400 text-sm mt-1 max-w-xs text-center leading-relaxed font-medium">
                                    Kattints a bal oldali listából egy beszélgetésre az előzmények megtekintéséhez.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
