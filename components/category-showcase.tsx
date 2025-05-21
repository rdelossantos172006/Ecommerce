"use client"

import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

// Define themed category icons and proper type
type IconKey = 'clothing' | 'electronics' | 'homeDecor' | 'toys' | 'titleLeft' | 'titleRight';

type ThemeIcons = {
  [key in IconKey]: string;
};

const categoryIcons: Record<string, ThemeIcons> = {
  default: {
    clothing: "👕",
    electronics: "📱",
    homeDecor: "🛋️",
    toys: "🧸",
    titleLeft: "🛍️",
    titleRight: "🛍️"
  },
  christmas: {
    clothing: "🧣",
    electronics: "🎮",
    homeDecor: "🎄",
    toys: "🎁",
    titleLeft: "🎄",
    titleRight: "🎄"
  },
  valentine: {
    clothing: "👗",
    electronics: "💻",
    homeDecor: "💝",
    toys: "🧸",
    titleLeft: "💖",
    titleRight: "💖"
  },
  allsaints: {
    clothing: "👘",
    electronics: "📟",
    homeDecor: "🕯️",
    toys: "🎭",
    titleLeft: "🔮",
    titleRight: "🔮"
  }
}

// Mapping from slugs to icon keys
const slugToIconKey: Record<string, IconKey> = {
  'clothing': 'clothing',
  'electronics': 'electronics',
  'home-decor': 'homeDecor',
  'toys': 'toys'
};

const categories = [
  { name: "Clothing", slug: "clothing", gradientFrom: "from-blue-500", gradientTo: "to-indigo-600" },
  { name: "Electronics", slug: "electronics", gradientFrom: "from-teal-500", gradientTo: "to-emerald-600" },
  { name: "Home Decor", slug: "home-decor", gradientFrom: "from-pink-500", gradientTo: "to-rose-600" },
  { name: "Toys", slug: "toys", gradientFrom: "from-amber-500", gradientTo: "to-orange-600" },
]

export default function CategoryShowcase() {
  const { theme } = useTheme()
  
  // Get the appropriate icons based on the current theme
  const icons = categoryIcons[theme] || categoryIcons.default

  return (
    <div className="py-16 bg-gradient-to-b from-background to-background/90" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center">
          <span className="text-2xl md:text-3xl mr-3">{icons.titleLeft}</span> 
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Shop by Category</span> 
          <span className="text-2xl md:text-3xl ml-3">{icons.titleRight}</span>
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {categories.map((category) => {
              // Get the appropriate icon key for this category
              const iconKey = slugToIconKey[category.slug];
              
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl border shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradientFrom} ${category.gradientTo} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                  <div className="relative aspect-square flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-background/60 dark:bg-card/60 rounded-full p-4 mb-4 shadow-inner group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                      <span className="text-4xl md:text-5xl block">{icons[iconKey]}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold mt-2">{category.name}</h3>
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span className="px-4 py-1.5 bg-primary/90 text-primary-foreground rounded-full text-sm font-medium">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
