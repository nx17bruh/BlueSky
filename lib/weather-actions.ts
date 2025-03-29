"use server"

// Server-side only code
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

// Import types from a shared types file
import type { WeatherData, ForecastData, LocationData } from "@/lib/weather-types"

export async function fetchCurrentWeather(lat: number, lon: number, units = "metric"): Promise<WeatherData> {
  const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }

  return response.json()
}

export async function fetchForecast(lat: number, lon: number, units = "metric"): Promise<ForecastData> {
  const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data")
  }

  return response.json()
}

export async function fetchLocations(query: string): Promise<LocationData[]> {
  const response = await fetch(`${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error("Failed to search locations")
  }

  return response.json()
}

export async function fetchLocationByCoords(lat: number, lon: number): Promise<LocationData[]> {
  const response = await fetch(`${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)

  if (!response.ok) {
    throw new Error("Failed to get location")
  }

  return response.json()
}

