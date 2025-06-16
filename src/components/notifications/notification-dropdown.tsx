"use client"
import { fr } from "date-fns/locale"
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
import { formatDistanceToNow, parse, isValid } from "date-fns"
import { useRouter } from "next/navigation"

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead(notification.id)
    }
    setIsOpen(false)

    if (notification.related_id) {
      if (notification.title.toLowerCase().includes("idée") || notification.message.toLowerCase().includes("idée")) {
        try {
          const ideaTitleMatch = notification.message.match(/a soumis une nouvelle idée : '([^']+)'/)
          const ideaTitle = ideaTitleMatch ? ideaTitleMatch[1] : ""
          const searchParams = new URLSearchParams()
          if (ideaTitle) {
            searchParams.set("search", ideaTitle)
          }
          const url = `/admin/ideas${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
          router.push(url)
        } catch (error) {
          console.error("Error navigating to idea:", error)
          router.push("/admin/ideas")
        }
      } else if (
        notification.title.toLowerCase().includes("évaluation") ||
        notification.message.toLowerCase().includes("projet")
      ) {
        try {
          const projectMatch = notification.message.match(/Le projet '([^']+)' a été évalué/)
          const userMatch = notification.message.match(/par l'utilisateur '([^']+)'/)
          const projectTitle = projectMatch ? projectMatch[1] : ""
          const username = userMatch ? userMatch[1] : ""
          const searchTerm = `${projectTitle} ${username}`.trim()
          const searchParams = new URLSearchParams()
          if (searchTerm) {
            searchParams.set("search", searchTerm)
          }
          const url = `/admin/statistics${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
          router.push(url)
        } catch (error) {
          console.error("Error navigating to project evaluation:", error)
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

  const getNotificationActionText = (notification: any) => {
    if (notification.title.toLowerCase().includes("idée") || notification.message.toLowerCase().includes("soumise")) {
      return "Voir les détails de l’idée"
    } else if (
      notification.title.toLowerCase().includes("évaluation") ||
      notification.message.toLowerCase().includes("projet")
    ) {
      return "Voir les détails de l’évaluation"
    }
    return "Cliquez pour voir les détails"
  }

  // Helper: Parse ISO or MySQL date string (no manual offset, UTC best practice)
  const parseNotificationDate = (dateString: string) => {
    if (!dateString) return null
    if (dateString.includes("T")) {
      // ISO format, JS parses as UTC
      const d = new Date(dateString)
      return isValid(d) ? d : null
    }
    // MySQL format: "YYYY-MM-DD HH:mm:ss"
    const d = parse(dateString, "yyyy-MM-dd HH:mm:ss", new Date())
    return isValid(d) ? d : null
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
              Marquer tout comme lu
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Pas encore de notifications</div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => {
              const parsedDate = parseNotificationDate(notification.created_at)
              return (
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
                        {parsedDate
                          ? formatDistanceToNow(parsedDate, {
                              addSuffix: true,
                              includeSeconds: true,
                              locale: fr,
                            })
                          : "Date inconnue"}
                      </div>
                      {notification.related_id && (
                        <div className="text-xs text-blue-600 mt-1 font-medium">
                          {getNotificationActionText(notification)} →
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
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
              Voir toutes les notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
