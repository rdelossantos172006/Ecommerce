import { generateImageUrl, type Product } from '@/lib/products';

// Mock product data
export const mockProducts: Product[] = [
  {
    id: "clothing-1",
    name: "Classic White T-Shirt",
    description: "A timeless white t-shirt made from 100% organic cotton.",
    price: 799,
    originalPrice: 1299,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    rating: 4.5,
    isOnSale: true,
    tags: ["essentials", "casual"],
    discount: 38
  },
  {
    id: "clothing-2",
    name: "Slim Fit Jeans",
    description: "Comfortable slim fit jeans that go with everything.",
    price: 1499,
    originalPrice: 2499,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop",
    rating: 4.2,
    isOnSale: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "clothing-3",
    name: "Winter Jacket",
    description: "Stay warm and stylish with this winter jacket featuring premium insulation.",
    price: 3599,
    originalPrice: 5999,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop",
    rating: 4.8,
    isOnSale: false,
    sizes: ["M", "L", "XL"]
  },
  {
    id: "electronics-1",
    name: "Wireless Earbuds",
    description: "True wireless earbuds with noise cancellation and long battery life.",
    price: 3990,
    originalPrice: 5990,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop",
    rating: 4.6,
    isOnSale: true,
    discount: 33
  },
  {
    id: "electronics-2",
    name: "Smart Watch",
    description: "Track your fitness, receive notifications, and more with this sleek smartwatch.",
    price: 5990,
    originalPrice: 7990,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
    rating: 4.4,
    isOnSale: true
  },
  {
    id: "electronics-3",
    name: "Bluetooth Speaker",
    description: "Portable Bluetooth speaker with 360° sound and 20-hour battery life.",
    price: 2499,
    originalPrice: 3499,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    rating: 4.3,
    isOnSale: false
  },
  {
    id: "home-decor-1",
    name: "Decorative Throw Pillow",
    description: "Add a pop of color to your sofa with this beautiful throw pillow.",
    price: 899,
    originalPrice: 1499,
    category: "home-decor",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=600&h=600&fit=crop",
    rating: 4.1,
    isOnSale: true,
    discount: 40
  },
  {
    id: "home-decor-2",
    name: "Modern Wall Clock",
    description: "Minimalist wall clock that adds style to any room.",
    price: 1499,
    originalPrice: 1999,
    category: "home-decor",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop",
    rating: 4.5,
    isOnSale: false
  },
  {
    id: "home-decor-3",
    name: "Ceramic Vase",
    description: "Handcrafted ceramic vase for your favorite flowers.",
    price: 1299,
    originalPrice: undefined,
    category: "home-decor",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&h=600&fit=crop",
    rating: 4.7,
    isOnSale: false
  },
  {
    id: "toys-1",
    name: "Plush Teddy Bear",
    description: "Soft and huggable teddy bear for children of all ages.",
    price: 999,
    originalPrice: 1499,
    category: "toys",
    image: "https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=600&h=600&fit=crop",
    rating: 4.9,
    isOnSale: true,
    discount: 33
  },
  {
    id: "toys-2",
    name: "Building Blocks Set",
    description: "Educational building blocks to boost creativity and motor skills.",
    price: 1899,
    originalPrice: 2499,
    category: "toys",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop",
    rating: 4.5,
    isOnSale: false
  },
  {
    id: "toys-3",
    name: "Remote Control Car",
    description: "High-speed remote control car for indoor and outdoor fun.",
    price: 2499,
    originalPrice: 3499,
    category: "toys",
    image: "https://images.unsplash.com/photo-1595856619767-ab739fa7daae?w=600&h=600&fit=crop",
    rating: 4.2,
    isOnSale: true
  },
  {
    id: "kitchenware-1",
    name: "Chef's Knife Set",
    description: "Professional-grade knife set for all your cooking needs.",
    price: 4999,
    originalPrice: 6999,
    category: "kitchenware",
    image: "https://images.unsplash.com/photo-1593618793289-9dc339f5a5dd?w=600&h=600&fit=crop",
    rating: 4.8,
    isOnSale: true,
    discount: 28
  },
  {
    id: "kitchenware-2",
    name: "Ceramic Coffee Mug",
    description: "Elegant ceramic mug for your morning coffee or tea.",
    price: 899,
    originalPrice: 1299,
    category: "kitchenware",
    image: "https://images.unsplash.com/photo-1571489528490-118422f47cbb?w=600&h=600&fit=crop",
    rating: 4.4,
    isOnSale: false
  },
  {
    id: "kitchenware-3",
    name: "Silicone Cooking Utensil Set",
    description: "Heat-resistant silicone utensils for non-stick cookware.",
    price: 1999,
    originalPrice: 2999,
    category: "kitchenware",
    image: "https://images.unsplash.com/photo-1627302968982-6bf89267746a?w=600&h=600&fit=crop",
    rating: 4.6,
    isOnSale: true
  }
];

// Helper to generate failsafe product images
export function getProductImage(product: Product): string {
  // If product already has a valid image, return it
  if (product.image && product.image.startsWith('http')) {
    return product.image;
  }
  
  // Generate a relevant image based on name and category
  try {
    return generateImageUrl(product.name, product.category);
  } catch (error) {
    console.error("Error generating image for product:", product.name);
    // Provide category-specific fallback images
    const fallbacks: Record<string, string> = {
      'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop',
      'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop',
      'home-decor': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop',
      'toys': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=600&h=600&fit=crop',
      'kitchenware': 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&h=600&fit=crop'
    };
    return fallbacks[product.category] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&h=600&fit=crop';
  }
} 