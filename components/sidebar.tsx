"use client"

import type React from "react"

import { Home, BarChart2, Map, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useColorContext } from "@/components/theme-provider"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart2, label: "Forecast", href: "/forecast" },
  { icon: Map, label: "Locations", href: "/locations" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { headerColor } = useColorContext()

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <div
      className="w-64 text-white p-6 hidden md:block dark:bg-gray-900 transition-colors duration-200"
      style={{ backgroundColor: headerColor }}
    >
      <div className="space-y-6">
        {menuItems.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            onClick={(e) => handleNavigation(e, href)}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-lg transition-colors",
              pathname === href ? "bg-white/10" : "hover:bg-white/5",
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

