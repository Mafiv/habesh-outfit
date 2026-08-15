import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { ViewToggle, ProductListItem } from '../components/CatalogHelpers'
import { categories } from '../data/products'
import { ProductGridSkeleton } from '../components/ui/ProductGridSkeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { api } from '../lib/api'
import type { Product } from '../types'
import { Package } from 'lucide-react'

const PAGE_SIZE = 12

export function CatalogPage() {
  const { gender, subcategory } = useParams()
  const navigate = useNavigate()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'low' | 'high'>('low')
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const cat = categories.find((c) => c.gender === gender)
  const title = subcategory
    ? `${cat?.name ?? ''} · ${subcategory}`
    : cat?.name ?? 'Catalog'

  const loadProducts = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (reset) setLoading(true)
      else setLoadingMore(true)

      try {
        const data = await api.getProducts({
          gender,
          subcategory,
          sort: sortBy,
          page: pageNum,
          pageSize: PAGE_SIZE,
          inStock: true,
        })
        setProducts((prev) => (reset ? data.results : [...prev, ...data.results]))
        setTotalPages(data.totalPages)
        setPage(pageNum)
      } catch {
        if (reset) setProducts([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [gender, subcategory, sortBy]
  )

  useEffect(() => {
    loadProducts(1, true)
  }, [loadProducts])

  useEffect(() => {
    const node = loaderRef.current
    if (!node || loading || loadingMore || page >= totalPages) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadProducts(page + 1, false)
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [loading, loadingMore, page, totalPages, loadProducts])

  return (
    <div className="pb-24">
      <PageHeader
        title={title}
        showSearch
        onSearchClick={() => navigate('/search')}
      />

      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between px-4 py-3 mx-4 mt-2 card-modern">
          <button
            type="button"
            onClick={() => navigate(`/catalog/${gender}/${subcategory ?? 'New'}/filters`)}
            className="flex items-center gap-2 text-sm font-medium text-body"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSortBy(sortBy === 'low' ? 'high' : 'low')}
              className="text-xs text-muted"
            >
              Price: {sortBy === 'low' ? 'low to high' : 'high to low'}
            </button>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <div className="px-4 py-4">
          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try a different category or check back later."
              actionLabel="Browse Shop"
              onAction={() => navigate('/shop')}
            />
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}

          {!loading && page < totalPages && (
            <div ref={loaderRef} className="py-6 flex justify-center">
              {loadingMore && <LoadingSpinner label="Loading more..." />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
