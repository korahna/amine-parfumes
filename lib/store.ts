import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
  type: 'full' | 'decant'
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'amine-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ─── Filter Store (Boutique) ────────────────────────────────────

interface FilterState {
  category: string | null
  scentFamily: string | null
  type: 'full' | 'decant' | null
  setCategory: (category: string | null) => void
  setScentFamily: (family: string | null) => void
  setType: (type: 'full' | 'decant' | null) => void
  resetFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  category: null,
  scentFamily: null,
  type: null,
  setCategory: (category) => set({ category }),
  setScentFamily: (scentFamily) => set({ scentFamily }),
  setType: (type) => set({ type }),
  resetFilters: () => set({ category: null, scentFamily: null, type: null }),
}))
