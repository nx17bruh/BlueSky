"use client"

import { useState } from "react"
import { useColorContext } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Paintbrush } from "lucide-react"

const presetColors = [
  { name: "Blue", value: "#1a1b4b" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
]

export function ColorPickerDropdown() {
  const { headerColor, setHeaderColor } = useColorContext()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          style={{ backgroundColor: headerColor }}
        >
          <Paintbrush className="w-4 h-4 text-white" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Header Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <div className="grid grid-cols-5 gap-2 mb-2">
            {presetColors.map((color) => (
              <button
                key={color.value}
                className="h-8 rounded-md cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  setHeaderColor(color.value)
                  setOpen(false)
                }}
                title={color.name}
              />
            ))}
          </div>
          <input
            type="color"
            value={headerColor}
            onChange={(e) => setHeaderColor(e.target.value)}
            className="w-full h-8 cursor-pointer rounded-md"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setHeaderColor("#1a1b4b")
            setOpen(false)
          }}
        >
          Reset to Default
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

