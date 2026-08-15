import { useNavigate } from 'react-router-dom'
import { Search, Sparkles, ArrowRight } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { categoryChips } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import { HorizontalProductSkeleton } from '../components/ui/ProductGridSkeleton'
import { ErrorBanner } from '../components/ui/ErrorBanner'

export function HomePage() {
  const navigate = useNavigate()
  const { getNewProducts, getSaleProducts, loading, error, refresh } = useProducts()
  const newProducts = getNewProducts()
  const saleProducts = getSaleProducts()

  return (
    <div className="pb-28 page-mesh">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-label">Welcome back</p>
              <h1 className="page-title">Stylish</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="w-10 h-10 rounded-xl glass shadow-soft flex items-center justify-center text-body focus-ring"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/search')}
            className="w-full h-12 px-4 rounded-xl glass shadow-soft flex items-center gap-3 text-left focus-ring"
          >
            <Search size={18} className="text-muted" />
            <span className="text-sm text-muted">Search brands, styles...</span>
          </button>
        </div>

        {error && (
          <div className="px-4 mb-2">
            <ErrorBanner message="Using offline catalog. Some features may be limited." onRetry={refresh} />
          </div>
        )}

        {/* Hero */}
        <div className="px-4 mt-2">
          <div className="relative rounded-3xl overflow-hidden h-52 shadow-card">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6bf687e59?w=800&h=400&fit=crop&auto=format"
              alt="Street clothes collection"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <div className="flex items-center gap-1.5 text-accent mb-1">
                <Sparkles size={14} />
                <span className="text-xs font-semibold uppercase tracking-wider">Summer drop</span>
              </div>
              <h2 className="text-white text-2xl font-bold tracking-tight">Street essentials</h2>
              <p className="text-white/75 text-sm mt-1">Up to 40% off selected items</p>
              <button
                type="button"
                onClick={() => navigate('/catalog/women/Clothes')}
                className="mt-4 self-start inline-flex items-center gap-2 gradient-primary text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-soft"
              >
                Shop now
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Category chips */}
        <div className="px-4 mt-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {categoryChips.map((chip, i) => (
              <button
                key={chip}
                type="button"
                onClick={() => navigate(`/catalog/women/${chip}`)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  i === 0
                    ? 'gradient-primary text-white shadow-soft'
                    : 'card-modern text-body hover:-translate-y-0.5'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* New arrivals */}
        <section className="mt-8">
          <div className="flex items-end justify-between px-4 mb-4">
            <div>
              <p className="section-label">Fresh picks</p>
              <h3 className="text-lg font-bold text-body">New arrivals</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/catalog/women/New')}
              className="text-xs font-semibold text-primary"
            >
              View all
            </button>
          </div>
          {loading ? (
            <div className="px-4"><HorizontalProductSkeleton /></div>
          ) : (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="horizontal"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sale */}
        <section className="mt-8">
          <div className="flex items-end justify-between px-4 mb-4">
            <div>
              <p className="section-label">Limited time</p>
              <h3 className="text-lg font-bold text-body">On sale</h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/catalog/women/Clothes')}
              className="text-xs font-semibold text-primary"
            >
              View all
            </button>
          </div>
          {loading ? (
            <div className="px-4"><HorizontalProductSkeleton /></div>
          ) : (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4 pb-1">
              {saleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="horizontal"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
