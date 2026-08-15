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
  fetchProduct: (id: string) => Promise<Product | null>
  searchProducts: (query: string, page?: number) => Promise<Product[]>
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
  const [productCache, setProductCache] = useState<Record<string, Product>>({})

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProducts({ pageSize: 100 })
      if (data.results.length > 0) {
        setProducts(data.results)
        const cache: Record<string, Product> = {}
        data.results.forEach((p) => { cache[p.id] = p })
        setProductCache((prev) => ({ ...prev, ...cache }))
      }
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
    (id: string) => productCache[id] ?? products.find((p) => p.id === id),
    [products, productCache]
  )

  const fetchProduct = useCallback(async (id: string): Promise<Product | null> => {
    const cached = productCache[id] ?? products.find((p) => p.id === id)
    if (cached) return cached

    try {
      const product = await api.getProduct(id)
      setProductCache((prev) => ({ ...prev, [id]: product }))
      setProducts((prev) => (prev.some((p) => p.id === id) ? prev : [...prev, product]))
      return product
    } catch {
      return null
    }
  }, [productCache, products])

  const searchProducts = useCallback(async (query: string, page = 1) => {
    const q = query.trim()
    if (!q) return []
    try {
      const data = await api.searchProducts(q, page)
      return data.results
    } catch {
      const lower = q.toLowerCase()
      return products.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          p.brand.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower)
      )
    }
  }, [products])

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
        fetchProduct,
        searchProducts,
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
