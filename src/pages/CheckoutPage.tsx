import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { useCart } from '../context/CartContext'

const addresses = [
  { id: '1', name: 'Jane Doe', address: '123 Fashion St', city: 'New York, NY 10001', isDefault: true },
  { id: '2', name: 'Jane Doe', address: '456 Style Ave', city: 'Brooklyn, NY 11201' },
]

type Step = 'address' | 'payment' | 'review'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, discount, clearCart } = useCart()
  const [step, setStep] = useState<Step>('address')
  const [selectedAddress, setSelectedAddress] = useState('1')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal - discount + shipping

  const submitOrder = () => {
    clearCart()
    navigate('/success')
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'address', label: 'Address' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ]

  return (
    <div className="pb-24 min-h-screen bg-white">
      <PageHeader title="Checkout" />

      <div className="max-w-lg mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.key
                    ? 'bg-primary text-white'
                    : steps.findIndex((x) => x.key === step) > i
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-100 text-muted'
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-xs ${step === s.key ? 'font-bold' : 'text-muted'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-1" />
              )}
            </div>
          ))}
        </div>

        <div className="px-4 py-4">
          {step === 'address' && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase mb-2">Shipping Address</h2>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedAddress === addr.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold">{addr.name}</p>
                    <p className="text-sm text-muted">{addr.address}</p>
                    <p className="text-sm text-muted">{addr.city}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] text-primary font-semibold uppercase">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}
              <Button fullWidth onClick={() => setStep('payment')}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase mb-2">Payment Method</h2>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-primary"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold">Credit Card</p>
                  <p className="text-xs text-muted mt-1">**** **** **** 4242</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">
                    VISA
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer ${
                  paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="accent-primary"
                />
                <p className="text-sm font-semibold">PayPal</p>
              </label>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('address')}>
                  Back
                </Button>
                <Button fullWidth onClick={() => setStep('review')}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase mb-2">Order Summary</h2>

              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-14 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.product.title}</p>
                    <p className="text-xs text-muted">
                      {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-bold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-2">
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
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep('payment')}>
                  Back
                </Button>
                <Button fullWidth size="lg" onClick={submitOrder}>
                  Submit Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
