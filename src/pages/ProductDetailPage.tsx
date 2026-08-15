import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { StarRating } from '../components/StarRating'
import { ProductCard } from '../components/ProductCard'
import { getProduct, getRelatedProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

export function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [showSizePicker, setShowSizePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted">Product not found</p>
      </div>
    )
  }

  const related = getRelatedProducts(product)

  const handleAddToCart = () => {
    const size = selectedSize || product.sizes[0]
    const color = selectedColor || product.colors[0]
    addItem(product, size, color)
    navigate('/bag')
  }

  return (
    <div className="pb-28 bg-white min-h-screen">
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
        {/* Image gallery */}
        <div className="relative aspect-[3/4] bg-gray-100">
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
            <h2 className="text-xl font-bold mt-0.5">{product.title}</h2>
            <StarRating rating={product.rating} />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-muted line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Size selector */}
          <div>
            <button
              type="button"
              onClick={() => setShowSizePicker(!showSizePicker)}
              className="w-full flex items-center justify-between h-12 px-4 bg-[#f9f9f9] border border-border rounded-lg"
            >
              <span className="text-sm">
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
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizePicker(false)
                    }}
                    className={`min-w-[48px] h-10 px-3 rounded-lg text-sm font-medium border ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-white'
                        : 'border-border'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color selector */}
          <div>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-full flex items-center justify-between h-12 px-4 bg-[#f9f9f9] border border-border rounded-lg"
            >
              <span className="text-sm">
                Color:{' '}
                {selectedColor ? (
                  <span
                    className="inline-block w-4 h-4 rounded-full align-middle ml-1 border border-border"
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
                    onClick={() => {
                      setSelectedColor(color)
                      setShowColorPicker(false)
                    }}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-2">Description</h3>
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>

          {/* Shipping info */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-2">Shipping Info</h3>
            <p className="text-sm text-muted leading-relaxed">
              Free standard shipping on orders over $50. Express delivery available
              for $9.99. Returns accepted within 30 days.
            </p>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <section className="pt-2">
              <h3 className="text-sm font-bold uppercase mb-3">You can also like this</h3>
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

      {/* Sticky add to cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40">
        <div className="max-w-lg mx-auto">
          <Button fullWidth size="lg" onClick={handleAddToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  )
}
