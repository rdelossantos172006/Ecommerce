import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { SeasonalWrapper } from "@/components/seasonal-wrapper"
import dynamic from "next/dynamic"
import "./globals.css"

// Dynamically import the Navbar component to reduce initial load time
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: true,
  loading: () => (
    <div className="h-16 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
})

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ruby's Affordable eShop",
  description: "Budget-friendly items for everyone this Christmas",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* Add preconnect for external resources */}
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="relative min-h-screen flex flex-col">
                {/* Use the client component wrapper for seasonal elements */}
                <SeasonalWrapper />
                
                <Navbar />
                <main className="flex-1 relative z-10">{children}</main>
                <Toaster />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
