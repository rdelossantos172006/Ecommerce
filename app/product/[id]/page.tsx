import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProductById, formatPrice, type Product } from "@/lib/products"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductReviews, { type Review } from "@/components/product-reviews"
import ProductActions from "@/components/product-actions"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // Fetch product data server-side
  let product: Product | null = null
  try {
    if (id) {
      product = await getProductById(id)
    }
  } catch (error) {
    console.error("Error fetching product:", error)
  }

  // Redirect if product not found - handled in UI
  if (!product) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">Sorry, the product you're looking for doesn't exist.</p>
        <Link href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
          Return to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          {product.isOnSale && <div className="sale-badge">Sale</div>}
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={1200}
            height={1200}
            className="w-full h-auto rounded-lg"
            priority={true}
            quality={100}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Badge>
            {product.isOnSale && (
              <Badge variant="secondary" className="text-xs">
                On Sale
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating)
                    ? "text-accent fill-accent"
                    : i < product.rating
                      ? "text-accent-foreground fill-accent-foreground/50"
                      : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              ({product.rating})
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {product.originalPrice && (
              <span className="text-sm text-primary font-medium">
                Save {formatPrice(product.originalPrice - product.price)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Client-side interactive components are now in ProductActions component */}
          <ProductActions product={product} />

          <div className="mt-8 border-t pt-6">
            <h3 className="font-medium mb-2">Product Details</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
              <li>Condition: Good (Second-hand)</li>
              <li>Shipping: Available nationwide</li>
              <li>Returns: 7-day return policy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Client-side reviews component */}
      <ProductReviews productId={id} />
    </div>
  )
}
