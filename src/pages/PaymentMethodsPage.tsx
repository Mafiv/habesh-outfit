import { useState } from 'react'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { useUserData } from '../context/UserDataContext'

export function PaymentMethodsPage() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPayment } =
    useUserData()
  const [showForm, setShowForm] = useState(false)
  const [cardNumber, setCardNumber] = useState('')

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    const last4 = cardNumber.slice(-4) || '0000'
    addPaymentMethod({
      type: 'card',
      label: `Card ending in ${last4}`,
      last4,
      brand: 'Visa',
      isDefault: paymentMethods.length === 0,
    })
    setCardNumber('')
    setShowForm(false)
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader
        title="Payment Methods"
        rightAction={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="p-1 text-primary"
            aria-label="Add payment method"
          >
            <Plus size={22} />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {showForm && (
          <form
            onSubmit={handleAddCard}
            className="surface rounded-xl p-4 border border-default space-y-3"
          >
            <h3 className="text-sm font-bold uppercase">Add Card</h3>
            <input
              type="text"
              placeholder="Card number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              required
              className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary font-mono"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="flex-1 h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="CVV"
                className="w-24 h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">Save Card</Button>
            </div>
          </form>
        )}

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`surface rounded-xl p-4 border flex items-center gap-4 ${
              method.isDefault ? 'border-primary' : 'border-default'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              {method.type === 'paypal' ? (
                <span className="text-primary font-bold text-sm">PP</span>
              ) : (
                <CreditCard size={22} className="text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{method.label}</p>
              {method.isDefault && (
                <p className="text-[10px] text-primary font-bold uppercase">Default</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!method.isDefault && (
                <button
                  type="button"
                  onClick={() => setDefaultPayment(method.id)}
                  className="text-xs text-primary font-semibold"
                >
                  Default
                </button>
              )}
              <button
                type="button"
                onClick={() => removePaymentMethod(method.id)}
                className="p-1 text-muted hover:text-primary"
                aria-label="Remove payment method"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addPaymentMethod({
              type: 'paypal',
              label: 'PayPal',
              isDefault: paymentMethods.length === 0,
            })
          }
          className="w-full surface rounded-xl p-4 border border-dashed border-default text-sm text-muted hover:border-primary hover:text-primary transition-colors"
        >
          + Link PayPal account
        </button>
      </div>
    </div>
  )
}
