export type Product = {
  id: string
  slug: string
  name: { fr: string; ar: string }
  description: { fr: string; ar: string }
  type: 'full' | 'decant'
  brand: string
  scentNotes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  volume: number
  price: number
  images: string[]
  inStock: boolean
  featured: boolean
  category: string
  createdAt: Date
}

export type Order = {
  id: string
  items: { productId: string; quantity: number; price: number }[]
  customer: {
    name: string
    phone: string
    address: string
    city: string
    wilaya: string
  }
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'cod'
  createdAt: Date
}

export type Category = {
  id: string
  slug: string
  name: { fr: string; ar: string }
  sortOrder: number
}
