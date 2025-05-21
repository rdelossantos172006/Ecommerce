"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { ordersApi } from "@/lib/api"
import { Package, ShoppingBag, Clock, Home } from "lucide-react"

interface Order {
  id: number
  total_amount: number
  status: string
  created_at: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/orders")
    }
  }, [user, router])

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setLoading(true)
        // Get data from API
        const response = await ordersApi.getAll()
        
        console.log("API response:", response)
        
        // Ensure orders is always an array
        let ordersList: Order[] = []
        
        // Handle different response formats
        if (Array.isArray(response)) {
          ordersList = response
        } else if (response && typeof response === 'object') {
          // If response is an object, it might have an orders property
          if ('orders' in response && Array.isArray(response.orders)) {
            ordersList = response.orders
          } else if ('data' in response && Array.isArray(response.data)) {
            ordersList = response.data
          }
        }
        
        setOrders(ordersList)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load your orders. Please try again later.")
        setOrders([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "shipped":
        return <Package className="h-4 w-4 text-orange-500" />
      case "delivered":
        return <ShoppingBag className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Button asChild>
            <a href="/">Start Shopping</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-4 flex flex-wrap justify-between items-center gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order #{order.id}</p>
                  <p className="text-sm">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <p className="font-medium">{formatPrice(order.total_amount)}</p>
                </div>
              </div>
              <div className="p-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  )
} 