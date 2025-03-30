import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "20a7e53aedb50ad0125f8e9c3b25d234";
const BASE_URL = "https://api.openweathermap.org/data/2.5"
const GEO_URL = "https://api.openweathermap.org/geo/1.0"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")

  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint parameter" }, { status: 400 })
  }

  try {
    let url = ""

    if (endpoint === "weather") {
      const lat = searchParams.get("lat")
      const lon = searchParams.get("lon")
      const units = searchParams.get("units") || "metric"

      url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    } else if (endpoint === "forecast") {
      const lat = searchParams.get("lat")
      const lon = searchParams.get("lon")
      const units = searchParams.get("units") || "metric"

      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    } else if (endpoint === "direct") {
      const query = searchParams.get("q")

      url = `${GEO_URL}/direct?q=${encodeURIComponent(query || "")}&limit=5&appid=${API_KEY}`
    } else if (endpoint === "reverse") {
      const lat = searchParams.get("lat")
      const lon = searchParams.get("lon")

      url = `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    } else {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
    }

    console.log(`Fetching from: ${url.replace(API_KEY || "", "API_KEY")}`)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API error (${response.status}): ${errorText}`)
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in weather API route:", error)
    return NextResponse.json({ error: "Failed to fetch data. Please try again." }, { status: 500 })
  }
}



