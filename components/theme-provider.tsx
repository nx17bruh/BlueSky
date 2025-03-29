"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Ensure we only render theme components on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Create a context for the header color
type ColorContextType = {
  headerColor: string
  setHeaderColor: (color: string) => void
}

export const ColorContext = createContext<ColorContextType>({
  headerColor: "#1a1b4b",
  setHeaderColor: () => {},
})

export const useColorContext = () => useContext(ColorContext)

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [headerColor, setHeaderColor] = useState("#1a1b4b")

  return <ColorContext.Provider value={{ headerColor, setHeaderColor }}>{children}</ColorContext.Provider>
}

