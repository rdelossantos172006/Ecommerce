"use client"

import { useTheme, type SeasonalTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Snowflake, Heart, Ghost, Palette } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  // Theme options with associated icons and names
  const themeOptions: { value: SeasonalTheme; icon: React.ReactNode; label: string; bgColor: string }[] = [
    {
      value: "default",
      icon: <Palette className="h-5 w-5" />,
      label: "Default",
      bgColor: "bg-primary/20",
    },
    {
      value: "christmas",
      icon: <Snowflake className="h-5 w-5 text-emerald-500" />,
      label: "Christmas",
      bgColor: "bg-emerald-100 dark:bg-emerald-950/40",
    },
    {
      value: "valentine",
      icon: <Heart className="h-5 w-5 text-pink-500" />,
      label: "Valentine's Day",
      bgColor: "bg-pink-100 dark:bg-pink-950/40",
    },
    {
      value: "allsaints",
      icon: <Ghost className="h-5 w-5 text-amber-500" />,
      label: "All Saints Day",
      bgColor: "bg-amber-100 dark:bg-amber-950/40",
    },
  ]

  // Find the current theme from options
  const currentTheme = themeOptions.find((t) => t.value === theme) || themeOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`h-9 w-9 rounded-full ${currentTheme.bgColor} transition-all duration-300`}
          aria-label={`Current theme: ${currentTheme.label}`}
        >
          {currentTheme.icon}
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 min-w-[180px]">
        <div className="grid grid-cols-2 gap-2">
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-20 rounded-lg gap-2 ${
                theme === option.value ? 'bg-muted border-2 border-primary' : ''
              } hover:bg-muted/80`}
              onClick={() => setTheme(option.value)}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${option.bgColor}`}>
                {option.icon}
              </div>
              <span className="text-xs font-medium">{option.label}</span>
            </Button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 