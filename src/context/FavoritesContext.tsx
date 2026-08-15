import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Product } from '../types'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'
import { products as allProducts } from '../data/products'

interface FavoritesContextType {
  favorites: string[]
  favoriteProducts: Product[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const favorites = favoriteProducts.map((p) => p.id)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      const saved = localStorage.getItem('stylish_favorites')
      const ids: string[] = saved ? JSON.parse(saved) : []
      setFavoriteProducts(allProducts.filter((p) => ids.includes(p.id)))
      return
    }

    setLoading(true)
    try {
      const data = await api.getFavorites()
      setFavoriteProducts(data)
    } catch {
      /* keep current */
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        await api.toggleFavorite(productId)
        await refresh()
        return
      }

      const saved = localStorage.getItem('stylish_favorites')
      const ids: string[] = saved ? JSON.parse(saved) : []
      const next = ids.includes(productId)
        ? ids.filter((id) => id !== productId)
        : [...ids, productId]
      localStorage.setItem('stylish_favorites', JSON.stringify(next))
      setFavoriteProducts(allProducts.filter((p) => next.includes(p.id)))
    },
    [isAuthenticated, refresh]
  )

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  )

  return (
    <FavoritesContext.Provider
      value={{ favorites, favoriteProducts, toggleFavorite, isFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
