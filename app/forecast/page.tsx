"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Bell, User, MapPin, Loader2, RefreshCw, Wind, Droplets, Sunrise, Sunset, Calendar, Map } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import WeatherCard from "@/components/weather-card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentWeather, getForecast, type WeatherData, type ForecastData } from "@/lib/weather-service"
import { Logo } from "@/components/logo"
import { ColorPickerDropdown } from "@/components/color-picker-dropdown"
import { Modern3DBox } from "@/components/modern-3d-box"
import Forecast from "@/components/forecast"
import ChanceOfRain from "@/components/chance-of-rain"

export default function ForecastPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")
  const name = searchParams.get("name") || ""
  const country = searchParams.get("country") || ""
  const state = searchParams.get("state") || ""

  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<"metric" | "imperial">("metric")

  const fetchWeatherData = async () => {
    if (!lat || !lon) {
      router.push("/")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, units),
        getForecast(lat, lon, units),
      ])

      setCurrentWeather(weather)
      setForecast(forecastData)
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.")
      console.error("Error fetching weather data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"))
  }

  // Fetch weather data on initial load and when units change
  useEffect(() => {
    fetchWeatherData()

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [lat, lon, units])

  const locationDisplay = `${name}${state ? `, ${state}` : ""}, ${country}`

  // Calculate local sunrise and sunset times
  const getSunriseSunsetTimes = () => {
    if (!currentWeather) return { sunriseTime: "", sunsetTime: "" }

    const sunriseDate = new Date(currentWeather.sys.sunrise * 1000)
    const sunsetDate = new Date(currentWeather.sys.sunset * 1000)

    // Apply timezone offset
    const localSunriseTime = new Date(sunriseDate.getTime() + currentWeather.timezone * 1000)
    const localSunsetTime = new Date(sunsetDate.getTime() + currentWeather.timezone * 1000)

    const sunriseTime = localSunriseTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    const sunsetTime = localSunsetTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    return { sunriseTime, sunsetTime }
  }

  const handleViewOnMap = () => {
    router.push("/locations")
  }

  const handleAddToCalendar = () => {
    router.push("/calendar")
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {units === "metric" ? "°C" : "°F"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleUnits}>
                  Switch to {units === "metric" ? "Fahrenheit" : "Celsius"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={fetchWeatherData} title="Refresh weather data">
              <RefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Button>

            <ThemeToggle />
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <ColorPickerDropdown />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Current Location</div>
            <div className="text-lg font-medium">{locationDisplay}</div>
          </div>
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleViewOnMap}>
            <Map className="w-4 h-4" />
            View on Map
          </Button>

          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleAddToCalendar}>
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Main weather card - 6 columns */}
            <div className="lg:col-span-6">
              {currentWeather && <WeatherCard weather={currentWeather} units={units} />}
            </div>

            {/* Weather details - 6 columns */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {currentWeather && (
                <>
                  {/* Humidity */}
                  <Modern3DBox title="Humidity" icon={<Droplets className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {currentWeather.main.humidity}%
                      </div>
                    </div>
                  </Modern3DBox>

                  {/* Wind */}
                  <Modern3DBox title="Wind" icon={<Wind className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {Math.round(currentWeather.wind.speed)} {units === "metric" ? "km/h" : "mph"}
                      </div>
                    </div>
                  </Modern3DBox>

                  {/* Sunrise & Sunset */}
                  <Modern3DBox
                    title="Sunrise & Sunset"
                    icon={<Sunrise className="w-5 h-5" />}
                    className="col-span-2"
                    gradient
                  >
                    <div className="flex items-center justify-around">
                      <div className="flex flex-col items-center">
                        <Sunrise className="w-8 h-8 text-orange-400 mb-2" />
                        <div className="text-lg font-medium">{getSunriseSunsetTimes().sunriseTime}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Sunrise</div>
                      </div>

                      <div className="flex flex-col items-center">
                        <Sunset className="w-8 h-8 text-orange-600 mb-2" />
                        <div className="text-lg font-medium">{getSunriseSunsetTimes().sunsetTime}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Sunset</div>
                      </div>
                    </div>
                  </Modern3DBox>
                </>
              )}
            </div>

            {/* Precipitation - 4 columns */}
            <div className="lg:col-span-4">
              {currentWeather && (
                <Modern3DBox title="Precipitation" icon={<Droplets className="w-5 h-5" />} className="h-full" gradient>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                      {currentWeather.rain?.["1h"] || 0} {units === "metric" ? "mm" : "in"}
                    </div>
                  </div>
                </Modern3DBox>
              )}
            </div>

            {/* Chance of Rain - 8 columns */}
            <div className="lg:col-span-8">
              {forecast && (
                <Modern3DBox className="h-full" gradient>
                  <ChanceOfRain forecast={forecast} />
                </Modern3DBox>
              )}
            </div>

            {/* 3 Day Forecast - 12 columns (full width) */}
            <div className="lg:col-span-12">
              {forecast && (
                <Modern3DBox className="h-full" gradient>
                  <Forecast forecast={forecast} units={units} />
                </Modern3DBox>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

