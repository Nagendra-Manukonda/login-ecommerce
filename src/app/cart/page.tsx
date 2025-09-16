"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/Store/cartStore"
import { Button } from "@/component/ui/button"
import { Card, CardContent } from "@/component/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import StarRating from "@/component/StarRating"

export default function CartPage() {
  const { items, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } =
    useCartStore()
  const router = useRouter()

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

 const [authChecked, setAuthChecked] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1]

    if (userCookie) {
      setIsAuth(true)
    } else {
      router.replace("/Sign-In")
    }
    setAuthChecked(true)
  }, [router])

  if (!hydrated || !authChecked) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex flex-col md:flex-row gap-4 p-4 bg-white shadow-md animate-pulse rounded-lg"
          >
            <div className="w-40 h-40 bg-gray-300 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
              <div className="flex gap-2 mt-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

 if (!isAuth) return null

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  )

  if (items.length === 0) {
    return (
      <div className="max-w-4xl h-full bg-white mx-auto p-6 text-center">
        <h1 className="text-3xl text-gray-800 font-bold mb-4">
          Your Cart is Empty 🛒
        </h1>
        <Button
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto p-6 space-y-6 bg-amber-50">
      <Link
        href="/"
        className="inline-block mb-4 text-sm font-semibold text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-4 text-black">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col md:flex-row p-4 shadow-md bg-white"
          >
            {item.thumbnail && (
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={180}
                height={180}
                className="rounded-lg object-cover"
              />
            )}

            <CardContent className="flex flex-col justify-between flex-1 ml-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold">Brand:</span> {item.brand} |{" "}
                  <span className="font-semibold">Category:</span> {item.category}
                </p>
                {item.rating && (
                  <div className="mt-1">
                    <StarRating rating={item.rating} />
                  </div>
                )}
                <p className="text-gray-800 font-medium mt-2">
                  ${item.price} x {item.quantity} ={" "}
                  <span className="font-bold text-green-700">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-green-500 text-white cursor-pointer w-8 h-8 rounded-full"
                  >
                    +
                  </Button>
                  <Button
                    onClick={() => {
                      if (item.quantity === 1) {
                        removeFromCart(item.id)
                      } else {
                        decreaseQuantity(item.id)
                      }
                    }}
                    className="bg-red-500 text-white cursor-pointer w-8 h-8 rounded-full"
                  >
                    -
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  className="bg-red-500 text-white cursor-pointer hover:bg-red-600"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <h2 className="text-xl font-bold text-gray-800">
          Total: ${totalPrice.toFixed(2)}
        </h2>
        <div className="flex gap-3 ml-6 ">
          <Button variant="outline" onClick={clearCart} className="cursor-pointer  bg-black text-white w-[27%]  lg:w-fit hover:bg-red-600 hover:text-white">
            Clear Cart
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 w-[27%] lg:w-fit cursor-pointer text-white"
            onClick={() => router.push("/")}
          >
            Add More
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 w-[27%] lg:w-fit cursor-pointer text-white"
          onClick={() => router.push("/checkout")}>
            Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}
