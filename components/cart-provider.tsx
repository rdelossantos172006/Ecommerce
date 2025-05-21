"use client"

import React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export type CartItem = {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  quantity: number
  category: string
  size?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()
  const { user } = useAuth()
  const isInitialMount = useRef(true)

  // Load cart from localStorage when user changes
  useEffect(() => {
    // Skip the first render to avoid state updates during initial rendering
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // Still load cart on first render, but without triggering effects
      if (user) {
        const savedCart = localStorage.getItem(`cart-${user.id}`)
        if (savedCart) {
          try {
            setItems(JSON.parse(savedCart))
          } catch (e) {
            console.error("Failed to parse saved cart:", e)
          }
        }
      }
      return;
    }
    
    if (user) {
      const savedCart = localStorage.getItem(`cart-${user.id}`)
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Failed to parse saved cart:", e)
        }
      }
    } else {
      // Clear cart when logged out
      setItems([])
    }
  }, [user])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart-${user.id}`, JSON.stringify(items))
    }
  }, [items, user])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Check if item already exists (with size if applicable)
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id && (!item.size || i.size === item.size))

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity

        toast({
          title: "Cart updated",
          description: `${item.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        })

        return updatedItems
      } else {
        // Add new item
        toast({
          title: "Item added to cart",
          description: `${item.name} added to your cart`,
        })

        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string, size?: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === id && (!size || i.size === size))

      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} removed from your cart`,
        })
      }

      return prevItems.filter((i) => !(i.id === id && (!size || i.size === size)))
    })
  }

  const updateQuantity = (id: string, quantity: number, size?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && (!size || item.size === size)) {
          return { ...item, quantity }
        }
        return item
      }),
    )
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
