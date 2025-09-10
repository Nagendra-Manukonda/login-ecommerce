"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import StarRating from "@/component/StarRating"
import { Button } from "@/component/ui/button"
import { useCartStore } from "@/Store/cartStore"

interface Review {
  rating: number
  comment: string
  reviewerName: string
  date: string
}

interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  thumbnail: string
  images: string[]
  reviews: Review[]
}

export default function ProductPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  const { items, addToCart } = useCartStore()
  const id = pathname.split("/").pop()

  useEffect(() => {
    if (!id) return
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray-600 pt-10">Loading...</p>
  if (!product) return <p className="text-red-500">Product not found</p>

  const cartItem = items.find((item) => item.id === product.id)

  return (
    <div className="max-w-7xl mx-auto p-6 bg-amber-50">
      <Link
        href="/"
        className="inline-block mb-4 text-sm font-semibold text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-lg rounded-xl p-6">
            <div className="md:sticky md:top-6 self-start h-fit">
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {product.images.map((img, index) => (
             <Image
  key={index}
  src={img}
  alt={`product-image-${index}`}
  width={320}
  height={400}
  className="object-cover border rounded-md cursor-pointer hover:scale-100 transition"
/>

            ))}
          </div>

          <div className="flex gap-4 w-full">
            {cartItem ? (
              <Button
                className="bg-blue-500 hover:bg-blue-600 rounded text-white w-1/2 py-6 text-lg font-semibold"
                onClick={() => router.push("/cart")}
              >
                Go to Cart
              </Button>
            ) : (
              <Button
                className="bg-yellow-400 hover:bg-yellow-500 rounded text-white w-64 py-6 text-lg font-semibold"
                onClick={() => {
                  addToCart(product)
                  router.push("/cart")
                }}
              >
                Add to Cart
              </Button>
            )}

            <Button
              className="bg-red-500/90 hover:bg-red-600 rounded text-white w-64 py-6 text-lg font-semibold"
              onClick={() => {
                if (!cartItem) addToCart(product)
                router.push("/cart")
              }}
            >
              Buy Now
            </Button>
          </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>

            <div className="flex items-center gap-4 mt-2">
              <StarRating rating={product.rating} />
              <span className="text-gray-500">({product.stock} in stock)</span>
            </div>

            <div className="text-3xl font-bold text-green-600 mt-4">
              ${product.price}
              <span className="ml-2 text-lg text-red-500">
                ({product.discountPercentage}% OFF)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><span className="font-semibold">Brand:</span> {product.brand}</p>
            <p><span className="font-semibold">Category:</span> {product.category}</p>
            <p><span className="font-semibold">SKU:</span> {product.sku}</p>
            <p><span className="font-semibold">Weight:</span> {product.weight}g</p>
            <p>
              <span className="font-semibold">Dimensions:</span>{" "}
              {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
            </p>
            <p><span className="font-semibold">Availability:</span> {product.availabilityStatus}</p>
            <p><span className="font-semibold">Warranty:</span> {product.warrantyInformation}</p>
            <p><span className="font-semibold">Shipping:</span> {product.shippingInformation}</p>
            <p><span className="font-semibold">Return Policy:</span> {product.returnPolicy}</p>
            <p><span className="font-semibold">Min Order:</span> {product.minimumOrderQuantity}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mt-6 mb-4">
              Customer Reviews
            </h2>
            {product.reviews?.length === 0 ? (
              <p className="text-gray-500">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {product.reviews?.map((review, index) => (
                  <div key={index} className="border-b pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-500">{review.reviewerName}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
