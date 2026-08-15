import { NavLink, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Heart, User, Handbag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/shop', icon: Handbag, label: 'Shop' },
  { to: '/bag', icon: ShoppingBag, label: 'Bag' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const hideOnPaths = ['/login', '/signup', '/forgot-password', '/checkout', '/success']

export function BottomNav() {
  const location = useLocation()
  const { itemCount } = useCart()

  if (hideOnPaths.some((p) => location.pathname.startsWith(p))) return null
  if (location.pathname.startsWith('/product/') && location.pathname.includes('/filters')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 surface border-t border-default safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px] ${
                isActive ? 'text-primary' : 'text-muted'
              }`
            }
          >
            <div className="relative">
              <Icon size={22} strokeWidth={1.5} />
              {to === '/bag' && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
