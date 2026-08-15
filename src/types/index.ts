export interface Product {
  id: string
  title: string
  brand: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  image: string
  images: string[]
  category: string
  subcategory: string
  gender: 'women' | 'men' | 'kids'
  isNew?: boolean
  isSale?: boolean
  colors: string[]
  sizes: string[]
  description: string
}

export interface CartItem {
  product: Product
  size: string
  color: string
  quantity: number
}

export interface Address {
  id: string
  name: string
  address: string
  city: string
  zip: string
  isDefault?: boolean
}

export interface User {
  id?: string
  name: string
  email: string
}

export type Category = {
  id: string
  name: string
  gender: 'women' | 'men' | 'kids'
  subcategories: string[]
}

export type OrderStatus = 'processing' | 'shipped' | 'in_transit' | 'delivered'

export interface OrderItem {
  productId: string
  title: string
  brand: string
  image: string
  size: string
  color: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  mongoId?: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  address: Address
  trackingNumber: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal'
  label: string
  last4?: string
  brand?: string
  isDefault?: boolean
}

export interface Review {
  id: string
  productId: string
  productTitle: string
  productImage: string
  rating: number
  comment: string
  date: string
}

export interface SavedPromocode {
  code: string
  discount: number
  description: string
  expiresAt: string
}
