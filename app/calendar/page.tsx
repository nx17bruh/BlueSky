"use client"

import { useState } from "react"
import { Bell, User, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ColorPickerDropdown } from "@/components/color-picker-dropdown"
import { Modern3DBox } from "@/components/modern-3d-box"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const prevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const nextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Create calendar days array
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center">
            <MobileNav />
            <Logo />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <ColorPickerDropdown />
          </div>
        </div>

        <Modern3DBox
          className="max-w-3xl mx-auto"
          title="Weather Calendar"
          icon={<CalendarIcon className="w-5 h-5" />}
          gradient
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center font-medium py-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => (
              <div
                key={index}
                className={`
                  h-14 p-1 border border-gray-100 dark:border-gray-800 rounded-md
                  ${!day ? "bg-gray-50 dark:bg-gray-900/20" : ""}
                  ${
                    day && day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? "bg-blue-100 dark:bg-blue-900/20 font-bold"
                      : ""
                  }
                  transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/10
                `}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <span className="text-right p-1">{day}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            Click on a date to view or add weather events
          </div>
        </Modern3DBox>
      </main>
    </div>
  )
}

