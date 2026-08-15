import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { Button } from '../components/Button'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    promocode,
    setPromocode,
    discount,
  } = useCart()
  const [promoInput, setPromoInput] = useState(promocode)
  const [promoError, setPromoError] = useState('')

  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal - discount + shipping

  const applyPromo = () => {
    const valid = ['SAVE10', 'STYLE20'].includes(promoInput.toUpperCase())
    if (valid) {
      setPromocode(promoInput)
      setPromoError('')
    } else {
      setPromoError('Invalid promocode')
    }
  }

  if (items.length === 0) {
    return (
      <div className="pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">Your bag is empty</h2>
        <p className="text-sm text-muted mt-1 text-center">
          Add items to get started with your shopping
        </p>
        <Button className="mt-6" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-32">
      <div className="max-w-lg mx-auto">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-extrabold text-body">My Bag</h1>
          <p className="text-xs text-muted mt-1">{items.length} items</p>
        </div>

        <div className="px-4 space-y-3 mt-2">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-3 surface rounded-xl p-3 shadow-sm border border-default"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-20 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted uppercase">{item.product.brand}</p>
                    <p className="text-sm font-semibold truncate">{item.product.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.product.id, item.size, item.color)
                    }
                    className="p-1 text-muted"
                    aria-label="Remove item"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted">Size: {item.size}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 border border-border rounded-full px-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="p-1.5"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="p-1.5"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promocode */}
        <div className="px-4 mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promocode"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 h-12 px-4 bg-[#f9f9f9] border border-border rounded-lg text-sm outline-none focus:border-primary"
            />
            <Button variant="outline" size="sm" onClick={applyPromo} className="flex-shrink-0">
              Apply
            </Button>
          </div>
          {promoError && <p className="text-xs text-primary mt-1">{promoError}</p>}
          {discount > 0 && (
            <p className="text-xs text-green-600 mt-1">
              Promocode applied! You save ${discount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="px-4 mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">Discount</span>
              <span className="text-green-600">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted">Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 surface border-t border-default p-4 z-40">
        <div className="max-w-lg mx-auto">
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate(isAuthenticated ? '/checkout' : '/login', {
              state: isAuthenticated ? undefined : { from: '/checkout' },
            })}
          >
            {isAuthenticated ? `Checkout · $${total.toFixed(2)}` : 'Login to Checkout'}
          </Button>
        </div>
      </div>
    </div>
  )
}
