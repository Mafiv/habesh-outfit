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
import { Button } from '../components/Button'

const menuItems = [
  { icon: Package, label: 'My Orders', path: '/orders', desc: 'Track & history' },
  { icon: MapPin, label: 'Addresses', path: '/addresses', desc: 'Shipping info' },
  { icon: CreditCard, label: 'Payment Methods', path: '/payment-methods', desc: 'Cards & wallets' },
  { icon: Tag, label: 'Promocodes', path: '/promocodes', desc: 'Your discounts' },
  { icon: Star, label: 'My Reviews', path: '/reviews', desc: 'Product feedback' },
  { icon: Settings, label: 'Settings', path: '/settings', desc: 'Preferences' },
]

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <LoadingSpinner fullScreen label="Loading profile..." />
  }

  if (!isAuthenticated) {
    return (
      <div className="pb-28 page-mesh max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="card-modern p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">S</span>
          </div>
          <h2 className="text-xl font-bold text-body">Welcome to Stylish</h2>
          <p className="text-sm text-muted mt-2">
            Sign in to access orders, saved items, and personalized picks
          </p>
          <div className="flex flex-col gap-3 mt-6">
            <Button fullWidth onClick={() => navigate('/login')}>Sign in</Button>
            <Button variant="outline" fullWidth onClick={() => navigate('/signup')}>
              Create account
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-28 page-mesh max-w-lg mx-auto">
      <div className="px-4 pt-6 pb-5">
        <div className="card-modern p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-soft">
            <span className="text-2xl font-bold text-white">
              {user!.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="section-label">Account</p>
            <h1 className="text-xl font-bold text-body truncate">{user!.name}</h1>
            <p className="text-sm text-muted truncate">{user!.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {menuItems.map(({ icon: Icon, label, path, desc }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(path)}
            className="w-full card-modern p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-body">{label}</p>
              <p className="text-xs text-muted">{desc}</p>
            </div>
            <ChevronRight size={18} className="text-muted flex-shrink-0" />
          </button>
        ))}

        <button
          type="button"
          onClick={async () => {
            await logout()
            navigate('/')
          }}
          className="w-full card-modern p-4 flex items-center gap-4 mt-2 text-primary hover:bg-primary/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-semibold">Log out</span>
        </button>
      </div>
    </div>
  )
}
