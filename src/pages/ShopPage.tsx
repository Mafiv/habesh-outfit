import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { categories } from '../data/products'

export function ShopPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-extrabold">Categories</h1>
      </div>

      <div className="px-4 space-y-4 mt-2">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => navigate(`/catalog/${cat.gender}`)}
              className="w-full flex items-center justify-between p-4 border-b border-border"
            >
              <span className="text-base font-bold">{cat.name}</span>
              <ChevronRight size={20} className="text-muted" />
            </button>
            <div className="grid grid-cols-2 gap-px bg-border">
              {cat.subcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => navigate(`/catalog/${cat.gender}/${sub}`)}
                  className="bg-white p-4 text-sm font-medium text-left hover:bg-gray-50 transition-colors"
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
