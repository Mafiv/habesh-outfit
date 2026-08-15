import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '../components/Button'
import { InputField, SocialLogin, AuthFooter } from '../components/FormFields'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string })?.from ?? '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = await login(email, password)
    setSubmitting(false)
    if (ok) navigate(from, { replace: true })
    else setError('Invalid email or password')
  }

  if (authLoading) {
    return (
      <div className="min-h-screen surface-page flex items-center justify-center">
        <LoadingSpinner label="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen surface-page px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-4xl font-extrabold text-center mt-8 text-body">Login</h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-xs text-muted underline"
          >
            Forgot your password?
          </button>
        </div>

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </Button>
        {error && <p className="text-sm text-primary text-center">{error}</p>}
      </form>

      <div className="mt-8">
        <SocialLogin mode="login" />
      </div>

      <AuthFooter text="Don't have an account?" linkText="Sign up" to="/signup" />
    </div>
  )
}
