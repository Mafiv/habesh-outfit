import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { Address, Order, PaymentMethod, Review, SavedPromocode, CartItem } from '../types'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

interface UserDataContextType {
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  promocodes: SavedPromocode[]
  reviews: Review[]
  loading: boolean
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>
  removeAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => Promise<void>
  removePaymentMethod: (id: string) => Promise<void>
  setDefaultPayment: (id: string) => Promise<void>
  createOrder: (params: {
    items: CartItem[]
    subtotal: number
    discount: number
    shipping: number
    total: number
    addressId: string
  }) => Promise<Order>
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>
  removeReview: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const UserDataContext = createContext<UserDataContextType | null>(null)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [promocodes, setPromocodes] = useState<SavedPromocode[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([])
      setPaymentMethods([])
      setOrders([])
      setPromocodes([])
      setReviews([])
      return
    }

    setLoading(true)
    try {
      const [addrs, methods, ords, promos, revs] = await Promise.all([
        api.getAddresses(),
        api.getPaymentMethods(),
        api.getOrders(),
        api.getPromocodes(),
        api.getReviews(),
      ])
      setAddresses(addrs)
      setPaymentMethods(methods)
      setOrders(ords)
      setPromocodes(promos)
      setReviews(revs)
    } catch (err) {
      console.error('Failed to load user data:', err)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addAddress = useCallback(async (address: Omit<Address, 'id'>) => {
    await api.createAddress(address)
    await refresh()
  }, [refresh])

  const removeAddress = useCallback(async (id: string) => {
    await api.deleteAddress(id)
    await refresh()
  }, [refresh])

  const setDefaultAddress = useCallback(async (id: string) => {
    await api.setDefaultAddress(id)
    await refresh()
  }, [refresh])

  const addPaymentMethod = useCallback(async (method: Omit<PaymentMethod, 'id'>) => {
    await api.createPaymentMethod(method)
    await refresh()
  }, [refresh])

  const removePaymentMethod = useCallback(async (id: string) => {
    await api.deletePaymentMethod(id)
    await refresh()
  }, [refresh])

  const setDefaultPayment = useCallback(async (id: string) => {
    await api.setDefaultPayment(id)
    await refresh()
  }, [refresh])

  const createOrder = useCallback(async (params: {
    items: CartItem[]
    subtotal: number
    discount: number
    shipping: number
    total: number
    addressId: string
  }) => {
    const addr = addresses.find((a) => a.id === params.addressId) ?? addresses[0]
    const order = await api.createOrder({
      items: params.items.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        brand: i.product.brand,
        image: i.product.image,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.product.price,
      })),
      subtotal: params.subtotal,
      discount: params.discount,
      shipping: params.shipping,
      total: params.total,
      address: addr
        ? { name: addr.name, address: addr.address, city: addr.city, zip: addr.zip }
        : undefined,
    })
    await refresh()
    return order
  }, [addresses, refresh])

  const addReview = useCallback(async (review: Omit<Review, 'id' | 'date'>) => {
    await api.createReview(review)
    await refresh()
  }, [refresh])

  const removeReview = useCallback(async (id: string) => {
    await api.deleteReview(id)
    await refresh()
  }, [refresh])

  return (
    <UserDataContext.Provider
      value={{
        addresses,
        paymentMethods,
        orders,
        promocodes,
        reviews,
        loading,
        addAddress,
        removeAddress,
        setDefaultAddress,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPayment,
        createOrder,
        addReview,
        removeReview,
        refresh,
      }}
    >
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  const ctx = useContext(UserDataContext)
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider')
  return ctx
}

export function useAddresses() {
  const ctx = useUserData()
  return {
    addresses: ctx.addresses,
    addAddress: ctx.addAddress,
    removeAddress: ctx.removeAddress,
    setDefaultAddress: ctx.setDefaultAddress,
  }
}

export function useOrders() {
  const ctx = useUserData()
  return { orders: ctx.orders, createOrder: ctx.createOrder }
}
