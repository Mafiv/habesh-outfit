import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { InputField, SocialLogin, AuthFooter } from '../components/FormFields'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login(email, password)
    navigate('/')
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
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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

        <Button type="submit" fullWidth size="lg">
          Login
        </Button>
      </form>

      <div className="mt-8">
        <SocialLogin mode="login" />
      </div>

      <AuthFooter text="Don't have an account?" linkText="Sign up" to="/signup" />
    </div>
  )
}
