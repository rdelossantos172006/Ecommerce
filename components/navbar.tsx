"use client"

import type React from "react"

import { useState, useEffect, useCallback, useTransition, memo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, Menu, X, User, LogOut, Gift, ChevronDown, Bell, Heart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { SearchBar } from "@/components/search-bar"
import { ThemeSelector } from "@/components/theme-selector"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/products"
import Image from "next/image"

// Memoize the navbar component to prevent unnecessary re-renders
const Navbar = memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [showSnowflakes, setShowSnowflakes] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { totalItems, items, totalPrice } = useCart()

  // Use React 18's useTransition for navigation
  const [isPending, startTransition] = useTransition()

  // Only show snowflakes after component mounts to avoid hydration issues
  useEffect(() => {
    setShowSnowflakes(true)
  }, [])

  // Prefetch common routes for faster navigation
  useEffect(() => {
    // Prefetch main routes
    const routesToPrefetch = [
      "/",
      "/category/clothing",
      "/category/electronics",
      "/category/home-decor",
      "/category/toys",
    ]

    routesToPrefetch.forEach((route) => {
      router.prefetch(route)
    })
  }, [router])

  // Optimized navigation handler with useTransition
  const handleNavigation = useCallback(
    (href: string) => {
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }

      // Use startTransition to mark navigation as non-blocking
      startTransition(() => {
        router.push(href)
      })
    },
    [router, isMenuOpen],
  )

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`)
        setMobileSearchQuery("")
        setIsMenuOpen(false)
      })
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="christmas-hover"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div className="flex items-center">
          <button onClick={() => handleNavigation("/")} className="flex items-center space-x-2 group">
            <Gift className="h-6 w-6 text-primary group-hover:animate-bounce" />
            <span className="font-bold text-xl text-primary group-hover:text-secondary transition-colors duration-300">
              Ruby's eShop
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-1 ml-6 z-10">
          <button
            onClick={() => handleNavigation("/")}
            className={`nav-link christmas-hover ${pathname === "/" ? "text-primary" : ""}`}
          >
            Home
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 christmas-hover nav-link">
                Categories <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {[
                { name: "Clothing", path: "/category/clothing", icon: "👕" },
                { name: "Electronics", path: "/category/electronics", icon: "📱" },
                { name: "Home Decor", path: "/category/home-decor", icon: "🛋️" },
                { name: "Toys", path: "/category/toys", icon: "🧸" },
              ].map((category) => (
                <DropdownMenuItem key={category.path} asChild>
                  <button
                    onClick={() => handleNavigation(category.path)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => handleNavigation("/all-products")}
            className={`nav-link christmas-hover ${pathname === "/all-products" ? "text-primary" : ""}`}
          >
            Shop Now
          </button>
        </div>

        <div className="ml-auto flex items-center space-x-4 relative z-20">
          {/* SearchBar component - properly aligned with navbar */}
          <SearchBar />

          {/* Theme selector */}
          <ThemeSelector />

          {showSnowflakes && (
            <div className="nav-snow-container">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`nav-snowflake nav-snowflake-${i % 3}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-full christmas-hover">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => handleNavigation("/orders")}
                    className="cursor-pointer flex items-center w-full text-left"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    My Orders
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => handleNavigation("/wishlist")}
                    className="cursor-pointer flex items-center w-full text-left"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => handleNavigation("/profile")}
                    className="cursor-pointer flex items-center w-full text-left"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => handleNavigation("/notifications")}
                    className="cursor-pointer flex items-center w-full text-left"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="christmas-hover" onClick={() => handleNavigation("/login")}>
              Login
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative christmas-hover"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Your Cart ({totalItems})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {items.slice(0, 4).map((item) => (
                    <div key={`${item.id}-${item.size || "default"}`} className="p-3 flex gap-3 hover:bg-muted/50 rounded-md">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{item.quantity} × {formatPrice(item.price)}</span>
                          {item.size && <span className="ml-2">Size: {item.size}</span>}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  {items.length > 4 && (
                    <div className="px-3 pb-2 text-xs text-center text-muted-foreground">
                      +{items.length - 4} more items in cart
                    </div>
                  )}
                </div>
              )}
              <DropdownMenuSeparator />
              <div className="p-3">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <Button onClick={() => handleNavigation("/cart")} className="w-full">
                  View Cart
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu - optimized with fewer elements */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs overflow-y-auto bg-background p-6 pb-16 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => handleNavigation("/")} className="flex items-center space-x-2 group">
                <Gift className="h-6 w-6 text-primary group-hover:animate-bounce" />
                <span className="font-bold text-xl text-primary group-hover:text-secondary transition-colors duration-300">
                  Ruby's eShop
                </span>
              </button>
              <Button
                variant="ghost"
                size="icon"
                className="christmas-hover"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-6 mt-3">
              <form onSubmit={handleMobileSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-10"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => handleNavigation("/")}
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors ${
                    pathname === "/" ? "bg-muted" : ""
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/all-products")}
                  className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors ${
                    pathname === "/all-products" ? "bg-muted" : ""
                  }`}
                >
                  Shop Now
                </button>

                {[
                  { name: "Clothing", path: "/category/clothing", icon: "👕" },
                  { name: "Electronics", path: "/category/electronics", icon: "📱" },
                  { name: "Home Decor", path: "/category/home-decor", icon: "🛋️" },
                  { name: "Toys", path: "/category/toys", icon: "🧸" },
                ].map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(category.path)}
                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors ${
                      pathname === category.path ? "bg-muted" : ""
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
          <div className="h-full bg-primary w-1/3 animate-pulse"></div>
        </div>
      )}
    </header>
  )
})

export default Navbar
