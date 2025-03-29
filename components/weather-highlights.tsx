"use client"

import { Card } from "@/components/ui/card"
import { Droplets, Wind, Sunrise, Sunset } from "lucide-react"
import type { WeatherData } from "@/lib/weather-service"

interface WeatherHighlightsProps {
  weather: WeatherData
  units: "metric" | "imperial"
}

export default function WeatherHighlights({ weather, units }: WeatherHighlightsProps) {
  const speedUnit = units === "metric" ? "km/h" : "mph"
  const precipValue = weather.rain?.["1h"] || 0
  const precipUnit = units === "metric" ? "mm" : "in"

  // Calculate local sunrise and sunset times based on the location's timezone
  const sunriseDate = new Date(weather.sys.sunrise * 1000)
  const sunsetDate = new Date(weather.sys.sunset * 1000)

  // Apply timezone offset (convert to local time of the location)
  const localSunriseTime = new Date(sunriseDate.getTime() + weather.timezone * 1000)
  const localSunsetTime = new Date(sunsetDate.getTime() + weather.timezone * 1000)

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

  const highlights = [
    {
      label: "Precipitation",
      value: `${precipValue} ${precipUnit}`,
      icon: Droplets,
    },
    {
      label: "Humidity",
      value: `${weather.main.humidity}%`,
      icon: Droplets,
    },
    {
      label: "Wind",
      value: `${Math.round(weather.wind.speed)} ${speedUnit}`,
      icon: Wind,
    },
    {
      label: "Sunrise & Sunset",
      value: `${sunriseTime} / ${sunsetTime}`,
      icon: Sunrise,
      secondIcon: Sunset,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Today's Highlights</h2>
      <div className="grid grid-cols-2 gap-4">
        {highlights.map(({ label, value, icon: Icon, secondIcon: SecondIcon }) => (
          <Card key={label} className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            <div className="mt-2 flex items-center gap-2">
              <Icon className="w-5 h-5 text-blue-600" />
              {SecondIcon && <SecondIcon className="w-5 h-5 text-orange-400" />}
              <span className="text-lg font-medium">{value}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

