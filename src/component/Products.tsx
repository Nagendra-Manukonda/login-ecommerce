"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import StarRating from "./StarRating"
import Image from "next/image"
import { useCartStore } from "@/Store/cartStore"
import Link from "next/link"

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
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none")

  const observerRef = useRef<HTMLDivElement | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const isFetchingRef = useRef(false) 
  const { items, addToCart } = useCartStore()

  const fetchProducts = async (reset = false, newPage = 0, query = searchQuery) => {
    if (isFetchingRef.current) return
    if (!hasMore && !reset) return

    isFetchingRef.current = true
    setLoading(true)

    try {
      const url =
        query.trim().length >= 2
          ? `https://dummyjson.com/products/search?q=${encodeURIComponent(
              query
            )}&limit=12&skip=${newPage * 12}`
          : `https://dummyjson.com/products?limit=12&skip=${newPage * 12}`

      const res = await fetch(url, { cache: "no-store" })
      const data = await res.json()
      const newProducts: Product[] = data.products || []

      setProducts((prev) => {
        if (reset) return newProducts
        const unique = newProducts.filter((p) => !prev.some((x) => x.id === p.id))
        return [...prev, ...unique]
      })

      setHasMore(newProducts.length > 0)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      isFetchingRef.current = false
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(page === 0, page, searchQuery)
  }, [page])

  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [loading, hasMore])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setPage(0)
      setHasMore(true)
      setProducts([])
      fetchProducts(true, 0, searchQuery)
    }, 800)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  const handleSortChange = (order: "asc" | "desc" | "none") => {
  setSortOrder(order)

  if (order === "none") {
    setPage(0)
    setHasMore(true)
    fetchProducts(true, 0) 
    return
  }

  setProducts((prev) =>
    [...prev].sort((a, b) =>
      order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    )
  )
}


  return (
    <div className="pt-5">

      <h2 className="flex justify-center text-4xl items-center tracking-wider font-bold text-gray-800 mt-6">
        Products
      </h2>

      <div className="flex flex-row sm:flex-row justify-between items-center gap-3 px-4 mt-5">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md bg-amber-50 px-3 py-2 lg:w-1/2 sm:w-1/2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-500"
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
        {products.map((product) => {
          const ifInCart = items.some((item) => item.id === product.id)
          return (
            <Link key={product.id} href={`/products/${product.id}`} passHref>
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
        {!hasMore && !loading && <p className="text-gray-400">No more products</p>}
      </div>
    </div>
  )
}
