import { NavLink, useLocation } from 'react-router-dom'
import { Home, ShoppingBag, Heart, User, Handbag } from 'lucide-react'
import { useCart } from '../context/CartContext'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/shop', icon: Handbag, label: 'Shop' },
  { to: '/bag', icon: ShoppingBag, label: 'Bag' },
  { to: '/favorites', icon: Heart, label: 'Saved' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const hideOnPaths = ['/login', '/signup', '/forgot-password', '/checkout', '/success', '/admin']

export function BottomNav() {
  const location = useLocation()
  const { itemCount } = useCart()

  if (hideOnPaths.some((p) => location.pathname.startsWith(p))) return null
  if (location.pathname.startsWith('/product/') && location.pathname.includes('/filters')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 safe-area-bottom pointer-events-none">
      <div className="max-w-lg mx-auto glass rounded-2xl shadow-float pointer-events-auto">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 min-w-[52px] rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-body hover:bg-black/5 dark:hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                    {to === '/bag' && itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 gradient-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-soft">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
