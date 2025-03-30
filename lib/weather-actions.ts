"use server"

// Server-side only code
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

// Import types from a shared types file
import type { WeatherData, ForecastData, LocationData } from "@/lib/weather-types"

export async function fetchCurrentWeather(lat: number, lon: number, units = "metric"): Promise<WeatherData> {
  console.log(`Fetching current weather for lat: ${lat}, lon: ${lon}, units: ${units}`)

  try {
    const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Weather API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching current weather:", error)
    throw new Error("Failed to fetch weather data. Please try again.")
  }
}

export async function fetchForecast(lat: number, lon: number, units = "metric"): Promise<ForecastData> {
  console.log(`Fetching forecast for lat: ${lat}, lon: ${lon}, units: ${units}`)

  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Forecast API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to fetch forecast data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching forecast:", error)
    throw new Error("Failed to fetch forecast data. Please try again.")
  }
}

export async function fetchLocations(query: string): Promise<LocationData[]> {
  console.log(`Searching locations for query: ${query}`)

  try {
    const response = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Locations API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to search locations: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error searching locations:", error)
    throw new Error("Failed to search locations. Please try again.")
  }
}

export async function fetchLocationByCoords(lat: number, lon: number): Promise<LocationData[]> {
  console.log(`Fetching location for lat: ${lat}, lon: ${lon}`)

  try {
    const response = await fetch(`${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Reverse geocoding API error (${response.status}): ${errorText}`)
      throw new Error(`Failed to get location: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error getting location by coords:", error)
    throw new Error("Failed to get location. Please try again.")
  }
}

