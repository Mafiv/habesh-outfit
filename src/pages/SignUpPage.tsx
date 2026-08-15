import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { InputField, SocialLogin, AuthFooter } from '../components/FormFields'
import { useAuth } from '../context/AuthContext'

export function SignUpPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = await signup(name, email, password)
    setSubmitting(false)
    if (ok) navigate('/')
    else setError('Sign up failed. Try a different email.')
  }

  return (
    <div className="min-h-screen surface-page px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-4xl font-extrabold text-center mt-8 text-body">Sign up</h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" minLength={6} />

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </Button>
        {error && <p className="text-sm text-primary text-center">{error}</p>}
      </form>

      <div className="mt-8">
        <SocialLogin mode="signup" />
      </div>

      <AuthFooter text="Already have an account?" linkText="Login" to="/login" />
    </div>
  )
}
