"use client"
import { useEffect, useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import StarRating from "./StarRating"
import Image from "next/image"
import { useCartStore } from "@/Store/cartStore"
import MainHeader from "./MainHeader"
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { items, addToCart } = useCartStore()

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products)
        setFilteredProducts(data.products)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSearch = (query: string) => {
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredProducts(filtered)
  }

  if (loading) return <p className="text-gray-600">Loading products...</p>

  return (
    <div className="pt-5">
      <h2 className=" flex justify-center text-4xl items-center tracking-wider font-bold text-gray-800 ">Products</h2>
      <MainHeader onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3">
        {filteredProducts.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product) => {
            const ifInCart = items.some((item) => item.id === product.id)

            return (
              <Link key={product.id} href={`/products/${product.id}`} passHref>
                <Card
                  className="relative bg-white rounded-xs cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={280}
                      height={280}
                      className="object-cover hover:scale-110 transition"
                    />
                    <div className="absolute top-62 right-2 text-black rounded-md text-sm flex items-center gap-2 px-2 py-1">
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
                        onClick={() => window.location.href = "/cart"}
                        className="mt-3 w-full font-semibold text-white cursor-pointer bg-yellow-400 hover:bg-amber-500 rounded-md"
                      >
                        Go to Cart
                      </Button>
                    ) : (
                      <Button
                        onClick={() => addToCart(product)}
                        className="mt-3 w-full font-semibold text-black cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        Add to Bag
                      </Button>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
