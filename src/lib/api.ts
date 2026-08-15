import { getAuthToken } from './auth-client'
import type { Product, Address, Order, PaymentMethod, Review, SavedPromocode } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (auth) {
    const token = await getAuthToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || `API error ${res.status}`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  health: () => request<{ status: string }>('/health/'),

  // Catalog (public)
  getProducts: (params?: { gender?: string; subcategory?: string; sort?: string }) => {
    const qs = new URLSearchParams()
    if (params?.gender) qs.set('gender', params.gender)
    if (params?.subcategory) qs.set('subcategory', params.subcategory)
    if (params?.sort) qs.set('sort', params.sort)
    const query = qs.toString()
    return request<Product[]>(`/catalog/products/${query ? `?${query}` : ''}`)
  },

  getProduct: (id: string) => request<Product>(`/catalog/products/${id}/`),

  getRelatedProducts: (id: string) =>
    request<Product[]>(`/catalog/products/${id}/related/`),

  // Orders (auth required)
  getOrders: () => request<Order[]>('/orders/', {}, true),

  getOrder: (id: string) => request<Order>(`/orders/${id}/`, {}, true),

  createOrder: (data: object) =>
    request<Order>('/orders/', { method: 'POST', body: JSON.stringify(data) }, true),

  // Addresses
  getAddresses: () => request<Address[]>('/addresses/', {}, true),

  createAddress: (data: Omit<Address, 'id'>) =>
    request<Address>('/addresses/', { method: 'POST', body: JSON.stringify(data) }, true),

  deleteAddress: (id: string) =>
    request<void>(`/addresses/${id}/`, { method: 'DELETE' }, true),

  setDefaultAddress: (id: string) =>
    request<Address>(`/addresses/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ isDefault: true }),
    }, true),

  // Payment methods
  getPaymentMethods: () => request<PaymentMethod[]>('/payment-methods/', {}, true),

  createPaymentMethod: (data: Omit<PaymentMethod, 'id'>) =>
    request<PaymentMethod>('/payment-methods/', { method: 'POST', body: JSON.stringify(data) }, true),

  deletePaymentMethod: (id: string) =>
    request<void>(`/payment-methods/${id}/`, { method: 'DELETE' }, true),

  setDefaultPayment: (id: string) =>
    request<PaymentMethod>(`/payment-methods/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ isDefault: true }),
    }, true),

  // Reviews
  getReviews: () => request<Review[]>('/reviews/', {}, true),

  createReview: (data: Omit<Review, 'id' | 'date'>) =>
    request<Review>('/reviews/', { method: 'POST', body: JSON.stringify(data) }, true),

  deleteReview: (id: string) =>
    request<void>(`/reviews/${id}/`, { method: 'DELETE' }, true),

  // Favorites
  getFavorites: () => request<Product[]>('/favorites/', {}, true),

  toggleFavorite: (productId: string) =>
    request<{ favorited: boolean }>('/favorites/', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }, true),

  // Promocodes
  getPromocodes: () => request<SavedPromocode[]>('/payments/promocodes/', {}, true),

  // Stripe
  createCheckoutSession: (data: object) =>
    request<{ sessionId: string; url: string }>(
      '/payments/create-checkout-session/',
      { method: 'POST', body: JSON.stringify(data) },
      true
    ),
}

export function isBackendConfigured(): boolean {
  return Boolean(import.meta.env.VITE_API_URL || true)
}
