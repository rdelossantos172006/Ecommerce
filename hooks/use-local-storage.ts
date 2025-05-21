"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Initialize on first render
  useEffect(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none, use initialValue
      const value = item ? JSON.parse(item) : initialValue
      setStoredValue(value)
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that 
  // persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }

  return [storedValue, setValue]
} 