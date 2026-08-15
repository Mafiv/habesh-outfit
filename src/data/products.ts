import type { Product, Category } from '../types'

export const categories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    gender: 'women',
    subcategories: ['New', 'Clothes', 'Shoes', 'Accessories'],
  },
  {
    id: 'men',
    name: 'Men',
    gender: 'men',
    subcategories: ['New', 'Clothes', 'Shoes', 'Accessories'],
  },
  {
    id: 'kids',
    name: 'Kids',
    gender: 'kids',
    subcategories: ['New', 'Clothes', 'Shoes', 'Accessories'],
  },
]

export const categoryChips = ['New', 'Clothes', 'Shoes', 'Accessories']

const img = (id: string, w = 400, h = 500) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`

export const products: Product[] = [
  {
    id: '1',
    title: 'T-shirt SPANISH',
    brand: 'Mango',
    price: 12,
    rating: 4.5,
    reviewCount: 128,
    image: img('1521572267360-7333520fc085'),
    images: [img('1521572267360-7333520fc085'), img('1434389677669-e94b3604b210'), img('1551028719-0d9b941943c5')],
    category: 'Clothes',
    subcategory: 'T-shirts',
    gender: 'women',
    isNew: true,
    colors: ['#222', '#DB3022', '#fff'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'A timeless Spanish-inspired tee crafted from soft organic cotton. Perfect for casual street style with a relaxed fit and breathable fabric.',
  },
  {
    id: '2',
    title: 'H&M Basic T-shirt',
    brand: 'H&M',
    price: 10,
    originalPrice: 14,
    rating: 4.2,
    reviewCount: 89,
    image: img('1434389677669-e94b3604b210'),
    images: [img('1434389677669-e94b3604b210'), img('1521572267360-7333520fc085')],
    category: 'Clothes',
    subcategory: 'T-shirts',
    gender: 'women',
    isSale: true,
    colors: ['#222', '#fff', '#9b9b9b'],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Essential basic tee with a slim fit. Made from 100% cotton for everyday comfort and easy layering.',
  },
  {
    id: '3',
    title: 'Adidas Men Galaxy',
    brand: 'Adidas',
    price: 89,
    rating: 4.8,
    reviewCount: 256,
    image: img('1542291026-7eec264c27ff'),
    images: [img('1542291026-7eec264c27ff'), img('1460353589841-044d77ddcc0e')],
    category: 'Shoes',
    subcategory: 'Sneakers',
    gender: 'men',
    isNew: true,
    colors: ['#222', '#fff', '#DB3022'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    description:
      'Galaxy-inspired running shoes with responsive cushioning and a breathable mesh upper. Built for all-day comfort.',
  },
  {
    id: '4',
    title: 'Nike Air Max',
    brand: 'Nike',
    price: 120,
    originalPrice: 150,
    rating: 4.7,
    reviewCount: 312,
    image: img('1460353589841-044d77ddcc0e'),
    images: [img('1460353589841-044d77ddcc0e'), img('1542291026-7eec264c27ff')],
    category: 'Shoes',
    subcategory: 'Sneakers',
    gender: 'men',
    isSale: true,
    colors: ['#222', '#fff'],
    sizes: ['7', '8', '9', '10', '11'],
    description:
      'Iconic Air Max silhouette with visible Air cushioning. A street-style staple with premium materials.',
  },
  {
    id: '5',
    title: 'Leather Jacket',
    brand: 'Zara',
    price: 199,
    rating: 4.6,
    reviewCount: 74,
    image: img('1551028719-0d9b941943c5'),
    images: [img('1551028719-0d9b941943c5'), img('1591047139-782c14d4b9a6')],
    category: 'Clothes',
    subcategory: 'Jackets',
    gender: 'women',
    isNew: true,
    colors: ['#222', '#8B4513'],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Classic biker-style leather jacket with asymmetric zip and quilted shoulders. A wardrobe essential.',
  },
  {
    id: '6',
    title: 'Summer Dress',
    brand: 'Mango',
    price: 45,
    originalPrice: 60,
    rating: 4.4,
    reviewCount: 156,
    image: img('1591047139-782c14d4b9a6'),
    images: [img('1591047139-782c14d4b9a6'), img('1515372039744-b3329a4b4fd0')],
    category: 'Clothes',
    subcategory: 'Dresses',
    gender: 'women',
    isSale: true,
    colors: ['#fff', '#DB3022', '#FFD700'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Flowy midi dress perfect for warm days. Lightweight fabric with a flattering A-line silhouette.',
  },
  {
    id: '7',
    title: 'Kids Sneakers',
    brand: 'Nike',
    price: 55,
    rating: 4.5,
    reviewCount: 42,
    image: img('1560763184-39a7d30e45d7'),
    images: [img('1560763184-39a7d30e45d7')],
    category: 'Shoes',
    subcategory: 'Sneakers',
    gender: 'kids',
    isNew: true,
    colors: ['#DB3022', '#222', '#fff'],
    sizes: ['28', '29', '30', '31', '32'],
    description:
      'Colorful kids sneakers with easy velcro closure. Durable rubber sole for active play.',
  },
  {
    id: '8',
    title: 'Silk Scarf',
    brand: 'H&M',
    price: 25,
    rating: 4.3,
    reviewCount: 67,
    image: img('1515372039744-b3329a4b4fd0'),
    images: [img('1515372039744-b3329a4b4fd0')],
    category: 'Accessories',
    subcategory: 'Scarves',
    gender: 'women',
    colors: ['#DB3022', '#222', '#FFD700'],
    sizes: ['One Size'],
    description:
      'Luxurious silk-blend scarf with vibrant print. Adds a pop of color to any outfit.',
  },
  {
    id: '9',
    title: 'Denim Jacket',
    brand: 'Levis',
    price: 79,
    rating: 4.6,
    reviewCount: 198,
    image: img('1576995088064-05306fc77f82'),
    images: [img('1576995088064-05306fc77f82')],
    category: 'Clothes',
    subcategory: 'Jackets',
    gender: 'men',
    colors: ['#4169E1', '#222'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description:
      'Classic trucker jacket in premium denim. Timeless style with a modern slim fit.',
  },
  {
    id: '10',
    title: 'Crossbody Bag',
    brand: 'Zara',
    price: 35,
    rating: 4.1,
    reviewCount: 53,
    image: img('1584917860-726670f2f151'),
    images: [img('1584917860-726670f2f151')],
    category: 'Accessories',
    subcategory: 'Bags',
    gender: 'women',
    isNew: true,
    colors: ['#222', '#8B4513', '#fff'],
    sizes: ['One Size'],
    description:
      'Compact crossbody bag with adjustable strap. Perfect for essentials on the go.',
  },
]

export const brands = ['Adidas', 'H&M', 'Levis', 'Mango', 'Nike', 'Zara']
export const allColors = ['#222', '#fff', '#DB3022', '#FFD700', '#4169E1', '#8B4513', '#9b9b9b']
export const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(gender?: string, subcategory?: string): Product[] {
  let filtered = [...products]
  if (gender) filtered = filtered.filter((p) => p.gender === gender)
  if (subcategory && subcategory !== 'New') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === subcategory.toLowerCase()
    )
  } else if (subcategory === 'New') {
    filtered = filtered.filter((p) => p.isNew)
  }
  return filtered
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew)
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.isSale)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}
