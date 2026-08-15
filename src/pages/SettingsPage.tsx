import { useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

export function SettingsPage() {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader title="Settings" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Appearance</h3>
          <div className="surface rounded-xl border border-default overflow-hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-4"
            >
              <div className="flex items-center gap-3">
                {isDark ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
                <div className="text-left">
                  <p className="text-sm font-semibold">Dark Mode</p>
                  <p className="text-xs text-muted">{isDark ? 'On' : 'Off'}</p>
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  isDark ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    isDark ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name ?? 'Jane Doe'}
                className="w-full h-12 px-4 mt-1 surface-input rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Email</label>
              <input
                type="email"
                defaultValue={user?.email ?? 'jane@example.com'}
                className="w-full h-12 px-4 mt-1 surface-input rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Password Change</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current password"
              className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Notifications</h3>
          <div className="surface rounded-xl border border-default divide-y divide-border dark:divide-border-dark">
            {['Sales and promotions', 'Order updates', 'New arrivals'].map((label) => (
              <label key={label} className="flex items-center justify-between px-4 py-4 cursor-pointer">
                <span className="text-sm">{label}</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-full h-12 bg-primary text-white font-bold text-sm uppercase rounded-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
