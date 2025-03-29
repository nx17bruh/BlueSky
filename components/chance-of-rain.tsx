"use client"

import { Card } from "@/components/ui/card"
import { type ForecastData, getChanceOfRain } from "@/lib/weather-service"

interface ChanceOfRainProps {
  forecast: ForecastData
}

export default function ChanceOfRain({ forecast }: ChanceOfRainProps) {
  const rainData = getChanceOfRain(forecast)
  const hasRainChance = rainData.some((item) => item.value > 0)

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Chance of Rain</h2>

      {!hasRainChance ? (
        <div className="py-8 text-center">
          <p className="text-lg">There is a 0% chance of rain.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {rainData.map(({ time, value }) => (
              <div key={time} className="flex items-center gap-2">
                <div className="w-16 text-sm text-gray-500 dark:text-gray-400">{time}</div>
                <div className="flex-1">
                  <div
                    className="h-2 bg-blue-200 dark:bg-blue-900 rounded"
                    style={{
                      width: `${value}%`,
                      backgroundColor:
                        value > 70 ? "var(--color-primary, #1a1b4b)" : "var(--color-primary-light, #e0e7ff)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Sunny</span>
            <span>Rainy</span>
            <span>Heavy Rain</span>
          </div>
        </>
      )}
    </Card>
  )
}

