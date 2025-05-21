"use client"

import { useEffect, useState, useMemo } from "react"
import type { JSX } from "react"

export function ChristmasDecorations() {
  const [decorations, setDecorations] = useState<JSX.Element[]>([])

  // Use useMemo to create decorations only once
  const decorationItems = useMemo(() => {
    // Reduce the number of decorations for better performance
    const items = [
      { emoji: "🎄", className: "jingle" },
      { emoji: "🎁", className: "float" },
      { emoji: "❄️", className: "twinkle" },
      { emoji: "🔔", className: "jingle" },
      { emoji: "🦌", className: "float" },
      { emoji: "⭐", className: "twinkle" },
      { emoji: "🎅", className: "float" },
    ]

    return Array.from({ length: 7 }, (_, i) => {
      const item = items[i % items.length]
      const size = Math.random() * 1.5 + 0.5
      const top = Math.random() * 100
      const left = Math.random() * 100
      const delay = Math.random() * 5

      return (
        <div
          key={i}
          className={`absolute pointer-events-none ${item.className}`}
          style={{
            top: `${top}vh`,
            left: `${left}vw`,
            fontSize: `${size}rem`,
            animationDelay: `${delay}s`,
            zIndex: 0,
            opacity: 0.5,
            willChange: "transform", // Optimize for animations
          }}
        >
          {item.emoji}
        </div>
      )
    })
  }, [])

  useEffect(() => {
    // Set decorations only once on mount
    setDecorations(decorationItems)
  }, [decorationItems])

  return <div className="fixed inset-0 overflow-hidden pointer-events-none">{decorations}</div>
}
