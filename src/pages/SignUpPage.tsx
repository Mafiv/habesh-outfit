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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    signup(name, email, password)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-4xl font-extrabold text-center mt-8">Sign up</h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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

        <Button type="submit" fullWidth size="lg">
          Sign up
        </Button>
      </form>

      <div className="mt-8">
        <SocialLogin mode="signup" />
      </div>

      <AuthFooter text="Already have an account?" linkText="Login" to="/login" />
    </div>
  )
}
