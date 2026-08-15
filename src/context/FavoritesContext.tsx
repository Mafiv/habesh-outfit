import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Product } from '../types'

interface FavoritesContextType {
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  favoriteProducts: Product[]
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

export function FavoritesProvider({
  children,
  products,
}: {
  children: ReactNode
  products: Product[]
}) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('stylish_favorites')
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
      localStorage.setItem('stylish_favorites', JSON.stringify(next))
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  )

  const favoriteProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, favoriteProducts }}
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
