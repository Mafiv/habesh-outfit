import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
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
    <div className="pb-24">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-body">Stylish</h1>
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="p-2"
            aria-label="Search"
          >
            <Search size={22} />
          </button>
        </div>

        {error && <ErrorBanner message="Using offline catalog. Some features may be limited." onRetry={refresh} />}

        <div className="px-4 mt-2">
          <div className="relative rounded-2xl overflow-hidden h-48 bg-gradient-to-br from-[#222] to-[#444]">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6bf687e59?w=800&h=400&fit=crop&auto=format"
              alt="Street clothes collection"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative z-10 p-6 flex flex-col justify-end h-full">
              <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Fashion sale
              </span>
              <h2 className="text-white text-3xl font-extrabold mt-1">Street clothes</h2>
              <button
                type="button"
                onClick={() => navigate('/catalog/women/Clothes')}
                className="mt-3 self-start bg-primary text-white text-xs font-bold uppercase px-6 py-2.5 rounded-full"
              >
                Check
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 mt-5">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {categoryChips.map((chip, i) => (
              <button
                key={chip}
                type="button"
                onClick={() => navigate(`/catalog/women/${chip}`)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  i === 0
                    ? 'bg-primary text-white'
                    : 'surface text-body border border-default'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-base font-bold uppercase tracking-wide text-body">New</h3>
            <button type="button" onClick={() => navigate('/catalog/women/New')} className="text-xs text-muted">
              View all
            </button>
          </div>
          {loading ? (
            <div className="px-4"><HorizontalProductSkeleton /></div>
          ) : (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
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

        <section className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-base font-bold uppercase tracking-wide text-body">Sale</h3>
            <button type="button" onClick={() => navigate('/catalog/women/Clothes')} className="text-xs text-muted">
              View all
            </button>
          </div>
          {loading ? (
            <div className="px-4"><HorizontalProductSkeleton /></div>
          ) : (
            <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
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
