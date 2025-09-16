"use client"

import { useCartStore } from "@/Store/cartStore"
import { Button } from "@/component/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card"
import { Input } from "@/component/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [showPopup, setShowPopup] = useState(false)

  const totalPrice = items.reduce(
    (sum, item) => sum + (item.price * (item.quantity ?? 1)),
    0
  )

  const handlePlaceOrder = () => {
    clearCart()
    setShowPopup(true)
  }

  return (
    <div className="bg-gray-300/80 p-6">
         <Link
        href="/"
        className="inline-block mb-4 text-sm font-semibold text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-2.5">
            <Input placeholder="Full Name" />
            <Input placeholder="Email" />
            <Input placeholder="Phone" />
            <Input placeholder="Address" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="City" />
              <Input placeholder="Postal Code" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-2.5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              <span>Credit / Debit Card</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <span>UPI</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on Delivery</span>
            </label>

            {paymentMethod === "card" && (
              <div className="space-y-3 mt-3">
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <Input placeholder="Cardholder Name" />
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="space-y-3 mt-3">
                <Input placeholder="Enter UPI ID (e.g. name@upi)" />
              </div>
            )}

            {paymentMethod === "cod" && (
              <p className="text-gray-600 mt-3">
                💵 You can pay with cash upon delivery.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            <>
              <ul className="divide-y">
                {items.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>
                      {item.title} x {item.quantity ?? 1}
                    </span>
                    <span>${item.price * (item.quantity ?? 1)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between tracking-wider leading-9 font-semibold text-lg">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/cart")}
                  className="bg-black text-white hover:bg-red-600 hover:text-white flex-1"
                >
                  Back to Cart
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <Card className="p-6 w-80 text-center">
            <CardHeader>
              <CardTitle className="text-green-600 font-bold text-xl">
                ✅ Order Placed Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Thank you for your purchase.</p>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white w-full"
                onClick={() => setShowPopup(false)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </div>
  )
}
