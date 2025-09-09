import { Star } from "lucide-react"

export default function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-end m-2 justify-end">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating)
        const half = !filled && i < rating

        return (
          <Star
            key={i}
            size={18}
            className={
              filled
                ? "text-yellow-500 fill-yellow-500"
                : half
                ? "text-yellow-500 fill-yellow-500 opacity-50"
                : "text-gray-300"
            }
          />
        )
      })}
      <span className="ml-2 text-sm font-medium text-gray-600">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}
