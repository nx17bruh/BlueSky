"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Bell, Moon, Sun, Monitor, SettingsIcon, UserCircle, Upload } from "lucide-react"
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
import { Modern3DBox } from "@/components/modern-3d-box"
import { UserProfile } from "@/components/user-profile"
import { useUser } from "@/components/user-context"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { headerColor, setHeaderColor } = useColorContext()
  const { isLoggedIn, user, updateProfile } = useUser()
  const [name, setName] = useState("")
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Ensure we only render theme components on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    if (user) {
      setName(user.name)
    }
  }, [user])

  const handleUpdateProfile = () => {
    updateProfile({
      name,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          updateProfile({ profileImage: event.target.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeaderColor(e.target.value)
  }

  // Function to open the login dialog from the UserProfile component
  const openLoginDialog = () => {
    // Find and click the user profile trigger button
    const triggerButton = document.querySelector("[data-user-profile-trigger]") as HTMLButtonElement
    if (triggerButton) {
      triggerButton.click()

      // Small delay to ensure the dropdown opens first
      setTimeout(() => {
        // Find and click the login menu item
        const loginMenuItem = document.querySelector("[data-login-menu-item]") as HTMLButtonElement
        if (loginMenuItem) {
          loginMenuItem.click()
        }
      }, 100)
    }
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
            <UserProfile />
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
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white cursor-pointer relative"
                        onClick={triggerFileInput}
                      >
                        {user?.profileImage ? (
                          <img
                            src={user.profileImage || "/placeholder.svg"}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          user?.name.charAt(0)
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <div>
                        <h3 className="text-lg font-medium">{user?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input id="display-name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                    </div>

                    <Button onClick={handleUpdateProfile}>Update Profile</Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Not Logged In</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Log in to access your account settings</p>
                    <Button onClick={openLoginDialog}>Log In</Button>
                  </div>
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




