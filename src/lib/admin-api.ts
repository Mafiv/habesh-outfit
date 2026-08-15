import type { Order, Product } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const ADMIN_KEY_STORAGE = 'stylish_admin_key'

export function getAdminKey(): string | null {
  return sessionStorage.getItem(ADMIN_KEY_STORAGE)
}

export function setAdminKey(key: string) {
  sessionStorage.setItem(ADMIN_KEY_STORAGE, key)
}

export function clearAdminKey() {
  sessionStorage.removeItem(ADMIN_KEY_STORAGE)
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const key = getAdminKey()
  if (!key) throw new Error('Admin key required')

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': key,
      ...(options.headers as Record<string, string>),
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `Admin API error ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const adminApi = {
  verifyKey: async (key: string) => {
    const res = await fetch(`${API_URL}/admin/orders/`, {
      headers: { 'X-Admin-Key': key },
    })
    if (!res.ok) throw new Error('Invalid admin key')
    return res.json()
  },

  getOrders: (status?: string) =>
    adminRequest<Order[]>(`/admin/orders/${status ? `?status=${status}` : ''}`),

  updateOrder: (id: string, data: { status?: string; trackingNumber?: string }) =>
    adminRequest<Order>(`/admin/orders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getProducts: () => adminRequest<Product[]>('/admin/products/'),

  updateProduct: (id: string, data: { stock?: number; price?: number }) =>
    adminRequest<Product>(`/admin/products/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
}
