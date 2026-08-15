import { useNavigate } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useFavorites } from '../context/FavoritesContext'
import { Button } from '../components/Button'

export function FavoritesPage() {
  const navigate = useNavigate()
  const { favoriteProducts } = useFavorites()

  if (favoriteProducts.length === 0) {
    return (
      <div className="pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">No favorites yet</h2>
        <p className="text-sm text-muted mt-1 text-center">
          Tap the heart icon on products you love
        </p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Browse Products
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-24">
      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-extrabold">Favorites</h1>
          <p className="text-xs text-muted mt-1">{favoriteProducts.length} items</p>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
