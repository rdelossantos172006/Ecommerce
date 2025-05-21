// API service for interacting with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      const error = data.message || response.statusText;
      return Promise.reject(error);
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing response:', error);
    return Promise.reject('Invalid response from server');
  }
};

// Get auth token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Authentication API calls
export const authApi = {
  // Register a new user
  register: async (userData: { email: string; password: string; name?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },
  
  // Login a user
  login: async (credentials: { email: string; password: string }) => {
    console.log('Login attempt:', credentials.email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      console.log('Login response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Server error: ${response.status}`;
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        return Promise.reject(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Network error during login:', error);
      return Promise.reject('Network error: Failed to connect to server');
    }
  },
  
  // Get current user profile
  getProfile: async () => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Update user profile
  updateProfile: async (profileData: { name?: string; email?: string }) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    
    return handleResponse(response);
  },
};

// Products API calls for real API
export const productsApiFallback = {
  // Get all products
  getAll: async (params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params?.offset) {
      queryParams.append('offset', params.offset.toString());
    }
    
    const url = `${API_BASE_URL}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    return handleResponse(response);
  },
  
  // Get a single product by ID
  getById: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    return handleResponse(response);
  },
  
  // Get products by category
  getByCategory: async (category: string, limit?: number) => {
    const queryParams = new URLSearchParams();
    
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    const url = `${API_BASE_URL}/products/category/${category}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    return handleResponse(response);
  },
  
  // Get products on sale
  getOnSale: async (limit?: number) => {
    const queryParams = new URLSearchParams();
    
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    const url = `${API_BASE_URL}/products/sale${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    return handleResponse(response);
  },
  
  // Search products
  search: async (query: string, limit?: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    const url = `${API_BASE_URL}/products/search?${queryParams.toString()}`;
    const response = await fetch(url);
    
    return handleResponse(response);
  },
};

// Orders API calls
export const ordersApi = {
  // Get all orders for the current user
  getAll: async () => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    try {
      // Try to fetch from real API
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return handleResponse(response);
    } catch (error) {
      console.log("Falling back to mock orders data");
      // Return mock data for testing
      return [
        {
          id: 1001,
          total_amount: 4999,
          status: "processing",
          created_at: new Date(Date.now() - 86400000).toISOString(), // yesterday
          items: [
            {
              product_id: "electronics-1",
              quantity: 1,
              price: 3990,
              name: "Wireless Earbuds",
              image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop"
            },
            {
              product_id: "kitchenware-2",
              quantity: 2,
              price: 899,
              name: "Ceramic Coffee Mug",
              image: "https://images.unsplash.com/photo-1571489528490-118422f47cbb?w=600&h=600&fit=crop"
            }
          ],
          shipping_address: "123 Main Street, Anytown, AN 12345",
          payment_method: "COD"
        },
        {
          id: 1002,
          total_amount: 6499,
          status: "shipped",
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(), // a week ago
          items: [
            {
              product_id: "clothing-2",
              quantity: 1,
              price: 1499,
              size: "M",
              name: "Slim Fit Jeans",
              image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop"
            },
            {
              product_id: "electronics-3",
              quantity: 2,
              price: 2499,
              name: "Bluetooth Speaker",
              image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"
            }
          ],
          shipping_address: "456 Oak Avenue, Somewhere, SW 67890",
          payment_method: "gcash"
        },
        {
          id: 1003,
          total_amount: 3599,
          status: "delivered",
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(), // a month ago
          items: [
            {
              product_id: "clothing-3",
              quantity: 1,
              price: 3599,
              size: "L",
              name: "Winter Jacket",
              image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=600&fit=crop"
            }
          ],
          shipping_address: "789 Pine Road, Elsewhere, EL 54321",
          payment_method: "bank"
        }
      ];
    }
  },
  
  // Get a single order by ID
  getById: async (orderId: number) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    try {
      // Try to fetch from real API
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return handleResponse(response);
    } catch (error) {
      console.log("Falling back to mock order data");
      
      // Return mock data for testing based on orderId
      const mockOrders = await ordersApi.getAll();
      return mockOrders.find((order: any) => order.id === orderId);
    }
  },
  
  // Create a new order
  create: async (orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      size?: string;
    }>;
    total_amount: number;
    shipping_address?: string;
    payment_method?: string;
  }) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    
    return handleResponse(response);
  },
};

// Wishlist API calls
export const wishlistApi = {
  // Get the current user's wishlist
  getAll: async () => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
  
  // Add a product to the wishlist
  addItem: async (productId: string) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId }),
    });
    
    return handleResponse(response);
  },
  
  // Remove a product from the wishlist
  removeItem: async (productId: string) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return handleResponse(response);
  },
};

// Reviews API calls
export const reviewsApi = {
  // Get reviews for a product
  getByProduct: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    return handleResponse(response);
  },
  
  // Create a new review
  create: async (productId: string, reviewData: { rating: number; comment?: string }) => {
    const token = getToken();
    
    if (!token) {
      return Promise.reject('Authentication required');
    }
    
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    
    return handleResponse(response);
  },
};

import { generateImageUrl } from "@/lib/products"
import { mockProducts } from "@/lib/mock-products"

// Helper to generate failsafe product images
function getProductImage(product: any): string {
  // If product already has an image, return it
  if (product.image && product.image.startsWith('http')) {
    return product.image
  }
  
  // Generate a relevant image based on name and category
  try {
    return generateImageUrl(product.name, product.category)
  } catch (error) {
    console.error("Error generating image for product:", product.name)
    // Provide category-specific fallback images
    const fallbacks = {
      'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop',
      'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&h=600&fit=crop',
      'home-decor': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=600&fit=crop',
      'toys': 'https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=600&h=600&fit=crop',
      'kitchenware': 'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=600&h=600&fit=crop'
    }
    return fallbacks[product.category as keyof typeof fallbacks] || 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&h=600&fit=crop'
  }
}

// API class for handling product data
export const productsApi = {
  getAll: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Return mock data with image processing
    return { products: mockProducts.map(p => ({...p, image: getProductImage(p)})) }
  },
  
  getByCategory: async (category: string, limit: number = 10) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    // Filter by category, add images, and limit results
    const filteredProducts = mockProducts
      .filter(p => p.category === category)
      .map(p => ({...p, image: getProductImage(p)}))
      .slice(0, limit)
    return { products: filteredProducts }
  },
  
  getOnSale: async (limit: number = 10) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    // Filter for products on sale, add images, and limit results
    const saleProducts = mockProducts
      .filter(p => p.isOnSale)
      .map(p => ({...p, image: getProductImage(p)}))
      .slice(0, limit)
    return { products: saleProducts }
  },
  
  getById: async (id: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))
    // Find product by ID
    const product = mockProducts.find(p => p.id === id)
    if (!product) throw new Error(`Product with id ${id} not found`)
    // Add image processing
    return { product: {...product, image: getProductImage(product)} }
  },
  
  search: async (query: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Case-insensitive search in name and description
    const lowercaseQuery = query.toLowerCase()
    const searchResults = mockProducts
      .filter(p => {
        return (
          p.name.toLowerCase().includes(lowercaseQuery) ||
          p.description.toLowerCase().includes(lowercaseQuery) ||
          p.category.toLowerCase().includes(lowercaseQuery)
        )
      })
      .map(p => ({...p, image: getProductImage(p)}))
      .slice(0, 10)
    
    return { products: searchResults }
  }
} 