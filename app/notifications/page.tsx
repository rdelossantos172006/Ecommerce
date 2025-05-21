"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Bell, ShoppingBag, Tag, Info, CheckCircle2, Clock } from "lucide-react"

type Notification = {
  id: string
  title: string
  message: string
  type: "order" | "promo" | "info"
  date: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/notifications")
      return
    }

    // Load notifications from localStorage or generate mock data
    const savedNotifications = localStorage.getItem(`notifications-${user.id}`)
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      // Generate mock notifications
      const mockNotifications: Notification[] = [
        {
          id: "notif-1",
          title: "Your order has been shipped!",
          message: "Order #ORD-123456 has been shipped and will arrive in 2-3 days.",
          type: "order",
          date: "2023-12-10T10:30:00",
          read: false,
        },
        {
          id: "notif-2",
          title: "Christmas Sale is Live!",
          message: "Enjoy up to 50% off on selected items. Limited time offer!",
          type: "promo",
          date: "2023-12-08T09:15:00",
          read: true,
        },
        {
          id: "notif-3",
          title: "New items in your wishlist are on sale",
          message: "Some items in your wishlist are now on sale. Check them out!",
          type: "info",
          date: "2023-12-05T14:45:00",
          read: false,
        },
      ]

      setNotifications(mockNotifications)
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(mockNotifications))
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))

    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({ ...notif, read: true }))

    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications))
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id)

    setNotifications(updatedNotifications)
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(updatedNotifications))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-5 w-5 text-primary" />
      case "promo":
        return <Tag className="h-5 w-5 text-secondary" />
      case "info":
        return <Info className="h-5 w-5 text-accent" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Bell className="mr-2 h-6 w-6" /> Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>

        {notifications.length > 0 && (
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Bell className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-4">No notifications yet</h2>
          <p className="text-muted-foreground mb-8">You don't have any notifications at the moment.</p>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border rounded-lg p-4 transition-all ${notification.read ? "bg-background" : "bg-muted"}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>{notification.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-8 w-8 p-0"
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(notification.date)}
                    </span>

                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
