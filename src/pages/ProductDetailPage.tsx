import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { StarRating } from '../components/StarRating'
import { ProductCard } from '../components/ProductCard'
import { ProductDetailSkeleton } from '../components/ui/ProductGridSkeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import { Package } from 'lucide-react'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, fetchProduct, getRelatedProducts } = useProducts()
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()

  const [product, setProduct] = useState(() => getProduct(id ?? '') ?? null)
  const [loading, setLoading] = useState(!product)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [showSizePicker, setShowSizePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    if (!id) return
    const cached = getProduct(id)
    if (cached) {
      setProduct(cached)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProduct(id).then((p) => {
      setProduct(p)
      setLoading(false)
    })
  }, [id, getProduct, fetchProduct])

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="min-h-screen surface-page">
        <PageHeader title="Product" />
        <EmptyState
          icon={Package}
          title="Product not found"
          description="This item may have been removed or is no longer available."
          actionLabel="Back to Shop"
          onAction={() => navigate('/shop')}
        />
      </div>
    )
  }

  const related = getRelatedProducts(product)

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0]
    const color = selectedColor || product.colors[0]
    addItem(product, size, color)
    showToast(`${product.title} added to bag`)
  }

  return (
    <div className="pb-28 surface-page min-h-screen">
      <PageHeader
        title=""
        rightAction={
          <button
            type="button"
            onClick={() => toggleFavorite(product.id)}
            aria-label="Toggle favorite"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isFavorite(product.id) ? '#DB3022' : 'none'}
              stroke={isFavorite(product.id) ? '#DB3022' : '#222'}
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        }
      />

      <div className="max-w-lg mx-auto">
        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-dark-elevated">
          <img
            src={product.images[activeImage] ?? product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`w-2 h-2 rounded-full ${
                    i === activeImage ? 'bg-primary' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-5 space-y-4">
          <div>
            <p className="text-xs text-muted uppercase">{product.brand}</p>
            <h2 className="text-xl font-bold mt-0.5 text-body">{product.title}</h2>
            <StarRating rating={product.rating} />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-body">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-muted line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowSizePicker(!showSizePicker)}
              className="w-full flex items-center justify-between h-12 px-4 surface-input rounded-lg"
            >
              <span className="text-sm text-body">
                Size: <strong>{selectedSize || 'Select size'}</strong>
              </span>
              <ChevronDown size={18} className={`transition-transform ${showSizePicker ? 'rotate-180' : ''}`} />
            </button>
            {showSizePicker && (
              <div className="flex flex-wrap gap-2 mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setSelectedSize(size); setShowSizePicker(false) }}
                    className={`min-w-[48px] h-10 px-3 rounded-lg text-sm font-medium border ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-default surface'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center justify-between h-12 px-4 surface-input rounded-lg"
            >
              <span className="text-sm text-body">
                Color:{' '}
                {selectedColor ? (
                  <span
                    className="inline-block w-4 h-4 rounded-full align-middle ml-1 border border-default"
                    style={{ backgroundColor: selectedColor }}
                  />
                ) : (
                  <strong>Select color</strong>
                )}
              </span>
              <ChevronDown size={18} className={`transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
            </button>
            {showColorPicker && (
              <div className="flex gap-3 mt-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { setSelectedColor(color); setShowColorPicker(false) }}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-primary scale-110' : 'border-default'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase mb-2 text-body">Description</h3>
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase mb-2 text-body">Shipping Info</h3>
            <p className="text-sm text-muted leading-relaxed">
              Free standard shipping on orders over $50. Express delivery available for $9.99.
            </p>
          </div>

          {related.length > 0 && (
            <section className="pt-2">
              <h3 className="text-sm font-bold uppercase mb-3 text-body">You can also like this</h3>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
                {related.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    variant="horizontal"
                    onClick={() => navigate(`/product/${p.id}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 surface border-t border-default p-4 z-40">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/bag')}>
            View Bag
          </Button>
          <Button fullWidth size="lg" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  )
}
