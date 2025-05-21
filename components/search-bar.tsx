"use client"

import type React from "react"
import { useState, useRef, useEffect, useTransition, useDeferredValue, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchProducts, formatPrice, type Product } from "@/lib/products"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // React 18 features for performance
  const [isPending, startTransition] = useTransition()
  const deferredQuery = useDeferredValue(query)

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = JSON.parse(localStorage.getItem("recent-searches") || "[]")
      setRecentSearches(savedSearches)
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter(term => term !== searchTerm)
    ].slice(0, 5) // Keep only 5 most recent searches
    
    setRecentSearches(updatedSearches)
    
    if (typeof window !== "undefined") {
      localStorage.setItem("recent-searches", JSON.stringify(updatedSearches))
    }
  }

  // Handle search query changes with deferred value
  useEffect(() => {
    const performSearch = async () => {
      if (deferredQuery.length > 1) {
        setIsLoading(true)
        setError(null)
        try {
          const searchResults = await searchProducts(deferredQuery)
          // Validate that searchResults is an array before setting state
          if (Array.isArray(searchResults)) {
            setResults(searchResults.slice(0, 5)) // Limit to 5 results for the dropdown
          } else {
            console.error("Search results is not an array:", searchResults)
            setResults([])
            setError("Invalid search results format")
          }
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
          setError("Failed to perform search")
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setError(null)
      }
    }

    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(timer)
  }, [deferredQuery])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Open search with Ctrl+K or Command+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
        if (inputRef.current) inputRef.current.focus()
      }
      
      // Close search with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setIsOpen(false)
        setQuery("")
      })
    }
  }

  const handleProductClick = useCallback((productId: string) => {
    if (!productId) {
      console.error("Product ID is undefined or empty")
      return
    }
    
    startTransition(() => {
      router.push(`/product/${productId}`)
      setIsOpen(false)
      setQuery("")
    })
  }, [router])

  // Theme-specific classes
  const themeClasses = {
    default: {
      inputBorder: "focus-visible:border-primary",
      resultHover: "hover:border-primary hover:bg-primary/5"
    },
    christmas: {
      inputBorder: "focus-visible:border-christmas-green",
      resultHover: "hover:border-christmas-green hover:bg-christmas-green/5"
    },
    valentine: {
      inputBorder: "focus-visible:border-pink-500",
      resultHover: "hover:border-pink-500 hover:bg-pink-50/20"
    },
    allsaints: {
      inputBorder: "focus-visible:border-amber-500",
      resultHover: "hover:border-amber-500 hover:bg-amber-500/5"
    }
  }

  const currentTheme = themeClasses[theme as keyof typeof themeClasses] || themeClasses.default

  return (
    <div className="relative w-full max-w-md" ref={searchContainerRef}>
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className={cn(
              "pl-9 pr-9 py-2 h-10 w-full border rounded-lg transition-all",
              currentTheme.inputBorder,
              "focus-visible:ring-0"
            )}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(!!e.target.value.trim())
            }}
            onClick={() => {
              if (query.trim()) setIsOpen(true)
            }}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground h-8 w-8 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit" variant="ghost" size="icon" className="ml-1">
          <Search className="h-5 w-5" />
        </Button>
      </form>
      
      {/* Search results dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-lg shadow-lg bg-background z-50 max-h-[70vh] overflow-auto">
          {error ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="mt-2 text-xs text-muted-foreground">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div>
              <div className="p-2">
                {results.map((product) => (
                  <div 
                    key={product.id}
                    className={cn(
                      "flex items-center gap-3 p-2 border border-transparent rounded-md cursor-pointer transition-all",
                      currentTheme.resultHover
                    )}
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="w-12 h-12 relative flex-shrink-0 bg-muted/30 rounded-md overflow-hidden">
                      <Image 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        loading="lazy"
                      />
                      {product.isOnSale && (
                        <div className="absolute top-0 left-0 bg-primary text-[10px] text-white px-1">
                          Sale
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{product.name}</h3>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-sm justify-center text-primary hover:text-primary"
                  onClick={handleSearch}
                >
                  See all results
                </Button>
              </div>
            </div>
          ) : query.length > 1 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          ) : null}
          
          {query.length <= 1 && recentSearches.length > 0 && (
            <div className="p-3">
              <p className="text-xs text-muted-foreground mb-2">Recent Searches</p>
              <div className="flex flex-col">
                {recentSearches.slice(0, 3).map((term, index) => (
                  <button
                    key={index}
                    className="text-left px-2 py-1.5 hover:bg-muted/50 rounded-md text-sm flex items-center"
                    onClick={() => {
                      setQuery(term)
                      if (inputRef.current) inputRef.current.focus()
                    }}
                  >
                    <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Keyboard shortcut hint */}
      <div className="hidden sm:block absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
          <span className="text-[10px]">{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</span>
          <span className="text-[10px]">K</span>
        </kbd>
      </div>
    </div>
  )
}
