"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import ProductCard from "@/components/product-card"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductsByCategory, type Product } from "@/lib/products"

const categoryIcons: Record<string, string> = {
  clothing: "👕",
  electronics: "📱",
  "home-decor": "🛋️",
  toys: "🧸",
}

const categoryNames: Record<string, string> = {
  clothing: "Clothing",
  electronics: "Electronics",
  "home-decor": "Home Decor",
  toys: "Toys",
}

export default function CategoryPage(props: { params: { slug: string } }) {
  // Access the slug safely from props
  const currentSlug = props.params.slug
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Handle invalid category
  if (!Object.keys(categoryNames).includes(currentSlug)) {
    notFound()
  }

  const categoryName = categoryNames[currentSlug]
  const categoryIcon = categoryIcons[currentSlug]

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const productData = await getProductsByCategory(currentSlug)
        setProducts(productData)
      } catch (err) {
        console.error(`Error fetching ${currentSlug} products:`, err)
        setError(`Failed to load ${categoryName} products. Please try again later.`)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentSlug, categoryName])

  // Handle error state
  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>{categoryIcon}</span> {categoryName}
        </h1>
      </div>

      {/* Fixed grid to show exactly 3 products per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {loading ? (
          <LoadingSkeleton />
        ) : products.length > 0 ? (
          // Render products directly in the grid
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-xl border bg-card">
          <div className="aspect-square relative">
            <Skeleton className="absolute inset-0" />
          </div>
          <div className="p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-5 w-1/3" />
          </div>
        </div>
      ))}
    </>
  )
}
