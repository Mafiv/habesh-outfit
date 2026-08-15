import { Star } from 'lucide-react'
import type { Product } from '../types'
import { useFavorites } from '../context/FavoritesContext'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  variant?: 'grid' | 'horizontal'
}

export function ProductCard({ product, onClick, variant = 'grid' }: ProductCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()

  const badge = product.isNew ? (
    <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-semibold px-2 py-0.5 rounded">
      NEW
    </span>
  ) : product.isSale ? (
    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded">
      -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
    </span>
  ) : null

  const heartBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(product.id)
      }}
      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 shadow-sm"
      aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFavorite(product.id) ? '#DB3022' : 'none'}
        stroke={isFavorite(product.id) ? '#DB3022' : '#222'}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )

  if (variant === 'horizontal') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex-shrink-0 w-[148px] text-left bg-white rounded-lg overflow-hidden shadow-sm"
      >
        <div className="relative aspect-[3/4]">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
          {badge}
          {heartBtn}
        </div>
        <div className="p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <Star size={10} fill="#FFB800" stroke="#FFB800" />
            <span className="text-[10px] text-muted">{product.rating}</span>
          </div>
          <p className="text-[10px] text-muted uppercase">{product.brand}</p>
          <p className="text-xs font-semibold truncate">{product.title}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-muted line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white rounded-lg overflow-hidden shadow-sm w-full"
    >
      <div className="relative aspect-[3/4]">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        {badge}
        {heartBtn}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Star size={12} fill="#FFB800" stroke="#FFB800" />
          <span className="text-xs text-muted">{product.rating}</span>
        </div>
        <p className="text-xs text-muted uppercase">{product.brand}</p>
        <p className="text-sm font-semibold truncate">{product.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </button>
  )
}
