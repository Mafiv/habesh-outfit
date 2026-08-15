import { useState, useEffect } from 'react'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { StripeCardForm } from '../components/StripeCardForm'
import { useUserData } from '../context/UserDataContext'
import { api } from '../lib/api'

export function PaymentMethodsPage() {
  const { paymentMethods, removePaymentMethod, setDefaultPayment, refresh } = useUserData()
  const [showStripeForm, setShowStripeForm] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [publishableKey, setPublishableKey] = useState('')
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getStripeConfig().then((cfg) => {
      setStripeEnabled(cfg.stripeEnabled)
      setPublishableKey(cfg.publishableKey)
    }).catch(() => {})
  }, [])

  const startAddCard = async () => {
    if (!stripeEnabled) {
      setShowStripeForm(true)
      return
    }
    setLoading(true)
    try {
      const { clientSecret: secret } = await api.createSetupIntent()
      setClientSecret(secret)
      setShowStripeForm(true)
    } catch {
      /* Stripe unavailable */
    } finally {
      setLoading(false)
    }
  }

  const handleStripeSuccess = async () => {
    await api.syncStripePaymentMethods()
    await refresh()
    setShowStripeForm(false)
    setClientSecret('')
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader
        title="Payment Methods"
        rightAction={
          <button
            type="button"
            onClick={startAddCard}
            disabled={loading}
            className="p-1 text-primary"
            aria-label="Add payment method"
          >
            <Plus size={22} />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {showStripeForm && stripeEnabled && clientSecret && publishableKey && (
          <div className="surface rounded-xl p-4 border border-default">
            <h3 className="text-sm font-bold uppercase mb-3">Add Card (Stripe)</h3>
            <StripeCardForm
              clientSecret={clientSecret}
              publishableKey={publishableKey}
              onSuccess={handleStripeSuccess}
              onCancel={() => {
                setShowStripeForm(false)
                setClientSecret('')
              }}
            />
          </div>
        )}

        {showStripeForm && !stripeEnabled && (
          <div className="surface rounded-xl p-4 border border-default">
            <p className="text-sm text-muted">
              Stripe is not configured. Add STRIPE_SECRET_KEY to enable secure card storage.
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowStripeForm(false)}>
              Close
            </Button>
          </div>
        )}

        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`surface rounded-xl p-4 border flex items-center gap-4 ${
              method.isDefault ? 'border-primary' : 'border-default'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard size={22} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{method.label}</p>
              {method.last4 && (
                <p className="text-xs text-muted">**** **** **** {method.last4}</p>
              )}
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

        {paymentMethods.length === 0 && !showStripeForm && (
          <p className="text-sm text-muted text-center py-8">
            No payment methods saved. Tap + to add a card.
          </p>
        )}
      </div>
    </div>
  )
}
