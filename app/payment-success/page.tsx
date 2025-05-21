"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function PaymentSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-secondary/20 p-3">
            <CheckCircle2 className="h-12 w-12 text-secondary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been confirmed.</p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <div className="flex justify-between mb-4">
            <span className="text-muted-foreground">Order Number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/orders">View My Orders</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>A confirmation email has been sent to your email address.</p>
          <p className="mt-2">
            <span className="text-primary">🎄</span> Merry Christmas and Happy Shopping!{" "}
            <span className="text-primary">🎄</span>
          </p>
        </div>
      </div>
    </div>
  )
}
