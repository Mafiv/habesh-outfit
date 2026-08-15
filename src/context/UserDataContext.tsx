import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type {
  Address,
  Order,
  OrderItem,
  PaymentMethod,
  Review,
  SavedPromocode,
  CartItem,
} from '../types'

interface UserDataContextType {
  addresses: Address[]
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  removeAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  paymentMethods: PaymentMethod[]
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removePaymentMethod: (id: string) => void
  setDefaultPayment: (id: string) => void
  orders: Order[]
  createOrder: (params: {
    items: CartItem[]
    subtotal: number
    discount: number
    shipping: number
    total: number
    addressId: string
  }) => Order
  promocodes: SavedPromocode[]
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
  removeReview: (id: string) => void
}

const UserDataContext = createContext<UserDataContextType | null>(null)

const STORAGE_KEY = 'stylish_user_data'

const defaultAddresses: Address[] = [
  {
    id: '1',
    name: 'Jane Doe',
    address: '123 Fashion St',
    city: 'New York, NY',
    zip: '10001',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jane Doe',
    address: '456 Style Ave',
    city: 'Brooklyn, NY',
    zip: '11201',
  },
]

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Visa ending in 4242',
    last4: '4242',
    brand: 'Visa',
    isDefault: true,
  },
  { id: '2', type: 'paypal', label: 'PayPal', isDefault: false },
]

const defaultPromocodes: SavedPromocode[] = [
  {
    code: 'SAVE10',
    discount: 0.1,
    description: '10% off your order',
    expiresAt: '2026-12-31',
  },
  {
    code: 'STYLE20',
    discount: 0.2,
    description: '20% off fashion items',
    expiresAt: '2026-09-30',
  },
  {
    code: 'WELCOME15',
    discount: 0.15,
    description: '15% off first order',
    expiresAt: '2026-06-30',
  },
]

const defaultReviews: Review[] = [
  {
    id: '1',
    productId: '3',
    productTitle: 'Adidas Men Galaxy',
    productImage:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&auto=format',
    rating: 5,
    comment: 'Great fit and very comfortable for daily wear!',
    date: '2026-07-20',
  },
  {
    id: '2',
    productId: '1',
    productTitle: 'T-shirt SPANISH',
    productImage:
      'https://images.unsplash.com/photo-1521572267360-7333520fc085?w=200&h=200&fit=crop&auto=format',
    rating: 4,
    comment: 'Soft fabric, runs slightly large. Would recommend sizing down.',
    date: '2026-06-15',
  },
]

const defaultOrders: Order[] = [
  {
    id: 'ORD-1042',
    date: '2026-08-01',
    status: 'delivered',
    trackingNumber: 'TRK839201847',
    address: defaultAddresses[0],
    subtotal: 89,
    discount: 0,
    shipping: 0,
    total: 89,
    items: [
      {
        productId: '3',
        title: 'Adidas Men Galaxy',
        brand: 'Adidas',
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&auto=format',
        size: '10',
        color: '#222',
        quantity: 1,
        price: 89,
      },
    ],
  },
  {
    id: 'ORD-1087',
    date: '2026-08-10',
    status: 'in_transit',
    trackingNumber: 'TRK928374651',
    address: defaultAddresses[0],
    subtotal: 57,
    discount: 5.7,
    shipping: 9.99,
    total: 61.29,
    items: [
      {
        productId: '1',
        title: 'T-shirt SPANISH',
        brand: 'Mango',
        image:
          'https://images.unsplash.com/photo-1521572267360-7333520fc085?w=200&h=200&fit=crop&auto=format',
        size: 'M',
        color: '#DB3022',
        quantity: 1,
        price: 12,
      },
      {
        productId: '6',
        title: 'Summer Dress',
        brand: 'Mango',
        image:
          'https://images.unsplash.com/photo-1591047139-782c14d4b9a6?w=200&h=200&fit=crop&auto=format',
        size: 'S',
        color: '#fff',
        quantity: 1,
        price: 45,
      },
    ],
  },
]

interface StoredData {
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  promocodes: SavedPromocode[]
  reviews: Review[]
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* use defaults */
  }
  return {
    addresses: defaultAddresses,
    paymentMethods: defaultPaymentMethods,
    orders: defaultOrders,
    promocodes: defaultPromocodes,
    reviews: defaultReviews,
  }
}

function generateTrackingNumber(): string {
  return `TRK${Math.random().toString().slice(2, 11)}`
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const addAddress = useCallback((address: Omit<Address, 'id'>) => {
    setData((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { ...address, id: Date.now().toString() },
      ],
    }))
  }, [])

  const updateAddress = useCallback((id: string, updates: Partial<Address>) => {
    setData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    }))
  }, [])

  const removeAddress = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }))
  }, [])

  const setDefaultAddress = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }))
  }, [])

  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, 'id'>) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: [
        ...prev.paymentMethods,
        { ...method, id: Date.now().toString() },
      ],
    }))
  }, [])

  const removePaymentMethod = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((m) => m.id !== id),
    }))
  }, [])

  const setDefaultPayment = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    }))
  }, [])

  const createOrder = useCallback(
    (params: {
      items: CartItem[]
      subtotal: number
      discount: number
      shipping: number
      total: number
      addressId: string
    }): Order => {
      const address =
        data.addresses.find((a) => a.id === params.addressId) ??
        data.addresses[0]

      const orderItems: OrderItem[] = params.items.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        brand: item.product.brand,
        image: item.product.image,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const order: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        status: 'processing',
        trackingNumber: generateTrackingNumber(),
        address,
        subtotal: params.subtotal,
        discount: params.discount,
        shipping: params.shipping,
        total: params.total,
        items: orderItems,
      }

      setData((prev) => ({
        ...prev,
        orders: [order, ...prev.orders],
      }))

      return order
    },
    [data.addresses]
  )

  const addReview = useCallback((review: Omit<Review, 'id' | 'date'>) => {
    setData((prev) => ({
      ...prev,
      reviews: [
        {
          ...review,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
        },
        ...prev.reviews,
      ],
    }))
  }, [])

  const removeReview = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== id),
    }))
  }, [])

  return (
    <UserDataContext.Provider
      value={{
        addresses: data.addresses,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        paymentMethods: data.paymentMethods,
        addPaymentMethod,
        removePaymentMethod,
        setDefaultPayment,
        orders: data.orders,
        createOrder,
        promocodes: data.promocodes,
        reviews: data.reviews,
        addReview,
        removeReview,
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
  const { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress } =
    useUserData()
  return { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress }
}

export function useOrders() {
  const { orders, createOrder } = useUserData()
  return { orders, createOrder }
}
