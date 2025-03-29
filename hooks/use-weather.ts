"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getCurrentWeather,
  getForecast,
  searchLocations,
  getLocationByCoords,
  type WeatherData,
  type ForecastData,
  type LocationData,
} from "@/lib/weather-service"

export interface WeatherState {
  currentWeather: WeatherData | null
  forecast: ForecastData | null
  location: LocationData | null
  isLoading: boolean
  error: string | null
  units: "metric" | "imperial"
}

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    currentWeather: null,
    forecast: null,
    location: null,
    isLoading: true,
    error: null,
    units: "metric",
  })

  const [searchResults, setSearchResults] = useState<LocationData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

  const fetchWeatherData = useCallback(
    async (lat: number, lon: number) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const [weather, forecast] = await Promise.all([
          getCurrentWeather(lat, lon, state.units),
          getForecast(lat, lon, state.units),
        ])

        setState((prev) => ({
          ...prev,
          currentWeather: weather,
          forecast: forecast,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Failed to fetch weather data. Please try again.",
          isLoading: false,
        }))
        console.error("Error fetching weather data:", error)
      }
    },
    [state.units],
  )

  const setLocation = useCallback(
    async (location: LocationData) => {
      setState((prev) => ({
        ...prev,
        location,
        isLoading: true,
        error: null,
      }))

      await fetchWeatherData(location.lat, location.lon)
    },
    [fetchWeatherData],
  )

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)

    try {
      const results = await searchLocations(query)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching locations:", error)
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const getUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        isLoading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      const locations = await getLocationByCoords(latitude, longitude)

      if (locations.length > 0) {
        setState((prev) => ({ ...prev, location: locations[0] }))
        await fetchWeatherData(latitude, longitude)
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Failed to get your location. Please search manually.",
        isLoading: false,
      }))
      console.error("Error getting user location:", error)
    }
  }, [fetchWeatherData])

  const toggleUnits = useCallback(() => {
    setState((prev) => {
      const newUnits = prev.units === "metric" ? "imperial" : "metric"
      return { ...prev, units: newUnits }
    })

    if (state.location) {
      fetchWeatherData(state.location.lat, state.location.lon)
    }
  }, [state.location, fetchWeatherData])

  // Initialize with user's location
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  // Handle search query changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery)
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, searchLocation])

  return {
    ...state,
    searchResults,
    searchQuery,
    searchLoading,
    setSearchQuery,
    setLocation,
    getUserLocation,
    toggleUnits,
  }
}

