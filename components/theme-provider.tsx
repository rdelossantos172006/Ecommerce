"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Define available themes
export type SeasonalTheme = "default" | "christmas" | "valentine" | "allsaints"

interface ThemeContextType {
  theme: SeasonalTheme
  setTheme: (theme: SeasonalTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get current month to suggest a default theme
  const currentMonth = new Date().getMonth() + 1 // 1-12
  
  // Determine default theme based on month
  const getDefaultTheme = (): SeasonalTheme => {
    if (currentMonth === 12 || currentMonth === 1) return "christmas" // December-January
    if (currentMonth === 2) return "valentine" // February
    if (currentMonth === 11) return "allsaints" // November
    return "default"
  }
  
  // Use localStorage to persist theme preference
  const [theme, setTheme] = useLocalStorage<SeasonalTheme>(
    "seasonal-theme",
    getDefaultTheme()
  )
  
  // Apply theme class to body
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("theme-default", "theme-christmas", "theme-valentine", "theme-allsaints")
    root.classList.add(`theme-${theme}`)
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}
