"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/products"
import { useToast } from "@/components/ui/use-toast"
import { Heart, ShoppingCart, Trash2, AlertCircle } from "lucide-react"

type WishlistItem = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const { user } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/wishlist")
      return
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem(`wishlist-${user.id}`)
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== id)
    setWishlistItems(updatedWishlist)
    localStorage.setItem(`wishlist-${user.id}`, JSON.stringify(updatedWishlist))

    toast({
      title: "Removed from wishlist",
      description: "Item has been removed from your wishlist",
    })
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      quantity: 1,
      category: item.category,
    })

    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Heart className="mr-2 h-6 w-6 text-primary" /> My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love to your wishlist and find them here anytime.</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-lg border bg-background product-card">
              <Link href={`/product/${item.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {item.name}</span>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-20 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFromWishlist(item.id)
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>

              <div className="aspect-square overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-semibold">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addToCart(item)
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
