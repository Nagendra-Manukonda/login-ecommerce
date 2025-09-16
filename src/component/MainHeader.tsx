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
} from "@/component/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"
import { getCookie, deleteCookie } from "@/libs/cookies"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/Store/cartStore"

interface MainHeaderProps {
  onResults?: (results: any[]) => void
}

export default function MainHeader({ onResults }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const items = useCartStore((state) => state.items)
  const cartCount = items.length

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
    setTimeout(() => {
    router.replace("/Sign-In")
  }, 0)
  }

  return (
    <header className="z-50 fixed top-0 left-0 w-full bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1
            onClick={() => router.push("/")}
            className="text-lg font-bold text-black cursor-pointer"
          >
            My App
          </h1>

          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => router.push("/cart")}
              className="relative flex items-center justify-center cursor-pointer bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 p-1 bg-red-600 text-white text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center">
                 {cartCount > 99 ? "99+" : cartCount}
                   </span>
              )}

            </Button>

            {!user ? (
              <Button
                onClick={() => router.push("/Sign-In")}
                className="bg-violet-500 hover:bg-violet-600 cursor-pointer text-white"
              >
                Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="cursor-pointer">
                  <Avatar>
                    <AvatarImage src={user.image} alt={user.firstName} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-0 bg-transparent border-0 shadow-none">
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="w-64 bg-gray-300/80 backdrop-blur-lg border border-white/20 shadow-xl">
                      <CardHeader className="flex flex-col items-center">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={user.image} alt={user.firstName} />
                          <AvatarFallback>
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-black mt-2">
                          {user.firstName} {user.lastName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-black space-y-2">
                        <p>👤 {user.username}</p>
                        <p>📧 {user.email}</p>
                        <Button
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
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

          <div className="flex items-center gap-3 lg:hidden">
            <Button
              onClick={() => router.push("/cart")}
              className="relative flex items-center justify-center cursor-pointer bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
            >
              <ShoppingCart className="w-4 h-4 mr-2 text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 pl-1 bg-red-600 text-white text-xs font-medium w-7 h-7 rounded-full flex items-center justify-center">
                 {cartCount > 99 ? "99+" : cartCount}
                   </span>
              )}
            </Button>

            {!user ? (
              <Button
                onClick={() => router.push("/Sign-In")}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                Login
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-1 rounded-full border bg-gray-300/80 border-gray-300"
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
      </div>

      {mobileMenuOpen && user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-gray-100 rounded-md p-4 shadow mx-4 mt-2"
        >
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
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </header>
  )
}
