"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/component/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/component/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/component/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"
import { getCookie, deleteCookie } from "@/libs/cookies"
import { ShoppingCart, Menu } from "lucide-react"
import { useCartStore } from "@/Store/cartStore"

interface MainHeaderProps {
  onResults?: (results: any[]) => void
}

export default function MainHeader({ onResults }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const items = useCartStore((state) => state.items)
  const cartCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0)

  useEffect(() => {
    const storedUser = getCookie("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  useEffect(() => {
    if (user && pathname === "/Sign-In") {
      router.replace("/")
    }
  }, [user, pathname, router])

  const handleLogout = () => {
    deleteCookie("user")
    setUser(null)
    router.replace("/Sign-In")
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (value.length < 2) {
        if (onResults) onResults([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${value}&sortBy=title&order=${sortOrder}`
        )
        const data = await res.json()
        if (onResults) onResults(data.products || [])
      } catch (err) {
        console.error("Search error:", err)
        if (onResults) onResults([])
      } finally {
        setLoading(false)
      }
    }, 800)
  }

  const handleSortChange = async (order: "asc" | "desc" | "none") => {
    if (order === "none") {
      try {
        const res = await fetch("https://dummyjson.com/products")
        const data = await res.json()
        if (onResults) onResults(data.products || [])
      } catch (err) {
        console.error("Reset error:", err)
        if (onResults) onResults([])
      }
      return
    }

    setSortOrder(order)
    setLoading(true)
    try {
      const res = await fetch(
        `https://dummyjson.com/products?sortBy=title&order=${order}`
      )
      const data = await res.json()
      if (onResults) onResults(data.products || [])
    } catch (err) {
      console.error("Sort error:", err)
      if (onResults) onResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="z-50 fixed top-0 left-0 w-full bg-white ">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-16 p-3 gap-3">

        <div className="flex items-center justify-between w-full lg:w-auto">
          <h1
            onClick={() => router.push("/")}
            className="text-lg font-bold text-black cursor-pointer"
          >
            My App
          </h1>
<div className="flex items-center gap-3 lg:hidden">
  {/* Cart button works directly */}
  <button
    type="button"
    onClick={() => router.push("/cart")}
    className="relative flex items-center justify-center cursor-pointer bg-green-500 p-2 rounded text-white hover:bg-green-600 transition"
  >
    <ShoppingCart className="w-5 h-5 text-white" />
    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </button>

  {/* Avatar toggle for mobile */}
  {!user ? (
    <Button
      variant="secondary"
      onClick={() => router.push("/Sign-In")}
      className="bg-violet-500 hover:bg-violet-600 cursor-pointer text-white"
    >
      Login
    </Button>
  ) : (
    <button
      type="button"
      onClick={() => setMobileMenuOpen((prev) => !prev)}
      className="p-1 rounded-full border border-gray-300"
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={user.image} alt={user.firstName} />
        <AvatarFallback>
          {user.firstName?.[0]}
          {user.lastName?.[0]}
        </AvatarFallback>
      </Avatar>
    </button>
  )}
</div>

        </div>

        <div className="flex-1 flex justify-center bottom-10 lg:bottom-0 relative w-full lg:w-auto ">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="border border-gray-300 rounded-md px-3 py-1 w-1/2 lg:w-full max-w-xs lg:max-w-md  text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              Loading...
            </span>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-4 left-2">
          <button
            onClick={() => router.push("/cart")}
            className="relative flex items-center justify-center cursor-pointer bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
          >
            <ShoppingCart className="w-4 h-4 mr-2 text-white" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white hover:text-white px-4 py-2"
              >
                Sort by Title
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSortChange("none")}>
                None
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("asc")}>
                Ascending (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("desc")}>
                Descending (Z-A)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!user ? (
            <Button
              variant="secondary"
              onClick={() => router.push("/Sign-In")}
              className="bg-violet-500 hover:bg-violet-600 cursor-pointer text-white"
            >
              Login
            </Button>
          ) : (
            <DropdownMenu key={user.email}>
              <DropdownMenuTrigger className="cursor-pointer">
                <Avatar>
                  <AvatarImage src={user.image} alt={user.firstName} />
                  <AvatarFallback>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0 bg-transparent cursor-pointer border-0 shadow-none">
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="w-64 bg-gray-300/80 backdrop-blur-lg border border-white/20 shadow-xl">
                    <CardHeader className="flex flex-col items-center">
                      <Avatar className="w-16 h-16 mb-3">
                        <AvatarImage src={user.image} alt={user.firstName} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-black justify-center pb-3">
                        {user.firstName} {user.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-black space-y-2 m-3">
                      <p>👤 {user.username}</p>
                      <p>📧 {user.email}</p>
                      <p>⚧ {user.gender}</p>
                      <Button
                        className="w-full justify-center items-center flex cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-3 bg-gray-100 rounded-md p-4 shadow"
          >
            <div className="mb-3">
              <p className="text-sm font-semibold mb-2">Sort By</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSortChange("asc")}>
                  A-Z
                </Button>
                <Button size="sm" onClick={() => handleSortChange("desc")}>
                  Z-A
                </Button>
                <Button size="sm" onClick={() => handleSortChange("none")}>
                  None
                </Button>
              </div>
            </div>

            {!user ? (
              <Button
                variant="secondary"
                onClick={() => router.push("/Sign-In")}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white"
              >
                Login
              </Button>
            ) : (
              <Card className="bg-white shadow">
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="w-16 h-16 mb-3">
                    <AvatarImage src={user.image} alt={user.firstName} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>
                    {user.firstName} {user.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <p>👤 {user.username}</p>
                  <p>📧 {user.email}</p>
                  <p>⚧ {user.gender}</p>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}
