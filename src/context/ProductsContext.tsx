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
import { products as fallbackProducts } from '../data/products'

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getProduct: (id: string) => Product | undefined
  getProductsByCategory: (gender?: string, subcategory?: string) => Product[]
  getNewProducts: () => Product[]
  getSaleProducts: () => Product[]
  getRelatedProducts: (product: Product, limit?: number) => Product[]
}

const ProductsContext = createContext<ProductsContextType | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProducts()
      if (data.length > 0) setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  )

  const getProductsByCategory = useCallback(
    (gender?: string, subcategory?: string) => {
      let filtered = [...products]
      if (gender) filtered = filtered.filter((p) => p.gender === gender)
      if (subcategory && subcategory !== 'New') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === subcategory.toLowerCase()
        )
      } else if (subcategory === 'New') {
        filtered = filtered.filter((p) => p.isNew)
      }
      return filtered
    },
    [products]
  )

  const getNewProducts = useCallback(
    () => products.filter((p) => p.isNew),
    [products]
  )

  const getSaleProducts = useCallback(
    () => products.filter((p) => p.isSale),
    [products]
  )

  const getRelatedProducts = useCallback(
    (product: Product, limit = 4) =>
      products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, limit),
    [products]
  )

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refresh,
        getProduct,
        getProductsByCategory,
        getNewProducts,
        getSaleProducts,
        getRelatedProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
