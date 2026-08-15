import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X, Clock } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProductListItem } from '../components/CatalogHelpers'
import { useProducts } from '../context/ProductsContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'

const RECENT_KEY = 'stylish_recent_searches'

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecentSearch(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return
  const recent = getRecentSearches().filter((s) => s !== trimmed)
  localStorage.setItem(RECENT_KEY, JSON.stringify([trimmed, ...recent].slice(0, 8)))
}

export function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [recent, setRecent] = useState<string[]>(getRecentSearches())
  const { products, loading, searchProducts } = useProducts()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return searchProducts(query)
  }, [query, searchProducts, products])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setSearchParams({ q: value.trim() })
      saveRecentSearch(value)
      setRecent(getRecentSearches())
    } else {
      setSearchParams({})
    }
  }

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecent([])
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader title="Search" />

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search products, brands..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="w-full h-12 pl-11 pr-10 surface-input rounded-full text-sm outline-none focus:border-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {!query.trim() && recent.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase text-body flex items-center gap-2">
                <Clock size={14} />
                Recent
              </h3>
              <button
                type="button"
                onClick={clearRecent}
                className="text-xs text-muted"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 rounded-full text-sm surface border border-default text-body"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && loading && (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner label="Searching..." />
          </div>
        )}

        {query.trim() && !loading && results.length === 0 && (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find anything for "${query}". Try a different search term.`}
            actionLabel="Browse Shop"
            onAction={() => navigate('/shop')}
          />
        )}

        {query.trim() && !loading && results.length > 0 && (
          <div className="mt-6">
            <p className="text-xs text-muted mb-3">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <div className="space-y-3">
              {results.map((product) => (
                <ProductListItem
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {!query.trim() && recent.length === 0 && (
          <div className="mt-12 text-center">
            <Search size={48} className="mx-auto text-muted mb-4 opacity-40" />
            <p className="text-sm text-muted">Search for clothes, shoes, brands...</p>
          </div>
        )}
      </div>
    </div>
  )
}
