import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authClient } from '../lib/auth-client'
import { useToast } from '../context/ToastContext'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function InputField({ label, id, className = '', ...props }: InputFieldProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-xs text-muted font-semibold tracking-wide">
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full h-12 px-4 surface-input rounded-xl text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 transition-all ${className}`}
        {...props}
      />
    </div>
  )
}

interface SocialLoginProps {
  mode: 'login' | 'signup'
}

export function SocialLogin({ mode: _mode }: SocialLoginProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleGoogle = async () => {
    setLoading('google')
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin,
      })
    } catch {
      showToast('Google sign-in unavailable. Check auth service config.', 'error')
    } finally {
      setLoading(null)
    }
  }

  const handleFacebook = () => {
    showToast('Facebook login coming soon', 'info')
  }

  return (
    <div className="space-y-4">
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-default" />
        <span className="px-4 text-xs text-muted font-medium">Or continue with</span>
        <div className="flex-1 border-t border-default" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={!!loading}
          className="h-12 rounded-xl border border-default surface flex items-center justify-center gap-2 text-sm font-medium text-body hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors disabled:opacity-50 focus-ring"
          aria-label="Login with Google"
        >
          {loading === 'google' ? (
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleFacebook}
          disabled={!!loading}
          className="h-12 rounded-xl bg-[#1877F2] flex items-center justify-center gap-2 text-sm font-medium text-white hover:opacity-95 transition-opacity disabled:opacity-50 focus-ring"
          aria-label="Login with Facebook"
        >
          Facebook
        </button>
      </div>
    </div>
  )
}

export function AuthFooter({ text, linkText, to }: { text: string; linkText: string; to: string }) {
  return (
    <p className="text-center text-sm text-muted mt-8">
      {text}{' '}
      <Link to={to} className="text-primary font-semibold hover:underline">
        {linkText}
      </Link>
    </p>
  )
}

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="min-h-screen surface-page page-mesh px-4 py-8 max-w-lg mx-auto flex flex-col justify-center">
      <div className="card-modern p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto mb-4 shadow-soft flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-body tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted mt-2">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}
