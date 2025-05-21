"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/products"
import { useTheme } from "@/components/theme-provider"

// Define themed category icons
type IconKey = 'clothing' | 'electronics' | 'homeDecor' | 'toys';

type ThemeIcons = {
  [key in IconKey]: string;
};

const categoryIcons: Record<string, ThemeIcons> = {
  default: {
    clothing: "👕",
    electronics: "📱",
    homeDecor: "🛋️",
    toys: "🧸"
  },
  christmas: {
    clothing: "🧣",
    electronics: "🎮",
    homeDecor: "🎄",
    toys: "🎁"
  },
  valentine: {
    clothing: "👗",
    electronics: "💻",
    homeDecor: "💝",
    toys: "🧸"
  },
  allsaints: {
    clothing: "👘",
    electronics: "📟",
    homeDecor: "🕯️",
    toys: "🎭"
  }
}

// Mapping from slugs to icon keys
const slugToIconKey: Record<string, IconKey> = {
  'clothing': 'clothing',
  'electronics': 'electronics',
  'home-decor': 'homeDecor',
  'toys': 'toys'
};

interface CategoryPreviewProps {
  title: string
  icon?: string // Made optional since we'll use themed icons
  products: Product[]
  slug: string
}

export default function CategoryPreview({ title, icon, products, slug }: CategoryPreviewProps) {
  const { theme } = useTheme()
  
  // Get the appropriate icons based on the current theme
  const icons = categoryIcons[theme] || categoryIcons.default
  
  // Get the icon for this category
  const themeIcon = slugToIconKey[slug] ? icons[slugToIconKey[slug]] : icon
  
  // Make sure we have exactly 3 products for the preview
  const previewProducts = products.slice(0, 3)
  
  // Check if we have enough products to show
  const hasProducts = previewProducts.length > 0

  return (
    <section className="py-12 border-b border-border/40 last:border-0">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-2xl md:text-3xl">{themeIcon}</span> {title}
          </h2>
          <Link href={`/category/${slug}`} className="text-primary flex items-center hover:underline">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Single row of 3 products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {previewProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* Browse more link - only visible on mobile */}
        <div className="mt-6 text-center md:hidden">
          <Link 
            href={`/category/${slug}`} 
            className="inline-flex items-center text-primary hover:underline"
          >
            Browse more {title.toLowerCase()} <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
