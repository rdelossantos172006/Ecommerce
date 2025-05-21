"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { ordersApi } from "@/lib/api"
import { ArrowLeft, Package, Truck, Clock, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { use } from "react"

interface OrderItem {
  product_id: string
  quantity: number
  price: number
  size?: string
  name: string
  image: string
}

interface OrderDetails {
  id: number
  user_id: number
  total_amount: number
  status: string
  shipping_address: string
  payment_method: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const orderId = parseInt(resolvedParams.id)
  const { user } = useAuth()
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/orders")
    }
  }, [user, router, orderId])

  // Fetch order details when component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) return

      try {
        setLoading(true)
        const response = await ordersApi.getById(orderId)
        console.log("Order details API response:", response)
        // Extract the inner `order` object from the response
        const data = response.order
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [user, orderId])

  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Package className="h-5 w-5 text-orange-500" />
      case "delivered":
        return <ShoppingBag className="h-5 w-5 text-green-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case "gcash":
        return "💳"
      case "bank":
        return "🏦"
      case "cod":
        return "💵"
      default:
        return "💰"
    }
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.push("/orders")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : !order ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Order not found or you don't have permission to view it.</p>
          <Button asChild>
            <a href="/orders">View Your Orders</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-muted-foreground">Placed on {formatDate(order.created_at)}</p>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Shipping Address</h3>
                <p className="text-muted-foreground">{order.shipping_address}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span>{getPaymentMethodIcon(order.payment_method)}</span>
                  {order.payment_method?.charAt(0).toUpperCase() + order.payment_method?.slice(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted p-4">
              <h2 className="font-medium">Order Items</h2>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 py-3 border-b last:border-b-0">
                    <div className="w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.total_amount - 50)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(50)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button asChild>
              <a href="/">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 