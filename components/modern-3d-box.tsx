"use client"

import type React from "react"

import { useState, useRef, type ReactNode } from "react"
import { motion } from "framer-motion"

interface Modern3DBoxProps {
  children: ReactNode
  className?: string
  title?: string
  icon?: ReactNode
  gradient?: boolean
}

export function Modern3DBox({ children, className = "", title, icon, gradient = false }: Modern3DBoxProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const boxRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

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
    setIsHovered(false)
  }

  // Calculate 3D transform based on mouse position
  const calculateTransform = () => {
    if (!boxRef.current || !isHovered) return "perspective(1000px) rotateX(0deg) rotateY(0deg)"

    const rect = boxRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (limited to small angles)
    const rotateY = ((mousePosition.x - centerX) / centerX) * 3
    const rotateX = ((centerY - mousePosition.y) / centerY) * 3

    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  return (
    <motion.div
      ref={boxRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`
          h-full rounded-xl overflow-hidden
          ${
            gradient
              ? "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/70"
              : "bg-white/80 dark:bg-gray-800/80"
          }
          border border-gray-200 dark:border-gray-700
          backdrop-blur-sm p-4
          transition-all duration-300
        `}
        style={{
          transform: calculateTransform(),
          transition: "transform 0.1s ease-out",
          boxShadow: isHovered
            ? "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px rgba(59, 130, 246, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {(title || icon) && (
          <div className="flex items-center justify-between mb-3">
            {title && <h3 className="font-medium text-gray-700 dark:text-gray-300">{title}</h3>}
            {icon && <div className="text-blue-500 dark:text-blue-400">{icon}</div>}
          </div>
        )}

        {children}

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

