"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { type Product } from "@/lib/products"

export default function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  )
  const [imageError, setImageError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [cartButtonText, setCartButtonText] = useState("Add to Cart")

  // Reset added status after a delay
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
        setCartButtonText("Add to Cart");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login before adding items to cart",
        variant: "destructive",
      })
      router.push(`/login?redirect=/product/${product.id}`)
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: imageError ? "/placeholder.svg?height=1200&width=1200" : product.image,
      quantity: quantity,
      category: product.category,
      size: selectedSize,
    })

    // Show visual feedback
    setAddedToCart(true);
    setCartButtonText("Added!");

    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`,
    })
  }

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login before making a purchase",
        variant: "destructive",
      })
      router.push(`/login?redirect=/product/${product.id}`)
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: imageError ? "/placeholder.svg?height=1200&width=1200" : product.image,
      quantity: quantity,
      category: product.category,
      size: selectedSize,
    })

    router.push("/checkout")
  }

  return (
    <div className="space-y-6">
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <Select value={selectedSize} onValueChange={(value: string) => setSelectedSize(value)}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size: string) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className={`flex-1 ${addedToCart 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-primary hover:bg-primary/90'}`} 
          onClick={handleAddToCart}
        >
          {addedToCart ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {cartButtonText}
        </Button>
        <Button variant="secondary" className="flex-1" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  )
} 