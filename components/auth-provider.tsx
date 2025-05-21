"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api"

// Define the User type
interface User {
  id: number
  email: string
  name: string | null
}

// Define the context value type
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Check backend connection
async function checkBackendConnection() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    console.log('Checking backend connection to:', API_BASE_URL);
    
    // Use a simple GET request with no special options
    const response = await fetch(`${API_BASE_URL}/products?limit=1`);
    
    console.log('Backend connection status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}

// Check backend connection - alternative approach
async function checkBackendConnectionBasic() {
  try {
    // Use the most basic fetch possible
    const response = await fetch('http://localhost:5000/api/products?limit=1', {
      method: 'GET',
      mode: 'no-cors', // This is a last resort to bypass CORS issues
    });
    
    // In no-cors mode, we can't access most properties
    // but if we got here without an error, the server is probably running
    console.log('Basic connection check completed');
    return true;
  } catch (error) {
    console.error('Basic connection check failed:', error);
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const isInitialMount = useRef(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    
    // Only perform connection checks after the initial render
    const checkConnection = async () => {
      // Skip toast notifications during initial render
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return true;
      }
      
      let isConnected = await checkBackendConnection();
      
      // If standard connection check fails, try the basic approach
      if (!isConnected) {
        console.log("Standard connection check failed, trying basic check...");
        isConnected = await checkBackendConnectionBasic();
      }
      
      console.log('Backend connection available:', isConnected);
      if (!isConnected) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check if the backend is running.",
          variant: "destructive",
        });
      }
      return isConnected;
    };
    
    checkConnection();
    
    if (token) {
      setLoading(true)
      authApi.getProfile()
        .then(data => {
          setUser(data.user)
        })
        .catch(error => {
          console.error("Failed to get user profile:", error)
          // If token is invalid, remove it
          localStorage.removeItem("token")
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      console.log("Starting login process for:", email);
      
      // First check if backend is reachable
      try {
        let isConnected = await checkBackendConnection();
        
        // If standard connection check fails, try the basic approach
        if (!isConnected) {
          console.log("Standard connection check failed, trying basic check...");
          isConnected = await checkBackendConnectionBasic();
        }
        
        if (!isConnected) {
          toast({
            title: "Connection Error",
            description: "Unable to connect to the server. Please check if the backend is running.",
            variant: "destructive",
          });
          return false;
        }
      } catch (connectionError) {
        console.error("Connection check failed:", connectionError);
        toast({
          title: "Connection Error",
          description: "Unable to check server connection. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      const data = await authApi.login({ email, password })
      
      // Save token to localStorage
      localStorage.setItem("token", data.token)
      
      // Set user state
      setUser(data.user)
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
      
      return true
    } catch (error) {
      console.error("Login failed:", error)
      
      // More detailed user-facing error message
      let errorMessage = "Invalid email or password";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      
      // Check for specific network-related errors
      if (errorMessage.includes("Failed to fetch") || errorMessage.includes("Network error")) {
        errorMessage = "Unable to connect to the server. Please check your internet connection and make sure the server is running.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      setLoading(true)
      const data = await authApi.register({ email, password, name })
      
      // Save token to localStorage
      localStorage.setItem("token", data.token)
      
      // Set user state
      setUser(data.user)
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      })
      
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: typeof error === "string" ? error : "Email may already be in use",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
