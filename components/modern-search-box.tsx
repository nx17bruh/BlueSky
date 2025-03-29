"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin, Search, Loader2, X } from "lucide-react"
import type { LocationData } from "@/lib/weather-service"
import { motion } from "framer-motion"

interface ModernSearchBoxProps {
  onSearch: (query: string) => Promise<void>
  onSelect: (location: LocationData) => void
  searchResults: LocationData[]
  isLoading: boolean
  placeholder?: string
}

export function ModernSearchBox({
  onSearch,
  onSelect,
  searchResults,
  isLoading,
  placeholder = "Search for a city or country...",
}: ModernSearchBoxProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const boxRef = useRef<HTMLDivElement>(null)

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!boxRef.current) return

    const rect = boxRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  // Reset mouse position when mouse leaves
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  // Clear search input
  const clearSearch = () => {
    setQuery("")
  }

  // Calculate 3D transform based on mouse position
  const calculateTransform = () => {
    if (!boxRef.current || !isFocused) return "perspective(1000px) rotateX(0deg) rotateY(0deg)"

    const rect = boxRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (limited to small angles)
    const rotateY = ((mousePosition.x - centerX) / centerX) * 2
    const rotateX = ((centerY - mousePosition.y) / centerY) * 2

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  return (
    <div
      className="relative w-full max-w-2xl mx-auto"
      ref={boxRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`
          relative rounded-xl overflow-hidden backdrop-blur-sm
          ${
            isFocused
              ? "shadow-[0_0_15px_rgba(59,130,246,0.5)] dark:shadow-[0_0_15px_rgba(96,165,250,0.5)]"
              : "shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          }
          transition-all duration-300 ease-out
          bg-gradient-to-r from-white/80 to-white/50
          dark:from-gray-800/80 dark:to-gray-900/50
          border border-gray-200 dark:border-gray-700
        `}
        style={{
          transform: calculateTransform(),
          transition: "transform 0.1s ease-out",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-gray-400 dark:text-gray-500">
            <MapPin className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="
              w-full py-4 pl-12 pr-16 bg-transparent
              text-gray-800 dark:text-gray-200
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none text-base
            "
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-16 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="
              absolute right-3 rounded-lg p-2
              bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700
              text-white disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </form>
      </motion.div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <motion.div
          className="
            absolute z-10 w-full mt-2 rounded-xl overflow-hidden
            bg-white dark:bg-gray-800 shadow-lg
            border border-gray-200 dark:border-gray-700
            backdrop-blur-sm
          "
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={`${result.name}-${index}`}
                className="
                  w-full px-4 py-3 text-left flex items-center gap-3
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-150
                "
                onClick={() => onSelect(result)}
              >
                <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">
                  {result.name}, {result.state ? `${result.state}, ` : ""}
                  {result.country}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

