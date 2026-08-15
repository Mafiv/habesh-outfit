import { useState, useEffect, useCallback } from 'react'
import { Shield, Package, Truck, LogOut } from 'lucide-react'
import { Button } from '../components/Button'
import { adminApi, getAdminKey, setAdminKey, clearAdminKey } from '../lib/admin-api'
import type { Order, OrderStatus, Product } from '../types'

const STATUS_OPTIONS: OrderStatus[] = [
  'pending_payment',
  'processing',
  'shipped',
  'in_transit',
  'delivered',
  'cancelled',
]

export function AdminPage() {
  const [keyInput, setKeyInput] = useState('')
  const [authenticated, setAuthenticated] = useState(!!getAdminKey())
  const [tab, setTab] = useState<'orders' | 'products'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [ords, prods] = await Promise.all([
        adminApi.getOrders(),
        adminApi.getProducts(),
      ])
      setOrders(ords)
      setProducts(prods)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
      if (err instanceof Error && err.message.includes('Unauthorized')) {
        clearAdminKey()
        setAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated, loadData])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await adminApi.verifyKey(keyInput)
      setAdminKey(keyInput)
      setAuthenticated(true)
    } catch {
      setError('Invalid admin key')
    }
  }

  const handleLogout = () => {
    clearAdminKey()
    setAuthenticated(false)
    setKeyInput('')
  }

  const updateOrderStatus = async (mongoId: string, status: OrderStatus) => {
    await adminApi.updateOrder(mongoId, { status })
    await loadData()
  }

  const updateProductStock = async (id: string, stock: number) => {
    await adminApi.updateProduct(id, { stock })
    await loadData()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen surface-page flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 surface rounded-2xl p-6 border border-default">
          <div className="flex items-center gap-2 text-primary">
            <Shield size={24} />
            <h1 className="text-xl font-bold text-body">Admin Dashboard</h1>
          </div>
          <p className="text-sm text-muted">Enter your admin API key to manage orders and inventory.</p>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin API key"
            className="w-full h-12 px-4 surface-input rounded-lg text-sm outline-none focus:border-primary"
            required
          />
          {error && <p className="text-xs text-primary">{error}</p>}
          <Button fullWidth type="submit">Sign In</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen surface-page pb-12">
      <header className="sticky top-0 z-30 surface border-b border-default px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-body">Admin</h1>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              tab === 'orders' ? 'bg-primary text-white' : 'surface border border-default text-body'
            }`}
          >
            <Truck size={16} className="inline mr-1" /> Orders
          </button>
          <button
            type="button"
            onClick={() => setTab('products')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
              tab === 'products' ? 'bg-primary text-white' : 'surface border border-default text-body'
            }`}
          >
            <Package size={16} className="inline mr-1" /> Products
          </button>
        </div>

        {error && <p className="text-sm text-primary mb-4">{error}</p>}
        {loading && <p className="text-sm text-muted">Loading...</p>}

        {tab === 'orders' && !loading && (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.mongoId ?? order.id} className="surface rounded-xl p-4 border border-default">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-body">{order.id}</p>
                    <p className="text-xs text-muted">{order.date} · ${order.total.toFixed(2)}</p>
                  </div>
                  <span className="text-xs font-semibold uppercase text-primary">{order.status}</span>
                </div>
                <p className="text-xs text-muted mb-2">
                  {order.items.length} items · Tracking: {order.trackingNumber}
                </p>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.mongoId!, e.target.value as OrderStatus)
                  }
                  className="w-full h-10 px-3 surface-input rounded-lg text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-muted text-center py-8">No orders yet</p>
            )}
          </div>
        )}

        {tab === 'products' && !loading && (
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="surface rounded-xl p-4 border border-default flex gap-3">
                <img src={product.image} alt={product.title} className="w-14 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-body">{product.title}</p>
                  <p className="text-xs text-muted">{product.brand} · ${product.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <label className="text-xs text-muted">Stock:</label>
                    <input
                      type="number"
                      min={0}
                      defaultValue={product.stock ?? 0}
                      onBlur={(e) => updateProductStock(product.id, Number(e.target.value))}
                      className="w-20 h-8 px-2 surface-input rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
