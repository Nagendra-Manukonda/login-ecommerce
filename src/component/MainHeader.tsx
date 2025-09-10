"use client"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
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
  onSearch: (query: string) => void
}

export default function MainHeader({ onSearch }: MainHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

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
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <header className="z-50 fixed top-0 left-0 w-full flex items-center justify-between p-3 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <h1
          onClick={() => router.push("/")}
          className="text-xl font-bold text-black cursor-pointer"
        >
          My App
        </h1>
      </div>

      <div className="flex-1 flex justify-center px-4 relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md px-3 py-1 w-full max-w-md pr-10 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
        {/* <SearchIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-text" /> */}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/cart")}
          className="relative flex items-center justify-center text-md cursor-pointer bg-green-500 p-2 gap-1.5 rounded text-white hover:bg-green-600 transition"
        >
          <ShoppingCart className="w-4 h-4 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          Cart
        </button>

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
                      className="w-full justify-center items-center flex bg-red-500 hover:bg-red-600 text-white"
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
    </header>
  )
}
