"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MainHeader from "@/component/MainHeader"
import { getCookie } from "@/libs/cookies"
import Products from "@/component/Products"

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getCookie("user")
    if (!storedUser) {
      router.replace("/Sign-In")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  return (
    <div className="min-h-screen bg-gray-300">
      <MainHeader />
      <main className="p-6">
        <Products />
      </main>
    </div>
  )
}
