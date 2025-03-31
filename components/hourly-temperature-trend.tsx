"use client"

import { useEffect, useRef } from "react"
import type { ForecastData } from "@/lib/weather-service"

interface HourlyTemperatureTrendProps {
  forecast: ForecastData
  units: "metric" | "imperial"
}

export default function HourlyTemperatureTrend({ forecast, units }: HourlyTemperatureTrendProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tempUnit = units === "metric" ? "°C" : "°F"

  // Get the next 8 hours of forecast data
  const hourlyData = forecast.list.slice(0, 8).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "2-digit", hour12: true }),
    temp: Math.round(item.main.temp),
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 30

    // Find min and max temperatures
    const temps = hourlyData.map((item) => item.temp)
    const minTemp = Math.min(...temps) - 2
    const maxTemp = Math.max(...temps) + 2
    const tempRange = maxTemp - minTemp

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 0.5
    ctx.beginPath()
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height - 2 * padding) * (i / 4)
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
    }
    ctx.stroke()

    // Draw temperature line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 3
    ctx.beginPath()
    hourlyData.forEach((item, index) => {
      const x = padding + (width - 2 * padding) * (index / (hourlyData.length - 1))
      const normalizedTemp = (item.temp - minTemp) / tempRange
      const y = height - padding - normalizedTemp * (height - 2 * padding)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points and labels
    hourlyData.forEach((item, index) => {
      const x = padding + (width - 2 * padding) * (index / (hourlyData.length - 1))
      const normalizedTemp = (item.temp - minTemp) / tempRange
      const y = height - padding - normalizedTemp * (height - 2 * padding)

      // Draw point
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw temperature label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${item.temp}${tempUnit}`, x, y - 10)

      // Draw time label
      ctx.fillText(item.time, x, height - 10)
    })
  }, [hourlyData, tempUnit])

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-medium mb-2">Hourly Temperature Trend</h3>
      <div className="relative h-[200px] w-full">
        <canvas ref={canvasRef} width={500} height={200} className="w-full h-full" />
      </div>
    </div>
  )
}

