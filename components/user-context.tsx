"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserContextType = {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

type User = {
  name: string
  email: string
  profileImage: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const login = (email: string, password: string) => {
    // In a real app, you would validate credentials with a backend
    // For demo purposes, we'll just accept any input
    const newUser = {
      name: email.split("@")[0], // Use part of email as name
      email,
      profileImage: null,
    }

    setUser(newUser)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ isLoggedIn, user, login, logout, updateProfile }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
