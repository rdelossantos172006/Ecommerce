import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"

// This component provides a reliable fallback when the dynamic product loading fails
export default function FallbackProductGrid() {
  // Hardcoded products that will always render
  const fallbackProducts = [
    {
      id: "clothing-1",
      name: "Holiday Sweater",
      description: "Cozy and festive sweater perfect for Christmas gatherings",
      price: 399,
      originalPrice: 599,
      category: "clothing",
      discount: 33,
      rating: 4.5,
    },
    {
      id: "electronics-1",
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with excellent sound quality",
      price: 899,
      originalPrice: 1299,
      category: "electronics",
      discount: 30,
      rating: 4.6,
    },
    {
      id: "home-decor-1",
      name: "Christmas Lights",
      description: "Colorful LED Christmas lights for festive decoration",
      price: 299,
      originalPrice: 499,
      category: "home-decor",
      discount: 40,
      rating: 4.8,
    },
    {
      id: "toys-1",
      name: "Teddy Bear",
      description: "Soft and cuddly teddy bear for children",
      price: 249,
      originalPrice: 399,
      category: "toys",
      discount: 38,
      rating: 4.6,
    },
    {
      id: "kitchenware-1",
      name: "Cooking Pot Set",
      description: "Durable cooking pot set for your kitchen",
      price: 799,
      originalPrice: 1199,
      category: "kitchenware",
      discount: 33,
      rating: 4.8,
    },
  ]

  // Category icons for visual representation
  const categoryIcons: Record<string, string> = {
    clothing: "👕",
    electronics: "📱",
    "home-decor": "🛋️",
    toys: "🧸",
    kitchenware: "🍳",
  }

  // Format price helper
  const formatPrice = (price: number): string => {
    return `₱${price.toLocaleString()}`
  }

  return (
    <>
      {fallbackProducts.map((product) => (
        <div
          key={product.id}
          className="group relative overflow-hidden rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
        >
          <div className="relative aspect-square overflow-hidden">
            {/* Sale badge */}
            <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {product.discount}% OFF
            </div>

            {/* Wishlist button */}
            <button className="absolute top-3 left-3 z-30 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/20">
              <Heart className="h-4 w-4" />
            </button>

            {/* Product image */}
            <Link href={`/product/${product.id}`} className="block h-full">
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-5xl">{categoryIcons[product.category]}</span>
              </div>
            </Link>

            {/* Action buttons overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 flex items-end justify-center p-4 transition-opacity duration-300">
              <div className="flex gap-2 w-full">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 backdrop-blur-sm bg-white/20 hover:bg-white/40 transition-all"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/20 hover:bg-white/40 transition-all"
                  asChild
                >
                  <Link href={`/product/${product.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs font-medium">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </Badge>
              <div className="flex items-center">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
              </div>
            </div>

            <Link href={`/product/${product.id}`}>
              <h3 className="font-medium text-base line-clamp-1 mt-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-muted-foreground line-clamp-1 h-4 mt-1">{product.description}</p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-bold text-base">{formatPrice(product.price)}</span>
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
