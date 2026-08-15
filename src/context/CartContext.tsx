import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)
  const [promocode, setPromocodeState] = useState(
    () => localStorage.getItem(PROMO_KEY) ?? ''
  )

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

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
  }, [])

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
