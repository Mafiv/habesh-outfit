import { useNavigate } from 'react-router-dom'
import {
  Package,
  MapPin,
  CreditCard,
  Tag,
  Star,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/orders' },
  { icon: MapPin, label: 'Shipping Addresses', path: '/addresses' },
  { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods' },
  { icon: Tag, label: 'Promocodes', path: '/promocodes' },
  { icon: Star, label: 'My Reviews', path: '/reviews' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading profile..." />
  }

  if (!isAuthenticated) {
    return (
      <div className="pb-24 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">Welcome to Stylish</h2>
        <p className="text-sm text-muted mt-1 text-center">
          Sign in to access your orders and preferences
        </p>
        <div className="flex gap-3 mt-6 w-full max-w-xs">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex-1 h-12 border-2 border-primary text-primary font-bold text-sm uppercase rounded-full"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="flex-1 h-12 bg-primary text-white font-bold text-sm uppercase rounded-full"
          >
            Sign up
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-24 max-w-lg mx-auto">
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {user!.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">{user!.name}</h1>
            <p className="text-sm text-muted">{user!.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-2">
        <div className="surface rounded-xl shadow-sm overflow-hidden border border-default">
          {menuItems.map(({ icon: Icon, label, path }, i) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-default' : ''
              }`}
            >
              <Icon size={20} className="text-muted" />
              <span className="flex-1 text-left text-sm font-medium text-body">{label}</span>
              <ChevronRight size={18} className="text-muted" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={async () => {
            await logout()
            navigate('/')
          }}
          className="w-full flex items-center gap-4 px-4 py-4 mt-4 surface rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors border border-default"
        >
          <LogOut size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">Logout</span>
        </button>
      </div>
    </div>
  )
}
