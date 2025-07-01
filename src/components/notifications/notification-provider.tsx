"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client/dist/socket"
import { da } from "date-fns/locale"

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  is_read: boolean
  created_at: string
  related_id?: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  socket: Socket | null
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  fetchNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const socketRef = useRef<Socket | null>(null)

  // Helper to check if user is authenticated admin
  const isAdmin = user && user.user_role === "admin"

  // Fetch notifications from the backend (only if admin)
  const fetchNotifications = async () => {
    if (!isAdmin) return

    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        console.log("Fetched notifications:", data.notifications)
        setUnreadCount(data.unread_count)
      } else if (response.status === 401) {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      setNotifications([])
      setUnreadCount(0)
    }
  }

  // Mark a notification as read (only if admin)
  const markAsRead = async (id: number) => {
    if (!isAdmin) return

    try {
      console.log("Marking notification as read:", id)

      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else if (response.status === 401) {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Mark all notifications as read (only if admin)
  const markAllAsRead = async () => {
    if (!isAdmin) return

    try {
      const response = await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        credentials: "include",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))
        setUnreadCount(0)
      } else if (response.status === 401) {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Set up socket connection and listeners
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (isAdmin && !socketRef.current) {
      timeout = setTimeout(() => {
        const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
          withCredentials: true,
        })
        socketRef.current = socket

        socket.on("connect", () => {
          console.log("Connected to notification server")
        })

        socket.on("new_notification", (data: any) => {
          // Robust related_id logic: support idea_id, project_id, evaluation_id, related_id
          let related_id =
            data.related_id?.toString() ||
            data.idea_id?.toString() ||
            data.project_id?.toString() ||
            data.evaluation_id?.toString() ||
            undefined

          const newNotification: Notification = {
            id: data.id,
            title: data.title,
            message: data.message,
            type: data.type,
            is_read: false,
            created_at: data.timestamp,
            related_id,
          }
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)

          // Show browser notification if permission granted
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(data.title, {
              body: data.message,
              icon: "/images/ram-logo.png",
            })
          }
        })

        fetchNotifications()
      }, 200)

      return () => {
        if (timeout) clearTimeout(timeout)
        if (socketRef.current) {
          socketRef.current.disconnect()
          socketRef.current = null
        }
      }
    }

    if (!isAdmin && socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setNotifications([])
      setUnreadCount(0)
    }
    // eslint-disable-next-line
  }, [isAdmin])

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket: socketRef.current,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
