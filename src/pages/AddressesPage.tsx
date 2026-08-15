import { useState } from 'react'
import { MapPin, Plus, Trash2, Star } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { useAddresses } from '../context/UserDataContext'

export function AddressesPage() {
  const { addresses, addAddress, removeAddress, setDefaultAddress } = useAddresses()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addAddress({ ...form, isDefault: addresses.length === 0 })
    setForm({ name: '', address: '', city: '', zip: '' })
    setShowForm(false)
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader
        title="Shipping Addresses"
        rightAction={
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="p-1 text-primary"
            aria-label="Add address"
          >
            <Plus size={22} />
          </button>
        }
      />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="surface rounded-xl p-4 border border-default space-y-3"
          >
            <h3 className="text-sm font-bold uppercase">New Address</h3>
            {(['name', 'address', 'city', 'zip'] as const).map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
              />
            ))}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">Save</Button>
            </div>
          </form>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`surface rounded-xl p-4 border ${
              addr.isDefault ? 'border-primary' : 'border-default'
            }`}
          >
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{addr.name}</p>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold uppercase text-primary flex items-center gap-0.5">
                      <Star size={10} fill="currentColor" /> Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{addr.address}</p>
                <p className="text-sm text-muted">
                  {addr.city}, {addr.zip}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeAddress(addr.id)}
                className="p-1 text-muted hover:text-primary"
                aria-label="Remove address"
              >
                <Trash2 size={18} />
              </button>
            </div>
            {!addr.isDefault && (
              <button
                type="button"
                onClick={() => setDefaultAddress(addr.id)}
                className="mt-3 text-xs text-primary font-semibold"
              >
                Set as default
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
