"use client"
import { useEffect, useState } from "react"
import { Card } from "@/component/ui/card"
import { Button } from "./ui/button"
import StarRating from "./StarRating"
import Link from "next/link"
import { useCartStore } from "@/Store/cartStore"
import { useRouter } from "next/navigation"

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
  const [loading, setLoading] = useState(true)
  const { items, addToCart } = useCartStore()
  const router = useRouter()

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray-600">Loading products...</p>

  return (
    <div>
      <h2 className=" flex justify-center text-4xl items-center tracking-wider font-bold text-gray-800 mb-4">Products</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {products.map((product) => {
          const ifInCart = items.some((item) => item.id === product.id)

          return (
            <Card
              key={product.id}
              className="relative bg-white rounded-xs overflow-hidden flex flex-col"
            >
              <Link href={`/products/${product.id}`} className="block">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="object-cover hover:scale-110 transition"
                />
                <div className="absolute top-64 right-2 text-black rounded-md text-sm flex items-center gap-2 px-2 py-1">
                  <span className="font-bold">${product.price}</span>
                  <span className="text-red-500 font-semibold text-xs">
                    ({product.discountPercentage}% OFF)

                  </span>
                </div>
              </Link>
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
                    onClick={() => router.push("/cart")}
                    className="mt-3 w-full font-semibold cursor-pointer text-white bg-yellow-400 hover:bg-amber-500 rounded-md"
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      addToCart(product)
                      // router.push("/cart") 
                    }}
                    className="mt-3 w-full font-semibold cursor-pointer text-black bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    Add to Bag
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
