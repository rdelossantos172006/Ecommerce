"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift, ChevronRight, Heart, Ghost } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function HeroBanner() {
  const { theme } = useTheme()
  
  // Theme-specific content
  const themeContent = {
    default: {
      gradientClasses: "bg-gradient-to-r from-primary/90 to-secondary/90",
      title: "Welcome to Ruby's Affordable eShop",
      subtitle: "Find amazing deals on budget-friendly items for everyone!",
      promoTag: "Shop Now",
      icon: <Gift className="inline-block h-5 w-5 mr-2" />,
      decorations: [
        { emoji: "💎", position: "top-10 left-10" },
        { emoji: "🛍️", position: "bottom-10 right-10" },
        { emoji: "✨", position: "top-1/4 right-1/4" },
        { emoji: "💰", position: "bottom-1/4 left-1/4" }
      ]
    },
    christmas: {
      gradientClasses: "bg-gradient-to-r from-[#BB2528] to-[#165B33]",
      title: "🎁 Big Holiday Sale — Up to 50% Off This Christmas!",
      subtitle: "Find amazing deals on second-hand and budget-friendly items. Perfect gifts for everyone without breaking the bank!",
      promoTag: "Christmas Sale is Live!",
      icon: <Gift className="inline-block h-5 w-5 mr-2" />,
      decorations: [
        { emoji: "🎄", position: "top-10 left-10" },
        { emoji: "🎁", position: "bottom-10 right-10" },
        { emoji: "❄️", position: "top-1/4 right-1/4" },
        { emoji: "🎅", position: "bottom-1/4 left-1/4" }
      ]
    },
    valentine: {
      gradientClasses: "bg-gradient-to-r from-[#9F1239] to-[#DB2777]",
      title: "❤️ Valentine's Day Special — Love Deals for Everyone!",
      subtitle: "Express your love with our amazing collection of budget-friendly gifts. Perfect for your special someone!",
      promoTag: "Valentine's Day Sale!",
      icon: <Heart className="inline-block h-5 w-5 mr-2" />,
      decorations: [
        { emoji: "💕", position: "top-10 left-10" },
        { emoji: "💌", position: "bottom-10 right-10" },
        { emoji: "💘", position: "top-1/4 right-1/4" },
        { emoji: "🌹", position: "bottom-1/4 left-1/4" }
      ]
    },
    allsaints: {
      gradientClasses: "bg-gradient-to-r from-[#784212] to-[#E38C2D]",
      title: "🕯️ All Saints Day Collection — Celebrate with Style",
      subtitle: "Discover our unique collection of items perfect for the season. Find meaningful gifts that honor traditions.",
      promoTag: "All Saints Special!",
      icon: <Ghost className="inline-block h-5 w-5 mr-2" />,
      decorations: [
        { emoji: "🕯️", position: "top-10 left-10" },
        { emoji: "🎭", position: "bottom-10 right-10" },
        { emoji: "🔥", position: "top-1/4 right-1/4" },
        { emoji: "✨", position: "bottom-1/4 left-1/4" }
      ]
    }
  }
  
  // Get the current theme content or default
  const currentThemeContent = themeContent[theme] || themeContent.default

  // Additional text styling for Valentine's theme to improve visibility
  const textClasses = theme === 'valentine' 
    ? 'text-shadow-sm text-white' 
    : 'text-shadow-sm text-white';
  
  // Button styling based on theme
  const outlineButtonClasses = 'border-white text-white bg-black/20 hover:bg-black/30 text-shadow-sm';

  return (
    <div className={`relative overflow-hidden ${currentThemeContent.gradientClasses} py-16 md:py-24 hero-banner theme-${theme}`}>
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Theme pattern background */}
        <div className="absolute inset-0 bg-repeat opacity-10"></div>

        {/* Decorative elements */}
        {currentThemeContent.decorations.map((decoration, index) => (
          <div key={index} className={`absolute ${decoration.position} text-4xl`}>{decoration.emoji}</div>
        ))}
      </div>

      {/* Add a semi-transparent overlay for better text contrast in valentine theme */}
      {(theme === 'valentine' || theme === 'default') && (
        <div className="absolute inset-0 bg-black/20 z-0"></div>
      )}

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full mb-4 animate-pulse">
            {currentThemeContent.icon}
            <span className="font-medium">{currentThemeContent.promoTag}</span>
          </div>

          <h1 className={`text-3xl md:text-5xl font-bold mb-4 ${textClasses}`}>
            {currentThemeContent.title}
          </h1>

          <p className={`text-lg md:text-xl mb-8 text-white`}>
            {currentThemeContent.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              asChild 
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/all-products">
                Shop Now <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild 
              className={outlineButtonClasses}
            >
              <Link href="#categories">Explore Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 