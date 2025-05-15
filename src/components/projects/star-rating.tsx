"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  max?: number
}

export function StarRating({ value, onChange, max = 5 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const handleMouseEnter = (index: number) => {
    setHoverValue(index)
  }

  const handleMouseLeave = () => {
    setHoverValue(null)
  }

  const handleClick = (index: number) => {
    onChange(index)
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className="flex items-center gap-1">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1
        return (
          <button
            key={index}
            type="button"
            className={`p-1 focus:outline-none transition-transform ${
              displayValue >= starValue ? "text-yellow-500 scale-110" : "text-gray-300"
            } hover:scale-125`}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        )
      })}
      <span className="ml-2 text-sm font-medium">{displayValue > 0 ? displayValue : "Not rated"}</span>
    </div>
  )
}
