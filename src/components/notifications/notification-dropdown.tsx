"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Clock } from "lucide-react"
import { useNotifications } from "./notification-provider"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNotificationClick = async (notification: any) => {
    // Mark as read if unread
    if (!notification.is_read) {
      markAsRead(notification.id)
    }

    // Close the dropdown
    setIsOpen(false)

    // Handle navigation based on notification type and related_id
    if (notification.related_id) {
      // If it's an idea notification
      if (notification.title.toLowerCase().includes("idea") || notification.message.toLowerCase().includes("idea")) {
        try {
          // Extract idea title from the notification message
          // The message format is: "{username} submitted a new idea: '{title}'"
          const ideaTitleMatch = notification.message.match(/submitted a new idea: '([^']+)'/)
          const ideaTitle = ideaTitleMatch ? ideaTitleMatch[1] : ""

          // Navigate to admin/ideas with the idea title as a search parameter
          const searchParams = new URLSearchParams()
          if (ideaTitle) {
            searchParams.set("search", ideaTitle)
          }

          const url = `/admin/ideas${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
          router.push(url)
        } catch (error) {
          console.error("Error navigating to idea:", error)
          // Fallback to just navigate to ideas page
          router.push("/admin/ideas")
        }
      }
      // If it's a project evaluation notification
      else if (
        notification.title.toLowerCase().includes("evaluation") ||
        notification.message.toLowerCase().includes("evaluated")
      ) {
        try {
          // Extract project title and username from the notification message
          // The message format is: "Project '{project_title}' was evaluated by user '{username}'."
          const projectMatch = notification.message.match(/Project '([^']+)' was evaluated/)
          const userMatch = notification.message.match(/by user '([^']+)'/)

          const projectTitle = projectMatch ? projectMatch[1] : ""
          const username = userMatch ? userMatch[1] : ""

          console.log("Extracted project title:", projectTitle)
          console.log("Extracted username:", username)

          // Combine project title and username for search
          const searchTerm = `${projectTitle} ${username}`.trim()

          console.log("Combined search term:", searchTerm)

          // Navigate to admin/statistics with the combined search parameter
          const searchParams = new URLSearchParams()
          if (searchTerm) {
            searchParams.set("search", searchTerm)
          }

          const url = `/admin/statistics${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
          console.log("Navigating to:", url)
          router.push(url)
        } catch (error) {
          console.error("Error navigating to project evaluation:", error)
          // Fallback to just navigate to statistics page
          router.push("/admin/statistics")
        }
      }
      // Add more navigation logic for other types of notifications here
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "🎉"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "💡"
    }
  }

  // Get notification action text based on content
  const getNotificationActionText = (notification: any) => {
    if (notification.title.toLowerCase().includes("idea") || notification.message.toLowerCase().includes("idea")) {
      return "View idea details"
    } else if (
      notification.title.toLowerCase().includes("evaluation") ||
      notification.message.toLowerCase().includes("evaluated")
    ) {
      return "View evaluation details"
    }
    return "Click to view details"
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600 hover:bg-red-600">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-1 text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer hover:bg-muted/50 ${!notification.is_read ? "bg-blue-50" : ""}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2 w-full">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{notification.title}</p>
                      {!notification.is_read && <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </div>
                    {notification.related_id && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                        {getNotificationActionText(notification)} →
                      </div>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-center text-sm text-muted-foreground cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                router.push("/admin/notifications")
              }}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
