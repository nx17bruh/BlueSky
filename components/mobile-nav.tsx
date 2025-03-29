"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useColorContext } from "@/components/theme-provider"
import { Home, BarChart2, Map, Calendar, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart2, label: "Forecast", href: "/forecast" },
  { icon: Map, label: "Locations", href: "/locations" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const { headerColor } = useColorContext()
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0" style={{ backgroundColor: headerColor }}>
        <div className="space-y-6 p-6 text-white">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <button
              key={label}
              onClick={() => handleNavigation(href)}
              className={cn(
                "flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left",
                pathname === href ? "bg-white/10" : "hover:bg-white/5",
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

