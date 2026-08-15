import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X, Clock } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { ProductListItem } from '../components/CatalogHelpers'
import { useProducts } from '../context/ProductsContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { EmptyState } from '../components/ui/EmptyState'
import type { Product } from '../types'

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
  const [results, setResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const { searchProducts } = useProducts()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const data = await searchProducts(query)
        if (!cancelled) setResults(data)
      } finally {
        if (!cancelled) setSearching(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, searchProducts])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    if (value.trim()) {
      setSearchParams({ q: value.trim() })
      saveRecentSearch(value)
      setRecent(getRecentSearches())
    } else {
      setSearchParams({})
    }
  }, [setSearchParams])

  const clearRecent = () => {
    localStorage.removeItem(RECENT_KEY)
    setRecent([])
  }

  return (
    <div className="pb-28 min-h-screen page-mesh">
      <PageHeader title="Search" />

      <div className="max-w-lg mx-auto px-4 pt-2">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products, brands..."
            className="w-full h-12 pl-11 pr-11 card-modern text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {!query.trim() && recent.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase text-muted flex items-center gap-1.5">
                <Clock size={14} /> Recent
              </h2>
              <button type="button" onClick={clearRecent} className="text-xs text-primary">
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSearch(term)}
                  className="px-3 py-1.5 rounded-full text-xs surface border border-default"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && searching && (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner label="Searching..." />
          </div>
        )}

        {query.trim() && !searching && results.length === 0 && (
          <EmptyState
            icon={Search}
            title="No results"
            description={`Nothing found for "${query}". Try another search term.`}
          />
        )}

        {query.trim() && !searching && results.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted mb-2">{results.length} results</p>
            {results.map((product) => (
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
  )
}
