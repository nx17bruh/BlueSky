// Import types
import type { WeatherData, ForecastData, LocationData } from "@/lib/weather-types"

// Import server actions
import { fetchCurrentWeather, fetchForecast, fetchLocations, fetchLocationByCoords } from "@/lib/weather-actions"

// Client-side utility functions and wrappers for server actions
export type { WeatherData, ForecastData, LocationData }

export async function getCurrentWeather(lat: number, lon: number, units = "metric"): Promise<WeatherData> {
  return fetchCurrentWeather(lat, lon, units)
}

export async function getForecast(lat: number, lon: number, units = "metric"): Promise<ForecastData> {
  return fetchForecast(lat, lon, units)
}

export async function searchLocations(query: string): Promise<LocationData[]> {
  return fetchLocations(query)
}

export async function getLocationByCoords(lat: number, lon: number): Promise<LocationData[]> {
  return fetchLocationByCoords(lat, lon)
}

export function getWeatherIcon(code: string): string {
  return `https://openweathermap.org/img/wn/${code}@2x.png`
}

export function formatTime(timestamp: number, timezone: number, format: "time" | "day" | "full" = "time"): string {
  const date = new Date((timestamp + timezone) * 1000)

  if (format === "time") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  } else if (format === "day") {
    return date.toLocaleDateString("en-US", { weekday: "long" })
  } else {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }
}

export function kelvinToCelsius(kelvin: number): number {
  return Math.round(kelvin - 273.15)
}

export function kelvinToFahrenheit(kelvin: number): number {
  return Math.round(((kelvin - 273.15) * 9) / 5 + 32)
}

export function getChanceOfRain(forecast: ForecastData): { time: string; value: number }[] {
  return forecast.list.slice(0, 7).map((item) => ({
    time: formatTime(item.dt, forecast.city.timezone, "time"),
    value: Math.round(item.pop * 100), // Convert probability to percentage
  }))
}

export function getDailyForecast(forecast: ForecastData): {
  day: string
  high: number
  low: number
  condition: string
  icon: string
  date: string
}[] {
  const dailyData: Record<
    string,
    {
      temps: number[]
      icons: string[]
      conditions: string[]
      date: string
    }
  > = {}

  // Group forecast data by day
  forecast.list.forEach((item) => {
    const date = new Date((item.dt + forecast.city.timezone) * 1000)
    const day = date.toISOString().split("T")[0]

    if (!dailyData[day]) {
      dailyData[day] = {
        temps: [],
        icons: [],
        conditions: [],
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }
    }

    dailyData[day].temps.push(item.main.temp)
    dailyData[day].icons.push(item.weather[0].icon)
    dailyData[day].conditions.push(item.weather[0].main)
  })

  // Convert to array and calculate high/low
  return Object.entries(dailyData)
    .slice(0, 3)
    .map(([dateStr, data]) => {
      const date = new Date(dateStr)
      const day = date.toLocaleDateString("en-US", { weekday: "long" })
      const high = Math.round(Math.max(...data.temps))
      const low = Math.round(Math.min(...data.temps))

      // Get the most common condition and icon
      const conditionCounts: Record<string, number> = {}
      const iconCounts: Record<string, number> = {}

      data.conditions.forEach((condition) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1
      })

      data.icons.forEach((icon) => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1
      })

      const condition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0]
      const icon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0]

      return { day, high, low, condition, icon, date: data.date }
    })
}

