"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export function SeasonalBackground() {
  const { theme } = useTheme()
  const pathname = usePathname()
  
  // Only apply full-page backgrounds on the homepage
  const isHomepage = pathname === "/"
  
  useEffect(() => {
    // Apply specific theme elements for each season
    const body = document.body
    
    // Remove all season-specific classes first
    body.classList.remove(
      "valentine-bg", 
      "christmas-bg", 
      "allsaints-bg",
      "default-bg"
    )
    
    // Apply the right class based on current theme
    if (isHomepage) {
      body.classList.add(`${theme}-bg`)
    }
    
    return () => {
      // Cleanup when component unmounts
      body.classList.remove(
        "valentine-bg", 
        "christmas-bg", 
        "allsaints-bg",
        "default-bg"
      )
    }
  }, [theme, isHomepage])
  
  // This component doesn't render anything visible
  return null
} 