"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import React from "react"

interface ThemedProductContainerProps {
  children: React.ReactNode
  className?: string
}

export function ThemedProductContainer({ children, className }: ThemedProductContainerProps) {
  const { theme } = useTheme()
  
  // Theme-based styling
  const themeStyles = {
    default: "bg-background",
    christmas: "bg-gradient-to-b from-background to-background/95 border-green-800/10 product-christmas",
    valentine: "bg-gradient-to-b from-background to-pink-50/5 border-pink-500/10 product-valentine",
    allsaints: "bg-gradient-to-b from-background to-amber-800/5 border-amber-500/10 product-allsaints"
  }

  return (
    <div className={cn(
      "relative rounded-lg p-4 transition-all duration-300",
      themeStyles[theme],
      className
    )}>
      {theme === "christmas" && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -top-2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-christmas-red to-transparent opacity-30"></div>
          <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-christmas-green to-transparent opacity-30"></div>
          <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.5 9H22L16 13.5L18 21L12 17L6 21L8 13.5L2 9H9.5L12 2Z" fill="#c41e3a" />
            </svg>
          </div>
        </div>
      )}
      
      {theme === "valentine" && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -top-2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-20"></div>
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#db2777" />
            </svg>
          </div>
        </div>
      )}
      
      {theme === "allsaints" && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -top-2 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-20"></div>
          <div className="absolute top-4 right-4 opacity-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="#b45309" />
            </svg>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
} 