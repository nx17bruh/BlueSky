"use client"

import { Card } from "@/components/ui/card"
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning } from "lucide-react"
import { type ForecastData, getDailyForecast } from "@/lib/weather-service"
import { useColorContext } from "@/components/theme-provider"
import { useState, useEffect } from "react"

interface ForecastProps {
  forecast: ForecastData
  units: "metric" | "imperial"
}

const getWeatherIconComponent = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "thunderstorm":
      return CloudLightning
    case "drizzle":
    case "rain":
      return CloudRain
    case "snow":
      return CloudSnow
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
      return CloudFog
    case "clear":
      return Sun
    case "clouds":
    default:
      return Cloud
  }
}

const getWeatherConditionText = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "thunderstorm":
      return "Thunderstorm"
    case "drizzle":
      return "Drizzle"
    case "rain":
      return "Rainy"
    case "snow":
      return "Snowfall"
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
      return "Foggy"
    case "clear":
      return "Clear"
    case "clouds":
      return "Cloudy"
    default:
      return condition
  }
}

export default function Forecast({ forecast, units }: ForecastProps) {
  const forecastData = getDailyForecast(forecast)
  const tempUnit = units === "metric" ? "°" : "°"
  const { headerColor } = useColorContext()
  const [cardColor, setCardColor] = useState("rgba(138, 143, 234, 0.2)")

  // Calculate a lighter version of the header color for the cards
  useEffect(() => {
    // Convert hex to RGB and create a lighter version with opacity
    const hexToRgba = (hex: string, opacity: number) => {
      // Remove # if present
      hex = hex.replace("#", "")

      // Parse the hex values
      const r = Number.parseInt(hex.substring(0, 2), 16)
      const g = Number.parseInt(hex.substring(2, 4), 16)
      const b = Number.parseInt(hex.substring(4, 6), 16)

      // Return rgba string
      return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    setCardColor(hexToRgba(headerColor, 0.2))
  }, [headerColor])

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">3 Days Forecast</h2>
      <div className="space-y-4">
        {forecastData.map((day, index) => {
          const Icon = getWeatherIconComponent(day.condition)
          const conditionText = getWeatherConditionText(day.condition)

          // Alternate layout based on index
          const isEven = index % 2 === 0

          return (
            <div
              key={`${day.day}-${day.condition}`}
              className={`flex items-center rounded-lg overflow-hidden ${isEven ? "flex-row" : "flex-row-reverse"}`}
              style={{ backgroundColor: cardColor }}
            >
              <div className={`flex-1 p-4 flex ${isEven ? "justify-start" : "justify-end"}`}>
                <div className={`flex items-center gap-2 ${isEven ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`flex flex-col ${isEven ? "items-start" : "items-end"}`}>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-medium">
                        ↑ {day.high}
                        {tempUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-medium">
                        ↓ {day.low}
                        {tempUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`flex-1 p-4 flex ${isEven ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-center gap-3 ${isEven ? "flex-row-reverse" : "flex-row"}`}>
                  <Icon className="w-10 h-10 text-gray-600 dark:text-gray-300" />
                  <div className={`flex flex-col ${isEven ? "items-end" : "items-start"}`}>
                    <div className="font-medium">{day.day}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{conditionText}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

