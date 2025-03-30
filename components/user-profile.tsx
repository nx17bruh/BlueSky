"use client"

import type React from "react"

import { useState } from "react"
import { User, LogOut, Upload, UserCircle } from "lucide-react"
import { useUser } from "./user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UserProfile() {
  const { isLoggedIn, user, login, logout, updateProfile } = useUser()
  const [loginOpen, setLoginOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [imageDialogOpen, setImageDialogOpen] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, password)
    setLoginOpen(false)
    setEmail("")
    setPassword("")
  }

  const handleUpdateProfileImage = () => {
    if (profileImageUrl) {
      updateProfile({ profileImage: profileImageUrl })
      setProfileImageUrl("")
      setImageDialogOpen(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center justify-center h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            data-user-profile-trigger
          >
            {isLoggedIn && user?.profileImage ? (
              <img
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {isLoggedIn ? (
            <>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setImageDialogOpen(true)}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Change Profile Photo</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLoginOpen(true)}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Log In</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log In</DialogTitle>
            <DialogDescription>Enter your credentials to access your account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Log In</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>Enter a URL for your profile image.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="profileImage">Image URL</Label>
              <Input
                id="profileImage"
                type="url"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {profileImageUrl && (
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={profileImageUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateProfileImage} disabled={!profileImageUrl}>
              Update Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

