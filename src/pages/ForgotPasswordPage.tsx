import { useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { InputField } from '../components/FormFields'
import { useAuth } from '../context/AuthContext'

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = await requestPasswordReset(email)
    setSubmitting(false)
    if (ok) setSent(true)
    else setError('Could not send reset email. Check the address or try again.')
  }

  return (
    <div className="min-h-screen surface-page">
      <PageHeader title="Forgot Password" />

      <div className="max-w-lg mx-auto px-4 py-8">
        {sent ? (
          <div className="text-center mt-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#DB3022" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-body">Check your email</h2>
            <p className="text-sm text-muted mt-2">
              If an account exists for {email}, you will receive a password reset link.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Enter your email address and we will send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <Button type="submit" fullWidth size="lg" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send'}
              </Button>
              {error && <p className="text-sm text-primary text-center">{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  )
}
