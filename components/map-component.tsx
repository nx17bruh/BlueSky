"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "next-themes"
import { Loader2 } from "lucide-react"

interface MapComponentProps {
  onLocationSelect: (lat: number, lon: number) => void
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const { theme } = useTheme()
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapInitialized, setIsMapInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const leafletLoadAttempts = useRef(0)

  // Function to load Leaflet scripts and CSS
  const loadLeaflet = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // Check if Leaflet is already loaded
      if (window.L) {
        resolve()
        return
      }

      // Load CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      link.crossOrigin = ""
      document.head.appendChild(link)

      // Load JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = ""
      script.async = true

      script.onload = () => {
        resolve()
      }

      script.onerror = () => {
        reject(new Error("Failed to load Leaflet script"))
      }

      document.head.appendChild(script)
    })
  }, [])

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.L) return

    // Clean up previous map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    try {
      // Initialize map
      const map = window.L.map(mapRef.current, {
        // Add some options to improve reliability
        preferCanvas: true,
        attributionControl: false,
        zoomControl: true,
        minZoom: 2,
        maxBoundsViscosity: 1.0,
      }).setView([20, 0], 2)

      // Set world bounds to prevent scrolling too far
      const bounds = window.L.latLngBounds(window.L.latLng(-90, -180), window.L.latLng(90, 180))
      map.setMaxBounds(bounds)

      mapInstanceRef.current = map

      // Always use the light theme for the map
      const tileLayer = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

      window.L.tileLayer(tileLayer, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      }).addTo(map)

      // Add click event handler
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        onLocationSelect(lat, lng)
      })

      // Add attribution control in a better position
      window.L.control
        .attribution({
          position: "bottomright",
        })
        .addTo(map)

      setIsMapInitialized(true)
      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Failed to initialize map. Please refresh the page.")
      setIsLoading(false)
    }
  }, [onLocationSelect])

  // Load Leaflet and initialize map
  useEffect(() => {
    let isMounted = true

    const setupMap = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await loadLeaflet()

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (isMounted) {
            initializeMap()
          }
        }, 100)
      } catch (error) {
        console.error("Error loading Leaflet:", error)

        // Retry loading if failed (up to 3 attempts)
        if (leafletLoadAttempts.current < 3) {
          leafletLoadAttempts.current += 1
          setTimeout(setupMap, 1000) // Wait 1 second before retrying
        } else {
          if (isMounted) {
            setError("Failed to load map. Please refresh the page.")
            setIsLoading(false)
          }
        }
      }
    }

    setupMap()

    // Cleanup function
    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [loadLeaflet, initializeMap])

  // We don't need to update the tile layer when theme changes anymore
  // since we're always using the light theme for the map

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
      {/* Map container */}
      <div
        ref={mapRef}
        className="h-full w-full"
        style={{
          position: "relative",
          visibility: isLoading || error ? "hidden" : "visible",
        }}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

