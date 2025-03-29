"use client"

import { useRouter } from "next/navigation"
import { Bell, User } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import { useState } from "react"
import { searchLocations, type LocationData } from "@/lib/weather-service"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { ColorPickerDropdown } from "@/components/color-picker-dropdown"
import { ModernSearchBox } from "@/components/modern-search-box"
import { CityCard } from "@/components/city-card"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<LocationData[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setSearchLoading(true)

    try {
      const results = await searchLocations(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching locations:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleLocationSelect = (location: LocationData) => {
    router.push(
      `/forecast?lat=${location.lat}&lon=${location.lon}&name=${location.name}&country=${location.country}${location.state ? `&state=${location.state}` : ""}`,
    )
  }

  const popularCities = [
    { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
    { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
    { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
    { name: "Mumbai", country: "IN", lat: 19.076, lon: 72.8777 },
    { name: "Ahmedabad", country: "IN", lat: 23.0225, lon: 72.5714 },
    { name: "Hyderabad", country: "IN", lat: 17.385, lon: 78.4867 },
  ]

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center">
            <MobileNav />
            <Logo />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <ColorPickerDropdown />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 md:mt-12 px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Check the Weather, Anytime, Anywhere!
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get accurate weather forecasts for any location around the world
            </p>
          </motion.div>

          <div className="mb-12">
            <ModernSearchBox
              onSearch={handleSearch}
              onSelect={handleLocationSelect}
              searchResults={searchResults}
              isLoading={searchLoading}
              placeholder="Search for a city, country, or coordinates..."
            />
          </div>

          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium mb-6 text-center">Popular Cities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCities.map((city, index) => (
                <CityCard
                  key={`${city.name}-${city.country}`}
                  city={city as LocationData}
                  onSelect={handleLocationSelect}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

