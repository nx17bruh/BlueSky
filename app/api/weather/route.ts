import { type NextRequest, NextResponse } from "next/server"
import { fetchCurrentWeather, fetchForecast, fetchLocations, fetchLocationByCoords } from "@/lib/weather-actions"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 })
  }

  try {
    let result

    if (endpoint === "weather") {
      const lat = Number.parseFloat(searchParams.get("lat") || "0")
      const lon = Number.parseFloat(searchParams.get("lon") || "0")
      const units = searchParams.get("units") || "metric"

      result = await fetchCurrentWeather(lat, lon, units)
    } else if (endpoint === "forecast") {
      const lat = Number.parseFloat(searchParams.get("lat") || "0")
      const lon = Number.parseFloat(searchParams.get("lon") || "0")
      const units = searchParams.get("units") || "metric"

      result = await fetchForecast(lat, lon, units)
    } else if (endpoint === "direct") {
      const query = searchParams.get("q") || ""

      result = await fetchLocations(query)
    } else if (endpoint === "reverse") {
      const lat = Number.parseFloat(searchParams.get("lat") || "0")
      const lon = Number.parseFloat(searchParams.get("lon") || "0")

      result = await fetchLocationByCoords(lat, lon)
    } else {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

