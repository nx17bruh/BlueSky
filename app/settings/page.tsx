"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Bell, User, Moon, Sun, Monitor, SettingsIcon, UserCircle } from "lucide-react"
import Sidebar from "@/components/sidebar"
import MobileNav from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useColorContext } from "@/components/theme-provider"
import { Logo } from "@/components/logo"
import { ColorPickerDropdown } from "@/components/color-picker-dropdown"
import { Modern3DBox } from "@/components/modern-3d-box"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { headerColor, setHeaderColor } = useColorContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [mounted, setMounted] = useState(false)

  // Ensure we only render theme components on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    setIsLoggedIn(true)
    setName("John Doe")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setName("")
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderColor(e.target.value)
  }

  if (!mounted) {
    return null
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

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Modern3DBox title="Account Settings" icon={<UserCircle className="w-5 h-5" />} gradient>
                {isLoggedIn ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input id="display-name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>

                    <Button onClick={handleLogout} variant="destructive">
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit">Log In</Button>
                  </form>
                )}
              </Modern3DBox>
            </TabsContent>

            <TabsContent value="appearance">
              <Modern3DBox title="Appearance Settings" icon={<SettingsIcon className="w-5 h-5" />} gradient>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-6 w-6" />
                        <span>Light</span>
                      </Button>

                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-6 w-6" />
                        <span>Dark</span>
                      </Button>

                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-6 w-6" />
                        <span>System</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Header Color</Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: headerColor }}
                      />
                      <Input type="color" value={headerColor} onChange={handleColorChange} className="w-16 h-10 p-1" />
                      <div className="flex-1">
                        <Input type="text" value={headerColor} onChange={handleColorChange} placeholder="#1a1b4b" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label>Preset Colors</Label>
                      <div className="grid grid-cols-5 gap-2 mt-2">
                        {[
                          "#1a1b4b", // Default blue
                          "#10b981", // Green
                          "#8b5cf6", // Purple
                          "#f97316", // Orange
                          "#ef4444", // Red
                        ].map((color) => (
                          <button
                            key={color}
                            className="h-10 rounded-md cursor-pointer border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                            style={{ backgroundColor: color }}
                            onClick={() => setHeaderColor(color)}
                            aria-label={`Set color to ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button onClick={() => setHeaderColor("#1a1b4b")}>Reset to Default</Button>
                  </div>
                </div>
              </Modern3DBox>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

