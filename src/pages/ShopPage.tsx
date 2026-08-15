import { useNavigate } from 'react-router-dom'
import { ChevronRight, Sparkles } from 'lucide-react'
import { categories } from '../data/products'

export function ShopPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-28 page-mesh max-w-lg mx-auto">
      <div className="px-4 pt-5 pb-4">
        <p className="section-label">Browse</p>
        <h1 className="page-title">Categories</h1>
        <p className="text-sm text-muted mt-1">Find your next favorite look</p>
      </div>

      <div className="px-4 space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card-modern overflow-hidden">
            <button
              type="button"
              onClick={() => navigate(`/catalog/${cat.gender}`)}
              className="w-full flex items-center justify-between p-4 border-b border-default hover:bg-gray-50/80 dark:hover:bg-dark-elevated/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-primary" />
                </div>
                <span className="text-base font-bold text-body">{cat.name}</span>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </button>
            <div className="grid grid-cols-2 gap-px bg-border/60 dark:bg-border-dark">
              {cat.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => navigate(`/catalog/${cat.gender}/${sub}`)}
                  className="surface p-4 text-sm font-medium text-left text-body hover:bg-primary/5 transition-colors"
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
