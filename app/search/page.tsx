"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { searchProducts, type Product } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, SlidersHorizontal, Star, Tag, X, RefreshCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/components/theme-provider"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""
  const { theme } = useTheme()

  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "clothing", label: "Clothing" },
    { value: "electronics", label: "Electronics" },
    { value: "home-decor", label: "Home Decor" },
    { value: "toys", label: "Toys" }
  ]

  // Load recent searches
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = JSON.parse(localStorage.getItem("recent-searches") || "[]")
      setRecentSearches(savedSearches)
    }
  }, [])

  // Save search to recent searches
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

  useEffect(() => {
    // Only perform search if there's a query
    if (initialQuery) {
      performSearch()
    }
  }, [initialQuery])
  
  useEffect(() => {
    // Find min and max prices in search results
    if (searchResults.length > 0) {
      const prices = searchResults.map(product => product.price)
      const min = Math.floor(Math.min(...prices))
      const max = Math.ceil(Math.max(...prices))
      setMinPrice(min)
      setMaxPrice(max)
      setPriceRange([min, max])
    }
  }, [searchResults])

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true)
    setError(null)
    saveRecentSearch(query.trim())
    
    try {
      // Get search results
      let results = await searchProducts(query)
      
      // Handle case where API returns null or undefined
      if (!results) {
        results = []
      }
      
      setSearchResults(results)
      applyFilters(results)
    } catch (err) {
      console.error("Search error:", err)
      setError("An error occurred while searching. Please try again.")
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (products = searchResults) => {
    let filteredResults = [...products]
    
    // Filter by category
    if (category !== "all") {
      filteredResults = filteredResults.filter(product => product.category === category)
    }
    
    // Filter by price range
    filteredResults = filteredResults.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    )
    
    // Filter on sale items
    if (showOnSaleOnly) {
      filteredResults = filteredResults.filter(product => product.isOnSale)
    }

    // Sort results
    switch (sortBy) {
      case "price-low":
        filteredResults = filteredResults.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredResults = filteredResults.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filteredResults = filteredResults.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    setSearchResults(filteredResults)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    performSearch()
  }

  const handleClearFilters = () => {
    setCategory("all")
    setSortBy("relevance")
    setShowOnSaleOnly(false)
    setPriceRange([minPrice, maxPrice])
    performSearch()
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
  }
  
  const applyButtonStyles = theme === 'default'
    ? 'bg-primary hover:bg-primary/90'
    : theme === 'christmas'
    ? 'bg-christmas-darkRed hover:bg-christmas-darkRed/90'
    : theme === 'valentine'
    ? 'bg-pink-600 hover:bg-pink-600/90'
    : theme === 'allsaints'
    ? 'bg-amber-600 hover:bg-amber-600/90'
    : 'bg-primary hover:bg-primary/90'

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>

      <div className="mb-8 bg-muted/30 p-4 rounded-lg">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-primary focus-visible:ring-primary bg-white"
            />
          </div>
          <Button type="submit" className={applyButtonStyles} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
        
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Recent:</span>
              {recentSearches.slice(0, 3).map((term, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="rounded-full cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setQuery(term)
                    router.push(`/search?q=${encodeURIComponent(term.trim())}`)
                    setTimeout(() => performSearch(), 100)
                  }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            className="text-sm gap-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          
          <p className="text-muted-foreground text-sm">
            {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found for "{initialQuery}"
          </p>
        </div>
        
        {filtersOpen && (
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="space-y-4 flex-1">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4" /> 
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center gap-2">
                      <Checkbox 
                        id={`category-${cat.value}`} 
                        checked={category === cat.value}
                        onCheckedChange={() => setCategory(cat.value)}
                      />
                      <label 
                        htmlFor={`category-${cat.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {cat.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4" /> 
                  Price Range
                </h3>
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[minPrice, maxPrice]}
                    value={priceRange}
                    min={minPrice}
                    max={maxPrice}
                    step={100}
                    onValueChange={handlePriceRangeChange}
                    className="mb-6"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₱{priceRange[0].toLocaleString()}</span>
                    <span>₱{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" /> 
                  Options
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="on-sale" 
                      checked={showOnSaleOnly}
                      onCheckedChange={(checked) => setShowOnSaleOnly(!!checked)}
                    />
                    <label htmlFor="on-sale" className="text-sm cursor-pointer">Show only sale items</label>
                  </div>
                  
                  <div className="pt-2">
                    <label className="text-sm block mb-2">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-1">
                <RefreshCcw className="h-3 w-3" /> Reset Filters
              </Button>
              <Button size="sm" className={applyButtonStyles} onClick={() => applyFilters()}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categories.find(c => c.value === category)?.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setCategory("all")} />
            </Badge>
          )}
          
          {showOnSaleOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              On Sale Only
              <X className="h-3 w-3 cursor-pointer" onClick={() => setShowOnSaleOnly(false)} />
            </Badge>
          )}
          
          {sortBy !== "relevance" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {sortBy === "price-low" ? "Price (Low to High)" : 
                    sortBy === "price-high" ? "Price (High to Low)" : 
                    "Highest Rated"}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSortBy("relevance")} />
            </Badge>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Searching for products...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-medium mb-2">No results found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any products matching your search. Try using different keywords or browse our categories.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className={applyButtonStyles}>
              <a href="/">Home Page</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/all-products">Browse All Products</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
