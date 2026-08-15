import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { getStripe } from '../lib/stripe'
import { Button } from './Button'

interface StripeCardFormProps {
  clientSecret: string
  publishableKey: string
  onSuccess: () => void
  onCancel: () => void
}

function SetupForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    const { error: submitError } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    })

    setLoading(false)

    if (submitError) {
      setError(submitError.message ?? 'Failed to save card')
      return
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-xs text-primary">{error}</p>}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!stripe || loading}>
          {loading ? 'Saving...' : 'Save Card'}
        </Button>
      </div>
    </form>
  )
}

export function StripeCardForm({
  clientSecret,
  publishableKey,
  onSuccess,
  onCancel,
}: StripeCardFormProps) {
  const stripePromise = getStripe(publishableKey)

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <SetupForm onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}
