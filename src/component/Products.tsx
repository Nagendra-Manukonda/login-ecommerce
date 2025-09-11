"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import StarRating from "./StarRating"
import Image from "next/image"
import { useCartStore } from "@/Store/cartStore"
import Link from "next/link"
import MainHeader from "./MainHeader"

interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  thumbnail: string
  category: string
  discountPercentage: number
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const { items, addToCart } = useCartStore()

  const fetchProducts = useCallback(async () => {
    if (!hasMore) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=12&skip=${page * 12}`
      )
      const data = await res.json()
      if (data.products.length === 0) {
        setHasMore(false)
      } else {
        setProducts((prev) => {
          const newProducts = data.products.filter(
            (p: Product) => !prev.some((item) => item.id === p.id)
          )
          return [...prev, ...newProducts]
        })
      }
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore])

  useEffect(() => {
    fetchProducts()
  }, [page, fetchProducts])

  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loading])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(0)
      setProducts([])
      setHasMore(true)
    }, 500)
  }

  const handleSortChange = (order: "asc" | "desc" | "none") => {
    setSortOrder(order)
    if (order === "none") return
    setProducts((prev) =>
      [...prev].sort((a, b) =>
        order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      )
    )
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="pt-5">
      <MainHeader />

      <h2 className="flex justify-center text-4xl items-center tracking-wider font-bold text-gray-800 mt-6">
        Products
      </h2>

      <div className="flex flex-row sm:flex-row justify-between items-center gap-3 px-4 mt-5">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-gray-300 rounded-md bg-amber-50 px-3 py-2 w-full sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
        />

        <select
          onChange={(e) =>
            handleSortChange(e.target.value as "asc" | "desc" | "none")
          }
          className="cursor-pointer bg-white text-black px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          <option value="none">None</option>
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3 mt-3">
        {filteredProducts.map((product, index) => {
          const ifInCart = items.some((item) => item.id === product.id)
          return (
            <Link
              key={`${product.id}-${index}`}
              href={`/products/${product.id}`}
              passHref
            >
              <Card className="relative bg-white rounded-xs cursor-pointer overflow-hidden flex flex-col">
                <div className="relative">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={280}
                    height={280}
                    className="object-cover hover:scale-110 transition"
                  />
                  <div className="absolute bottom-2 right-2 text-black rounded-md text-sm flex items-center gap-2 px-2 py-1">
                    <span className="font-bold">${product.price}</span>
                    <span className="text-red-500 font-semibold text-xs">
                      ({product.discountPercentage}% OFF)
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-md font-semibold text-gray-800 m-1.5">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 m-1.5">
                    {product.description}
                  </p>
                  <StarRating rating={product.rating} />
                  {ifInCart ? (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = "/cart"
                      }}
                      className="mt-3 w-full font-semibold text-white cursor-pointer bg-yellow-400 hover:bg-amber-500 rounded-md"
                    >
                      Go to Cart
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(product)
                      }}
                      className="mt-3 w-full font-semibold text-black cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Add to Bag
                    </Button>
                  )}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <div ref={observerRef} className="h-10 flex justify-center items-center mt-5">
        {loading && <p className="text-gray-500">Loading...</p>}
        {!hasMore && <p className="text-gray-400">No more products</p>}
      </div>
    </div>
  )
}
