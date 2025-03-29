"use client"

import { Card } from "@/components/ui/card"
import type { WeatherData } from "@/lib/weather-service"
import { getWeatherIcon } from "@/lib/weather-service"
import { Cloud, CloudRain, Sun, CloudSnow, CloudFog, CloudLightning } from "lucide-react"

interface WeatherCardProps {
  weather: WeatherData
  units: "metric" | "imperial"
}

const getWeatherBackground = (weatherId: number) => {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) {
    return "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop"
  } else if (weatherId >= 300 && weatherId < 400) {
    return "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=2070&auto=format&fit=crop"
  } else if (weatherId >= 500 && weatherId < 600) {
    return "https://images.unsplash.com/photo-1519692933481-e162a57d6721?q=80&w=2070&auto=format&fit=crop"
  } else if (weatherId >= 600 && weatherId < 700) {
    return "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?q=80&w=2070&auto=format&fit=crop"
  } else if (weatherId >= 700 && weatherId < 800) {
    return "https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?q=80&w=2093&auto=format&fit=crop"
  } else if (weatherId === 800) {
    return "https://images.unsplash.com/photo-1553901753-215db344677a?q=80&w=2071&auto=format&fit=crop"
  } else {
    return "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2051&auto=format&fit=crop"
  }
}

const getWeatherIcon2 = (weatherId: number) => {
  if (weatherId >= 200 && weatherId < 300) {
    return CloudLightning
  } else if (weatherId >= 300 && weatherId < 600) {
    return CloudRain
  } else if (weatherId >= 600 && weatherId < 700) {
    return CloudSnow
  } else if (weatherId >= 700 && weatherId < 800) {
    return CloudFog
  } else if (weatherId === 800) {
    return Sun
  } else {
    return Cloud
  }
}

export default function WeatherCard({ weather, units }: WeatherCardProps) {
  const WeatherIcon = getWeatherIcon2(weather.weather[0].id)
  const backgroundImage = getWeatherBackground(weather.weather[0].id)
  const tempUnit = units === "metric" ? "°C" : "°F"

  // Get the current time in the location's timezone
  const localTime = new Date()
  // Adjust for the location's timezone offset (in seconds)
  localTime.setTime(localTime.getTime() + weather.timezone * 1000 + localTime.getTimezoneOffset() * 60 * 1000)

  const formattedLocalTime = localTime.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <Card className="relative overflow-hidden">
      <img
        src={backgroundImage || "/placeholder.svg"}
        alt={weather.weather[0].description}
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-black/30 p-6 flex flex-col justify-between text-white">
        <div className="flex items-center gap-2">
          <WeatherIcon className="w-6 h-6" />
          <span className="text-5xl font-light">
            {Math.round(weather.main.temp)}
            {tempUnit}
          </span>
        </div>
        <div>
          <div className="text-sm opacity-80">Local Time: {formattedLocalTime}</div>
          <div className="flex items-center gap-2">
            <img
              src={getWeatherIcon(weather.weather[0].icon) || "/placeholder.svg"}
              alt={weather.weather[0].description}
              className="w-8 h-8"
            />
            <span className="capitalize">{weather.weather[0].description}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

