"use client"

import { useEffect, useState, useMemo } from "react"

type Snowflake = {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
}

export function SnowAnimation() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  // Generate snowflakes only once with useMemo
  const initialSnowflakes = useMemo(() => {
    // Reduce the number of snowflakes for better performance
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    }))
  }, [])

  useEffect(() => {
    setSnowflakes(initialSnowflakes)

    // Use requestAnimationFrame for smoother animation
    let animationFrameId: number
    let lastTime = 0
    const fps = 30 // Limit to 30fps for better performance
    const interval = 1000 / fps

    const moveSnowflakes = (timestamp: number) => {
      // Throttle the animation to the target FPS
      if (timestamp - lastTime < interval) {
        animationFrameId = requestAnimationFrame(moveSnowflakes)
        return
      }

      lastTime = timestamp

      setSnowflakes((prevSnowflakes) =>
        prevSnowflakes.map((flake) => {
          // Move snowflake down and slightly to the side
          let newY = flake.y + flake.speed * 0.1
          let newX = flake.x + Math.sin(newY / 10) * 0.5
          let newRotation = flake.rotation + flake.rotationSpeed

          // Reset position if snowflake goes off screen
          if (newY > 100) {
            newY = -5
            newX = Math.random() * 100
          }

          if (newX < 0) newX = 100
          if (newX > 100) newX = 0

          if (newRotation > 360) newRotation -= 360
          if (newRotation < 0) newRotation += 360

          return {
            ...flake,
            x: newX,
            y: newY,
            rotation: newRotation,
          }
        }),
      )

      animationFrameId = requestAnimationFrame(moveSnowflakes)
    }

    animationFrameId = requestAnimationFrame(moveSnowflakes)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [initialSnowflakes])

  // Render fewer snowflakes for better performance
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          style={{
            position: "fixed",
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: flake.opacity,
            pointerEvents: "none",
            transform: `rotate(${flake.rotation}deg)`,
            boxShadow: "0 0 2px rgba(255, 255, 255, 0.8)",
            zIndex: 0,
            willChange: "transform", // Optimize for animations
          }}
        />
      ))}
    </div>
  )
}
