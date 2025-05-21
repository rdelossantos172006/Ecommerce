import { productsApi } from "@/lib/api"

// Type definition for a product
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
  isOnSale: boolean
  sizes?: string[]
  discount?: number
  dealType?: string
  dealEnds?: string
  stockLeft?: number
  tags?: string[]
}

// Convert API product to frontend format if needed
export function formatApiProduct(apiProduct: any): Product {
  const formattedProduct = {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price,
    category: apiProduct.category,
    image: apiProduct.image || generateImageUrl(apiProduct.name, apiProduct.category),
    rating: apiProduct.rating,
    isOnSale: apiProduct.is_on_sale,
    sizes: apiProduct.sizes,
    discount: apiProduct.discount,
    dealType: apiProduct.deal_type,
    dealEnds: apiProduct.deal_ends,
    stockLeft: apiProduct.stock_left,
    tags: apiProduct.tags
  }
  
  // If image is missing or a placeholder, generate a better one
  if (!formattedProduct.image || formattedProduct.image.includes('placeholder')) {
    formattedProduct.image = generateImageUrl(formattedProduct.name, formattedProduct.category)
  }
  
  return formattedProduct
}

// Generate image URL based on product name and category
export function generateImageUrl(productName: string, category: string): string {
  try {
    // Clean up the product name and category for better image search results
    const cleanName = encodeURIComponent(productName.trim().toLowerCase())
    const cleanCategory = encodeURIComponent(category.trim().toLowerCase())
    
    // For kitchenware, use a more specific and reliable approach
    if (category.toLowerCase() === 'kitchenware') {
      // Map specific kitchenware product names to better search terms
      const kitchenwareTerms: Record<string, string> = {
        "chef's knife set": "chef knife set,professional,cooking",
        "ceramic coffee mug": "coffee mug,ceramic,kitchen",
        "silicone cooking utensil set": "cooking utensils,kitchen tools,silicone",
        "coffee mug": "coffee mug,ceramic,kitchen", 
        "cutting board": "cutting board,kitchen,wood",
        "kitchen knife set": "chef knife,kitchen,professional"
      };
      
      // Use specific search term if available, otherwise use a generic but effective one
      const lowercaseName = productName.toLowerCase();
      const searchTerm = kitchenwareTerms[lowercaseName] || `${cleanCategory},${cleanName},kitchen`;
      
      // Use featured images for more reliable results
      return `https://source.unsplash.com/featured/600x600/?${searchTerm}`;
    }
    
    // Create a more specific search query based on product name and category
    const searchQuery = `${cleanCategory},${cleanName}`
    
    // Use different image services with more specific queries for better matches
    switch (category.toLowerCase()) {
      case 'clothing':
        return `https://source.unsplash.com/random/600x600/?fashion,${cleanName},clothes`
      case 'electronics':
        return `https://source.unsplash.com/random/600x600/?electronics,gadget,${cleanName}`
      case 'home-decor':
        return `https://source.unsplash.com/random/600x600/?home,decor,interior,${cleanName}`
      case 'toys':
        return `https://source.unsplash.com/random/600x600/?toy,${cleanName},play`
      default:
        // Create a stable, deterministic seed based on product name for consistent results
        const seed = [...productName].reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return `https://source.unsplash.com/random/600x600/?${searchQuery}&sig=${seed}`
    }
  } catch (error) {
    console.error("Error generating image URL:", error)
    // Fallback to a reliable default image
    
    // Use category-specific fallbacks for better user experience
    const fallbacks: Record<string, string> = {
      'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop',
      'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop',
      'home-decor': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop',
      'toys': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=600&h=600&fit=crop',
      'kitchenware': 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&h=600&fit=crop'
    };
    
    return fallbacks[category.toLowerCase()] || "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&h=600&fit=crop"
  }
}

// Format price to Philippine Peso
export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price)
}

// Get products by category with exactly 3 products per category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Request more products than needed to ensure we can fill 3 slots
    const response = await productsApi.getByCategory(category, 6)
    let products = response.products.map(formatApiProduct)
    
    // If less than 3 products returned, generate additional ones
    if (products.length < 3) {
      const additionalCount = 3 - products.length
      
      const sampleNames = {
        'clothing': ['Casual T-Shirt', 'Winter Jacket', 'Denim Jeans'],
        'electronics': ['Bluetooth Speaker', 'Wireless Earbuds', 'Smartphone Charger'],
        'home-decor': ['Decorative Pillow', 'Wall Clock', 'Picture Frame'],
        'toys': ['Plush Teddy Bear', 'Building Blocks', 'Remote Control Car'],
        'kitchenware': ['Coffee Mug', 'Cutting Board', 'Kitchen Knife Set']
      }
      
      // Generate additional products
      const defaultNames = ['Product 1', 'Product 2', 'Product 3']
      const names = sampleNames[category as keyof typeof sampleNames] || defaultNames
      
      for (let i = 0; i < additionalCount; i++) {
        const index = products.length % names.length
        products.push({
          id: `generated-${category}-${i}`,
          name: names[index],
          description: `High-quality ${names[index]} for your needs.`,
          price: Math.floor(Math.random() * 2000) + 500,
          originalPrice: Math.floor(Math.random() * 3000) + 1000,
          category: category,
          image: generateImageUrl(names[index], category),
          rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),  // Ratings between 3 and 5
          isOnSale: Math.random() > 0.5,
          stockLeft: Math.floor(Math.random() * 50) + 1
        })
      }
    }
    
    // Slice to exactly 3 products
    return products.slice(0, 3)
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error)
    
    // Generate fallback products if API fails
    const fallbackProducts: Product[] = []
    const sampleNames = [
      'Red Shirt', 'Blue Jeans', 'Winter Jacket'
    ]
    
    for (let i = 0; i < 3; i++) {
      fallbackProducts.push({
        id: `fallback-${category}-${i}`,
        name: sampleNames[i],
        description: `Quality ${sampleNames[i]} for everyday use.`,
        price: Math.floor(Math.random() * 2000) + 500,
        originalPrice: Math.floor(Math.random() * 3000) + 1000,
        category: category,
        image: generateImageUrl(sampleNames[i], category),
        rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
        isOnSale: Math.random() > 0.5,
        stockLeft: Math.floor(Math.random() * 50) + 1
      })
    }
    
    return fallbackProducts
  }
}

// Get on sale products (exactly 3)
export async function getOnSaleProducts(): Promise<Product[]> {
  try {
    const response = await productsApi.getOnSale(10)
    let products = response.products.map(formatApiProduct)
    
    // Ensure we have exactly 3 products
    if (products.length < 3) {
      // Get products from various categories to fill up
      const categories = ['clothing', 'electronics', 'home-decor', 'toys', 'kitchenware']
      let additionalProducts: Product[] = []
      
      for (const category of categories) {
        if (products.length + additionalProducts.length >= 3) break
        
        try {
          const categoryProducts = await getProductsByCategory(category)
          // Filter to only include on-sale items and ones not already in the list
          const saleProducts = categoryProducts
            .filter(p => p.isOnSale)
            .filter(p => !products.some((existing: Product) => existing.id === p.id))
          
          additionalProducts = [...additionalProducts, ...saleProducts]
        } catch (err) {
          console.error(`Error getting additional ${category} products:`, err)
        }
      }
      
      products = [...products, ...additionalProducts]
    }
    
    return products.slice(0, 3)
  } catch (error) {
    console.error("Error fetching on sale products:", error)
    
    // Generate fallback on-sale products
    const categories = ['clothing', 'electronics', 'home-decor']
    const fallbackProducts: Product[] = []
    
    for (let i = 0; i < 3; i++) {
      const category = categories[i % categories.length]
      const productName = `Sale Item ${i+1} - ${category}`
      
      fallbackProducts.push({
        id: `sale-fallback-${i}`,
        name: productName,
        description: `Special discounted ${category} item.`,
        price: Math.floor(Math.random() * 1500) + 500,
        originalPrice: Math.floor(Math.random() * 3000) + 1500,
        category: category,
        image: generateImageUrl(productName, category),
        rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3.5),
        isOnSale: true,
        discount: Math.floor(Math.random() * 40) + 10,
        stockLeft: Math.floor(Math.random() * 20) + 1
      })
    }
    
    return fallbackProducts
  }
}

// Get featured products (exactly 3)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await productsApi.getOnSale(10)
    let products = response.products.map(formatApiProduct)
    
    // Ensure we have exactly 3 products
    if (products.length < 3) {
      // Get products from various categories to fill up
      const categories = ['clothing', 'electronics', 'home-decor', 'toys', 'kitchenware']
      let additionalProducts: Product[] = []
      
      for (const category of categories) {
        if (products.length + additionalProducts.length >= 3) break
        
        try {
          const categoryProducts = await getProductsByCategory(category)
          // Filter to only include ones not already in the list
          const filteredProducts = categoryProducts
            .filter(p => !products.some((existing: Product) => existing.id === p.id))
            .slice(0, 3 - (products.length + additionalProducts.length))
          
          additionalProducts = [...additionalProducts, ...filteredProducts]
        } catch (err) {
          console.error(`Error getting additional ${category} products:`, err)
        }
      }
      
      products = [...products, ...additionalProducts]
    }
    
    return products.slice(0, 3)
  } catch (error) {
    console.error("Error fetching featured products:", error)
    
    // Generate fallback featured products with better visibility
    const categories = ['clothing', 'electronics', 'home-decor']
    const fallbackProducts: Product[] = []
    
    const featuredNames = [
      'Premium Winter Coat', 'Wireless Headphones', 'Luxury Throw Pillow'
    ]
    
    for (let i = 0; i < 3; i++) {
      const category = categories[i % categories.length]
      
      fallbackProducts.push({
        id: `featured-fallback-${i}`,
        name: featuredNames[i],
        description: `Premium quality ${featuredNames[i]}, our customer favorite.`,
        price: Math.floor(Math.random() * 3000) + 1000,
        originalPrice: Math.floor(Math.random() * 5000) + 2000,
        category: category,
        image: generateImageUrl(featuredNames[i], category),
        rating: Math.min(5, Math.floor(Math.random() * 20) / 10 + 4.0), // Higher ratings for featured
        isOnSale: Math.random() > 0.3,
        tags: ['featured', 'popular', 'top-rated'],
        stockLeft: Math.floor(Math.random() * 30) + 5
      })
    }
    
    return fallbackProducts
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await productsApi.getById(id)
    return formatApiProduct(response.product)
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    
    // If ID starts with our generated IDs, generate a product
    if (id.startsWith('generated-') || id.startsWith('fallback-') || id.startsWith('sale-fallback-') || id.startsWith('featured-fallback-')) {
      const parts = id.split('-')
      const category = parts.length > 1 ? parts[1] : 'clothing'
      const index = parts.length > 2 ? parseInt(parts[2]) : 0
      
      const sampleNames = {
        'clothing': ['Casual T-Shirt', 'Winter Jacket', 'Denim Jeans', 'Summer Dress', 'Knit Sweater', 'Formal Shirt'],
        'electronics': ['Bluetooth Speaker', 'Wireless Earbuds', 'Smartphone Charger', 'LED Desk Lamp', 'Digital Watch', 'Portable Power Bank'],
        'home-decor': ['Decorative Pillow', 'Wall Clock', 'Picture Frame', 'Ceramic Vase', 'Throw Blanket', 'Table Lamp'],
        'toys': ['Plush Teddy Bear', 'Building Blocks', 'Remote Control Car', 'Puzzle Game', 'Action Figure', 'Board Game'],
        'kitchenware': ['Coffee Mug', 'Cutting Board', 'Kitchen Knife Set', 'Mixing Bowl', 'Silicone Spatula', 'Measuring Cups']
      }
      
      const defaultNames = ['Product 1', 'Product 2', 'Product 3', 'Product 4', 'Product 5', 'Product 6']
      const names = sampleNames[category as keyof typeof sampleNames] || defaultNames
      const name = names[index % names.length]
      
      return {
        id: id,
        name: name,
        description: `High-quality ${name} for your everyday needs. This product is made with premium materials and designed for durability and comfort. Perfect for all occasions.`,
        price: Math.floor(Math.random() * 2000) + 500,
        originalPrice: Math.floor(Math.random() * 3000) + 1000,
        category: category,
        image: generateImageUrl(name, category),
        rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
        isOnSale: Math.random() > 0.5,
        sizes: category === 'clothing' ? ['S', 'M', 'L', 'XL'] : undefined,
        stockLeft: Math.floor(Math.random() * 50) + 1
      }
    }
    
    return null
  }
}

// Search products with category grouping
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await productsApi.search(query)
    let products = response.products.map(formatApiProduct)
    
    // If less than 6 results, generate some relevant ones
    if (products.length < 6) {
      // Get a mix of products from different categories
      const categories = ['clothing', 'electronics', 'home-decor', 'toys', 'kitchenware']
      const searchTerms = query.split(' ')
      
      for (const category of categories) {
        if (products.length >= 6) break
        
        // Generate a product that matches the search query for this category
        const productName = `${searchTerms.join(' ')} ${category}`
        
        products.push({
          id: `search-${category}-${products.length}`,
          name: productName,
          description: `${productName} - Perfect for all your needs.`,
          price: Math.floor(Math.random() * 2000) + 500,
          originalPrice: Math.floor(Math.random() * 3000) + 1000,
          category: category,
          image: generateImageUrl(productName, category),
          rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
          isOnSale: Math.random() > 0.5,
          stockLeft: Math.floor(Math.random() * 50) + 1
        })
      }
    }
    
    return products
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error)
    
    // Generate fallback search results
    const fallbackProducts: Product[] = []
    const categories = ['clothing', 'electronics', 'home-decor', 'toys', 'kitchenware']
    
    for (let i = 0; i < 6; i++) {
      const category = categories[i % categories.length]
      const productName = `${query} ${category} ${i+1}`
      
      fallbackProducts.push({
        id: `search-fallback-${i}`,
        name: productName,
        description: `Product matching "${query}" in ${category} category.`,
        price: Math.floor(Math.random() * 2000) + 500,
        originalPrice: Math.floor(Math.random() * 3000) + 1000,
        category: category,
        image: generateImageUrl(productName, category),
        rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
        isOnSale: Math.random() > 0.5,
        stockLeft: Math.floor(Math.random() * 50) + 1
      })
    }
    
    return fallbackProducts
  }
}

// Get all products from all categories
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Get products from all categories
    const categories = ['clothing', 'electronics', 'home-decor', 'toys']
    const categoryPromises = categories.map(category => 
      productsApi.getByCategory(category, 10)
        .then(response => response.products.map(formatApiProduct))
        .catch(error => {
          console.error(`Error fetching ${category} products:`, error)
          return [] as Product[]
        })
    )
    
    const productsArrays = await Promise.all(categoryPromises)
    
    // Combine all products into a single array
    let allProducts = productsArrays.flat()
    
    // Ensure we have at least 12 products total
    if (allProducts.length < 12) {
      const neededProducts = 12 - allProducts.length
      const generatedProducts: Product[] = []
      
      // Generate additional products for each category as needed
      const sampleProducts = {
        'clothing': ['Casual T-Shirt', 'Winter Jacket', 'Denim Jeans', 'Summer Dress', 'Knit Sweater'],
        'electronics': ['Bluetooth Speaker', 'Wireless Earbuds', 'Smartphone Charger', 'LED Desk Lamp', 'Digital Watch'],
        'home-decor': ['Decorative Pillow', 'Wall Clock', 'Picture Frame', 'Ceramic Vase', 'Throw Blanket'],
        'toys': ['Plush Teddy Bear', 'Building Blocks', 'Remote Control Car', 'Puzzle Game', 'Action Figure']
      }
      
      for (let i = 0; i < neededProducts; i++) {
        const category = categories[i % categories.length]
        const productNames = sampleProducts[category as keyof typeof sampleProducts]
        const name = productNames[i % productNames.length]
        
        generatedProducts.push({
          id: `all-products-${category}-${i}`,
          name: name,
          description: `High-quality ${name} for your everyday needs.`,
          price: Math.floor(Math.random() * 2000) + 500,
          originalPrice: Math.floor(Math.random() * 3000) + 1000,
          category: category,
          image: generateImageUrl(name, category),
          rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
          isOnSale: Math.random() > 0.5,
          stockLeft: Math.floor(Math.random() * 50) + 1
        })
      }
      
      allProducts = [...allProducts, ...generatedProducts]
    }
    
    return allProducts
  } catch (error) {
    console.error("Error fetching all products:", error)
    
    // Generate fallback products if API fails completely
    const fallbackProducts: Product[] = []
    const categories = ['clothing', 'electronics', 'home-decor', 'toys']
    
    for (let i = 0; i < 12; i++) {
      const category = categories[i % categories.length]
      const productName = `Product ${i+1} - ${category}`
      
      fallbackProducts.push({
        id: `all-fallback-${i}`,
        name: productName,
        description: `Quality ${productName} for everyday use.`,
        price: Math.floor(Math.random() * 2000) + 500,
        originalPrice: Math.floor(Math.random() * 3000) + 1000,
        category: category,
        image: generateImageUrl(productName, category),
        rating: Math.min(5, Math.floor(Math.random() * 50) / 10 + 3),
        isOnSale: Math.random() > 0.5,
        stockLeft: Math.floor(Math.random() * 50) + 1
      })
    }
    
    return fallbackProducts
  }
}
