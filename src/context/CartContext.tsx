import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { CartItem, Product, CartItemPayload } from '../types'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  promocode: string
  setPromocode: (code: string) => void
  discount: number
  syncing: boolean
}

const CartContext = createContext<CartContextType | null>(null)

const PROMO_CODES: Record<string, number> = {
  SAVE10: 0.1,
  STYLE20: 0.2,
  WELCOME15: 0.15,
}

const CART_KEY = 'stylish_cart'
const PROMO_KEY = 'stylish_promocode'

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function toPayload(items: CartItem[]): CartItemPayload[] {
  return items.map((i) => ({
    productId: i.product.id,
    title: i.product.title,
    brand: i.product.brand,
    image: i.product.image,
    size: i.size,
    color: i.color,
    quantity: i.quantity,
    price: i.product.price,
  }))
}

function payloadToCartItem(item: CartItemPayload): CartItem {
  return {
    product: {
      id: item.productId,
      title: item.title,
      brand: item.brand ?? '',
      price: item.price,
      rating: 0,
      reviewCount: 0,
      image: item.image ?? '',
      images: item.image ? [item.image] : [],
      category: '',
      subcategory: '',
      gender: 'women',
      colors: [],
      sizes: [],
      description: '',
    },
    size: item.size,
    color: item.color ?? '',
    quantity: item.quantity,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [promocode, setPromocodeState] = useState(
    () => localStorage.getItem(PROMO_KEY) ?? ''
  )
  const [syncing, setSyncing] = useState(false)
  const skipNextSync = useRef(false)
  const hydratedFromServer = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      hydratedFromServer.current = false
      return
    }

    let cancelled = false
    async function loadServerCart() {
      setSyncing(true)
      try {
        const localItems = loadCart()
        const localPromo = localStorage.getItem(PROMO_KEY) ?? ''

        const serverCart = localItems.length
          ? await api.syncCart({ items: toPayload(localItems), promocode: localPromo })
          : await api.getCart()

        if (cancelled) return

        skipNextSync.current = true
        setItems(serverCart.items.map(payloadToCartItem))
        setPromocodeState(serverCart.promocode || localPromo)
        hydratedFromServer.current = true
        localStorage.removeItem(CART_KEY)
      } catch {
        hydratedFromServer.current = true
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    loadServerCart()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
    }
  }, [items, isAuthenticated])

  useEffect(() => {
    localStorage.setItem(PROMO_KEY, promocode)
  }, [promocode])

  useEffect(() => {
    if (!isAuthenticated || !hydratedFromServer.current) return
    if (skipNextSync.current) {
      skipNextSync.current = false
      return
    }

    const timer = setTimeout(async () => {
      setSyncing(true)
      try {
        await api.updateCart({ items: toPayload(items), promocode })
      } catch {
        /* keep local state */
      } finally {
        setSyncing(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [items, promocode, isAuthenticated])

  const setPromocode = useCallback((code: string) => {
    setPromocodeState(code)
    localStorage.setItem(PROMO_KEY, code)
  }, [])

  const addItem = useCallback(
    (product: Product, size: string, color: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.product.id === product.id && i.size === size && i.color === color
        )
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        }
        return [...prev, { product, size, color, quantity }]
      })
    },
    []
  )

  const removeItem = useCallback(
    (productId: string, size: string, color: string) => {
      setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.product.id === productId &&
              i.size === size &&
              i.color === color
            )
        )
      )
    },
    []
  )

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem(CART_KEY)
    if (isAuthenticated) {
      api.clearCart().catch(() => {})
    }
  }, [isAuthenticated])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )
  const discountRate = PROMO_CODES[promocode.toUpperCase()] ?? 0
  const discount = subtotal * discountRate

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        promocode,
        setPromocode,
        discount,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
