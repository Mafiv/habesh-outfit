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
  name: string
  email: string
}

export type Category = {
  id: string
  name: string
  gender: 'women' | 'men' | 'kids'
  subcategories: string[]
}
