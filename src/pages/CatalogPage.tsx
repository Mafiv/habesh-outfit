import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProductCard } from '../components/ProductCard'
import { ViewToggle, ProductListItem } from '../components/CatalogHelpers'
import { categories } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { ProductGridSkeleton } from '../components/ui/ProductGridSkeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Package } from 'lucide-react'

export function CatalogPage() {
  const { gender, subcategory } = useParams()
  const navigate = useNavigate()
  const { getProductsByCategory, loading } = useProducts()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'low' | 'high'>('low')

  const cat = categories.find((c) => c.gender === gender)
  const title = subcategory
    ? `${cat?.name ?? ''} · ${subcategory}`
    : cat?.name ?? 'Catalog'

  let products = getProductsByCategory(gender, subcategory)
  products = [...products].sort((a, b) =>
    sortBy === 'low' ? a.price - b.price : b.price - a.price
  )

  return (
    <div className="pb-24">
      <PageHeader
        title={title}
        showSearch
        onSearchClick={() => navigate('/search')}
      />

      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between px-4 py-3 surface border-b border-default">
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
        </div>
      </div>
    </div>
  )
}
