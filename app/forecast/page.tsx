"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Bell,
  MapPin,
  Loader2,
  RefreshCw,
  Wind,
  Droplets,
  Calendar,
  Map,
  Thermometer,
  Sun,
  Droplet,
  Moon,
  Eye,
} from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import WeatherCard from "@/components/weather-card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentWeather, getForecast, type WeatherData, type ForecastData } from "@/lib/weather-service"
import { Logo } from "@/components/logo"
import { Modern3DBox } from "@/components/modern-3d-box"
import Forecast from "@/components/forecast"
import ChanceOfRain from "@/components/chance-of-rain"
import { UserProfile } from "@/components/user-profile"
import HourlyTemperatureTrend from "@/components/hourly-temperature-trend"

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
      console.log(`Fetching weather data for lat: ${lat}, lon: ${lon}, units: ${units}`)

      const [weather, forecastData] = await Promise.all([
        getCurrentWeather(lat, lon, units),
        getForecast(lat, lon, units),
      ])

      console.log("Weather data fetched successfully")
      setCurrentWeather(weather)
      setForecast(forecastData)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      setError("Failed to fetch weather data. Please try again.")
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

  // Simulate additional weather data that might not be directly available from the API
  const getSimulatedData = () => {
    if (!currentWeather) return null

    // These are simulated values based on existing data
    return {
      feelsLike: currentWeather.main.feels_like,
      aqi: Math.floor(Math.random() * 5) + 1, // 1-5 scale (1: Good, 5: Very Poor)
      uvIndex: Math.floor(Math.random() * 11) + 1, // 1-11+ scale
      dewPoint: currentWeather.main.temp - (100 - currentWeather.main.humidity) / 5,
      moonPhase: [
        "New Moon",
        "Waxing Crescent",
        "First Quarter",
        "Waxing Gibbous",
        "Full Moon",
        "Waning Gibbous",
        "Last Quarter",
        "Waning Crescent",
      ][Math.floor(Math.random() * 8)],
      visibility: currentWeather.visibility / 1000, // Convert from meters to kilometers
    }
  }

  const simulatedData = getSimulatedData()

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
            <UserProfile />
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

            {/* Hourly Temperature Trend - 6 columns */}
            <div className="lg:col-span-6">
              {forecast && (
                <Modern3DBox className="h-full" gradient>
                  <HourlyTemperatureTrend forecast={forecast} units={units} />
                </Modern3DBox>
              )}
            </div>

            {/* New Weather Metrics - 2 columns each */}
            {simulatedData && (
              <>
                {/* Feels Like Temperature */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Feels Like" icon={<Thermometer className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {Math.round(simulatedData.feelsLike)}
                        {units === "metric" ? "°C" : "°F"}
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Air Quality Index */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Air Quality" icon={<Wind className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-center">
                        <div className="text-4xl font-light text-blue-600 dark:text-blue-400">{simulatedData.aqi}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {simulatedData.aqi <= 2 ? "Good" : simulatedData.aqi <= 3 ? "Moderate" : "Poor"}
                        </div>
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* UV Index */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="UV Index" icon={<Sun className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-center">
                        <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                          {simulatedData.uvIndex}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {simulatedData.uvIndex <= 2
                            ? "Low"
                            : simulatedData.uvIndex <= 5
                              ? "Moderate"
                              : simulatedData.uvIndex <= 7
                                ? "High"
                                : "Very High"}
                        </div>
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Dew Point */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Dew Point" icon={<Droplet className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {Math.round(simulatedData.dewPoint)}
                        {units === "metric" ? "°C" : "°F"}
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Moon Phase */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Moon Phase" icon={<Moon className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-center">
                        <div className="text-xl font-light text-blue-600 dark:text-blue-400">
                          {simulatedData.moonPhase}
                        </div>
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Visibility */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Visibility" icon={<Eye className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {simulatedData.visibility.toFixed(1)}
                        {units === "metric" ? " km" : " mi"}
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Humidity */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Humidity" icon={<Droplets className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {currentWeather.main.humidity}%
                      </div>
                    </div>
                  </Modern3DBox>
                </div>

                {/* Wind */}
                <div className="lg:col-span-2">
                  <Modern3DBox title="Wind" icon={<Wind className="w-5 h-5" />} gradient>
                    <div className="flex items-center justify-center h-24">
                      <div className="text-4xl font-light text-blue-600 dark:text-blue-400">
                        {Math.round(currentWeather.wind.speed)} {units === "metric" ? "km/h" : "mph"}
                      </div>
                    </div>
                  </Modern3DBox>
                </div>
              </>
            )}

            {/* Chance of Rain - 6 columns */}
            <div className="lg:col-span-6">
              {forecast && (
                <Modern3DBox className="h-full" gradient>
                  <ChanceOfRain forecast={forecast} />
                </Modern3DBox>
              )}
            </div>

            {/* 3 Day Forecast - 6 columns */}
            <div className="lg:col-span-6">
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









