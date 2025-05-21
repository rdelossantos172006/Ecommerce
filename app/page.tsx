"use client"

import { useState, useEffect } from "react"
import HeroBanner from "@/components/hero-banner"
import CategoryPreview from "@/components/category-preview"
import { getProductsByCategory, getOnSaleProducts, getFeaturedProducts, type Product } from "@/lib/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CategoryShowcase from "@/components/category-showcase"
import ProductCard from "@/components/product-card"

export default function Home() {
  // State for product data
  const [clothingProducts, setClothingProducts] = useState<Product[]>([])
  const [electronicsProducts, setElectronicsProducts] = useState<Product[]>([])
  const [homeDecorProducts, setHomeDecorProducts] = useState<Product[]>([])
  const [toysProducts, setToysProducts] = useState<Product[]>([])
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Utility function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all product data in parallel for better performance
        const [clothing, electronics, homeDecor, toys, onSale, featured] = await Promise.all([
          getProductsByCategory("clothing"),
          getProductsByCategory("electronics"),
          getProductsByCategory("home-decor"),
          getProductsByCategory("toys"),
          getOnSaleProducts(),
          getFeaturedProducts()
        ])

        // Shuffle the featured and on sale products
        const shuffledFeatured = shuffleArray(featured)
        const shuffledOnSale = shuffleArray(onSale)

        // Set the products in state
        setClothingProducts(clothing)
        setElectronicsProducts(electronics)
        setHomeDecorProducts(homeDecor)
        setToysProducts(toys)
        setOnSaleProducts(shuffledOnSale)
        setFeaturedProducts(shuffledFeatured)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Function to reshuffle the products
  const reshuffleProducts = () => {
    setFeaturedProducts(prev => shuffleArray(prev))
    setOnSaleProducts(prev => shuffleArray(prev))
  }

  // Loading state (optional)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-primary font-medium">Loading Ruby's products...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <HeroBanner />
      <CategoryShowcase />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-8 bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-accent">⭐</span> Featured Products <span className="text-accent">⭐</span>
              </h2>
              <Button 
                onClick={reshuffleProducts} 
                variant="outline" 
                className="text-white border-white hover:bg-white/20"
              >
                Shuffle Products
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Sale Products */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              <span className="text-primary">✨</span> Ruby's Featured Sale Items{" "}
              <span className="text-primary">✨</span>
            </h2>
            <Button 
              onClick={reshuffleProducts} 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
            >
              Shuffle Products
            </Button>
          </div>

          {/* Single row layout with 3 products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {onSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild className="btn-modern">
              <Link href="/category/clothing">View All Sale Items</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryPreview title="Clothing" products={clothingProducts} slug="clothing" />

      <CategoryPreview title="Electronics" products={electronicsProducts} slug="electronics" />

      <CategoryPreview title="Home Decor" products={homeDecorProducts} slug="home-decor" />

      <CategoryPreview title="Toys" products={toysProducts} slug="toys" />
    </div>
  )
}
