import { LayoutGrid, List } from 'lucide-react'

interface ViewToggleProps {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`p-2 rounded ${view === 'grid' ? 'text-primary' : 'text-muted'}`}
        aria-label="Grid view"
      >
        <LayoutGrid size={20} />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`p-2 rounded ${view === 'list' ? 'text-primary' : 'text-muted'}`}
        aria-label="List view"
      >
        <List size={20} />
      </button>
    </div>
  )
}

interface ProductListItemProps {
  product: {
    id: string
    title: string
    brand: string
    price: number
    originalPrice?: number
    rating: number
    image: string
    isNew?: boolean
    isSale?: boolean
  }
  onClick: () => void
}

export function ProductListItem({ product, onClick }: ProductListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex gap-3 bg-white rounded-lg p-3 shadow-sm w-full text-left"
    >
      <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        {product.isNew && (
          <span className="absolute top-1 left-1 bg-black text-white text-[8px] font-semibold px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 py-1">
        <p className="text-xs text-muted uppercase">{product.brand}</p>
        <p className="text-sm font-semibold truncate">{product.title}</p>
        <p className="text-xs text-muted mt-1">★ {product.rating}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </button>
  )
}
