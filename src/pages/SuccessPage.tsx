import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

export function SuccessPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen surface-page flex flex-col items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full" />
          <div className="absolute inset-4 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path
                d="M16 24h32l-2 24H18l-2-24z"
                stroke="#DB3022"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M24 24V18a8 8 0 0 1 16 0v6"
                stroke="#DB3022"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="48" cy="20" r="8" fill="#DB3022" />
              <path d="M45 20l2 2 4-4" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-body">Success!</h1>
        <p className="text-sm text-muted mt-3 leading-relaxed">
          Your order will be delivered soon.
          <br />
          Thank you for choosing our app!
        </p>

        <Button
          fullWidth
          size="lg"
          className="mt-8"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
