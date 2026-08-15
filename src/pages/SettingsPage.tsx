import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function SettingsPage() {
  const navigate = useNavigate()

  return (
    <div className="pb-24 min-h-screen bg-white">
      <PageHeader title="Settings" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted">Full Name</label>
              <input
                type="text"
                defaultValue="Jane Doe"
                className="w-full h-12 px-4 mt-1 bg-[#f9f9f9] border border-border rounded-lg text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted">Email</label>
              <input
                type="email"
                defaultValue="jane@example.com"
                className="w-full h-12 px-4 mt-1 bg-[#f9f9f9] border border-border rounded-lg text-sm outline-none focus:border-primary"
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
              className="w-full h-12 px-4 bg-[#f9f9f9] border border-border rounded-lg text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full h-12 px-4 bg-[#f9f9f9] border border-border rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase mb-4">Notifications</h3>
          <div className="space-y-4">
            {['Sales and promotions', 'Order updates', 'New arrivals'].map((label) => (
              <label key={label} className="flex items-center justify-between cursor-pointer">
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
