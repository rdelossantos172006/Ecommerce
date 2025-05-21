"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect } from "react"

export function SeasonalDecorations() {
  const { theme } = useTheme()
  
  // Add animation keyframes
  useEffect(() => {
    const keyframes = `
      @keyframes fall {
        0% { transform: translateY(0) rotate(0); }
        100% { transform: translateY(100vh) rotate(360deg); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0); }
        50% { transform: translateY(-20px) rotate(10deg); }
      }
    `;
    
    // Check if style already exists to avoid duplicates
    const styleId = 'seasonal-animations';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
    
    return () => {
      // Cleanup when component unmounts
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  
  // Render different decorations based on the selected theme
  switch (theme) {
    case "christmas":
      return <ChristmasDecorations />
    case "valentine":
      return <ValentineDecorations />
    case "allsaints":
      return <AllSaintsDecorations />
    default:
      return null
  }
}

// Christmas decoration component
function ChristmasDecorations() {
  return (
    <div className="christmas-decorations fixed inset-0 pointer-events-none z-0">
      {/* Christmas tree in bottom right */}
      <div className="absolute right-4 bottom-0" style={{ width: '120px', height: '170px' }}>
        <div className="absolute w-5 h-20 bg-[#5E3B1B] left-1/2 bottom-0 transform -translate-x-1/2"></div>
        <div className="absolute w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[40px] border-b-[#165B33] left-1/2 bottom-[80px] transform -translate-x-1/2"></div>
        <div className="absolute w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[60px] border-b-[#165B33] left-1/2 bottom-[50px] transform -translate-x-1/2"></div>
        <div className="absolute w-0 h-0 border-l-[80px] border-l-transparent border-r-[80px] border-r-transparent border-b-[80px] border-b-[#165B33] left-1/2 bottom-[20px] transform -translate-x-1/2"></div>
        {/* Decorations */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-3 w-3 rounded-full bg-[#BB2528] animate-pulse"
            style={{
              left: `${Math.random() * 100}px`,
              bottom: `${20 + Math.random() * 130}px`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>
      
      {/* Snow at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ height: '100vh' }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-70"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animation: `fall ${Math.random() * 10 + 5}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Valentine's decorations component
function ValentineDecorations() {
  return (
    <div className="valentine-decorations fixed inset-0 pointer-events-none z-0">
      {/* Floating hearts */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6 - Math.random() * 0.4,
            transform: `scale(${0.5 + Math.random() * 0.5})`,
            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M15 25C15 25 25 18 25 10C25 5 21 1 16 1C13 1 15 6 15 6C15 6 17 1 14 1C9 1 5 5 5 10C5 18 15 25 15 25Z" 
              fill={`rgba(219, 39, 119, ${0.1 + Math.random() * 0.3})`} 
            />
          </svg>
        </div>
      ))}
      
      {/* Bottom decorative border */}
      <div className="absolute bottom-0 left-0 w-full h-24 opacity-30" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 45C30 45 45 35 45 25C45 15 35 15 30 25C25 15 15 15 15 25C15 35 30 45 30 45Z' fill='%23DB2777' /%3E%3C/svg%3E")`,
             backgroundSize: '60px 60px',
             backgroundRepeat: 'repeat-x',
             backgroundPosition: 'bottom'
           }}>
      </div>
    </div>
  )
}

// All Saints Day decorations
function AllSaintsDecorations() {
  return (
    <div className="allsaints-decorations fixed inset-0 pointer-events-none z-0">
      {/* Floating candles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '10px',
            opacity: 0.4 + Math.random() * 0.3,
          }}
        >
          <div className="flex flex-col items-center">
            <div className="w-2 h-8 bg-[#E38C2D] rounded-sm"></div>
            <div className="w-6 h-6 bg-[#fde68a] rounded-full animate-pulse blur-sm" 
                 style={{ 
                   animationDuration: `${1 + Math.random() * 2}s`,
                   opacity: 0.6 + Math.random() * 0.4
                 }}></div>
          </div>
        </div>
      ))}
      
      {/* Sparse floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i + 100}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: `rgba(227, 140, 45, ${0.1 + Math.random() * 0.2})`,
            animation: `float ${10 + Math.random() * 20}s linear infinite`,
            animationDelay: `${Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  )
} 