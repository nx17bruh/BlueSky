"use client"

import { useState, useEffect } from "react"
import { Bell, User, Loader2, MapPin, Navigation } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { getLocationByCoords } from "@/lib/weather-service"
import { Logo } from "@/components/logo"
import { ColorPickerDropdown } from "@/components/color-picker-dropdown"
import { Modern3DBox } from "@/components/modern-3d-box"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  ),
})

export default function LocationsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lon: number
    name?: string
    country?: string
  } | null>(null)
  const [mapKey, setMapKey] = useState(Date.now())
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Force re-render of map component when page is loaded
  useEffect(() => {
    setMapKey(Date.now())

    // Add a class to the body to ensure full height
    document.body.classList.add("h-full")

    return () => {
      document.body.classList.remove("h-full")
    }
  }, [])

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleMapClick(latitude, longitude)
        },
        (error) => {
          console.error("Error getting user location:", error)
          setIsLoading(false)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser")
    }
  }

  const handleMapClick = async (lat: number, lon: number) => {
    setIsLoading(true)
    setSelectedLocation({ lat, lon })

    try {
      const locations = await getLocationByCoords(lat, lon)

      if (locations.length > 0) {
        const { name, country, state } = locations[0]
        setSelectedLocation((prev) => ({ ...prev!, name, country }))

        // Navigate to forecast page after a short delay
        setTimeout(() => {
          router.push(
            `/forecast?lat=${lat}&lon=${lon}&name=${name}&country=${country}${state ? `&state=${state}` : ""}`,
          )
        }, 1000)
      } else {
        // If no location found, just use the coordinates
        setTimeout(() => {
          router.push(`/forecast?lat=${lat}&lon=${lon}&name=Unknown&country=Location`)
        }, 1000)
      }
    } catch (error) {
      console.error("Error getting location:", error)
      // If error, just use the coordinates
      setTimeout(() => {
        router.push(`/forecast?lat=${lat}&lon=${lon}&name=Unknown&country=Location`)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

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

        <Modern3DBox
          className="max-w-4xl mx-auto"
          title="World Weather Map"
          icon={<MapPin className="w-5 h-5" />}
          gradient
        >
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              Click anywhere on the map to check the weather at that location
            </p>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={getUserLocation}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
              My Location
            </Button>
          </div>

          <div className="relative">
            <MapComponent key={mapKey} onLocationSelect={handleMapClick} />

            {isLoading && selectedLocation && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                  <p>Loading weather for {selectedLocation?.name || "selected location"}...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            You can zoom in/out and pan the map to find specific locations
          </div>
        </Modern3DBox>
      </main>
    </div>
  )
}

