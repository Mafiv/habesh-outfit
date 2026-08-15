import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
}

export function StarRating({ rating, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.floor(rating) ? '#FFB800' : 'none'}
          stroke={i < Math.floor(rating) ? '#FFB800' : '#E8E8E8'}
        />
      ))}
      <span className="text-xs text-muted ml-1">({rating})</span>
    </div>
  )
}
