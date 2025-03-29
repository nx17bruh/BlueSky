"use client"

import type React from "react"

import { useState, useRef } from "react"
import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import type { LocationData } from "@/lib/weather-service"

interface CityCardProps {
  city: LocationData
  onSelect: (location: LocationData) => void
}

export function CityCard({ city, onSelect }: CityCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })
  }

  // Reset mouse position when mouse leaves
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  // Calculate 3D transform based on mouse position
  const calculateTransform = () => {
    if (!cardRef.current || !isHovered) return "perspective(1000px) rotateX(0deg) rotateY(0deg)"

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (limited to small angles)
    const rotateY = ((mousePosition.x - centerX) / centerX) * 5
    const rotateX = ((centerY - mousePosition.y) / centerY) * 5

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(city)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="
          h-full rounded-xl overflow-hidden
          bg-gradient-to-r from-white/80 to-white/50
          dark:from-gray-800/80 dark:to-gray-900/50
          border border-gray-200 dark:border-gray-700
          backdrop-blur-sm p-5
          transition-all duration-300
        "
        style={{
          transform: calculateTransform(),
          transition: "transform 0.1s ease-out",
          boxShadow: isHovered
            ? "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px rgba(59, 130, 246, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-lg">{city.name}</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{city.country}</span>
        </div>

        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {city.lat.toFixed(2)}°N, {city.lon.toFixed(2)}°E
        </div>

        <motion.div
          className="
            absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
            from-blue-400 to-purple-500 rounded-b-xl
          "
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  )
}

