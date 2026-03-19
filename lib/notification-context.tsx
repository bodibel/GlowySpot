"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './auth-context'
import { getUnreadMessageCount } from '@/lib/actions/salon'

interface NotificationContextType {
    unreadCount: number
    refreshUnreadCount: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { userData } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)

    const refreshUnreadCount = useCallback(async () => {
        if (!userData?.id) return
        try {
            const count = await getUnreadMessageCount(userData.id)
            setUnreadCount(count)
        } catch (error) {
            console.error("Error refreshing unread count:", error)
        }
    }, [userData?.id])

    useEffect(() => {
        if (!userData?.id) {
            setUnreadCount(0)
            return
        }

        // Initial fetch
        refreshUnreadCount()

        // Set up polling (every 30 seconds)
        const interval = setInterval(refreshUnreadCount, 30000)

        return () => clearInterval(interval)
    }, [userData?.id, refreshUnreadCount])

    return (
        <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}
