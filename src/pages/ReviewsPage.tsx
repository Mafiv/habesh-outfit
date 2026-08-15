import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Trash2, Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { useUserData } from '../context/UserDataContext'
import { products } from '../data/products'
import { useProducts } from '../context/ProductsContext'

export function ReviewsPage() {
  const navigate = useNavigate()
  const { reviews, addReview, removeReview } = useUserData()
  const [showForm, setShowForm] = useState(false)
  const { products: catalogProducts } = useProducts()
  const productList = catalogProducts.length ? catalogProducts : products
  const [selectedProduct, setSelectedProduct] = useState(productList[0]?.id ?? '')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const product = productList.find((p) => p.id === selectedProduct)!
    await addReview({
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      rating,
      comment,
    })
    setComment('')
    setRating(5)
    setShowForm(false)
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader
        title="My Reviews"
        rightAction={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="p-1 text-primary"
            aria-label="Add review"
          >
            <Plus size={22} />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="surface rounded-xl p-4 border border-default space-y-4"
          >
            <h3 className="text-sm font-bold uppercase">Write a Review</h3>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none"
            >
              {productList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <div>
              <p className="text-xs text-muted mb-2">Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    aria-label={`Rate ${i + 1} stars`}
                  >
                    <Star
                      size={24}
                      fill={i < rating ? '#FFB800' : 'none'}
                      stroke={i < rating ? '#FFB800' : '#E8E8E8'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 surface-input rounded-lg text-sm outline-none resize-none"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">Submit</Button>
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <Star size={48} className="mx-auto text-muted mb-4" />
            <p className="font-bold">No reviews yet</p>
            <p className="text-sm text-muted mt-1">Share your thoughts on products you've purchased</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="surface rounded-xl p-4 border border-default"
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/product/${review.productId}`)}
                  className="flex-shrink-0"
                >
                  <img
                    src={review.productImage}
                    alt={review.productTitle}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold truncate">{review.productTitle}</p>
                      <p className="text-xs text-muted">{review.date}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReview(review.id)}
                      className="p-1 text-muted hover:text-primary flex-shrink-0"
                      aria-label="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? '#FFB800' : 'none'}
                        stroke={i < review.rating ? '#FFB800' : '#E8E8E8'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
