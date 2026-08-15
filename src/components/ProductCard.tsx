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
    <span className="absolute top-2.5 left-2.5 bg-gray-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
      New
    </span>
  ) : product.isSale ? (
    <span className="absolute top-2.5 left-2.5 gradient-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-soft">
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
      className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full glass shadow-soft transition-transform active:scale-95"
      aria-label={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={isFavorite(product.id) ? 'var(--color-primary)' : 'none'}
        stroke={isFavorite(product.id) ? 'var(--color-primary)' : 'currentColor'}
        strokeWidth="2"
        className="text-body"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )

  const cardClass =
    variant === 'horizontal'
      ? 'flex-shrink-0 w-[152px] text-left card-modern overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]'
      : 'text-left card-modern overflow-hidden w-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]'

  return (
    <button type="button" onClick={onClick} className={cardClass}>
      <div className="relative aspect-[3/4] bg-gray-100 dark:bg-dark-elevated overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        {badge}
        {heartBtn}
      </div>
      <div className={variant === 'horizontal' ? 'p-3' : 'p-3.5'}>
        <div className="flex items-center gap-1 mb-1">
          <Star size={11} fill="#ffb703" stroke="#ffb703" />
          <span className="text-[10px] text-muted font-medium">{product.rating}</span>
        </div>
        <p className="text-[10px] text-muted font-medium uppercase tracking-wide">{product.brand}</p>
        <p className={`font-semibold truncate text-body ${variant === 'horizontal' ? 'text-xs' : 'text-sm'}`}>
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`font-bold text-body ${variant === 'horizontal' ? 'text-xs' : 'text-sm'}`}>
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-muted line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </button>
  )
}
